"use client";

import Cookies from "js-cookie";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Import Shadcn Button

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Cookies.set("loggedin", "true", { expires: 1 });
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox and spam folder.");
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 relative overflow-hidden">
  
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-50 opacity-50 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm font-medium">
            <span className="bg-gradient-to-r from-cyan-500 to-emerald-400 bg-clip-text text-transparent">
              FitGuru365 by Prash
            </span>
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">{error}</div>}
        {message && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-md text-sm border border-emerald-100">{message}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              placeholder="Email address"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              placeholder="Password"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm font-medium text-slate-500 hover:text-cyan-600 transition-colors"
            >
              Forgot password?
            </button>
          </div>
      
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white font-bold text-lg py-6 shadow-md transition-all duration-300"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-cyan-600 hover:text-cyan-500 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}