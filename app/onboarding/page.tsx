"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);

  // Form State
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("lose_fat");
  const [experience, setExperience] = useState("beginner");
  const [workoutFrequency, setWorkoutFrequency] = useState(3); // Default to 3 days

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userUid,
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
          fitnessGoal,
          experience,
          workoutFrequency, // Send new field
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Setup Your Profile</h1>
          <p className="text-slate-500 mt-2">Help us customize your plan.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                required
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="180"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="75"
              />
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fitness Goal</label>
            <select
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="lose_fat">Lose Fat</option>
              <option value="gain_muscle">Gain Muscle / Weight</option>
              <option value="recomp">Lose Fat & Gain Muscle (Recomp)</option>
            </select>
          </div>

          {/* NEW: Workout Frequency Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Workouts Per Week ({workoutFrequency} Days)
            </label>
            <div className="flex justify-between gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setWorkoutFrequency(num)}
                  className={`flex-1 py-3 rounded-lg font-bold border transition-all ${
                    workoutFrequency === num
                      ? "bg-cyan-500 text-white border-cyan-500 shadow-md transform scale-105"
                      : "bg-white text-slate-600 border-gray-200 hover:border-cyan-300 hover:bg-cyan-50"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { val: "beginner", label: "Beginner (0-1 Years)" },
                { val: "intermediate", label: "Intermediate (1-2 Years)" },
                { val: "advanced", label: "Advanced (2+ Years)" },
              ].map((level) => (
                <label
                  key={level.val}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    experience === level.val
                      ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={level.val}
                    checked={experience === level.val}
                    onChange={(e) => setExperience(e.target.value)}
                    className="hidden"
                  />
                  <div className="font-semibold">{level.label}</div>
                </label>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white font-bold text-lg py-6 mt-4"
          >
            {loading ? "Saving Profile..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  );
}