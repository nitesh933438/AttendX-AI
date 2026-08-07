import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Camera, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              AX
            </div>
            <span className="font-bold text-xl tracking-tight">AttendX AI</span>
          </div>
          <div>
            <Link to="/login" className="text-sm font-medium hover:text-blue-600 transition-colors mr-4">
              Sign In
            </Link>
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md shadow-blue-500/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full -z-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now with AI Smart Vision
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Smart Attendance</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Automate your classroom with facial recognition. AttendX AI brings flawless, real-time attendance tracking right to your smart devices.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all shadow-xl shadow-blue-600/20">
              Start Using Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why AttendX AI?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to modernize your academic workflow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Camera, title: "Facial Recognition", desc: "Mark attendance in seconds with our highly accurate smart camera system." },
              { icon: Zap, title: "Real-time Sync", desc: "Instant synchronization across all devices and dashboards." },
              { icon: ShieldCheck, title: "Secure Data", desc: "Enterprise-grade security using advanced cloud infrastructure." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-2xl text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mb-6">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
