"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, Activity, RefreshCw, BrainCircuit, ChevronRight, Utensils, Dumbbell, Mail } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
  
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

  
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-slate-900">The Core Engine</h2>
           <p className="text-slate-500 mt-2">How we manage your metabolism week-to-week.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
    
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Target className="text-blue-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Set Your Goal</h3>
            <p className="text-slate-600 leading-relaxed">
              Tell us your mission: <span className="font-semibold text-slate-800">Fat Loss</span>, <span className="font-semibold text-slate-800">Muscle Gain</span>, or <span className="font-semibold text-slate-800">Recomposition</span>. We factor in your age, experience level, and lifestyle to create your baseline.
            </p>
          </div>

          
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Activity className="text-emerald-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Get Your Targets</h3>
            <p className="text-slate-600 leading-relaxed">
              Instantly unlock your personalized roadmap. FitGuru365 calculates your exact 
              <span className="font-semibold text-slate-800"> Daily Calories</span> and 
              <span className="font-semibold text-slate-800"> Macro Split (Protein, Carbs, Fats)</span> 
              optimized specifically for your metabolic rate.
            </p>
          </div>

      
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

  
      <div className="bg-slate-900 py-20 px-6 mt-12 text-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-cyan-400 font-semibold text-sm mb-6">
              <BrainCircuit size={18} />
              <span>Now Available</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Generative AI Planning
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              FitGuru365 goes beyond numbers. We generate fully customized routines tailored to your biology and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
        
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Utensils size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
                  <Utensils size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Smart Diet Planner</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Struggling with what to eat? Our AI generates a full day of eating that hits your exact macro targets.
                  Simply input your <strong>Allergies</strong>, <strong>Restrictions</strong> (Vegan, Keto, etc.), and <strong>Favorite Foods</strong>.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"/> Respects dietary restrictions</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"/> Includes your favorite ingredients</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"/> Exact macro breakdown per meal</li>
                </ul>
              </div>
            </div>

    
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Dumbbell size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                  <Dumbbell size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Intelligent Workout Builder</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Stop guessing at the gym. We build a complete training split based on your <strong>Experience Level</strong>, <strong>Goal</strong>, and <strong>Frequency</strong>.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                   <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"/> Optimized training splits (PPL, Upper/Lower)</li>
                   <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"/> Specific sets & rep ranges</li>
                   <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"/> Tailored to your recovery capacity</li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="text-center py-24 px-6 bg-slate-50">
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

  
      <footer className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Get in Touch</h3>
            <p className="text-slate-500 max-w-md mx-auto">
                Have questions about the algorithm, need support, or want to provide feedback? We'd love to hear from you.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6">
                <a href="https://instagram.com/real_prash" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-pink-600 transition font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    @real_prash
                </a>
                <a href="mailto:prashant.nigam2256@gmail.com" className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition font-medium">
                    <Mail size={20} />
                    prashant.nigam2256@gmail.com
                </a>
            </div>
            <p className="text-xs text-slate-400 mt-12">
                © {new Date().getFullYear()} FitGuru365. Built by Prashant Nigam.
            </p>
        </div>
      </footer>
    </div>
  );
}