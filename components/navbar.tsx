"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { Menu, X } from "lucide-react"; 

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check login status on mount
  useEffect(() => {
    const checkLogin = () => {
      const cookie = Cookies.get("loggedin");
      setIsLoggedIn(!!cookie);
    };

    checkLogin();
    
  
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, [pathname]); 

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove("loggedin");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);


  const isActive = (path: string) => pathname === path ? "text-cyan-600 font-semibold" : "text-slate-600 hover:text-cyan-600";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-cyan-500 to-emerald-400 bg-clip-text text-transparent">
            FitGuru365
          </span>
        </Link>

      
        <div className="hidden md:flex items-center gap-8">
          <Link href="/how-it-works" className={`text-sm transition-colors ${isActive("/how-it-works")}`}>
            How it Works
          </Link>
          <Link href="/about" className={`text-sm transition-colors ${isActive("/about")}`}>
            About Us
          </Link>
        </div>

      
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className={`text-sm font-medium ${isActive("/dashboard")}`}>
                Dashboard
              </Link>
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                className="text-slate-600 hover:text-red-600 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-slate-600 hover:text-cyan-600">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        
        <button className="md:hidden text-slate-600" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-4 shadow-lg absolute w-full left-0">
          <Link 
            href="/how-it-works" 
            className="block text-sm font-medium text-slate-600" 
            onClick={() => setMobileMenuOpen(false)}
          >
            How it Works
          </Link>
          <Link 
            href="/about" 
            className="block text-sm font-medium text-slate-600" 
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                 <Link 
                  href="/dashboard" 
                  className="block text-center w-full py-2 rounded-lg bg-cyan-50 text-cyan-700 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="block text-center w-full py-2 text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block text-center w-full py-2 rounded-lg border border-slate-200 text-slate-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="block text-center w-full py-2 rounded-lg bg-slate-900 text-white font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};