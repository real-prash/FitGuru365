"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { Flame, Beef, Wheat, Droplets } from "lucide-react"; // Install: npm install lucide-react

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Input State
  const [newWeight, setNewWeight] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [dietAdherence, setDietAdherence] = useState(80); // Default 80%
  const [trainingAdherence, setTrainingAdherence] = useState(80);
  const [submittingWeight, setSubmittingWeight] = useState(false);
  const [adjustmentMessage, setAdjustmentMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (uid: string) => {
    try {
      const res = await fetch(`/api/user/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setLoading(false);
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingWeight(true);
    setAdjustmentMessage(null);

    try {
      const res = await fetch("/api/user/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.firebaseUid,
          weight: newWeight,
          date: newDate,
          dietAdherence,
          trainingAdherence,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        await fetchUserData(user.firebaseUid); // Refresh to see new macros/graph
        setNewWeight("");
        setAdjustmentMessage(data.adjustment); // "Plateau detected" etc
        
        // Clear message after 5 seconds
        setTimeout(() => setAdjustmentMessage(null), 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingWeight(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove("loggedin");
    router.push("/login");
  };

  const getGraphData = () => {
    if (!user?.weightHistory) return [];
    return user.weightHistory.map((entry: any) => ({
      date: format(new Date(entry.date), "MMM d"),
      weight: entry.weight,
    }));
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-xl text-slate-600">Loading FitGuru365...</div>;

  if (user && !user.isProfileComplete) {
     // (Keep your existing Onboarding Check Code here...)
     return <div className="p-10 text-center">Please complete your profile first. <Link href="/onboarding" className="text-blue-500">Go to Onboarding</Link></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user?.firstName}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium">
            Sign Out
          </button>
        </div>

        {/* --- MACRO CARD (NEW) --- */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <Flame className="text-yellow-400" /> Daily Targets
                </h2>
                <span className="text-sm text-slate-400 capitalize bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    Goal: {user?.fitnessGoal?.replace("_", " ")}
                </span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Calories</p>
                    <p className="text-3xl font-black text-slate-900">{user?.currentMacros?.calories}</p>
                    <p className="text-xs text-slate-400">kcal</p>
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
            {adjustmentMessage && (
                <div className="bg-blue-50 text-blue-700 text-center py-2 text-sm font-medium border-t border-blue-100 animate-pulse">
                    AI Update: {adjustmentMessage}
                </div>
            )}
        </div>

        {/* Graph & Input */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Weight Progress</h2>
          <div className="h-[300px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getGraphData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']}/>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Add New Entry Form with SLIDERS */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Log Weekly Weigh-In</h3>
            <form onSubmit={handleAddWeight} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              
              {/* Weight */}
              <div className="w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1">Current Weight (kg)</label>
                <input
                  type="number" step="0.1" required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="0.0"
                />
              </div>

              {/* Date */}
              <div className="w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                <input
                  type="date" required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              {/* Diet Consistency Slider */}
              <div className="w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1 flex justify-between">
                    <span>Diet Consistency</span>
                    <span className="text-cyan-600 font-bold">{dietAdherence}%</span>
                </label>
                <input 
                    type="range" min="0" max="100" step="10"
                    value={dietAdherence}
                    onChange={(e) => setDietAdherence(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

               {/* Training Consistency Slider */}
               <div className="w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1 flex justify-between">
                    <span>Training Consistency</span>
                    <span className="text-cyan-600 font-bold">{trainingAdherence}%</span>
                </label>
                <input 
                    type="range" min="0" max="100" step="10"
                    value={trainingAdherence}
                    onChange={(e) => setTrainingAdherence(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4 mt-2">
                <Button 
                    type="submit" 
                    disabled={submittingWeight}
                    className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3"
                >
                    {submittingWeight ? "Calculating Adjustments..." : "Save Log & Update Targets"}
                </Button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}