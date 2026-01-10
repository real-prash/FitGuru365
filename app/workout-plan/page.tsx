"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Activity, Trophy, CalendarDays, Loader2, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function WorkoutPlanPage() {
  const [user, setUser] = useState<any>(null);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const res = await fetch(`/api/user/${currentUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          
    
          if (data.user.workoutPlan) {
            setWorkoutPlan(data.user.workoutPlan);
          }
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGenerateWorkout = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.firebaseUid }),
      });

      const data = await res.json();

      if (res.ok) {
        setWorkoutPlan(data.plan);
      } else {
        alert(data.error || "Failed to generate plan.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-xl text-slate-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workout Plan Generator</h1>
          <p className="text-slate-500">AI-Designed training splits based on your available days and goals.</p>
        </div>

        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <Dumbbell className="text-cyan-400" /> Your Fitness Profile
                </h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600"><CalendarDays size={24} /></div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase">Frequency</p>
                        <p className="text-xl font-bold text-slate-900">{user?.workoutFrequency} Days / Week</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600"><Trophy size={24} /></div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase">Current Goal</p>
                        <p className="text-xl font-bold text-slate-900 capitalize">{user?.fitnessGoal?.replace("_", " ")}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Activity size={24} /></div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase">Experience Level</p>
                        <p className="text-xl font-bold text-slate-900 capitalize">{user?.experience}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- DISPLAY PLAN (If Exists) --- */}
        {workoutPlan && workoutPlan.workout_plan && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
               <h2 className="text-2xl font-bold text-indigo-900 mb-2">{workoutPlan.workout_plan.split_name}</h2>
               <p className="text-indigo-700">{workoutPlan.workout_plan.summary}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {workoutPlan.workout_plan.schedule.map((day: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{day.day}</h3>
                        <p className="text-slate-500">{day.focus}</p>
                      </div>
                      <PlayCircle className="text-slate-300" />
                   </div>
                   
                   <div className="space-y-3">
                      {day.exercises.map((ex: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                           <div>
                              <p className="font-semibold text-slate-900">{ex.name}</p>
                              {ex.notes && <p className="text-xs text-slate-500 italic">{ex.notes}</p>}
                           </div>
                           <div className="text-right text-sm">
                              <span className="font-bold text-indigo-600">{ex.sets} Sets</span>
                              <span className="text-slate-400 mx-2">|</span>
                              <span className="text-slate-600">{ex.reps} Reps</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- GENERATE BUTTON --- */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {workoutPlan ? "Regenerate Routine (1 per day) " : "Ready to Build Your Routine? (1 per day)"}
          </h2>
          <p className="text-slate-500 mb-6 max-w-lg mx-auto">
            {workoutPlan 
              ? "Need a change? Generate a new split based on your current profile." 
              : `Our AI will construct a full ${user?.workoutFrequency}-day split tailored to maximize ${user?.fitnessGoal?.replace("_", " ")}.`}
          </p>
          
          <Button 
            onClick={handleGenerateWorkout}
            disabled={generating}
            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg px-10 py-6 shadow-lg transition-all transform hover:scale-105"
          >
             {generating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" /> Building Plan... Can take upto a minute 
                </span>
             ) : (
                "Generate AI Workout Plan"
             )}
          </Button>
        </div>

      </div>
    </div>
  );
}