import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { uid, email, firstName, lastName, gender } = await request.json();

    // Validation
    if (!uid || !email || !firstName || !lastName || !gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists in MongoDB
    const userExists = await User.findOne({ firebaseUid: uid });
    if (userExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await User.create({
      firebaseUid: uid,
      email,
      firstName,
      lastName,
      gender,
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}