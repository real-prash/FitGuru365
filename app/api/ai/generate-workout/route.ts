import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    await connectDB();
    const { uid } = await request.json();

    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  
    if (user.lastWorkoutGenerated) {
      const lastGenDate = new Date(user.lastWorkoutGenerated);
      const now = new Date();

      
      // This resets automatically at midnight system time.
      if (lastGenDate.toDateString() === now.toDateString()) {
        return NextResponse.json(
          { error: "You can only generate one workout plan per day. Please try again tomorrow." }, 
          { status: 429 } 
        );
      }
    }

    const prompt = `
      You are FitGuru365. Create a weekly workout routine (JSON format).

      User Profile:
      - Goal: ${user.fitnessGoal}
      - Experience Level: ${user.experience}
      - Frequency: ${user.workoutFrequency} days per week
      
      Instructions:
      - Create a ${user.workoutFrequency}-day split (e.g., Push/Pull/Legs or Upper/Lower) suitable for this experience level.
      - Include specific exercises, sets, and rep ranges.
      - Explain the focus of each day.

      Return a JSON object with this EXACT structure:
      {
        "workout_plan": {
          "split_name": "e.g. Upper/Lower Split",
          "summary": "Brief strategy explanation",
          "schedule": [
            { 
              "day": "Day 1", 
              "focus": "Chest & Triceps", 
              "exercises": [
                { "name": "Bench Press", "sets": "3", "reps": "8-12", "notes": "Focus on control" }
              ] 
            }
          ]
        }
      }
    `;

    
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    
    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("No response from AI");

    const workoutPlanJSON = JSON.parse(textResponse);

    user.workoutPlan = workoutPlanJSON;
    user.lastWorkoutGenerated = new Date(); 
    await user.save();

    return NextResponse.json({ message: "Plan generated", plan: workoutPlanJSON }, { status: 200 });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}