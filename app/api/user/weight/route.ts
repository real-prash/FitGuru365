import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { adjustMacros } from "@/lib/fitnessEngine";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { uid, weight, date, dietAdherence, trainingAdherence } = await request.json();

    if (!uid || !weight) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newLog = {
      weight: Number(weight),
      date: new Date(date),
      dietAdherence: Number(dietAdherence),
      trainingAdherence: Number(trainingAdherence),
    };

    const tempHistory = [...user.weightHistory, newLog];

    // 4. Run the Adjustment Decision Tree (Added Age)
    const { newMacros, message } = adjustMacros(
      user.currentMacros,
      Number(weight),
      tempHistory,
      user.fitnessGoal,
      user.experience,
      user.age // <--- UPDATED
    );

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $set: { 
          weight: Number(weight),
          currentMacros: newMacros 
        }, 
        $push: { weightHistory: newLog }
      },
      { new: true }
    );

    return NextResponse.json({ 
      message: "Weight logged", 
      adjustment: message, 
      user: updatedUser 
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}