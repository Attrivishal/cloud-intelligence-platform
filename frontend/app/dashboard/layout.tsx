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
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || "");
          setUserEmail(user.email || "");
          
          if (user.name) {
            const nameParts = user.name.split(" ");
            if (nameParts.length >= 2) {
              setUserInitials(`${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase());
            } else if (nameParts.length === 1) {
              setUserInitials(nameParts[0].substring(0, 2).toUpperCase());
            }
          }
        } else {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              
              const decoded = JSON.parse(jsonPayload);
              if (decoded.name) {
                setUserName(decoded.name);
                const nameParts = decoded.name.split(" ");
                if (nameParts.length >= 2) {
                  setUserInitials(`${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase());
                } else {
                  setUserInitials(decoded.name.substring(0, 2).toUpperCase());
                }
              }
              if (decoded.email) setUserEmail(decoded.email);
            } catch (e) {
              console.error("Error decoding token:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
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
          ${sidebarCollapsed ? 'w-20' : 'w-64'} 
          bg-gradient-to-b from-[#0F1F2F] to-[#1A2A4A]
          border-r border-white/10
          transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          shadow-2xl shadow-black/50
          flex flex-col h-screen
        `}
      >
        {/* Sidebar Header */}
        <div className={`h-20 flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-white/10 bg-[#0F1F2F]`}>
          {!sidebarCollapsed ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-3 group" onClick={handleNavClick}>
                <div className="w-10 h-10 bg-gradient-to-br from-[#4A6FA5] to-[#5B7AB5] rounded-xl flex items-center justify-center shadow-lg shadow-[#4A6FA5]/30 group-hover:scale-110 group-hover:shadow-[#4A6FA5]/50 transition-all duration-300">
                  <Cloud className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                    cloud<span className="text-[#5B7AB5]">intel</span>
                  </span>
                  <span className="text-[10px] text-gray-500 tracking-wider">AI CLOUD PLATFORM</span>
                </div>
              </Link>
              <button
                onClick={toggleSidebar}
                className="hidden md:block p-1.5 rounded-lg hover:bg-white/10 transition group"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </button>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="flex items-center justify-center" onClick={handleNavClick}>
                <div className="w-10 h-10 bg-gradient-to-br from-[#4A6FA5] to-[#5B7AB5] rounded-xl flex items-center justify-center shadow-lg shadow-[#4A6FA5]/30 hover:scale-110 transition-all duration-300">
                  <Cloud className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
              </Link>
              <button
                onClick={toggleSidebar}
                className="hidden md:block p-1.5 rounded-lg bg-[#0F1F2F] border border-white/10 hover:bg-white/10 transition group absolute -right-3 top-7"
              >
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <div
                  className={`
                    flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] text-white shadow-lg shadow-[#2D3A5E]/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-gray-500"} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="text-sm font-medium">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                      )}
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/10 bg-[#0F1F2F]">
            <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] flex items-center justify-center ring-2 ring-white/20">
                  <span className="text-sm font-medium text-white">{userInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{userName || "User"}</p>
                  <p className="text-xs text-gray-400 truncate">{userEmail || "user@example.com"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-lg transition group"
                  title="Logout"
                >
                  <LogOut size={16} className="text-gray-400 group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
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
