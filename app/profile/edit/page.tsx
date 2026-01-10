"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uid, setUid] = useState("");


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("lose_fat");
  const [experience, setExperience] = useState("beginner");
  const [workoutFrequency, setWorkoutFrequency] = useState(3);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const res = await fetch(`/api/user/${user.uid}`);
        if (res.ok) {
          const data = await res.json();
          const u = data.user;
          
          setFirstName(u.firstName);
          setLastName(u.lastName);
          setGender(u.gender);
          setAge(u.age);
          setHeight(u.height);
          setWeight(u.weight);
          setFitnessGoal(u.fitnessGoal);
          setExperience(u.experience);
          setWorkoutFrequency(u.workoutFrequency);
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          firstName, lastName, gender, age, height, weight,
          fitnessGoal, experience, workoutFrequency
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Profile</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
        
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                        <input className="w-full p-3 border rounded-lg bg-slate-50" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                        <input className="w-full p-3 border rounded-lg bg-slate-50" value={lastName} onChange={e => setLastName(e.target.value)} required />
                    </div>
                </div>

                
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                        <input 
                            type="number" 
                            min="10" 
                            max="70" 
                            className="w-full p-3 border rounded-lg bg-slate-50" 
                            value={age} 
                            onChange={e => setAge(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Height (cm)</label>
                        <input 
                            type="number" 
                            min="100" 
                            max="215" 
                            className="w-full p-3 border rounded-lg bg-slate-50" 
                            value={height} 
                            onChange={e => setHeight(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weight (kg)</label>
                        <input 
                            type="number" 
                            min="30" 
                            max="150" 
                            className="w-full p-3 border rounded-lg bg-slate-50" 
                            value={weight} 
                            onChange={e => setWeight(e.target.value)} 
                            required 
                        />
                    </div>
                </div>

            
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                    <select className="w-full p-3 border rounded-lg bg-slate-50" value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fitness Goal</label>
                    <select className="w-full p-3 border rounded-lg bg-slate-50" value={fitnessGoal} onChange={e => setFitnessGoal(e.target.value)}>
                        <option value="lose_fat">Lose Fat</option>
                        <option value="gain_muscle">Gain Muscle</option>
                        <option value="recomp">Body Recomposition</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Experience</label>
                    <select className="w-full p-3 border rounded-lg bg-slate-50" value={experience} onChange={e => setExperience(e.target.value)}>
                        <option value="beginner">Beginner (0-1 yr)</option>
                        <option value="intermediate">Intermediate (1-2 yrs)</option>
                        <option value="advanced">Advanced (3+ yrs)</option>
                    </select>
                </div>

              
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                        <span>Workouts Per Week</span>
                        <span className="text-cyan-600 text-lg">{workoutFrequency} Days</span>
                    </label>
                    <input type="range" min="2" max="6" step="1" 
                        value={workoutFrequency} 
                        onChange={e => setWorkoutFrequency(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 mt-4"
                >
                    {saving ? "Saving Changes..." : "Update Profile"}
                </Button>

            </form>
        </div>
      </div>
    </div>
  );
}