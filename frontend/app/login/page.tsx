"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError("Server error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1929] overflow-hidden relative">
      
      {/* Main Background Gradient - Matching Hero Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1929] via-[#0F1F2F] to-[#1A2A4A]"></div>
      
      {/* Animated Glow Effects - Matching Main Page */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D3A5E]/20 via-[#4A6FA5]/10 to-[#5B7AB5]/20 blur-3xl opacity-50 animate-pulse"></div>
      
      {/* Floating Orbs - Matching Main Page Hero */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-[#2D3A5E]/30 to-[#4A6FA5]/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-[#4A6FA5]/30 to-[#5B7AB5]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Additional Depth Layers */}
      <div className="absolute top-40 right-40 w-64 h-64 bg-gradient-to-br from-[#1A2A4A]/40 to-[#2D3A5E]/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-40 w-64 h-64 bg-gradient-to-br from-[#3A5A8A]/30 to-[#4A6FA5]/30 rounded-full blur-3xl"></div>
      
      {/* Subtle Grid Pattern - Matching Main Page */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMkQzQTVFIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-20"></div>

      {/* Logo - Top Left */}
      <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
        <div className="w-8 h-8 bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] rounded-lg flex items-center justify-center shadow-lg shadow-[#2D3A5E]/30">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-[#4A6FA5] to-[#5B7AB5] bg-clip-text text-transparent">
          cloudintel<span className="text-[#5B7AB5]">.</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md px-4 z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-white/10 p-8 md:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-gray-300 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 block">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/50 focus:border-[#4A6FA5] transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-200 block">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-[#5B7AB5] hover:text-[#4A6FA5] transition font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/50 focus:border-[#4A6FA5] transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#4A6FA5] focus:ring-[#4A6FA5]/50"
                />
                <label htmlFor="remember" className="text-sm text-gray-300">
                  Remember Me
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] text-white py-3.5 rounded-xl font-medium hover:shadow-xl hover:shadow-[#2D3A5E]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-4 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-200 group">
              <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium text-white">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-200 group">
              <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
              </svg>
              <span className="text-sm font-medium text-white">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-300 mt-8">
            Don't have an account?{" "}
            <Link 
              href="/register" 
              className="text-[#5B7AB5] hover:text-[#4A6FA5] font-medium transition"
            >
              Create free account
            </Link>
          </p>
        </div>

        {/* Trust Badge */}
        <p className="text-center text-xs text-gray-400 mt-6">
          🔒 Secured by enterprise-grade encryption
        </p>
      </div>

      {/* Footer Links */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 text-xs text-gray-400 z-10">
        <Link href="/privacy" className="hover:text-[#5B7AB5] transition">Privacy</Link>
        <Link href="/terms" className="hover:text-[#5B7AB5] transition">Terms</Link>
        <Link href="/contact" className="hover:text-[#5B7AB5] transition">Contact</Link>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
