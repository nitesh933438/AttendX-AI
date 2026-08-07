import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Search,
  UserPlus,
  CheckCircle2,
  X,
  Eye,
  Edit3,
  Trash2,
  Filter,
  Building2,
  Phone,
  BookOpen,
  Hash,
  Mail,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ScanFace,
  FileSpreadsheet,
  Download,
  Upload,
  Printer,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
  FileText,
  User,
  MapPin,
  HeartHandshake,
  Calendar,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface ExtendedStudent {
  id: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone?: string;
  rollNumber: string;
  enrollmentNumber?: string;
  department: string;
  departmentId?: string;
  semester: string;
  semesterId?: string;
  section: string;
  sectionId?: string;
  session: string;
  gender: string;
  dob?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
  registrationStatus: "pending" | "approved" | "rejected";
  faceRegistered: boolean;
  faceStatus?: string;
  attendancePercentage: number;
  photoUrl?: string;
  role?: string;
}

export default function Students() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [semFilter, setSemFilter] = useState("ALL");
  const [secFilter, setSecFilter] = useState("ALL");
  const [faceFilter, setFaceFilter] = useState("ALL");
  const [regFilter, setRegFilter] = useState("ALL");

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof ExtendedStudent>("rollNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Visible Columns State
  const [visibleColumns, setVisibleColumns] = useState({
    photo: true,
    name: true,
    rollNumber: true,
    enrollment: true,
    department: true,
    semesterSec: true,
    phone: true,
    faceStatus: true,
    attendance: true,
    actions: true,
  });
  const [showColumnFilter, setShowColumnFilter] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<ExtendedStudent | null>(null);
  const [editingStudent, setEditingStudent] = useState<ExtendedStudent | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<ExtendedStudent | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form Fields (Single & Edit)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rollNumber: "",
    enrollmentNumber: "",
    department: "Computer Science & Engineering",
    semester: "Semester 1",
    section: "Section A",
    session: "2024-2028",
    gender: "Male",
    dob: "2003-01-01",
    address: "",
    guardianName: "",
    guardianPhone: "",
    photoUrl: "",
    faceRegistered: false,
  });

  // Bulk Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{
    inserted: number;
    duplicates: any[];
    errors: any[];
  } | null>(null);
  const [importing, setImporting] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
      showToast("Error", "Failed to load student records.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Form Change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Open Add Student Modal
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      rollNumber: "",
      enrollmentNumber: `EN${Math.floor(100000 + Math.random() * 900000)}`,
      department: "Computer Science & Engineering",
      semester: "Semester 1",
      section: "Section A",
      session: "2024-2028",
      gender: "Male",
      dob: "2003-05-15",
      address: "123 University Campus Road",
      guardianName: "",
      guardianPhone: "",
      photoUrl: "",
      faceRegistered: false,
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Student Modal
  const handleOpenEditModal = (student: ExtendedStudent) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      rollNumber: student.rollNumber || "",
      enrollmentNumber: student.enrollmentNumber || "",
      department: student.department || "Computer Science & Engineering",
      semester: student.semester || "Semester 1",
      section: student.section || "Section A",
      session: student.session || "2024-2028",
      gender: student.gender || "Male",
      dob: student.dob || "",
      address: student.address || "",
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      photoUrl: student.photoUrl || "",
      faceRegistered: student.faceRegistered || false,
    });
    setIsAddModalOpen(true);
  };

  // Submit Add / Edit Student
  const handleSubmitStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.rollNumber) {
      showToast("Validation Error", "Please fill in First Name, Email, and Roll Number.", "error");
      return;
    }

    try {
      const url = editingStudent ? `/api/students/${editingStudent.id}` : "/api/students";
      const method = editingStudent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(
          editingStudent ? "Student Updated" : "Student Added",
          `${formData.firstName} saved successfully.`,
          "success"
        );
        setIsAddModalOpen(false);
        fetchStudents();
      } else {
        showToast("Operation Failed", data.error || "Failed to save student.", "error");
      }
    } catch (err) {
      showToast("Error", "Server error while saving student.", "error");
    }
  };

  // Delete Student
  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;
    try {
      const res = await fetch(`/api/students/${deletingStudent.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Student Removed", `${deletingStudent.fullName || deletingStudent.firstName} removed.`, "success");
        setDeletingStudent(null);
        fetchStudents();
      } else {
        showToast("Delete Failed", "Could not remove student.", "error");
      }
    } catch (err) {
      showToast("Error", "Network error removing student.", "error");
    }
  };

  // Download Sample CSV Template
  const handleDownloadSampleTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Full Name,Roll Number,Enrollment Number,Email,Phone,Department,Semester,Section,Session,Gender,DOB,Address,Guardian Name,Guardian Phone\n" +
      "Rahul Sharma,CS2024010,EN2024010,rahul.sharma@attendx.edu,+91 9876543210,Computer Science & Engineering,Semester 1,Section A,2024-2028,Male,2003-04-12,45 Campus View,Sanjay Sharma,+91 9876500010\n" +
      "Priya Verma,CS2024011,EN2024011,priya.verma@attendx.edu,+91 9876543211,Computer Science & Engineering,Semester 1,Section B,2024-2028,Female,2003-08-25,89 College Road,Sunil Verma,+91 9876500011";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendx_student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Template Downloaded", "Sample CSV template ready for import.", "success");
  };

  // Handle CSV/Excel File Import Upload & Parsing
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        showToast("Invalid File", "CSV file contains no data rows.", "error");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      const parsedStudents: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        if (values.length >= 3) {
          parsedStudents.push({
            fullName: values[0] || "",
            rollNumber: values[1] || "",
            enrollmentNumber: values[2] || "",
            email: values[3] || "",
            phone: values[4] || "",
            department: values[5] || "Computer Science",
            semester: values[6] || "Semester 1",
            section: values[7] || "Section A",
            session: values[8] || "2024-2028",
            gender: values[9] || "Other",
            dob: values[10] || "",
            address: values[11] || "",
            guardianName: values[12] || "",
            guardianPhone: values[13] || "",
          });
        }
      }

      // Submit parsed to server for validation & duplicate check
      setImporting(true);
      try {
        const res = await fetch("/api/students/bulk-import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ students: parsedStudents }),
        });
        const result = await res.json();
        setImportResults({
          inserted: result.insertedCount || 0,
          duplicates: result.duplicates || [],
          errors: result.errors || [],
        });

        if (result.insertedCount > 0) {
          showToast(
            "Import Complete",
            `Successfully imported ${result.insertedCount} student records.`,
            "success"
          );
          fetchStudents();
        }
      } catch (err) {
        showToast("Import Failed", "Failed to process bulk student import.", "error");
      } finally {
        setImporting(false);
      }
    };

    reader.readAsText(file);
  };

  // Export Data (CSV, Excel format, PDF/Print)
  const handleExportCSV = () => {
    const headers = "Full Name,Roll Number,Enrollment Number,Email,Phone,Department,Semester,Section,Session,Gender,DOB,Guardian Name,Guardian Phone,Attendance %\n";
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.fullName || s.firstName}","${s.rollNumber}","${s.enrollmentNumber || ""}","${s.email}","${s.phone || ""}","${s.department}","${s.semester}","${s.section}","${s.session}","${s.gender}","${s.dob || ""}","${s.guardianName || ""}","${s.guardianPhone || ""}","${s.attendancePercentage}%"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `attendx_students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported", "Student database exported as CSV.", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  // Sorting Handler
  const handleSort = (col: keyof ExtendedStudent) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  // Filtering Logic
  const filteredStudents = students.filter((student) => {
    const nameStr = `${student.firstName} ${student.lastName || ""} ${student.fullName || ""}`.toLowerCase();
    const searchMatch =
      nameStr.includes(search.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      (student.enrollmentNumber && student.enrollmentNumber.toLowerCase().includes(search.toLowerCase())) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const deptMatch = deptFilter === "ALL" || student.department === deptFilter;
    const semMatch = semFilter === "ALL" || student.semester === semFilter;
    const secMatch = secFilter === "ALL" || student.section === secFilter;
    const faceMatch =
      faceFilter === "ALL" ||
      (faceFilter === "REGISTERED" && student.faceRegistered) ||
      (faceFilter === "PENDING" && !student.faceRegistered);

    return searchMatch && deptMatch && semMatch && secMatch && faceMatch;
  });

  // Sorted Students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const valA = a[sortColumn] ?? "";
    const valB = b[sortColumn] ?? "";
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginated Students
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = sortedStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-xl border border-indigo-500/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Student Lifecycle Directory
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">Student Management</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Comprehensive student registry with AI biometric face tracking, academic section assignments, and batch operations.
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              Bulk Import
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Print
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        )}
      </div>

      {/* Instant Search & Multi-Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Global Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Instant Search (Name, Roll, Email, Enrollment)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto">
            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science & Engineering">CS & Engineering</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Artificial Intelligence & ML">AI & ML</option>
            </select>

            {/* Face Status Filter */}
            <select
              value={faceFilter}
              onChange={(e) => setFaceFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Biometric Status</option>
              <option value="REGISTERED">Face Registered</option>
              <option value="PENDING">Face Pending</option>
            </select>

            {/* Column Selector Toggle */}
            <button
              onClick={() => setShowColumnFilter(!showColumnFilter)}
              className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Column Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Column Filter Toggle Box */}
        {showColumnFilter && (
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex flex-wrap gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={visibleColumns.enrollment} onChange={(e) => setVisibleColumns({ ...visibleColumns, enrollment: e.target.checked })} />
              Enrollment #
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={visibleColumns.phone} onChange={(e) => setVisibleColumns({ ...visibleColumns, phone: e.target.checked })} />
              Phone Number
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={visibleColumns.faceStatus} onChange={(e) => setVisibleColumns({ ...visibleColumns, faceStatus: e.target.checked })} />
              Face Status
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={visibleColumns.attendance} onChange={(e) => setVisibleColumns({ ...visibleColumns, attendance: e.target.checked })} />
              Attendance %
            </label>
          </div>
        )}
      </div>

      {/* Professional Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Student Records...</p>
          </div>
        ) : paginatedStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <User className="w-12 h-12 mx-auto mb-2 text-slate-400 opacity-60" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No students match your criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting search or adjusting your department filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Sticky Header */}
              <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4 cursor-pointer hover:text-indigo-500" onClick={() => handleSort("rollNumber")}>
                    <div className="flex items-center gap-1">
                      Roll Number <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  {visibleColumns.enrollment && <th className="p-4">Enrollment #</th>}
                  <th className="p-4">Department</th>
                  <th className="p-4">Semester & Sec</th>
                  {visibleColumns.phone && <th className="p-4">Phone</th>}
                  {visibleColumns.faceStatus && <th className="p-4">Biometric Status</th>}
                  {visibleColumns.attendance && <th className="p-4 cursor-pointer hover:text-indigo-500" onClick={() => handleSort("attendancePercentage")}>
                    <div className="flex items-center gap-1">
                      Attendance <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>}
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {paginatedStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.firstName}`}
                          alt={st.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">{st.fullName || `${st.firstName} ${st.lastName || ""}`}</span>
                          <span className="text-xs text-slate-500 truncate block">{st.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{st.rollNumber}</td>
                    {visibleColumns.enrollment && <td className="p-4 font-mono text-xs text-slate-500">{st.enrollmentNumber || "N/A"}</td>}
                    <td className="p-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{st.department}</td>
                    <td className="p-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {st.semester} - {st.section}
                    </td>
                    {visibleColumns.phone && <td className="p-4 text-xs text-slate-500">{st.phone || "N/A"}</td>}
                    {visibleColumns.faceStatus && (
                      <td className="p-4">
                        {st.faceRegistered ? (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                    )}
                    {visibleColumns.attendance && (
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full"
                              style={{ width: `${Math.min(st.attendancePercentage || 0, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {st.attendancePercentage || 0}%
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingStudent(st)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user?.role === "admin" && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(st)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Edit Student"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingStudent(st)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries per page (Total {sortedStudents.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW STUDENT DRAWER / MODAL */}
      <AnimatePresence>
        {viewingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setViewingStudent(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <img
                  src={viewingStudent.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingStudent.firstName}`}
                  alt={viewingStudent.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{viewingStudent.fullName || `${viewingStudent.firstName} ${viewingStudent.lastName}`}</h2>
                  <p className="text-xs text-indigo-500 font-mono font-bold">Roll: {viewingStudent.rollNumber} | Enrollment: {viewingStudent.enrollmentNumber || 'N/A'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{viewingStudent.department} ({viewingStudent.semester} - {viewingStudent.section})</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                  <span className="font-bold text-indigo-500 uppercase block">Academic Info</span>
                  <p><strong className="text-slate-700 dark:text-slate-300">Session:</strong> {viewingStudent.session || '2024-2028'}</p>
                  <p><strong className="text-slate-700 dark:text-slate-300">Attendance Rate:</strong> {viewingStudent.attendancePercentage}%</p>
                  <p><strong className="text-slate-700 dark:text-slate-300">Biometric Registration:</strong> {viewingStudent.faceRegistered ? 'Verified' : 'Pending'}</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                  <span className="font-bold text-indigo-500 uppercase block">Personal & Contact</span>
                  <p><strong className="text-slate-700 dark:text-slate-300">Email:</strong> {viewingStudent.email}</p>
                  <p><strong className="text-slate-700 dark:text-slate-300">Phone:</strong> {viewingStudent.phone || 'N/A'}</p>
                  <p><strong className="text-slate-700 dark:text-slate-300">Gender / DOB:</strong> {viewingStudent.gender} | {viewingStudent.dob || 'N/A'}</p>
                  <p><strong className="text-slate-700 dark:text-slate-300">Address:</strong> {viewingStudent.address || 'N/A'}</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 md:col-span-2">
                  <span className="font-bold text-indigo-500 uppercase block">Guardian Information</span>
                  <p><strong className="text-slate-700 dark:text-slate-300">Guardian Name:</strong> {viewingStudent.guardianName || 'N/A'}</p>
                  <p><strong className="text-slate-700 dark:text-slate-300">Guardian Phone:</strong> {viewingStudent.guardianPhone || 'N/A'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT STUDENT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {editingStudent ? "Edit Student Record" : "Add New Student"}
              </h2>

              <form onSubmit={handleSubmitStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Roll Number *</label>
                    <input
                      type="text"
                      name="rollNumber"
                      required
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. CS2024001"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Enrollment Number</label>
                    <input
                      type="text"
                      name="enrollmentNumber"
                      value={formData.enrollmentNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. EN2024001"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Semester & Section</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                      >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                      </select>
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                      >
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Guardian Name</label>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Guardian Phone</label>
                    <input
                      type="text"
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
                  >
                    Save Student Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BULK IMPORT MODAL */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportResults(null);
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Bulk Import Students (CSV / Excel)
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Upload a CSV or Excel format spreadsheet to import multiple students simultaneously.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-indigo-500 mx-auto" />
                <div>
                  <label className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md inline-block">
                    Browse CSV File
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-2">Accepted formats: .csv</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <button
                  onClick={handleDownloadSampleTemplate}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Download className="w-4 h-4" /> Download Sample CSV Template
                </button>

                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl"
                >
                  Done
                </button>
              </div>

              {/* Import Results Summary */}
              {importResults && (
                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    ✔ Imported {importResults.inserted} records successfully.
                  </p>
                  {importResults.duplicates.length > 0 && (
                    <p className="font-bold text-amber-600 dark:text-amber-400">
                      ⚠ Skipped {importResults.duplicates.length} duplicate roll numbers or emails.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl text-center"
            >
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Student Confirmation</h3>
              <p className="text-xs text-slate-500 mt-2">
                Are you sure you want to permanently delete <strong className="text-slate-800 dark:text-slate-200">{deletingStudent.fullName || deletingStudent.firstName}</strong> ({deletingStudent.rollNumber})?
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setDeletingStudent(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-600/30"
                >
                  Delete Student
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
