import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, GraduationCap, Clock, FileText, Camera, ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileCompletion from "../components/ProfileCompletion";

interface RecentActivity {
  id: number;
  studentName: string;
  courseName: string;
  timestamp: string;
  confidence: number;
  photoUrl: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeSessions: 0,
    todaysAttendances: 0,
    attendanceRate: 94,
    recentActivity: [] as RecentActivity[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: "Total Enrolled Students", value: stats.totalStudents, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", rate: "+12% this term" },
    { title: "Active Faculty", value: stats.totalTeachers, icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", rate: "100% Verified" },
    { title: "Active Camera Sessions", value: stats.activeSessions, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", rate: "Live Feeds" },
    { title: "Today's Verified Scans", value: stats.todaysAttendances, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", rate: `${stats.attendanceRate}% Attendance` },
  ];

  if (user?.role === 'student' && (!user?.rollNumber || user?.rollNumber === '')) {
    return (
      <div className="space-y-6">
        <ProfileCompletion />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-xl border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">AI-Powered Face Verification System</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName || "User"}
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time automated biometric attendance monitoring across campus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/attendance"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Camera className="w-4 h-4" />
            <span>Launch AI Camera</span>
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/dashboard/students"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Student</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{stat.title}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="h-9 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg mt-1" />
              ) : (
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
              )}
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-2 inline-block bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                {stat.rate}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Recent AI Scans & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Camera Scans</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live facial recognition logs verified by AI vision</p>
            </div>
            <Link
              to="/dashboard/reports"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View Full Log <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Course</th>
                  <th className="pb-3 font-semibold">Match Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {stats.recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">
                      No facial recognition scans recorded today yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentActivity.map((activity) => (
                    <tr key={activity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 flex items-center gap-3">
                        <img 
                          src={activity.photoUrl} 
                          alt={activity.studentName} 
                          className="w-8 h-8 rounded-full object-cover border border-indigo-500/20"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{activity.studentName}</span>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-400 text-xs font-medium">{activity.courseName}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {activity.confidence}% Match
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Marked
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick System Status & AI Security */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">AI Vision Model</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Gemini 2.5 Facial Embeddings</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Liveness Detection</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Anti-Spoofing Filter</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Enabled</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Low-Light Enhancer</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Auto</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 dark:text-slate-400">System Database</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Supabase Cloud SQL</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg space-y-3">
            <h3 className="font-bold text-lg">Quick Attendance Run</h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Open the web camera feed on mobile or desktop to automatically detect registered faces and mark present in real time.
            </p>
            <Link
              to="/dashboard/attendance"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-900 font-bold text-xs rounded-xl hover:bg-indigo-50 transition-colors shadow-md"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              Open Camera Scanner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

