"use client";

import Link from "next/link";
import Image from "next/image"; 
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  Code2, 
  Instagram, 
  Mail, 
  Trophy, 
  MapPin 
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      
     
      <div className="relative overflow-hidden pt-20 pb-24 text-center px-6 bg-slate-50 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-50 opacity-50 blur-3xl rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 opacity-50 blur-3xl rounded-full pointer-events-none -z-10" />
        
        
        <div className="w-40 h-40 mx-auto bg-gradient-to-tr from-cyan-500 to-emerald-500 rounded-full p-1 mb-6 shadow-xl">
           <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
              <Image 
                src="/profilepic.jpeg" 
                alt="Prashant Nigam" 
                fill
                className="object-cover"
                priority
              />
           </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Hi, I’m Prash.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          NASM Certified Personal Trainer & Full-Stack Developer.
        </p>
      </div>


      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">
        
       
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 shrink-0">
             <Dumbbell size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">The Coach</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              My passion for fitness stems from my personal journey. Growing up, I struggled with confidence and body image issues, fluctuating from skinny to overweight and facing my share of challenges at school. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Determined to change, I turned to training. That transformation didn't just build muscle—it built a resilience I carry into everything I do. Today, as a <strong>NASM Certified Personal Trainer</strong>, I’ve had the privilege of coaching clients at renowned studios like <strong>Winnipeg Winter Club, Orangetheory, 9ROUND, and Fit Body Bootcamp</strong>.
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
               <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                 <Trophy size={18} className="text-yellow-500"/> My Philosophy
               </h3>
               <p className="text-sm text-slate-500 italic">
                 "I focus on time-efficient, budget-friendly, and sustainable practices. Whether you want to lose fat, build muscle, or simply become the best version of yourself, I guide you every step of the way."
               </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 shrink-0">
             <Code2 size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">The Engineer</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Beyond the gym, I am a tech enthusiast with a strong foundation in full-stack development. I hold a <strong>BSc in Computer Science</strong> (Minor in Mathematics) from the <strong>University of Manitoba</strong>.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              I specialize in building scalable applications using modern stacks like <strong>React, Next.js, TypeScript, Go, PostgreSQL, and MongoDB</strong>. My experience includes designing distributed backend services, real-time systems, and production-ready platforms that are actively used by real users.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">Next.js 15</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">TypeScript</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">AI Integration</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">AWS</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 to-emerald-500/10" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">Why I Built FitGuru365</h2>
          <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 relative z-10">
            I realized that elite coaching is often expensive and inaccessible. I wanted to bridge the gap between my two worlds: 
            <strong> The empathy of a human coach</strong> and <strong>the precision of software</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto relative z-10">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
               <h4 className="font-bold text-cyan-400 mb-1">My 12-Week Program</h4>
               <p className="text-sm text-slate-400">The logic inside FitGuru365 is based on my proven "Physique Transformation Program" used with real clients.</p>
            </div>
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
               <h4 className="font-bold text-emerald-400 mb-1">AI Automation</h4>
               <p className="text-sm text-slate-400">I engineered the system to automate the weekly calorie adjustments and split creation I usually do manually.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Let's Connect</h3>
            <div className="flex flex-col md:flex-row justify-center gap-4">
                <Button asChild variant="outline" className="h-12 border-slate-300 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200">
                    <a href="https://instagram.com/real_prash" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Instagram size={20} /> Follow on Instagram
                    </a>
                </Button>
                <Button asChild variant="outline" className="h-12 border-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                    <a href="mailto:prashant.nigam2256@gmail.com" className="flex items-center gap-2">
                        <Mail size={20} /> Email Me
                    </a>
                </Button>
            </div>
            <p className="mt-8 text-sm text-slate-400 flex items-center justify-center gap-2">
               <MapPin size={14} /> Based in Winnipeg, MB
            </p>
        </div>

      </div>
    </div>
  );
}
