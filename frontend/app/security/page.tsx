"use client";

import { motion } from "framer-motion";
import { Cloud, ArrowLeft, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SecurityPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      <nav className="border-b border-white/5 bg-[#0A1929]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] rounded-xl flex items-center justify-center">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">cloudintel<span className="text-[#5B7AB5]">.</span></span>
          </Link>
          
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8">
            <Lock className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Security Framework
          </h1>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/5 rounded-3xl p-8 md:p-12"
        >
          <p className="text-gray-400 text-xl leading-relaxed">
            Security is non-negotiable. Our platform operates strictly on ReadOnlyAccess IAM policies. All transit is encrypted via TLS 1.3, and database operations use advanced row-level security.
          </p>
        </motion.section>

        
      </main>

      <footer className="py-10 border-t border-white/5 text-center text-gray-500 text-sm font-medium mt-auto relative bottom-0 w-full">
        <p>© 2026 Cloud Intelligence Platform.</p>
      </footer>
    </div>
  );
}
