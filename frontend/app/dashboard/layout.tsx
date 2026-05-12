"use client";

import { ReactNode, useState, useEffect } from "react";
import { 
  Menu, X, Home, TrendingUp, Zap, LineChart, Leaf, 
  LogOut, Server, Activity, Shield, Brain, BarChart3,
  Cloud, Cpu, Globe, Bell, ChevronLeft, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { fetchSustainability } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [esgScore, setEsgScore] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("JD");
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Cost Analytics", href: "/dashboard/cost", icon: TrendingUp },
    { name: "Infrastructure", href: "/dashboard/infrastructure", icon: Server },
    { name: "Optimization", href: "/dashboard/optimization", icon: Zap },
    { name: "Performance", href: "/dashboard/performance", icon: Activity },
    { name: "Risk Intelligence", href: "/dashboard/risk", icon: Shield },
    { name: "Sustainability", href: "/dashboard/sustainability", icon: Leaf },
    { name: "Forecast", href: "/dashboard/forecast", icon: Brain },
  ];

  useEffect(() => {
    async function loadESG() {
      try {
        const data = await fetchSustainability();
        setEsgScore(data.sustainability_score);
      } catch (err) {
        console.error(err);
      }
    }
    loadESG();

    // Load user data from localStorage or token
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Try to get from localStorage first for immediate display
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setUserName(user.name || "");
          setUserEmail(user.email || "");
          updateInitials(user.name);
        }

        // Always verify with the server to be "real"
        try {
          const res = await fetch(`http://127.0.0.1:8000/auth/me?token=${token}`);
          if (res.ok) {
            const data = await res.json();
            setUserName(data.name);
            setUserEmail(data.email);
            updateInitials(data.name);
            localStorage.setItem("user", JSON.stringify(data));
          }
        } catch (apiErr) {
          console.error("Error fetching user profile:", apiErr);
          
          // Fallback to token decoding if API fails
          decodeFromToken(token);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    const updateInitials = (name: string) => {
      if (!name) return;
      const nameParts = name.split(" ");
      if (nameParts.length >= 2) {
        setUserInitials(`${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase());
      } else {
        setUserInitials(name.substring(0, 2).toUpperCase());
      }
    };

    const decodeFromToken = (token: string) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(jsonPayload);
        if (decoded.name) {
          setUserName(decoded.name);
          updateInitials(decoded.name);
        }
        if (decoded.sub) setUserEmail(decoded.sub);
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    };

    loadUserData();


    // Load sidebar preference from localStorage
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setSidebarCollapsed(savedState === "true");
    }

    // Handle resize for mobile
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save sidebar preference
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const handleNavClick = () => {
    // Close mobile menu after clicking
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  const getESGColor = () => {
    if (esgScore === null) return "text-gray-400";
    if (esgScore >= 80) return "text-emerald-400";
    if (esgScore >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getESGBgColor = () => {
    if (esgScore === null) return "bg-gray-500/10";
    if (esgScore >= 80) return "bg-emerald-500/10";
    if (esgScore >= 50) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-[#0A1929] text-gray-100 overflow-hidden">
      
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:relative z-50 
          ${sidebarCollapsed ? 'w-20' : 'w-72'} 
          bg-[#0F1F2F]/95 backdrop-blur-2xl
          border-r border-white/5
          transition-all duration-500 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)]
          flex flex-col h-screen
        `}
      >
        {/* Sidebar Header */}
        <div className={`h-24 flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-6'} border-b border-white/5 bg-gradient-to-r from-[#0F1F2F] to-[#14253A]`}>
          {!sidebarCollapsed ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-3.5 group" onClick={handleNavClick}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#4A6FA5] to-[#5B7AB5] rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative w-11 h-11 bg-[#0F1F2F] rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-all duration-300">
                    <Cloud className="w-6 h-6 text-[#5B7AB5]" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-white tracking-tighter leading-none">
                    CLOUD<span className="text-[#5B7AB5]">INTEL</span>
                  </span>
                  <span className="text-[10px] text-[#5B7AB5] font-bold tracking-[0.2em] mt-1 opacity-70">AI POWERED</span>
                </div>
              </Link>
              <button
                onClick={toggleSidebar}
                className="hidden md:flex p-2 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 group"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-white" />
              </button>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="flex items-center justify-center relative group" onClick={handleNavClick}>
                <div className="absolute -inset-1 bg-gradient-to-br from-[#4A6FA5] to-[#5B7AB5] rounded-xl blur-sm opacity-0 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative w-11 h-11 bg-gradient-to-br from-[#1A2A4A] to-[#0F1F2F] rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all duration-500">
                  <Cloud className="w-6 h-6 text-[#5B7AB5]" strokeWidth={2} />
                </div>
              </Link>
              <button
                onClick={toggleSidebar}
                className="hidden md:flex p-1.5 rounded-full bg-[#5B7AB5] text-white hover:scale-110 transition-all duration-300 absolute -right-3 top-9 z-[60] shadow-lg shadow-[#5B7AB5]/40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {!sidebarCollapsed && (
            <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em] px-4 mb-4 uppercase opacity-50">Main Menu</p>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <div
                  className={`
                    group relative flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#4A6FA5]/10 text-white border border-[#4A6FA5]/20 shadow-[0_0_20px_rgba(74,111,165,0.1)]"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                    }
                  `}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-[#5B7AB5] rounded-r-full"></div>
                  )}
                  <Icon size={20} className={`transition-transform duration-300 ${isActive ? "text-[#5B7AB5] scale-110" : "text-gray-500 group-hover:scale-110 group-hover:text-gray-300"}`} />
                  {!sidebarCollapsed && (
                    <>
                      <span className={`text-sm font-semibold transition-all duration-300 ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}`}>{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5B7AB5] shadow-[0_0_10px_#5B7AB5]"></div>
                      )}
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - User Profile */}
        <div className={`p-4 border-t border-white/5 bg-[#0F1F2F]/50 backdrop-blur-md`}>
          {!sidebarCollapsed ? (
            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-500 group">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-[#4A6FA5] to-[#5B7AB5] rounded-full blur-[2px] opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative w-11 h-11 rounded-full bg-[#0A1929] flex items-center justify-center border border-white/10">
                    <span className="text-sm font-black text-white tracking-tighter">{userInitials}</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0F1F2F] shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate leading-none mb-1">{userName || "Administrator"}</p>
                  <p className="text-[10px] text-gray-500 truncate font-medium uppercase tracking-wider">{userEmail || "Cloud Expert"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl border border-white/5 hover:border-red-500/20 transition-all duration-300 group/logout"
                  title="Logout"
                >
                  <LogOut size={16} className="text-gray-500 group-hover/logout:text-red-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleLogout}
                className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl border border-white/5 hover:border-red-500/20 transition-all duration-300 group/logout"
                title="Logout"
              >
                <LogOut size={18} className="text-gray-500 group-hover/logout:text-red-400" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A6FA5] to-[#5B7AB5] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                  <span className="text-xs font-black text-white">{userInitials}</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0F1F2F]"></div>
              </div>
            </div>
          )}
        </div>
      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-4 sm:px-6 border-b border-white/10 bg-[#0A1929]/90 backdrop-blur-xl shadow-lg shadow-black/10 flex-shrink-0">
          
          {/* Left section */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition group"
              onClick={() => setOpen(!open)}
            >
              <Menu size={22} className="text-gray-400 group-hover:text-white" />
            </button>

            {/* Page Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A6FA5]/20 to-[#5B7AB5]/20 flex items-center justify-center border border-white/10">
                <Cpu className="w-5 h-5 text-[#4A6FA5]" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Cloud Intelligence</h1>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Live Dashboard · Real-time analytics
                </p>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            
            {/* ESG Badge - With animations */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4A6FA5] to-emerald-400 rounded-xl opacity-0 group-hover:opacity-30 blur transition-all duration-300"></div>
              <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl ${getESGBgColor()} border border-white/10 backdrop-blur-sm`}>
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-gray-300">ESG</span>
                <span className={`text-sm font-bold ${getESGColor()}`}>
                  {esgScore ?? "—"}
                </span>
                <div className="w-px h-4 bg-white/10"></div>
                <span className="text-xs font-bold text-white">
                  {esgScore == null ? '—' : esgScore >= 80 ? 'A' : esgScore >= 60 ? 'B' : esgScore >= 40 ? 'C' : 'D'}
                </span>
              </div>
            </div>

            {/* AWS Status - With animations */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-30 blur transition-all duration-300"></div>
              <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                <div className="relative">
                  <span className="absolute inset-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="flex items-center gap-1 pl-2">
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">AWS Connected</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 hidden lg:inline">
                  us-east-1
                </span>
              </div>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl hover:bg-white/5 transition group">
              <Bell className="w-4 h-4 text-gray-400 group-hover:text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold ring-2 ring-[#0A1929]">
                3
              </span>
            </button>

            {/* User Avatar */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4A6FA5] to-[#5B7AB5] rounded-xl opacity-0 group-hover:opacity-50 blur transition-all duration-300"></div>
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] flex items-center justify-center cursor-pointer border border-white/10">
                <span className="text-xs font-bold text-white">{userInitials}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-3 px-4 sm:px-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} CloudIntel</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300 transition">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition">Terms</a>
              <a href="#" className="hover:text-gray-300 transition">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
