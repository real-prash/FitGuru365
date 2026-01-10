"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Flame, Beef, Wheat, Droplets, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DietPlanPage() {
  const [user, setUser] = useState<any>(null);
  const [dietPlan, setDietPlan] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [restrictions, setRestrictions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [favorites, setFavorites] = useState("");
  const [generating, setGenerating] = useState(false); 

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const res = await fetch(`/api/user/${currentUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          
      
          if (data.user.dietPreferences) {
            setRestrictions(data.user.dietPreferences.restrictions || "");
            setAllergies(data.user.dietPreferences.allergies || "");
            setFavorites(data.user.dietPreferences.favorites || "");
          }

          
          if (data.user.dietPlan) {
            setDietPlan(data.user.dietPlan);
          }
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      await fetch("/api/user/diet-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.firebaseUid,
          restrictions,
          allergies,
          favorites,
        }),
      });

    
      const res = await fetch("/api/ai/generate-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.firebaseUid }),
      });

      const data = await res.json();

      if (res.ok) {
        setDietPlan(data.plan); 
      } else {
        
        alert(data.error || "Failed to generate plan. Please try again.");
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
          <h1 className="text-3xl font-bold text-gray-900">Diet Plan Generator</h1>
          <p className="text-slate-500">AI-Powered meal planning tailored to your biology.</p>
        </div>

  
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <Flame className="text-yellow-400" /> Daily Targets
                </h2>
                <span className="text-sm text-slate-400 capitalize bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    {user?.fitnessGoal?.replace("_", " ")}
                </span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Calories</p>
                    <p className="text-3xl font-black text-slate-900">{user?.currentMacros?.calories}</p>
                </div>
                <div className="space-y-1 border-l border-slate-100">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide flex justify-center items-center gap-1"><Beef size={14}/> Protein</p>
                    <p className="text-2xl font-bold text-slate-700">{user?.currentMacros?.protein}g</p>
                </div>
                <div className="space-y-1 border-l border-slate-100">
                    <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide flex justify-center items-center gap-1"><Wheat size={14}/> Carbs</p>
                    <p className="text-2xl font-bold text-slate-700">{user?.currentMacros?.carbs}g</p>
                </div>
                <div className="space-y-1 border-l border-slate-100">
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wide flex justify-center items-center gap-1"><Droplets size={14}/> Fat</p>
                    <p className="text-2xl font-bold text-slate-700">{user?.currentMacros?.fat}g</p>
                </div>
            </div>
        </div>


        {dietPlan && dietPlan.meal_plan && (
          <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
            <div className="bg-emerald-50 p-6 border-b border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-emerald-600" />
                <h2 className="text-xl font-bold text-emerald-900">Your Personalized Plan</h2>
              </div>
              <p className="text-emerald-700">{dietPlan.meal_plan.summary || "Here is your optimized nutrition plan for the day."}</p>
            </div>
            
            <div className="p-6 space-y-6">
              {dietPlan.meal_plan.meals.map((meal: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{meal.name}</h3>
                      <p className="text-slate-600 text-sm italic">{meal.description}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900">{meal.macros_estimated?.calories} kcal</div>
                      <div>P: {meal.macros_estimated?.protein_g}g | C: {meal.macros_estimated?.carbs_g}g | F: {meal.macros_estimated?.fat_g}g</div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {meal.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}


        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {dietPlan ? "Regenerate Plan (1 per day)" : "Generate Your Plan (1 per day)"}
          </h2>
          
          <form onSubmit={handleGeneratePlan} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Dietary Restrictions</label>
              <textarea 
                value={restrictions}
                onChange={(e) => setRestrictions(e.target.value)}
                placeholder="e.g. Vegetarian, No Pork..."
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none h-20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Allergies</label>
              <textarea 
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Peanuts, Dairy..."
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none h-20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Favorite Foods</label>
              <textarea 
                value={favorites}
                onChange={(e) => setFavorites(e.target.value)}
                placeholder="e.g. Chicken breast, Rice..."
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none h-20 resize-none"
              />
            </div>

            <Button 
                type="submit" 
                disabled={generating}
                className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-6 shadow-lg transition-all"
            >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Generating AI Plan... Can take upto a minute
                  </span>
                ) : (
                  "Save & Generate Plan"
                )}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}