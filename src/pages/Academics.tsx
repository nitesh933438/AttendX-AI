import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { 
  Building2, 
  BookOpen, 
  Layers, 
  Grid, 
  Plus, 
  Edit3, 
  Trash2, 
  Hash, 
  Calendar,
  CheckCircle2,
  X,
  Search,
  BookMarked
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Department {
  id: string;
  code: string;
  name: string;
  createdAt?: string;
}

interface Semester {
  id: string;
  name: string;
  semesterNumber: number;
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Section {
  id: string;
  name: string;
  departmentId: string;
  semesterId: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  departmentId: string;
  semesterId: string;
}

export default function Academics() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"departments" | "semesters" | "sections" | "subjects">("departments");
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form Fields
  // Dept
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  // Sem
  const [semName, setSemName] = useState("");
  const [semNumber, setSemNumber] = useState(1);
  const [academicYear, setAcademicYear] = useState("2024-2025");
  // Section
  const [secName, setSecName] = useState("");
  const [secDeptId, setSecDeptId] = useState("");
  const [secSemId, setSecSemId] = useState("");
  // Subject
  const [subName, setSubName] = useState("");
  const [subCode, setSubCode] = useState("");
  const [subCredits, setSubCredits] = useState(3);
  const [subDeptId, setSubDeptId] = useState("");
  const [subSemId, setSubSemId] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, semRes, secRes, subRes] = await Promise.all([
        fetch("/api/departments"),
        fetch("/api/semesters"),
        fetch("/api/sections"),
        fetch("/api/subjects")
      ]);
      const [deptData, semData, secData, subData] = await Promise.all([
        deptRes.json(),
        semRes.json(),
        secRes.json(),
        subRes.json()
      ]);

      setDepartments(Array.isArray(deptData) ? deptData : []);
      setSemesters(Array.isArray(semData) ? semData : []);
      setSections(Array.isArray(secData) ? secData : []);
      setSubjects(Array.isArray(subData) ? subData : []);
    } catch (e) {
      console.error(e);
      showToast("Error", "Failed to load academic records.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    if (activeTab === "departments") {
      setDeptName("");
      setDeptCode("");
    } else if (activeTab === "semesters") {
      setSemName("Semester 1");
      setSemNumber(1);
      setAcademicYear("2024-2025");
    } else if (activeTab === "sections") {
      setSecName("Section A");
      setSecDeptId(departments[0]?.id || "");
      setSecSemId(semesters[0]?.id || "");
    } else if (activeTab === "subjects") {
      setSubName("");
      setSubCode("");
      setSubCredits(3);
      setSubDeptId(departments[0]?.id || "");
      setSubSemId(semesters[0]?.id || "");
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    if (activeTab === "departments") {
      setDeptName(item.name);
      setDeptCode(item.code);
    } else if (activeTab === "semesters") {
      setSemName(item.name);
      setSemNumber(item.semesterNumber);
      setAcademicYear(item.academicYear);
    } else if (activeTab === "sections") {
      setSecName(item.name);
      setSecDeptId(item.departmentId);
      setSecSemId(item.semesterId);
    } else if (activeTab === "subjects") {
      setSubName(item.name);
      setSubCode(item.code);
      setSubCredits(item.credits);
      setSubDeptId(item.departmentId);
      setSubSemId(item.semesterId);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this academic item?")) return;
    try {
      const res = await fetch(`/api/${activeTab}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Deleted", `${activeTab.slice(0, -1)} deleted successfully.`, "success");
        fetchData();
      } else {
        showToast("Error", "Failed to delete record.", "error");
      }
    } catch (e) {
      showToast("Error", "Network error during deletion.", "error");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let url = `/api/${activeTab}`;
    let method = "POST";
    let bodyData: any = {};

    if (editingItem) {
      url = `/api/${activeTab}/${editingItem.id}`;
      method = "PUT";
    }

    if (activeTab === "departments") {
      bodyData = { name: deptName, code: deptCode };
    } else if (activeTab === "semesters") {
      bodyData = { name: semName, semesterNumber: Number(semNumber), academicYear };
    } else if (activeTab === "sections") {
      bodyData = { name: secName, departmentId: secDeptId, semesterId: secSemId };
    } else if (activeTab === "subjects") {
      bodyData = { name: subName, code: subCode, credits: Number(subCredits), departmentId: subDeptId, semesterId: subSemId };
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();

      if (res.ok) {
        showToast("Success", `${activeTab.slice(0, -1)} saved successfully.`, "success");
        setIsModalOpen(false);
        fetchData();
      } else {
        showToast("Failed", data.error || "Save operation failed.", "error");
      }
    } catch (err) {
      showToast("Error", "Server error saving item.", "error");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-xl border border-indigo-500/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Academic Infrastructure
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">Academic Structure Management</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Manage campus departments, academic semesters, classroom sections, and course subjects.
          </p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add New {activeTab.slice(0, -1)}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "departments"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Departments ({departments.length})
        </button>

        <button
          onClick={() => setActiveTab("semesters")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "semesters"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Semesters ({semesters.length})
        </button>

        <button
          onClick={() => setActiveTab("sections")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "sections"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Grid className="w-4 h-4" />
          Sections ({sections.length})
        </button>

        <button
          onClick={() => setActiveTab("subjects")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "subjects"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <BookMarked className="w-4 h-4" />
          Subjects ({subjects.length})
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Academic Records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "departments" && departments.map((d) => (
            <div key={d.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-lg">
                    {d.code}
                  </span>
                  {user?.role === 'admin' && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditModal(d)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{d.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Code: {d.code}</p>
              </div>
            </div>
          ))}

          {activeTab === "semesters" && semesters.map((s) => (
            <div key={s.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg">
                    {s.academicYear}
                  </span>
                  {user?.role === 'admin' && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditModal(s)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{s.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Semester Number: #{s.semesterNumber}</p>
              </div>
            </div>
          ))}

          {activeTab === "sections" && sections.map((sec) => (
            <div key={sec.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-lg">
                    Section
                  </span>
                  {user?.role === 'admin' && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditModal(sec)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(sec.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{sec.name}</h3>
              </div>
            </div>
          ))}

          {activeTab === "subjects" && subjects.map((sub) => (
            <div key={sub.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg">
                    {sub.code} ({sub.credits} Credits)
                  </span>
                  {user?.role === 'admin' && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditModal(sub)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{sub.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {editingItem ? "Edit" : "Create"} {activeTab.slice(0, -1)}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === "departments" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Department Code</label>
                      <input
                        type="text"
                        required
                        value={deptCode}
                        onChange={(e) => setDeptCode(e.target.value)}
                        placeholder="e.g. CSE, ECE, ME"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Department Name</label>
                      <input
                        type="text"
                        required
                        value={deptName}
                        onChange={(e) => setDeptName(e.target.value)}
                        placeholder="e.g. Computer Science & Engineering"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </>
                )}

                {activeTab === "semesters" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Semester Name</label>
                      <input
                        type="text"
                        required
                        value={semName}
                        onChange={(e) => setSemName(e.target.value)}
                        placeholder="e.g. Semester 1"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Semester Number</label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={12}
                          value={semNumber}
                          onChange={(e) => setSemNumber(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Academic Year</label>
                        <input
                          type="text"
                          required
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          placeholder="e.g. 2024-2025"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "sections" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Section Name</label>
                      <input
                        type="text"
                        required
                        value={secName}
                        onChange={(e) => setSecName(e.target.value)}
                        placeholder="e.g. Section A"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </>
                )}

                {activeTab === "subjects" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject Code</label>
                      <input
                        type="text"
                        required
                        value={subCode}
                        onChange={(e) => setSubCode(e.target.value)}
                        placeholder="e.g. CS101"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject Name</label>
                      <input
                        type="text"
                        required
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        placeholder="e.g. Data Structures & Algorithms"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Credits</label>
                      <input
                        type="number"
                        required
                        value={subCredits}
                        onChange={(e) => setSubCredits(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
                  >
                    Save {activeTab.slice(0, -1)}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
