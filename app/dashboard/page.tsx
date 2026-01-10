"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, differenceInDays } from "date-fns"; 
import { 
  Flame, Beef, Wheat, Droplets, 
  Utensils, Dumbbell, Settings, 
  ClipboardList, Bell, Check, Scale 
} from "lucide-react"; 
import { ReminderButton } from "@/components/reminder-button"; 

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [dietAdherence, setDietAdherence] = useState(80);
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
        await fetchUserData(user.firebaseUid);
        setNewWeight("");
        setAdjustmentMessage(data.adjustment);
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

  
  const getNotifications = () => {
    const msgs = [];
    
  
    if (user && user.weightHistory && user.weightHistory.length > 0) {
        const lastEntry = user.weightHistory[user.weightHistory.length - 1];
        const daysSince = differenceInDays(new Date(), new Date(lastEntry.date));
        
        if (daysSince >= 7) {
            msgs.push({
                id: 'weight-log',
                icon: <Scale className="text-amber-500" size={20} />,
                title: "Weekly Check-in Required",
                body: `It's been ${daysSince} days since your last log. Update your weight to keep your calorie targets accurate.`,
                variant: "warning"
            });
        }
    }

    
    if (user && !user.isProfileComplete) {
        msgs.push({
            id: 'profile-incomplete',
            icon: <ClipboardList className="text-blue-500" size={20} />,
            title: "Setup Incomplete",
            body: "Complete your onboarding to unlock AI features.",
            variant: "info"
        });
    }
    
    return msgs;
  };

  const notifications = getNotifications();

  if (loading) return <div className="flex h-screen items-center justify-center text-xl text-slate-600">Loading FitGuru365...</div>;

  if (user && !user.isProfileComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-10 text-center">
          <div className="mx-auto w-20 h-20 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <ClipboardList size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Welcome, {user.firstName}!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">To generate your personalized AI workout and diet plans, we first need to understand your biology and goals.</p>
          <Button asChild className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white font-bold text-lg h-14 shadow-lg">
            <Link href="/onboarding">Complete Setup</Link>
          </Button>
          <button onClick={handleLogout} className="mt-8 text-sm text-slate-400 hover:text-red-500 transition-colors font-medium">Sign Out</button>
        </div>
      </div>
    );
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

          <div className="flex items-center gap-3">
             <ReminderButton />
             <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                <Link href="/profile/edit" className="flex items-center gap-2">
                    <Settings size={16} /> Edit Profile
                </Link>
             </Button>
             <button onClick={handleLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium text-sm">
                Sign Out
             </button>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Bell size={18} className="text-slate-500" /> In-App Messages
                </h3>
                {notifications.length > 0 && (
                    <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                        {notifications.length} New
                    </span>
                )}
            </div>
            
            <div className="p-0">
                {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                            <Check size={20} className="text-emerald-500" />
                        </div>
                        <p className="text-sm">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map(msg => (
                            <div key={msg.id} className="p-4 hover:bg-slate-50 transition flex gap-4 items-start border-l-4 border-amber-400">
                                <div className="mt-1 p-2 bg-amber-50 rounded-full">{msg.icon}</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{msg.title}</h4>
                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{msg.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      
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

      
      
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
          
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Weight Progress</h2>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
              For accurate adjustments, please log your weight <strong>once a week</strong> (e.g., every Friday morning).
            </p>
          </div>

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

        
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Log Weekly Weigh-In</h3>
            <form onSubmit={handleAddWeight} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              
              <div className="w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1">Current Weight (kg)</label>
                <input type="number" step="0.1" required value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="0.0" />
              </div>
              <div className="w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div className="w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1 flex justify-between"><span>Diet Consistency</span><span className="text-cyan-600 font-bold">{dietAdherence}%</span></label>
                <input type="range" min="0" max="100" step="10" value={dietAdherence} onChange={(e) => setDietAdherence(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
              </div>
               <div className="w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1 flex justify-between"><span>Training Consistency</span><span className="text-cyan-600 font-bold">{trainingAdherence}%</span></label>
                <input type="range" min="0" max="100" step="10" value={trainingAdherence} onChange={(e) => setTrainingAdherence(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
              </div>
              <div className="md:col-span-2 lg:col-span-4 mt-2">
                <Button type="submit" disabled={submittingWeight} className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3">
                    {submittingWeight ? "Calculating Adjustments..." : "Save Log & Update Targets"}
                </Button>
              </div>
            </form>
          </div>

        
          <div className="border-t border-slate-100 pt-8 mt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">AI Plan Generators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 text-center hover:shadow-md transition">
                    <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-emerald-600"><Utensils size={24} /></div>
                    <h4 className="font-bold text-emerald-900 mb-2">Nutrition Plan</h4>
                    <p className="text-sm text-emerald-700 mb-6">Get a personalized meal plan based on your calories, allergies, and favorite foods.</p>
                    <Button asChild className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"><Link href="/diet-plan">Get Diet Plan</Link></Button>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center hover:shadow-md transition">
                    <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600"><Dumbbell size={24} /></div>
                    <h4 className="font-bold text-blue-900 mb-2">Workout Routine</h4>
                    <p className="text-sm text-blue-700 mb-6">Build a {user?.workoutFrequency}-day training split tailored to your goals and experience level.</p>
                    <Button asChild className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"><Link href="/workout-plan">Get Workout Plan</Link></Button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}