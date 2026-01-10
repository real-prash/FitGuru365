"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase"; 
import Link from "next/link";
import { Button } from "@/components/ui/button"; 

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          firstName,
          lastName,
          gender,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user profile to database");
      }

      router.push("/login");
      
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-50 opacity-50 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join <span className="font-bold text-slate-700">FitGuru365</span> today
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                placeholder="First Name"
              />
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                placeholder="Last Name"
              />
            </div>

            <div className="relative">
              <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none appearance-none transition-all"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
              </select>
              
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              placeholder="Email Address"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              placeholder="Password"
            />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              placeholder="Confirm Password"
            />
          </div>

          
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white font-bold text-lg py-6 shadow-md transition-all duration-300 mt-2"
          >
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="font-semibold text-cyan-600 hover:text-cyan-500 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}