"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0A1929]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* Logo - Shifted left with ml-0 */}
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group ml-0 lg:-ml-4"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#2D3A5E] to-[#5B7AB5] rounded-xl flex items-center justify-center shadow-lg shadow-[#2D3A5E]/30 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#4A6FA5] to-[#5B7AB5] bg-clip-text text-transparent">
                cloudintel<span className="text-[#5B7AB5]">.</span>
              </span>
            </div>

            {/* Desktop Nav - Bigger text */}
            <nav className="hidden md:flex items-center gap-10 lg:gap-12 text-base lg:text-lg font-medium">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </button>
            </nav>

            {/* Desktop Buttons - Slightly bigger */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => router.push("/login")}
                className="text-gray-300 hover:text-white px-4 py-2 text-base font-medium transition-colors"
              >
                Sign in
              </button>

              <button
                onClick={() => router.push("/signup")}
                className="bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] px-6 py-2.5 rounded-xl font-medium text-white shadow-lg shadow-[#2D3A5E]/30 hover:shadow-xl hover:shadow-[#2D3A5E]/40 hover:scale-[1.02] transition-all duration-300 text-base"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10 bg-[#0A1929]/95 backdrop-blur-xl">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-300 hover:text-white px-4 py-2 text-base font-medium text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("benefits")}
                  className="text-gray-300 hover:text-white px-4 py-2 text-base font-medium text-left"
                >
                  Benefits
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-gray-300 hover:text-white px-4 py-2 text-base font-medium text-left"
                >
                  How it Works
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-gray-300 hover:text-white px-4 py-2 text-base font-medium text-left"
                >
                  Pricing
                </button>
                <div className="flex flex-col space-y-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => router.push("/login")}
                    className="text-gray-300 hover:text-white px-4 py-2 text-base font-medium text-left"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] mx-4 px-4 py-3 rounded-xl font-medium text-white text-base"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-36 pb-28 px-6 sm:px-8 lg:px-10 overflow-hidden">
        {/* ... (hero section remains the same) ... */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1929] via-[#0F1F2F] to-[#1A2A4A]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(74,111,165,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(45,58,94,0.15),transparent_50%)]"></div>

        {/* Animated Glow Orbs */}
        <div className="absolute top-40 -left-20 w-80 h-80 bg-[#2D3A5E]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-[#4A6FA5]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMkQzQTVFIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm text-gray-300">Intelligent Cloud Analytics Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
              <span className="text-white">Master Your AWS</span>
              <span className="block mt-2 bg-gradient-to-r from-[#4A6FA5] via-[#5B7AB5] to-[#6B8ABF] bg-clip-text text-transparent">
                Cost & Performance
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
              Real-time monitoring, AI-powered forecasting, and automated optimization — all in one platform.
            </p>

            {/* Subheading */}
            <p className="text-base text-gray-400 mb-10 max-w-xl mx-auto">
              Get complete visibility into your AWS infrastructure, predict costs with 98% accuracy, and eliminate waste with data-driven insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => router.push("/signup")}
                className="group bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-xl shadow-[#2D3A5E]/30 hover:shadow-2xl hover:shadow-[#4A6FA5]/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-white text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                See How It Works
              </button>
            </div>

            {/* Platform Impact Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {[
                { value: "30%", label: "Avg. Cost Reduction", icon: "💰" },
                { value: "98%", label: "Forecast Accuracy", icon: "🎯" },
                { value: "Real-time", label: "AWS Monitoring", icon: "⚡" },
                { value: "AI-Powered", label: "Optimization Engine", icon: "🤖" }
              ].map((metric, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-2">{metric.icon}</div>
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Built With Tech Stack */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-white/10">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Built with</span>
              {["AWS SDK", "FastAPI", "PostgreSQL", "ML Model"].map((tech, i) => (
                <span key={i} className="text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST & TESTIMONIALS ================= */}
      <section className="py-24 px-6 sm:px-8 lg:px-10 bg-[#0F1F2F] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMkQzQTVFIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Trusted by Early Users
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              See what engineering teams are saying about CloudIntel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: "Cut our AWS costs by 32% in the first month. The optimization recommendations were spot-on and easy to implement.",
                author: "Sarah Chen",
                role: "CTO, TechFlow",
                rating: 5,
                initials: "SC"
              },
              {
                quote: "The forecasting accuracy is incredible. We now plan our cloud budget with confidence instead of guessing.",
                author: "Michael Rodriguez",
                role: "Engineering Lead, CloudScale",
                rating: 5,
                initials: "MR"
              },
              {
                quote: "Finally a tool that gives us complete visibility across all our AWS accounts. The interface is clean and intuitive.",
                author: "Priya Patel",
                role: "DevOps Manager, DataCore",
                rating: 5,
                initials: "PP"
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#4A6FA5]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2D3A5E]/20"
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] flex items-center justify-center text-sm font-medium text-white">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.author}</p>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-24 px-6 sm:px-8 lg:px-10 bg-[#0A1929]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#5B7AB5] font-semibold text-sm uppercase tracking-[0.2em]">Features</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-4">
              Everything you need to optimize your cloud
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive tools that give you complete control over your AWS infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Reduce Cloud Costs",
                description: "Identify waste and optimize resources to cut your AWS bill by up to 35% with automated recommendations.",
                icon: "💰",
                benefit: "Save money automatically"
              },
              {
                title: "Forecast with Confidence",
                description: "Predict future costs with 98% accuracy using ML models trained on your usage patterns.",
                icon: "📈",
                benefit: "Plan budgets accurately"
              },
              {
                title: "Real-time Visibility",
                description: "Monitor every AWS resource with live metrics, instant alerts, and comprehensive dashboards.",
                icon: "👁️",
                benefit: "Never miss an anomaly"
              },
              {
                title: "AI-Powered Insights",
                description: "Get smart recommendations to improve efficiency and eliminate waste across all services.",
                icon: "🤖",
                benefit: "Optimize automatically"
              },
              {
                title: "Multi-Account Support",
                description: "Manage all your AWS accounts from a single dashboard with consolidated views.",
                icon: "🏢",
                benefit: "Centralized control"
              },
              {
                title: "Sustainability Tracking",
                description: "Monitor carbon footprint and get recommendations for green computing practices.",
                icon: "🌱",
                benefit: "Build responsibly"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#4A6FA5] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2D3A5E]/30"
              >
                {/* Icon with glow */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[#4A6FA5]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] flex items-center justify-center text-2xl shadow-lg">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>

                {/* Benefit tag */}
                <div className="inline-flex items-center gap-1 text-xs text-[#5B7AB5] bg-[#5B7AB5]/10 px-3 py-1 rounded-full">
                  <span>{feature.benefit}</span>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <svg className="w-6 h-6 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BENEFITS SECTION ================= */}
      <section id="benefits" className="py-24 px-6 sm:px-8 lg:px-10 bg-[#0F1F2F]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#5B7AB5] font-semibold text-sm uppercase tracking-[0.2em]">Benefits</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-6">
                Transform your cloud operations
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Stop guessing and start optimizing. CloudIntel gives you the insights you need to make smarter decisions.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Reduce costs by 30% on average",
                    description: "Identify underutilized resources and right-size instances automatically",
                    icon: "💰"
                  },
                  {
                    title: "Improve infrastructure efficiency",
                    description: "Get real-time visibility into resource utilization and performance",
                    icon: "⚡"
                  },
                  {
                    title: "Make data-driven decisions",
                    description: "Accurate forecasts and insights to plan your cloud infrastructure better",
                    icon: "📊"
                  },
                  {
                    title: "Enterprise-grade security",
                    description: "Your data is encrypted and secure with industry-standard compliance",
                    icon: "🔒"
                  }
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#4A6FA5]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{benefit.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "30%", label: "Average savings", color: "from-emerald-500 to-emerald-400" },
                { value: "98%", label: "Forecast accuracy", color: "from-[#4A6FA5] to-[#5B7AB5]" },
                { value: "24/7", label: "Real-time monitoring", color: "from-purple-500 to-purple-400" },
                { value: "10x", label: "Faster insights", color: "from-amber-500 to-amber-400" }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-[#4A6FA5]/50 transition-all duration-300"
                >
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-24 px-6 sm:px-8 lg:px-10 bg-[#0A1929]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#5B7AB5] font-semibold text-sm uppercase tracking-[0.2em]">Process</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-4">
              Get started in minutes
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Simple three-step process to start optimizing your cloud infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Connect your AWS",
                description: "Securely connect your AWS account with read-only credentials in just a few clicks.",
                icon: "🔌"
              },
              {
                step: "02",
                title: "AI analyzes everything",
                description: "Our engine analyzes your infrastructure and identifies optimization opportunities.",
                icon: "🤖"
              },
              {
                step: "03",
                title: "Start saving immediately",
                description: "Get actionable recommendations and start reducing costs right away.",
                icon: "💰"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 group-hover:border-[#4A6FA5] transition-all duration-300 group-hover:-translate-y-2">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-5xl font-bold text-[#2D3A5E] mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/3 -right-4 text-2xl text-[#4A6FA5]">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section id="pricing" className="py-24 px-6 sm:px-8 lg:px-10 bg-[#0F1F2F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#5B7AB5] font-semibold text-sm uppercase tracking-[0.2em]">Pricing</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Start with a free trial. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$0",
                period: "forever",
                description: "Perfect for small projects and testing",
                features: [
                  "Up to 10 AWS resources",
                  "Basic monitoring",
                  "7-day data retention",
                  "Email support"
                ],
                buttonText: "Start Free",
                popular: false
              },
              {
                name: "Pro",
                price: "$49",
                period: "per month",
                description: "For growing teams with multiple accounts",
                features: [
                  "Unlimited AWS resources",
                  "Advanced analytics",
                  "30-day data retention",
                  "AI-powered forecasts",
                  "Priority support",
                  "Custom reports"
                ],
                buttonText: "Start 14-day trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "contact us",
                description: "For large organizations with specific needs",
                features: [
                  "Everything in Pro",
                  "SLA guarantees",
                  "Custom integrations",
                  "Dedicated account manager",
                  "On-premise deployment"
                ],
                buttonText: "Contact Sales",
                popular: false
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular
                    ? "bg-gradient-to-b from-[#1A2A4A] to-[#0F1F2F] border-2 border-[#4A6FA5] shadow-2xl shadow-[#4A6FA5]/20 scale-105"
                    : "bg-white/5 border border-white/10 hover:border-[#4A6FA5]/50 shadow-xl"
                } p-8`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4A6FA5] to-[#5B7AB5] text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-1">/{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => router.push(plan.name === "Enterprise" ? "/contact" : "/signup")}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] text-white hover:shadow-xl hover:shadow-[#2D3A5E]/30 hover:scale-[1.02]"
                      : "border border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 px-6 sm:px-8 lg:px-10 bg-gradient-to-br from-[#0A1929] to-[#1A2A4A] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#2D3A5E]/30 to-[#4A6FA5]/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Start optimizing today
          </h2>
          <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
            Join hundreds of companies already saving millions on AWS. Your 14-day free trial starts now.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/signup")}
              className="group bg-white text-[#0A1929] px-10 py-5 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="border-2 border-white/20 px-10 py-5 rounded-xl font-semibold text-lg text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              Talk to Sales
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-8 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* ================= ENHANCED FOOTER ================= */}
      <footer className="bg-[#0A1929] text-gray-400 px-6 sm:px-8 lg:px-10 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

            {/* Brand Column - Full width on mobile */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">cloudintel<span className="text-[#5B7AB5]">.</span></span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
                AI-powered AWS monitoring and optimization platform for modern cloud infrastructure. Trusted by engineering teams worldwide.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-110">
                  <span>𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-110">
                  <span>in</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-110">
                  <span>🐙</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-110">
                  <span>▶</span>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-base">Product</h3>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection("features")} className="text-gray-400 hover:text-white transition text-sm">Features</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="text-gray-400 hover:text-white transition text-sm">Pricing</button></li>
                <li><button onClick={() => scrollToSection("how-it-works")} className="text-gray-400 hover:text-white transition text-sm">How it Works</button></li>
                <li><a href="/integrations" className="text-gray-400 hover:text-white transition text-sm">Integrations</a></li>
                <li><a href="/changelog" className="text-gray-400 hover:text-white transition text-sm">Changelog</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-base">Company</h3>
              <ul className="space-y-3">
                <li><a href="/about" className="text-gray-400 hover:text-white transition text-sm">About</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition text-sm">Blog</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition text-sm">Careers</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition text-sm">Contact</a></li>
                <li><a href="/press" className="text-gray-400 hover:text-white transition text-sm">Press</a></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-base">Resources</h3>
              <ul className="space-y-3">
                <li><a href="/docs" className="text-gray-400 hover:text-white transition text-sm">Documentation</a></li>
                <li><a href="/api" className="text-gray-400 hover:text-white transition text-sm">API Reference</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-white transition text-sm">Support</a></li>
                <li><a href="/status" className="text-gray-400 hover:text-white transition text-sm">System Status</a></li>
                <li><a href="/tutorials" className="text-gray-400 hover:text-white transition text-sm">Tutorials</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-base">Legal</h3>
              <ul className="space-y-3">
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition text-sm">Privacy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition text-sm">Terms</a></li>
                <li><a href="/security" className="text-gray-400 hover:text-white transition text-sm">Security</a></li>
                <li><a href="/cookies" className="text-gray-400 hover:text-white transition text-sm">Cookies</a></li>
                <li><a href="/compliance" className="text-gray-400 hover:text-white transition text-sm">Compliance</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar - Enhanced */}
          <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm order-2 lg:order-1">
              © {new Date().getFullYear()} Cloud Intelligence Platform. All rights reserved.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 order-1 lg:order-2">
              <a href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition">Privacy</a>
              <a href="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition">Terms</a>
              <a href="/cookies" className="text-gray-500 hover:text-gray-300 text-sm transition">Cookies</a>
              <a href="/sitemap" className="text-gray-500 hover:text-gray-300 text-sm transition">Sitemap</a>
            </div>
          </div>

          {/* Trust Badges - Enhanced */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8 pt-8 border-t border-white/5">
            <span className="text-xs text-gray-600 hover:text-gray-400 transition">SOC 2 Type II</span>
            <span className="text-xs text-gray-600 hover:text-gray-400 transition">GDPR Compliant</span>
            <span className="text-xs text-gray-600 hover:text-gray-400 transition">AWS Partner</span>
            <span className="text-xs text-gray-600 hover:text-gray-400 transition">ISO 27001</span>
            <span className="text-xs text-gray-600 hover:text-gray-400 transition">HIPAA Ready</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
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
