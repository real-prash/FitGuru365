import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { calculateInitialTargets } from "@/lib/fitnessEngine"; // Import the helper

export async function POST(request: Request) {
  try {
    await connectDB();
    const { uid, age, height, weight, fitnessGoal, experience, workoutFrequency, gender } = await request.json(); // Added gender

    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Calculate Initial Macros
    const initialMacros = calculateInitialTargets(
      Number(weight),
      Number(height),
      Number(age),
      gender || "male", // Fallback if missing
      Number(workoutFrequency),
      fitnessGoal
    );

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        age, height, weight, fitnessGoal, experience, workoutFrequency,
        isProfileComplete: true,
        currentMacros: initialMacros, // SAVE MACROS
        $push: { 
          weightHistory: { 
            weight: Number(weight), 
            date: new Date(),
            dietAdherence: 100, // Assume perfect start
            trainingAdherence: 100 
          } 
        }
      },
      { new: true }
    );

    return NextResponse.json({ message: "Profile updated", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}