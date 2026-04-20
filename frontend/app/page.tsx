"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import {
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Globe,
  CheckCircle2,
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Cloud,
  PieChart,
  Target,
  Sparkles,
  Search,
  Users,
  LayoutDashboard,
  LucideIcon,
  Activity,
  DollarSign,
  Clock,
  Award,
  Star,
  ArrowUpRight,
  Play,
  Pause,
  Maximize2
} from "lucide-react";

// Custom hook for mouse parallax
const useMouseParallax = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
};

// Custom cursor component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const hoverElements = document.querySelectorAll('button, a, .hoverable');
    const handleMouseEnterHover = () => setIsHovering(true);
    const handleMouseLeaveHover = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnterHover);
      el.addEventListener('mouseleave', handleMouseLeaveHover);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnterHover);
        el.removeEventListener('mouseleave', handleMouseLeaveHover);
      });
    };
  }, [isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
      animate={{
        x: position.x - 12,
        y: position.y - 12,
        scale: isHovering ? 1.5 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    >
      <div className={`w-6 h-6 rounded-full border-2 border-[#5B7AB5] transition-all duration-300 ${isHovering ? 'bg-[#5B7AB5]/20 scale-150' : ''
        }`} />
    </motion.div>
  );
};

// Animated number counter
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value);
      let start = 0;
      const duration = 2000;
      const increment = numericValue / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

// Particle background component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      velocity: { x: number; y: number };
    }> = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        alpha: Math.random() * 0.5,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
        },
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91, 122, 181, ${particle.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30" />;
};

// Glowing card component
const GlowingCard = ({ children, className = "", delay = 0 }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -10 }}
      className={`group relative bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/5 hover:border-[#5B7AB5]/40 transition-all duration-500 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B7AB5]/0 via-[#5B7AB5]/0 to-[#5B7AB5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-[#5B7AB5]/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      {children}
    </motion.div>
  );
};

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  const mousePosition = useMouseParallax();

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

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
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] overflow-x-hidden">
      <CustomCursor />
      <ParticleBackground />

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#5B7AB5]/10 blur-[120px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#2D3A5E]/10 blur-[150px]"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Header with enhanced effects */}
      <motion.header
        style={{ y }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
            ? "bg-[#0A1929]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/50"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group ml-0 lg:-ml-4"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#2D3A5E] to-[#5B7AB5] rounded-xl flex items-center justify-center shadow-lg shadow-[#2D3A5E]/30"
              >
                <Cloud className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#4A6FA5] to-[#5B7AB5] bg-clip-text text-transparent tracking-tight">
                cloudintel<span className="text-[#5B7AB5]">.</span>
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-10 lg:gap-12 text-base lg:text-lg font-medium">
              {['Features', 'Benefits', 'How it Works', 'Pricing'].map((item, idx) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))}
                  className="text-gray-400 hover:text-white transition-colors relative group"
                >
                  {item}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#5B7AB5]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/login")}
                className="text-gray-400 hover:text-white px-4 py-2 text-base font-medium transition-colors"
              >
                Sign in
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/signup")}
                className="relative overflow-hidden group bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] px-6 py-2.5 rounded-xl font-medium text-white shadow-lg shadow-[#2D3A5E]/30 hover:shadow-xl hover:shadow-[#2D3A5E]/40 transition-all duration-300 text-base"
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>

            {/* Mobile menu button with animation */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Enhanced mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden py-6 border-t border-white/10 bg-[#0A1929]/95 backdrop-blur-2xl overflow-hidden"
              >
                <div className="flex flex-col space-y-4 px-2">
                  {['Features', 'Benefits', 'How it Works', 'Pricing'].map((item, i) => (
                    <motion.button
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))}
                      className="text-gray-400 hover:text-white px-4 py-3 text-lg font-medium text-left rounded-xl hover:bg-white/5 transition-all"
                    >
                      {item}
                    </motion.button>
                  ))}
                  <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => router.push("/login")}
                      className="text-gray-400 hover:text-white px-4 py-2 text-lg font-medium text-left"
                    >
                      Sign in
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => router.push("/signup")}
                      className="bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] mx-4 px-4 py-4 rounded-xl font-semibold text-white text-lg shadow-lg shadow-[#2D3A5E]/30"
                    >
                      Get Started
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section with 3D tilt effect */}
      <section className="relative pt-36 pb-28 px-6 sm:px-8 lg:px-10 overflow-hidden">
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center gap-2 bg-[#4A6FA5]/10 backdrop-blur-md px-4 py-2 rounded-full border border-[#4A6FA5]/20 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-[#5B7AB5]" />
              </motion.div>
              <span className="text-sm font-medium text-[#5B7AB5] tracking-wide uppercase">Intelligent Cloud Analytics Platform</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight mb-8">
              <span className="text-white">Master Your AWS</span>
              <motion.span
                className="block mt-2 bg-gradient-to-r from-[#4A6FA5] via-[#5B7AB5] to-[#7B9ACF] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% auto" }}
              >
                Cost & Performance
              </motion.span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
              Real-time monitoring, AI-powered forecasting, and automated optimization — all in one unified platform.
            </motion.p>

            <motion.p variants={fadeIn} className="text-base text-gray-500 mb-12 max-w-xl mx-auto">
              Get complete visibility, predict costs with 98% accuracy, and eliminate waste with data-driven insights.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/signup")}
                className="group relative bg-[#5B7AB5] hover:bg-[#4A6FA5] px-10 py-5 rounded-2xl font-bold text-white text-xl shadow-2xl shadow-[#5B7AB5]/40 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Start Free Trial</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ChevronRight className="relative z-10 w-6 h-6" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("features")}
                className="bg-white/5 backdrop-blur-lg border-2 border-white/10 px-10 py-5 rounded-2xl font-bold text-white text-xl hover:bg-white/10 hover:border-[#5B7AB5]/50 transition-all duration-300"
              >
                See How It Works
              </motion.button>
            </motion.div>

            {/* Animated metrics with counters */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-24"
            >
              {[
                { value: "30", label: "Avg. Cost Reduction", icon: TrendingUp, suffix: "%", color: "text-emerald-400" },
                { value: "98", label: "Forecast Accuracy", icon: Target, suffix: "%", color: "text-[#5B7AB5]" },
                { value: "Real-time", label: "Monitoring", icon: Zap, suffix: "", color: "text-amber-400" },
                { value: "AI-Powered", label: "Optimization", icon: Cpu, suffix: "", color: "text-purple-400" }
              ].map((metric, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 group"
                >
                  <motion.div
                    className={`w-12 h-12 ${metric.color} bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <metric.icon className="w-6 h-6" />
                  </motion.div>
                  <div className="text-3xl font-black text-white mb-1 tracking-tight">
                    {metric.value === "Real-time" || metric.value === "AI-Powered" ?
                      metric.value :
                      <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                    }
                  </div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-widest leading-tight">{metric.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tech stack with hover effects */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap items-center justify-center gap-6 mt-16 pt-10 border-t border-white/5"
            >
              <span className="text-sm text-gray-600 font-bold uppercase tracking-[0.3em]">Built with</span>
              {["AWS SDK", "FastAPI", "PostgreSQL", "ML Models"].map((tech, i) => (
                <motion.span
                  key={i}
                  whileHover={{ y: -5, color: "#fff", borderColor: "#5B7AB5", scale: 1.05 }}
                  className="text-sm font-semibold text-gray-500 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 cursor-default transition-all"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section with auto-rotating testimonials */}
      <section className="py-24 px-6 sm:px-8 lg:px-10 bg-[#0F1F2F] relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] mb-6"
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
              Trusted by Engineering Teams
            </h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto">
              CloudIntel is the preferred choice for modern enterprises optimizing their AWS infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
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
              <GlowingCard key={i} delay={i * 0.2}>
                <div className="p-10">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 + j * 0.1 }}
                      >
                        <Star className="w-4 h-4 text-[#5B7AB5] fill-[#5B7AB5]" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 6 }}
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] flex items-center justify-center text-sm font-bold text-white shadow-lg"
                    >
                      {testimonial.initials}
                    </motion.div>
                    <div>
                      <p className="text-base font-bold text-white">{testimonial.author}</p>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </GlowingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with enhanced cards */}
      <section id="features" className="py-32 px-6 sm:px-8 lg:px-10 bg-[#0A1929] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[#5B7AB5] font-black text-sm uppercase tracking-[0.4em] mb-4 block">Features</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-8">
              Everything you need to <br /> <span className="text-[#5B7AB5]">optimize your cloud</span>
            </h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
              Comprehensive tools that give you absolute control over your infrastructure and spending.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Reduce Cloud Costs",
                description: "Identify waste and optimize resources to cut your AWS bill by up to 35% with automated recommendations.",
                icon: BarChart3,
                benefit: "Save money automatically",
                color: "from-emerald-500 to-teal-500",
                stat: "35%",
                statLabel: "average savings"
              },
              {
                title: "Forecast with Confidence",
                description: "Predict future costs with 98% accuracy using ML models trained on your usage patterns.",
                icon: TrendingUp,
                benefit: "Plan budgets accurately",
                color: "from-blue-500 to-indigo-500",
                stat: "98%",
                statLabel: "accuracy rate"
              },
              {
                title: "Real-time Visibility",
                description: "Monitor every AWS resource with live metrics, instant alerts, and comprehensive dashboards.",
                icon: LayoutDashboard,
                benefit: "Never miss an anomaly",
                color: "from-purple-500 to-pink-500",
                stat: "24/7",
                statLabel: "monitoring"
              },
              {
                title: "AI-Powered Insights",
                description: "Get smart recommendations to improve efficiency and eliminate waste across all services.",
                icon: Sparkles,
                benefit: "Optimize automatically",
                color: "from-amber-500 to-orange-500",
                stat: "10x",
                statLabel: "faster insights"
              },
              {
                title: "Multi-Account Support",
                description: "Manage all your AWS accounts from a single dashboard with consolidated views.",
                icon: Globe,
                benefit: "Centralized control",
                color: "from-cyan-500 to-blue-500",
                stat: "Unlimited",
                statLabel: "accounts"
              },
              {
                title: "Security & Compliance",
                description: "Ensure your infrastructure follows best practices with automated security audits.",
                icon: ShieldCheck,
                benefit: "Stay secure always",
                color: "from-red-500 to-rose-500",
                stat: "100%",
                statLabel: "compliant"
              }
            ].map((feature, i) => (
              <GlowingCard key={i} delay={i * 0.1}>
                <div className="p-10">
                  <motion.div
                    className="relative mb-8"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-xl`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <motion.div
                      className="absolute -inset-2 bg-[#5B7AB5]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-500 text-base leading-relaxed mb-6">{feature.description}</p>

                  <div className="mb-6">
                    <div className="text-3xl font-black bg-gradient-to-r ${feature.color} bg-clip-text text-transparent">
                      {feature.stat}
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{feature.statLabel}</div>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5B7AB5] bg-[#5B7AB5]/10 px-4 py-2 rounded-full uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{feature.benefit}</span>
                  </div>
                </div>
              </GlowingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with animated counters */}
      <section id="benefits" className="py-32 px-6 sm:px-8 lg:px-10 bg-[#0F1F2F] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#5B7AB5] font-black text-sm uppercase tracking-[0.4em] mb-4 block">Benefits</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-8 leading-tight">
                Transform your cloud <br /> <span className="text-[#5B7AB5]">into a strategic asset</span>
              </h2>
              <p className="text-gray-500 text-xl mb-12 leading-relaxed">
                CloudIntel goes beyond simple monitoring. We provide the intelligence you need to innovate faster and spend smarter.
              </p>

              <div className="space-y-8">
                {[
                  { title: "Reduce costs by 30% on average", description: "Identify underutilized resources and right-size instances automatically", icon: BarChart3, color: "text-emerald-400" },
                  { title: "Improve infrastructure efficiency", description: "Get real-time visibility into resource utilization and performance", icon: Zap, color: "text-[#5B7AB5]" },
                  { title: "Make data-driven decisions", description: "Accurate forecasts and insights to plan your cloud infrastructure better", icon: TrendingUp, color: "text-amber-400" },
                  { title: "Enterprise-grade security", description: "Your data is encrypted and secure with industry-standard compliance", icon: ShieldCheck, color: "text-purple-400" }
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex gap-6 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-[#5B7AB5]/40 transition-all duration-300"
                    >
                      <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-500 text-base leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { value: "30", label: "Average savings", suffix: "%", color: "from-emerald-500 to-teal-400", icon: BarChart3 },
                { value: "98", label: "Forecast accuracy", suffix: "%", color: "from-[#5B7AB5] to-blue-400", icon: Target },
                { value: "24", label: "Real-time monitoring", suffix: "/7", color: "from-purple-500 to-pink-400", icon: LayoutDashboard },
                { value: "10", label: "Faster insights", suffix: "x", color: "from-amber-500 to-orange-400", icon: Zap }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 hover:border-[#5B7AB5]/40 transition-all duration-500 shadow-2xl"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 tracking-tighter`}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works with progress tracker */}
      <section id="how-it-works" className="py-32 px-6 sm:px-8 lg:px-10 bg-[#0A1929] relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[#5B7AB5] font-black text-sm uppercase tracking-[0.4em] mb-4 block">Process</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-8">
              Get started in <span className="text-[#5B7AB5]">minutes</span>
            </h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
              Simple three-step process to start optimizing your cloud infrastructure with zero friction.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-white/5 overflow-hidden">
              <motion.div
                initial={{ left: "-100%" }}
                whileInView={{ left: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#5B7AB5] to-transparent"
              />
            </div>

            {[
              { step: "01", title: "Connect your AWS", description: "Securely connect your AWS account with read-only credentials in just a few clicks.", icon: Cloud, color: "text-blue-400" },
              { step: "02", title: "AI Analysis", description: "Our engine analyzes your infrastructure and identifies optimization opportunities instantly.", icon: Sparkles, color: "text-purple-400" },
              { step: "03", title: "Start Saving", description: "Get actionable recommendations and start reducing costs right away.", icon: BarChart3, color: "text-emerald-400" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative z-10 mx-auto w-24 h-24 rounded-[2rem] bg-[#0A1929] border-2 border-white/5 flex items-center justify-center mb-8 group-hover:border-[#5B7AB5] transition-all duration-500 shadow-2xl"
                >
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                  <motion.div
                    className="absolute inset-0 rounded-[2rem] bg-[#5B7AB5]/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div className="text-6xl font-black text-white/5 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 pointer-events-none group-hover:text-white/10 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 text-base leading-relaxed px-4">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with enhanced cards */}
      <section id="pricing" className="py-32 px-6 sm:px-8 lg:px-10 bg-[#0F1F2F]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[#5B7AB5] font-black text-sm uppercase tracking-[0.4em] mb-4 block">Pricing</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-8">
              Simple, <span className="text-[#5B7AB5]">transparent</span> pricing
            </h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
              Start for free and scale as you grow. No hidden fees or complex contracts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Starter", price: "$0", period: "forever", description: "Perfect for personal projects and experimentation", features: ["Up to 10 AWS resources", "Basic monitoring", "7-day data retention", "Email support"], buttonText: "Start Free", popular: false },
              { name: "Pro", price: "$49", period: "per month", description: "For growing teams with multiple environments", features: ["Unlimited AWS resources", "Advanced analytics", "30-day data retention", "AI-powered forecasts", "Priority support", "Custom reports"], buttonText: "Start 14-day trial", popular: true },
              { name: "Enterprise", price: "Custom", period: "on request", description: "For large organizations with complex needs", features: ["Everything in Pro", "SLA guarantees", "Custom integrations", "Dedicated account manager", "On-premise deployment"], buttonText: "Contact Sales", popular: false }
            ].map((plan, i) => (
              <GlowingCard key={i} delay={i * 0.1}>
                <div className={`relative p-10 flex flex-col h-full ${plan.popular ? "bg-gradient-to-br from-[#1A2A4A] to-[#0F1F2F]" : ""}`}>
                  {plan.popular && (
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#5B7AB5] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl"
                    >
                      Most Popular
                    </motion.div>
                  )}

                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <motion.span
                        className="text-5xl font-black text-white"
                        animate={plan.popular ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {plan.price}
                      </motion.span>
                      <span className="text-gray-500 font-medium lowercase">/{plan.period}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.05 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-400">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(plan.name === "Enterprise" ? "/contact" : "/signup")}
                    className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${plan.popular
                        ? "bg-[#5B7AB5] text-white shadow-xl shadow-[#5B7AB5]/40"
                        : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                  >
                    <span className="relative z-10">{plan.buttonText}</span>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ y: "100%" }}
                      whileHover={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              </GlowingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with parallax */}
      <section className="py-32 px-6 sm:px-8 lg:px-10 bg-gradient-to-br from-[#0A1929] to-[#1A2A4A] text-white text-center relative overflow-hidden">
        <motion.div
          style={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5B7AB5]/10 rounded-full blur-[120px]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 mb-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-[#5B7AB5]" />
            </motion.div>
            <span className="text-sm font-bold uppercase tracking-widest">Ready to optimize?</span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
            Start optimizing <br /> <span className="text-[#5B7AB5]">today</span>
          </h2>
          <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of high-performing teams already saving millions on AWS. <br /> Your 14-day free trial starts now.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/signup")}
              className="group relative bg-[#5B7AB5] text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl shadow-[#5B7AB5]/40 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Get Started Free</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="relative z-10 w-6 h-6" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/contact")}
              className="bg-white/5 backdrop-blur-xl border-2 border-white/10 px-12 py-6 rounded-2xl font-bold text-xl text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              Talk to Sales
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 mt-12 flex flex-wrap items-center justify-center gap-6 font-medium"
          >
            {[
              { icon: CheckCircle2, text: "No credit card required", color: "text-emerald-500" },
              { icon: CheckCircle2, text: "14-day free trial", color: "text-emerald-500" },
              { icon: CheckCircle2, text: "Cancel anytime", color: "text-emerald-500" }
            ].map((item, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                {item.text}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-[#0A1929] text-gray-500 px-6 sm:px-8 lg:px-10 py-24 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-20">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Cloud className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-2xl font-black text-white tracking-tighter">cloudintel<span className="text-[#5B7AB5]">.</span></span>
              </div>
              <p className="text-sm leading-relaxed mb-8 max-w-xs font-medium">
                AI-powered Cloud Financial Operations (FinOps) platform. We help engineering teams build sustainable and cost-efficient cloud architectures.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Globe, label: "Web" },
                  { icon: Users, label: "Community" },
                  { icon: ExternalLink, label: "Social" }
                ].map((social, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#5B7AB5]/20 hover:text-white transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.button>
                ))}
              </div>
            </div>

            {[
              { title: "Product", links: ["Features", "Pricing", "Process", "Integrations", "Changelog"] },
              { title: "Company", links: ["About Us", "Our Blog", "Careers", "Contact", "Press Kit"] },
              { title: "Resources", links: ["Documentation", "API Reference", "Help Center", "Status", "Tutorials"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "Cookie Settings", "Compliance"] }
            ].map((column, idx) => (
              <div key={idx}>
                <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{column.title}</h3>
                <ul className="space-y-4">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <motion.a
                        href={`/${link.toLowerCase().replace(/ /g, '-')}`}
                        whileHover={{ x: 5, color: "#fff" }}
                        className="hover:text-white transition-colors text-sm font-medium cursor-pointer inline-block"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs font-semibold uppercase tracking-widest order-2 md:order-1">
              © {new Date().getFullYear()} Cloud Intelligence Platform. Designed for performance.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 order-1 md:order-2">
              <motion.a
                href="/trust"
                whileHover={{ color: "#5B7AB5" }}
                className="text-xs font-bold uppercase tracking-[0.2em] hover:text-[#5B7AB5] transition-colors"
              >
                Trust Center
              </motion.a>
              <motion.a
                href="/sitemap"
                whileHover={{ color: "#5B7AB5" }}
                className="text-xs font-bold uppercase tracking-[0.2em] hover:text-[#5B7AB5] transition-colors"
              >
                Sitemap
              </motion.a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-500"
                />
                <span className="text-[10px] font-black uppercase tracking-tighter">Status: Protected</span>
              </motion.div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}