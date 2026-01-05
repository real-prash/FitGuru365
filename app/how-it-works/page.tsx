"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, Activity, RefreshCw, BrainCircuit, ChevronRight } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16 text-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50 opacity-60 blur-3xl rounded-full pointer-events-none -z-10" />
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          Your Transformation, <br />
          <span className="bg-gradient-to-r from-cyan-500 to-emerald-400 bg-clip-text text-transparent">
            Automated by Intelligence.
          </span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          FitGuru365 eliminates the guesswork. No more confusing spreadsheets or rigid plans. 
          Just pure, data-driven coaching that adapts to <em>you</em>.
        </p>
      </div>

      {/* The 3-Step Process */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Step 1 */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Target className="text-blue-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Set Your Goal</h3>
            <p className="text-slate-600 leading-relaxed">
              Tell us your mission: <span className="font-semibold text-slate-800">Fat Loss</span>, <span className="font-semibold text-slate-800">Muscle Gain</span>, or <span className="font-semibold text-slate-800">Recomposition</span>. We factor in your age, experience level (Beginner to Advanced), and lifestyle to create your baseline.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Activity className="text-emerald-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Get Your Targets</h3>
            <p className="text-slate-600 leading-relaxed">
              Instantly unlock your personalized roadmap. FitGuru365 calculates your exact 
              <span className="font-semibold text-slate-800"> Daily Calories</span> and 
              <span className="font-semibold text-slate-800"> Macro Split (Protein, Carbs, Fats)</span> 
              optimized specifically for your metabolic rate and activity level.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <RefreshCw className="text-purple-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Weekly Adaptation</h3>
            <p className="text-slate-600 leading-relaxed">
              Bodies change, and so should your plan. Log your weight and adherence weekly. 
              Our <span className="font-semibold text-slate-800">Smart Engine</span> analyzes your trend data and automatically adjusts your calories to break plateaus or prevent fat gain.
            </p>
          </div>

        </div>
      </div>

      {/* Feature Highlight Section */}
      <div className="bg-slate-900 py-20 px-6 mt-12 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-cyan-400 font-semibold text-sm">
              <BrainCircuit size={18} />
              <span>Coming Soon</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              AI-Generated Diet & Workout Plans
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Need more than just numbers? FitGuru365 will soon generate fully customized 
              meal plans and gym routines based on your equipment access and dietary preferences—all powered by advanced AI.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Visual placeholder for the AI feature */}
            <div className="w-full max-w-sm bg-gradient-to-tr from-cyan-500 to-emerald-500 p-1 rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-slate-800 rounded-xl p-6 h-64 flex flex-col justify-center items-center text-center">
                <p className="text-2xl font-mono mb-2">🍽️ + 🏋️‍♂️</p>
                <p className="font-bold text-lg">Your Personalized Plan</p>
                <p className="text-sm text-slate-400 mt-2">Generating...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-24 px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          Ready to transform your physique?
        </h2>
        <Button 
            asChild 
            className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white font-bold text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all"
        >
          <Link href="/register" className="flex items-center gap-2">
            Start Your Journey <ChevronRight size={20} />
          </Link>
        </Button>
      </div>
    </div>
  );
}