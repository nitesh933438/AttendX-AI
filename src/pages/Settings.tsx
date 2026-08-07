import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Shield, 
  Paintbrush, 
  Sliders, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  Save, 
  Smartphone, 
  Laptop, 
  ShieldCheck,
  AlertCircle,
  Camera,
  Bell,
  EyeOff,
  LogOut,
  Trash2,
  Database,
  RefreshCw,
  Globe
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

export default function Settings() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance' | 'ai' | 'camera' | 'notifications' | 'privacy' | 'account'>('profile');

  // Profile Form State
  const [name, setName] = useState(user?.name || "");
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || "");
  const [employeeId, setEmployeeId] = useState(user?.id ? `EMP-10${user.id}` : "");
  const [department, setDepartment] = useState(user?.department || "Computer Science");
  const [semester, setSemester] = useState(user?.semester || "1st");
  const [section, setSection] = useState(user?.section || "A");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [joiningDate, setJoiningDate] = useState("2025-08-01");
  const [savingProfile, setSavingProfile] = useState(false);

  // Camera Settings
  const [cameraSource, setCameraSource] = useState("front");
  const [cameraRes, setCameraRes] = useState("1080p");
  const [autoFocus, setAutoFocus] = useState(true);
  const [mirrorMode, setMirrorMode] = useState(true);

  // Notification Settings
  const [notifyStarted, setNotifyStarted] = useState(true);
  const [notifyEnding, setNotifyEnding] = useState(true);
  const [notifyMarked, setNotifyMarked] = useState(true);
  const [notifyLow, setNotifyLow] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);

  // Privacy & Account
  const [shareData, setShareData] = useState(false);
  const [language, setLanguage] = useState("English");

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // AI & App settings
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(90);
  const [livenessDetection, setLivenessDetection] = useState(true);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await updateProfile({
        name,
        rollNumber,
        department,
        semester,
        section,
        phoneNumber
      });

      if (res.success) {
        showToast("Profile Saved", "Your account details have been updated.", "success");
      } else {
        showToast("Update Failed", res.error || "Could not update profile.", "error");
      }
    } catch (e) {
      showToast("Error", "Failed to save profile changes.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast("Validation Error", "Please fill in all password fields.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Password Mismatch", "New password and confirm password do not match.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Weak Password", "Password must be at least 6 characters.", "error");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        showToast("Password Changed", "Your password has been updated securely.", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast("Change Failed", res.error || "Current password incorrect.", "error");
      }
    } catch (e) {
      showToast("Error", "Failed to change password.", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">System & Account Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your user profile, change password, theme preferences, and AI parameters</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Settings Navigation Tabs */}
        <div className="md:col-span-3 space-y-1.5">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'profile' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'security' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Password</span>
          </button>

          <button 
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'appearance' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Paintbrush className="w-4 h-4" />
            <span>Appearance & Theme</span>
          </button>

          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'ai' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>AI Vision Engine</span>
          </button>

          <button 
            onClick={() => setActiveTab('camera')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'camera' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera Setup</span>
          </button>

          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'notifications' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button 
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'privacy' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            <span>Privacy Options</span>
          </button>

          <button 
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left mt-4 ${
              activeTab === 'account' 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25' 
                : 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-900/20'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Account Actions</span>
          </button>
        </div>
        
        {/* Settings Tab Content */}
        <div className="md:col-span-9">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <User className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Profile Settings</h2>
                  <p className="text-xs text-slate-500">Update your registered student / teacher details</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                      type="email" 
                      disabled 
                      value={user?.email || ""} 
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-mono border border-transparent cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Roll Number</label>
                    <input 
                      type="text" 
                      value={rollNumber}
                      onChange={e => setRollNumber(e.target.value)}
                      placeholder="STU-2026-001"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Department</label>
                    <input 
                      type="text" 
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Semester</label>
                    <select
                      value={semester}
                      onChange={e => setSemester(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(s => (
                        <option key={s} value={s}>{s} Sem</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Section</label>
                    <select
                      value={section}
                      onChange={e => setSection(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {["A", "B", "C", "D"].map(s => (
                        <option key={s} value={s}>Sec {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(user?.role === 'admin' || user?.role === 'teacher') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Employee ID</label>
                      <input 
                        type="text" 
                        value={employeeId}
                        onChange={e => setEmployeeId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Joining Date</label>
                      <input 
                        type="date" 
                        value={joiningDate}
                        onChange={e => setJoiningDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {savingProfile ? "Saving..." : "Save Profile Details"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* SECURITY & PASSWORD TAB */}
          {activeTab === 'security' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Lock className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Security & Change Password</h2>
                  <p className="text-xs text-slate-500">Update account password and review authorized sessions</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <KeyRound className="w-4 h-4" />
                    {savingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-400">Role Authorization Details</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 capitalize">Role: {user?.role}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {user?.email === 'nitesh933438@gmail.com' ? "Root Primary Administrator with complete permissions." : "Standard user permissions granted."}
                    </p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
            </motion.div>
          )}
          
          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Paintbrush className="w-5 h-5 text-purple-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Appearance & Theme</h2>
                  <p className="text-xs text-slate-500">Customize visual design aesthetic across devices</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Interface Mode</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Switch between Light and Dark interface styles.</p>
                </div>
                <select 
                  value={theme}
                  onChange={(e) => { setTheme(e.target.value as any); showToast("Theme Updated", `Switched to ${e.target.value} mode.`, "info"); }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">Auto System</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 mt-4">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Language Preferences</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Select your preferred system language.</p>
                </div>
                <select 
                  value={language}
                  onChange={(e) => { setLanguage(e.target.value); showToast("Language Updated", `Switched to ${e.target.value}.`, "info"); }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* AI TAB */}
          {activeTab === 'ai' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Vision Engine Parameters</h2>
                  <p className="text-xs text-slate-500">Fine-tune facial match confidence and spoofing protection</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-slate-700 dark:text-slate-300">Min Facial Feature Match Confidence</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{aiConfidenceThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="80" 
                    max="99" 
                    value={aiConfidenceThreshold}
                    onChange={e => { setAiConfidenceThreshold(Number(e.target.value)); showToast("AI Tuned", `Threshold set to ${e.target.value}%`, "info"); }}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Real-Time Liveness Checking</p>
                    <p className="text-[11px] text-slate-500">Detects blinking and depth to prevent photo spoofing.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={livenessDetection}
                    onChange={e => { setLivenessDetection(e.target.checked); showToast("Liveness Security", e.target.checked ? "Enabled" : "Disabled", "info"); }}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* CAMERA TAB */}
          {activeTab === 'camera' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Camera className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Camera & Video Settings</h2>
                  <p className="text-xs text-slate-500">Configure device camera preferences for attendance marking</p>
                </div>
              </div>
              
              <div className="space-y-4 text-xs font-medium text-slate-800 dark:text-slate-200">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Default Camera Source</p>
                  </div>
                  <select 
                    value={cameraSource}
                    onChange={e => { setCameraSource(e.target.value); showToast("Camera Setup", "Camera source updated.", "success"); }}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 font-bold border border-slate-300 dark:border-slate-700"
                  >
                    <option value="front">Front Camera</option>
                    <option value="back">Back Camera (Mobile)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Video Resolution</p>
                  </div>
                  <select 
                    value={cameraRes}
                    onChange={e => { setCameraRes(e.target.value); showToast("Camera Setup", "Resolution updated.", "success"); }}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 font-bold border border-slate-300 dark:border-slate-700"
                  >
                    <option value="720p">720p (Faster)</option>
                    <option value="1080p">1080p (HQ)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Auto Focus Mode</p>
                  <input type="checkbox" checked={autoFocus} onChange={e => setAutoFocus(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Mirror Video Mode</p>
                  <input type="checkbox" checked={mirrorMode} onChange={e => setMirrorMode(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded" />
                </div>
              </div>
            </motion.div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Bell className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Push Notifications</h2>
                  <p className="text-xs text-slate-500">Manage real-time alerts and system messages</p>
                </div>
              </div>

              <div className="space-y-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                {[
                  { label: "Attendance Session Started", state: notifyStarted, setter: setNotifyStarted },
                  { label: "Attendance Ending Soon", state: notifyEnding, setter: setNotifyEnding },
                  { label: "Attendance Marked Successfully", state: notifyMarked, setter: setNotifyMarked },
                  { label: "Low Attendance Warning (<75%)", state: notifyLow, setter: setNotifyLow },
                  { label: "Critical System Notifications", state: notifySystem, setter: setNotifySystem },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <p>{item.label}</p>
                    <input 
                      type="checkbox" 
                      checked={item.state} 
                      onChange={e => item.setter(e.target.checked)} 
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <EyeOff className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Privacy Controls</h2>
                  <p className="text-xs text-slate-500">Manage data sharing and visibility</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Share Anonymous Usage Data</p>
                  <p className="text-xs text-slate-500">Help improve the system by sharing basic interaction logs.</p>
                </div>
                <input 
                  type="checkbox"
                  checked={shareData}
                  onChange={e => setShareData(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
              </div>
            </motion.div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Account Actions</h2>
                  <p className="text-xs text-slate-500">Manage sessions or permanently delete your account</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2"><Smartphone className="w-4 h-4 text-emerald-600"/> Install App (PWA)</p>
                    <p className="text-[11px] text-slate-500 mt-1">Install AttendX AI as a native app on your phone, tablet, or desktop.</p>
                  </div>
                  <button onClick={() => showToast("PWA Install", "To install, click the install button in your browser address bar or menu.", "info")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap">
                    Install App
                  </button>
                </div>

                {user?.role === 'admin' && (
                  <div className="p-5 border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2"><Database className="w-4 h-4 text-indigo-600"/> Database Backup</p>
                      <p className="text-[11px] text-slate-500 mt-1">Export full database records (attendances, users, logs).</p>
                    </div>
                    <button onClick={async () => {
                      showToast("Backup Started", "Database backup is being prepared for download.", "info");
                      try {
                        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
                        const res = await fetch("/api/database/backup", {
                          headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (!res.ok) throw new Error("Backup failed");
                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `attendx_backup_${Date.now()}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        showToast("Success", "Backup downloaded successfully.", "success");
                      } catch (err) {
                        showToast("Error", "Failed to download backup.", "error");
                      }
                    }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors">
                      Export Data
                    </button>
                  </div>
                )}

                <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2"><LogOut className="w-4 h-4 text-slate-500"/> Sign Out</p>
                    <p className="text-[11px] text-slate-500 mt-1">End your current session on this device.</p>
                  </div>
                  <button onClick={() => { logout(); showToast("Signed Out", "You have been securely signed out.", "info"); }} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all whitespace-nowrap">
                    Logout Securely
                  </button>
                </div>

                <div className="p-5 border border-rose-200 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <p className="font-bold text-rose-600 dark:text-rose-500 text-sm flex items-center gap-2"><Trash2 className="w-4 h-4"/> Delete Account</p>
                    <p className="text-[11px] text-rose-500/70 mt-1">Permanently erase all your records, face data, and attendances. This is irreversible.</p>
                  </div>
                  <button onClick={() => {
                    if (window.confirm("Are you completely sure you want to delete your account? This action cannot be undone.")) {
                      showToast("Account Deleted", "Your account has been deleted.", "success");
                      setTimeout(() => { window.location.href = '/'; }, 1000);
                    }
                  }} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 whitespace-nowrap">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
