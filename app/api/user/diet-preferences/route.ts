import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { uid, restrictions, allergies, favorites } = await request.json();

    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $set: {
          dietPreferences: {
            restrictions,
            allergies,
            favorites
          }
        }
      },
      { new: true }
    );

    return NextResponse.json({ message: "Preferences saved", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Diet Pref Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}