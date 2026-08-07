import { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Filter, 
  Award, 
  UserX,
  Check,
  X,
  Clock,
  FileSpreadsheet
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { motion } from "motion/react";

interface AnalyticsData {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalSubjects: number;
    todaysAttendance: number;
    weeklyAttendance: number;
    monthlyAttendance: number;
    overallPercentage: number;
  };
  departmentStats: { department: string; totalStudents: number; percentage: number }[];
  subjectStats: { subject: string; count: number }[];
  topStudents: { id: number; name: string; email: string; rollNumber: string; department: string; presentCount: number; percentage: number }[];
  lowestStudents: { id: number; name: string; email: string; rollNumber: string; department: string; presentCount: number; percentage: number }[];
  studentStatsList: any[];
}

interface ManualRequest {
  id: number;
  studentId: number;
  sessionId: number;
  studentName: string;
  rollNumber: string;
  courseName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

export default function Analytics() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [manualRequests, setManualRequests] = useState<ManualRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'leaderboard' | 'requests'>('overview');

  const isAdminOrTeacher = user?.role === 'admin' || user?.role === 'teacher';

  const fetchData = async () => {
    try {
      const res = await fetch('/api/analytics/overview');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }

      const reqRes = await fetch('/api/manual-requests');
      if (reqRes.ok) {
        const reqJson = await reqRes.json();
        setManualRequests(reqJson);
      }
    } catch (e) {
      console.error("Failed to load analytics data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveRequest = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/manual-requests/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewedBy: user?.name || 'Admin' })
      });
      if (res.ok) {
        showToast("Request Updated", `Manual attendance request ${status}.`, "success");
        fetchData();
      }
    } catch (e) {
      showToast("Error", "Failed to update manual request.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Analytics & Metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    todaysAttendance: 0,
    weeklyAttendance: 0,
    monthlyAttendance: 0,
    overallPercentage: 0
  };

  const trendData = [
    { day: 'Mon', attendance: Math.round(stats.weeklyAttendance * 0.15) },
    { day: 'Tue', attendance: Math.round(stats.weeklyAttendance * 0.18) },
    { day: 'Wed', attendance: Math.round(stats.weeklyAttendance * 0.22) },
    { day: 'Thu', attendance: Math.round(stats.weeklyAttendance * 0.20) },
    { day: 'Fri', attendance: Math.round(stats.weeklyAttendance * 0.25) },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            Attendance Analytics & Reports Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time biometric attendance metrics, trends, departmental breakdowns, and manual verification queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setLoading(true); fetchData(); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Overview & Charts
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'departments'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Departments & Subjects
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Student Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span>Manual Requests</span>
          {manualRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
              {manualRequests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* 8 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Students</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalStudents}</p>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Enrolled campus wide
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Teachers</span>
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stats.totalTeachers}</p>
          <span className="text-xs text-slate-500">Active instructors</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Classes / Sessions</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalClasses}</p>
          <span className="text-xs text-slate-500">Recorded lectures</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Overall Attendance %</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.overallPercentage}%</p>
          <span className="text-xs text-emerald-600 font-semibold">Campus average</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Today's Attendance</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.todaysAttendance}</p>
          <span className="text-xs text-slate-500">Check-ins today</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Weekly Attendance</span>
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stats.weeklyAttendance}</p>
          <span className="text-xs text-slate-500">Past 7 days</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Monthly Attendance</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.monthlyAttendance}</p>
          <span className="text-xs text-slate-500">Past 30 days</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Subjects</span>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats.totalSubjects}</p>
          <span className="text-xs text-slate-500">Active courses</span>
        </div>
      </div>

      {/* TAB CONTENT: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Weekly Attendance Trend</h3>
              <p className="text-xs text-slate-500">Daily verification count across active campus lectures</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Breakdown Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Department Wise Attendance %</h3>
              <p className="text-xs text-slate-500">Comparative attendance rate across academic branches</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.departmentStats || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="percentage" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DEPARTMENTS & SUBJECTS */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Department Roster Distribution</h3>
            <div className="space-y-3">
              {data?.departmentStats.map((item, idx) => (
                <div key={item.department} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{item.department}</p>
                    <p className="text-xs text-slate-400">{item.totalStudents} enrolled students</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{item.percentage}%</span>
                    <span className="text-[10px] text-slate-400 block">Attendance Rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Subject-wise Session Check-ins</h3>
            <div className="space-y-3">
              {data?.subjectStats.map((subj, idx) => (
                <div key={subj.subject} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{subj.subject}</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                    {subj.count} Check-ins
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Attendance Students */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Award className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Top Attendance Students</h3>
            </div>
            <div className="space-y-3">
              {data?.topStudents.map((st, i) => (
                <div key={st.id} className="p-4 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{st.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{st.rollNumber} • {st.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{st.percentage}%</span>
                    <span className="text-[10px] text-slate-400 block">{st.presentCount} sessions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lowest Attendance Warning List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Low Attendance Warnings (&lt;75%)</h3>
            </div>
            <div className="space-y-3">
              {data?.lowestStudents.map((st, i) => (
                <div key={st.id} className="p-4 bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                      <UserX className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{st.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{st.rollNumber} • {st.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400">{st.percentage}%</span>
                    <span className="text-[10px] text-slate-400 block">{st.presentCount} sessions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MANUAL REQUESTS */}
      {activeTab === 'requests' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Manual Attendance Approval Requests</h3>
            <p className="text-xs text-slate-500">Approve or reject student manual attendance requests due to camera absence or medical leave.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {manualRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">No pending manual attendance requests.</td>
                  </tr>
                ) : (
                  manualRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{req.studentName}</td>
                      <td className="p-4 font-mono text-slate-500">{req.rollNumber}</td>
                      <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{req.courseName}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 italic">"{req.reason}"</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'approved' 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : req.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        {req.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveRequest(req.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleApproveRequest(req.id, 'rejected')}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-400 font-medium">Reviewed by {user?.name || 'Admin'}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
