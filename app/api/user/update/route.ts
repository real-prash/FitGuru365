import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { calculateInitialTargets } from "@/lib/fitnessEngine";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { 
      uid, 
      firstName, lastName, gender, age, height, weight, 
      fitnessGoal, experience, workoutFrequency 
    } = await request.json();

    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Recalculate Macros (Added experience)
    const newMacros = calculateInitialTargets(
      Number(weight),
      Number(height),
      Number(age),
      gender,
      Number(workoutFrequency),
      fitnessGoal,
      experience // <--- UPDATED
    );

    // 2. Update Database
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        firstName,
        lastName,
        gender,
        age: Number(age),
        height: Number(height),
        weight: Number(weight), 
        fitnessGoal,
        experience,
        workoutFrequency: Number(workoutFrequency),
        currentMacros: newMacros, 
      },
      { new: true }
    );

    return NextResponse.json({ message: "Profile updated", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}