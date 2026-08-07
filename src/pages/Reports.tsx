import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Download, FileText, Filter, Search, Calendar, CheckCircle2, Sparkles, Printer } from "lucide-react";
import { motion } from "motion/react";
import { useToast } from "../context/ToastContext";

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  rollNumber?: string;
  department?: string;
  semester?: string;
  section?: string;
  courseName: string;
  subject?: string;
  teacherName?: string;
  confidence: number;
  device?: string;
  browser?: string;
  timestamp: string;
  photoUrl: string;
}

export default function Reports() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");

  useEffect(() => {
    fetch('/api/attendances')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecords(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const userFilteredRecords = user?.role === 'student'
    ? records.filter(r => r.studentEmail?.toLowerCase() === user.email.toLowerCase())
    : records;

  const filtered = userFilteredRecords.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) || 
                          r.courseName.toLowerCase().includes(search.toLowerCase()) ||
                          (r.rollNumber && r.rollNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesCourse = selectedCourse === "ALL" || r.courseName === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const uniqueCourses = Array.from(new Set(records.map(r => r.courseName)));

  const exportToCSV = () => {
    if (filtered.length === 0) return;
    const headers = ["ID", "Student Name", "Roll Number", "Course", "Subject", "Confidence Match %", "Device", "Timestamp"];
    const rows = filtered.map(r => [
      r.id,
      `"${r.studentName}"`,
      `"${r.rollNumber || 'STU'}"`,
      `"${r.courseName}"`,
      `"${r.subject || 'General'}"`,
      `${r.confidence}%`,
      `"${r.device || 'PC'}"`,
      `"${new Date(r.timestamp).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Export Complete", "CSV report downloaded successfully.", "success");
  };

  const exportToExcel = () => {
    if (filtered.length === 0) return;
    // Excel-compatible tab-separated or XML format
    const headers = "ID\tStudent Name\tRoll Number\tCourse\tConfidence\tTimestamp\n";
    const rows = filtered.map(r => `${r.id}\t${r.studentName}\t${r.rollNumber || 'STU'}\t${r.courseName}\t${r.confidence}%\t${new Date(r.timestamp).toLocaleString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Attendance_Report_${new Date().toISOString().slice(0,10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Export Complete", "Excel XLS report downloaded successfully.", "success");
  };

  const exportToPDF = () => {
    window.print();
    showToast("Print / PDF", "PDF export dialog opened via browser print engine.", "info");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-600" />
            {user?.role === 'student' ? "My Attendance Record" : "Attendance Reports & Analytics"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comprehensive facial recognition audit logs and multi-format export tools
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportToExcel}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={exportToPDF}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student name, roll # or course..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Courses ({records.length} records)</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 uppercase font-bold tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Course / Lecture</th>
                <th className="p-4">Match Confidence</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Device</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">Loading attendance reports...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">No attendance records found matching filters.</td>
                </tr>
              ) : (
                filtered.map((record, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    key={record.id} 
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={record.photoUrl} 
                          alt={record.studentName} 
                          className="w-8 h-8 rounded-full object-cover border border-indigo-500/20"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">{record.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{record.studentEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-700 dark:text-slate-300">{record.rollNumber || `STU-${record.studentId}`}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{record.courseName}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        <Sparkles className="w-3 h-3" /> {record.confidence}% Match
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-400">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {record.device || 'Desktop PC'}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Present
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
