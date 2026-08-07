import { ReactNode, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import AppLayout from "./components/layout/AppLayout";

// Lazy-loaded routes for Production Optimization
const Login = lazy(() => import("./pages/Login"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Academics = lazy(() => import("./pages/Academics"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Students = lazy(() => import("./pages/Students"));
const Teachers = lazy(() => import("./pages/Teachers"));
const Settings = lazy(() => import("./pages/Settings"));
const Reports = lazy(() => import("./pages/Reports"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Landing = lazy(() => import("./pages/Landing"));
const FaceRegister = lazy(() => import("./pages/FaceRegister"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Forbidden = lazy(() => import("./pages/Forbidden"));
const ServerError = lazy(() => import("./pages/ServerError"));

const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode, allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Authenticating AttendX Session...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/forbidden" replace />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="attendx-theme">
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Loading AttendX...</p>
                  </div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/forbidden" element={<Forbidden />} />
                  <Route path="/server-error" element={<ServerError />} />
                  
                  <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="academics" element={<Academics />} />
                    <Route path="face-register" element={<FaceRegister />} />
                    <Route path="attendance" element={<Attendance />} />
                    
                    {/* Protected Student Management: Admin & Teacher */}
                    <Route 
                      path="students" 
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                          <Students />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Protected Teacher Management: Admin Only */}
                    <Route 
                      path="teachers" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <Teachers />
                        </ProtectedRoute>
                      } 
                    />

                    <Route path="settings" element={<Settings />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="notifications" element={<Notifications />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Route>
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
