import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> } 
) {
  try {
    await connectDB();
    
    
    const { uid } = await params;
    
    console.log("Searching for Firebase UID:", uid); 

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      console.log("User not found in MongoDB");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}