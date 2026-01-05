"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Import Shadcn Button

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if the "loggedin" cookie exists
    const isLoggedIn = Cookies.get("loggedin");

    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 relative overflow-hidden">
      
      {/* Optional: Subtle top gradient blob for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50 opacity-50 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-3xl z-10 space-y-8">
        
        {/* Main Heading with Gradient Text */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
          Welcome to <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-cyan-500 to-emerald-400 bg-clip-text text-transparent">
            FitGuru365
          </span>
        </h1>

        {/* Subheadings */}
        <div className="space-y-4">
          <p className="text-2xl md:text-3xl font-semibold text-slate-700">
            Free AI-Powered Fitness Coaching by Prash
          </p>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Sign in or create an account to start your transformation with personalized plans and real-time tracking.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4">
          
          {/* Sign Up - Primary Gradient Button (Pill shaped) */}
          <Button 
            asChild 
            className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white font-bold text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Link href="/register">
              Sign Up
            </Link>
          </Button>

          {/* Sign In - Clean Ghost/Outline Button */}
          <Button 
            asChild 
            variant="ghost" 
            className="rounded-full text-slate-600 hover:text-cyan-600 hover:bg-blue-50 font-semibold text-lg px-10 py-7"
          >
            <Link href="/login">
              Sign In
            </Link>
          </Button>

        </div>
      </div>
    </main>
  );
}