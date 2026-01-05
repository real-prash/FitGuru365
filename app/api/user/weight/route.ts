import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { adjustMacros } from "@/lib/fitnessEngine";

export async function POST(request: Request) {
  try {
    await connectDB();
    // Accept adherence inputs
    const { uid, weight, date, dietAdherence, trainingAdherence } = await request.json();

    if (!uid || !weight) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // 1. Fetch user first to get history for calculations
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. Create the new log entry
    const newLog = {
      weight: Number(weight),
      date: new Date(date),
      dietAdherence: Number(dietAdherence),
      trainingAdherence: Number(trainingAdherence),
    };

    // 3. Temporarily append to history to run calculations
    const tempHistory = [...user.weightHistory, newLog];

    // 4. Run the Adjustment Decision Tree
    const { newMacros, message } = adjustMacros(
      user.currentMacros,
      Number(weight),
      tempHistory,
      user.fitnessGoal,
      user.experience
    );

    // 5. Update Database
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $set: { 
          weight: Number(weight),
          currentMacros: newMacros // Update targets if changed
        }, 
        $push: { weightHistory: newLog }
      },
      { new: true }
    );

    return NextResponse.json({ 
      message: "Weight logged", 
      adjustment: message, // Send back message to show user
      user: updatedUser 
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}