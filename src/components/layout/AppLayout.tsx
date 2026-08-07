import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  FileText, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Menu,
  Camera,
  Search,
  Bell,
  ScanFace,
  BarChart3,
  Building2
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Academics", href: "/dashboard/academics", icon: Building2 },
    { name: "Students", href: "/dashboard/students", icon: Users },
    { name: "Teachers", href: "/dashboard/teachers", icon: GraduationCap },
    { name: "Face Registration", href: "/dashboard/face-register", icon: ScanFace },
    { name: "Attendance", href: "/dashboard/attendance", icon: Camera },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const teacherNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Academics", href: "/dashboard/academics", icon: Building2 },
    { name: "Students", href: "/dashboard/students", icon: Users },
    { name: "Attendance", href: "/dashboard/attendance", icon: Camera },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const studentNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Face Registration", href: "/dashboard/face-register", icon: ScanFace },
    { name: "My Attendance", href: "/dashboard/reports", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const navigation = user?.role === 'admin' ? adminNav 
                   : user?.role === 'teacher' ? teacherNav 
                   : studentNav;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sleek Dark Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 shadow-2xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight block">AttendX AI</span>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block">Smart Vision SaaS</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-500 overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mt-0.5",
                user?.role === 'admin' ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" :
                user?.role === 'teacher' ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
                "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              )}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sleek Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize">
                {user?.role} Portal
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> System Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search students, courses..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 rounded-lg text-sm focus:outline-none w-56 lg:w-64 transition-all"
              />
            </div>

            <Link 
              to="/dashboard/notifications"
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
            </Link>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
              onClick={logout}
              className="flex items-center gap-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-500/20 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-slate-900 text-slate-200 z-30 border-b border-slate-800 overflow-hidden shadow-xl"
            >
              <div className="p-4 flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-indigo-400" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Page Workspace */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-30 flex justify-around p-2">
        {navigation.slice(0, 4).map((item) => {
           const isActive = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
           return (
             <Link
               key={item.name}
               to={item.href}
               className={cn(
                 "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors",
                 isActive ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-200"
               )}
             >
               <item.icon className="w-5 h-5 mb-1" />
               <span className="text-[10px] font-medium">{item.name}</span>
             </Link>
           );
        })}
      </div>
    </div>
  );
}
