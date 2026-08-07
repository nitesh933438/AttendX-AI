import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  GraduationCap,
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  UserPlus,
  AlertTriangle,
  Layers,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  departmentId?: string;
  status: string;
  subjects: string[];
  assignedClasses: string[];
  photoUrl?: string;
  role?: string;
}

export default function Teachers() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof Teacher>("employeeId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    employeeId: "",
    department: "Computer Science & Engineering",
    subjectsInput: "CS101 - Data Structures & Algorithms",
    assignedClassesInput: "Section A (CS)",
    status: "Active",
  });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTeachers(data);
      }
    } catch (err) {
      console.error(err);
      showToast("Error", "Failed to load faculty directory.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpenAddModal = () => {
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      password: "Welcome@123",
      phone: "",
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: "Computer Science & Engineering",
      subjectsInput: "",
      assignedClassesInput: "",
      status: "Active",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.fullName || `${teacher.firstName} ${teacher.lastName || ""}`,
      email: teacher.email,
      password: "",
      phone: teacher.phone || "",
      employeeId: teacher.employeeId || "",
      department: teacher.department || "Computer Science & Engineering",
      subjectsInput: teacher.subjects?.join(", ") || "",
      assignedClassesInput: teacher.assignedClasses?.join(", ") || "",
      status: teacher.status || "Active",
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast("Validation Error", "Name and email are required.", "error");
      return;
    }

    const subjectsArr = formData.subjectsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const classesArr = formData.assignedClassesInput
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    try {
      let url = "/api/admin/create-teacher";
      let method = "POST";
      let body: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password || "Welcome@123",
        department: formData.department,
        phone: formData.phone,
        employeeId: formData.employeeId,
        subjects: subjectsArr,
        assignedClasses: classesArr,
        status: formData.status,
      };

      if (editingTeacher) {
        url = `/api/teachers/${editingTeacher.id}`;
        method = "PUT";
        body = {
          firstName: formData.name.split(" ")[0],
          lastName: formData.name.split(" ").slice(1).join(" "),
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          subjects: subjectsArr,
          assignedClasses: classesArr,
          status: formData.status,
        };
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(
          editingTeacher ? "Teacher Updated" : "Teacher Created",
          `${formData.name} record saved successfully.`,
          "success"
        );
        setIsAddModalOpen(false);
        fetchTeachers();
      } else {
        showToast("Operation Failed", data.error || "Failed to save teacher.", "error");
      }
    } catch (err) {
      showToast("Error", "Server error while saving teacher.", "error");
    }
  };

  const handleDeleteTeacher = async () => {
    if (!deletingTeacher) return;
    try {
      const res = await fetch(`/api/teachers/${deletingTeacher.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Teacher Deleted", `${deletingTeacher.fullName} deleted.`, "success");
        setDeletingTeacher(null);
        fetchTeachers();
      } else {
        showToast("Delete Failed", "Could not delete teacher record.", "error");
      }
    } catch (err) {
      showToast("Error", "Network error removing teacher.", "error");
    }
  };

  const handleSort = (col: keyof Teacher) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const nameStr = `${t.firstName} ${t.lastName || ""} ${t.fullName}`.toLowerCase();
    const searchMatch =
      nameStr.includes(search.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());

    const deptMatch = deptFilter === "ALL" || t.department === deptFilter;
    return searchMatch && deptMatch;
  });

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    const valA = a[sortColumn] ?? "";
    const valB = b[sortColumn] ?? "";
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTeachers.length / pageSize) || 1;
  const paginatedTeachers = sortedTeachers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-xl border border-indigo-500/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Faculty Directory
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">Teacher Management</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Manage academic faculty, subject assignments, class scheduling, and department affiliations.
          </p>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Add New Teacher
          </button>
        )}
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Faculty (Name, Employee ID, Email)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
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
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Faculty Records...</p>
          </div>
        ) : paginatedTeachers.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-2 text-slate-400 opacity-60" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No teachers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Faculty Member</th>
                  <th className="p-4 cursor-pointer hover:text-indigo-500" onClick={() => handleSort("employeeId")}>
                    <div className="flex items-center gap-1">
                      Employee ID <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Assigned Subjects</th>
                  <th className="p-4">Assigned Classes</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {paginatedTeachers.map((tch) => (
                  <tr key={tch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tch.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tch.firstName}`}
                          alt={tch.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">{tch.fullName || `${tch.firstName} ${tch.lastName || ""}`}</span>
                          <span className="text-xs text-slate-500 truncate block">{tch.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-purple-600 dark:text-purple-400">{tch.employeeId}</td>
                    <td className="p-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{tch.department}</td>
                    <td className="p-4 text-xs">
                      {tch.subjects && tch.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tch.subjects.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-bold rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 text-xs">
                      {tch.assignedClasses && tch.assignedClasses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tch.assignedClasses.map((c, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-bold rounded-md">
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {user?.role === "admin" && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(tch)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit / Assign Subjects"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTeacher(tch)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete Teacher"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div>Total {sortedTeachers.length} faculty members registered.</div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT TEACHER MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {editingTeacher ? "Edit Teacher & Course Assignments" : "Add New Faculty Member"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Kulkarni"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Employee ID</label>
                    <input
                      type="text"
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      placeholder="EMP-1001"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="teacher@attendx.edu"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Assign Subjects (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.subjectsInput}
                    onChange={(e) => setFormData({ ...formData, subjectsInput: e.target.value })}
                    placeholder="e.g. CS101 - Algorithms, CS102 - DBMS"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Assign Classes (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.assignedClassesInput}
                    onChange={(e) => setFormData({ ...formData, assignedClassesInput: e.target.value })}
                    placeholder="e.g. Section A (CS), Section B (CS)"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
                  />
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
                    Save Teacher Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl text-center"
            >
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Teacher Confirmation</h3>
              <p className="text-xs text-slate-500 mt-2">
                Are you sure you want to remove <strong className="text-slate-800 dark:text-slate-200">{deletingTeacher.fullName}</strong> ({deletingTeacher.employeeId}) from faculty directory?
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setDeletingTeacher(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTeacher}
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-600/30"
                >
                  Delete Teacher
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
