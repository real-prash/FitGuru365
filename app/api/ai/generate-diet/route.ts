import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    await connectDB();
    const { uid } = await request.json();

    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    
    if (user.lastDietGenerated) {
      const lastGenDate = new Date(user.lastDietGenerated);
      const now = new Date();


      if (lastGenDate.toDateString() === now.toDateString()) {
        return NextResponse.json(
          { error: "You can only generate one diet plan per day. Please try again tomorrow." }, 
          { status: 429 } 
        );
      }
    }

    const macros = user.currentMacros || { calories: 2000, protein: 150, carbs: 200, fat: 65 };
    const prefs = user.dietPreferences || { restrictions: "None", allergies: "None", favorites: "None" };

    
    const prompt = `
      You are FitGuru365. Create a 1-day meal plan (JSON format).

      Target: ${macros.calories} kcal
      Macros: ${macros.protein}g P / ${macros.carbs}g C / ${macros.fat}g F
      Diet: ${prefs.restrictions || "None"}
      Allergies: ${prefs.allergies || "None"}
      Favorites: ${prefs.favorites || "None"}
      Meals: 4 

      Return a JSON object with this structure:
      {
        "meal_plan": {
          "summary": "Brief motivational summary",
          "meals": [
            { 
              "name": "Breakfast", 
              "description": "Tasty description", 
              "items": ["item 1", "item 2"], 
              "macros_estimated": { "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 } 
            }
          ]
        }
      }
    `;

  
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("No response from AI");

    const dietPlanJSON = JSON.parse(textResponse);

    user.dietPlan = dietPlanJSON;
    user.lastDietGenerated = new Date(); 
    
    if (!user.currentMacros) user.currentMacros = macros;

    await user.save();

    return NextResponse.json({ message: "Plan generated", plan: dietPlanJSON }, { status: 200 });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}