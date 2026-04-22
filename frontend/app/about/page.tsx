"use client";

import { motion } from "framer-motion";
import { Cloud, ShieldCheck, Cpu, Code2, Mail, ArrowLeft, Globe, Zap, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AboutPage() {
  const router = useRouter();

  const sections = [
    {
      title: "Project Mission",
      content: "CloudIntel was built to simplify the complexities of AWS Infrastructure management. Our mission is to provide DevSecOps teams with clear, actionable insights into their cloud spend and security posture through high-performance data synchronization and AI-driven analytics.",
      icon: Cloud,
      color: "text-blue-400"
    },
    {
      title: "How it Works",
      content: "The platform connects securely to your AWS account using read-only IAM credentials. It perform automatic daily syncs for EC2, S3, RDS, and Lambda resources, calculating costs and analyzing utilization metrics to provide optimization recommendations.",
      icon: Zap,
      color: "text-amber-400"
    },
    {
      title: "Security & Privacy",
      content: "We take your cloud security seriously. All AWS credentials are encrypted at rest. The platform uses minimal required IAM permissions (ReadOnlyAccess) and never modifies your live infrastructure without explicit user action in the optimization dashboard.",
      icon: ShieldCheck,
      color: "text-emerald-400"
    },
    {
      title: "Technical Stack",
      content: "Built for speed and reliability using modern tools: Next.js 14 (Frontend), FastAPI (Python Backend), PostgreSQL (Database), and Boto3 (AWS Integration). The entire system is architected for low latency and high scalability.",
      icon: Code2,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0A1929]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] rounded-xl flex items-center justify-center">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">cloudintel<span className="text-[#5B7AB5]">.</span></span>
          </Link>
          
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Platform <span className="text-[#5B7AB5]">Information</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about the Cloud Intelligence Platform, its architecture, and its mission.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {sections.map((section, idx) => (
            <motion.section
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/5 rounded-3xl p-8 md:p-10 hover:border-[#5B7AB5]/30 transition-all duration-500 group"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <section.icon className={`w-8 h-8 ${section.color}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 rounded-[3rem] bg-gradient-to-br from-[#1A2A4A] to-[#0A1929] border border-white/10 text-center"
        >
          <Mail className="w-12 h-12 text-[#5B7AB5] mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
            If you need technical support or have questions about the platform, our development team is ready to help.
          </p>
          <a 
            href="mailto:support@cloudintel.io" 
            className="inline-block bg-[#5B7AB5] text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#5B7AB5]/20 hover:bg-[#4A6FA5] transition-all"
          >
            Contact Support
          </a>
        </motion.div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center text-gray-500 font-medium">
        <p>© 2026 Cloud Intelligence Platform. Created for the future of FinOps.</p>
      </footer>
    </div>
  );
}
