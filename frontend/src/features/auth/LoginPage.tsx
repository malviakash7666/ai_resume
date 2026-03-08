import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../service/user.service";
import GuestRoute from "./GuestRoute";

// ── Toast Component ─────────────────────────────────────────────────────────
type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-fade-in max-w-sm
        ${type === "success"
          ? "bg-emerald-400/10 border-emerald-400/25 text-emerald-300"
          : "bg-red-500/10 border-red-500/25 text-red-300"
        }`}
    >
      <span className="text-base">{type === "success" ? "✅" : "⚠"}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-xs opacity-50 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none ml-1"
      >
        ✕
      </button>
    </div>
  );
}

// ── Eye Icons ───────────────────────────────────────────────────────────────
function EyeOpen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ── Login Form ───────────────────────────────────────────────────────────────
function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client validation
    if (!form.email.trim()) {
      showToast("Please enter your email address.", "error");
      return;
    }
    if (!form.password) {
      showToast("Please enter your password.", "error");
      return;
    }

    setLoading(true);
    try {
      await loginUser(form);
      showToast("Welcome back! Redirecting...", "success");
      setTimeout(() => navigate("/dashboard", { replace: true }), 1200);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Invalid email or password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0e] flex items-center justify-center px-4 relative overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        *, body { font-family: 'Sora', sans-serif; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease forwards; }
      `}</style>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow */}
      <div
        className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[350px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%, transparent 70%)" }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors duration-200 mb-7 cursor-pointer bg-transparent border-none"
        >
          ← Back to home
        </button>

        <div className="bg-[#0d1017] border border-[#1a1f2e] rounded-2xl p-7">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-7">
            <span className="text-emerald-400 text-xl">◈</span>
            <span className="text-white font-bold text-sm tracking-tight">ResumeAI</span>
          </div>

          {/* Heading */}
          <h1 className="text-xl font-extrabold text-white tracking-tight mb-1">Welcome back</h1>
          <p className="text-xs text-slate-500 mb-7">Sign in to continue to your dashboard.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full bg-[#080a0e] border border-[#1e2330] text-white text-sm px-4 py-2.5 rounded-lg placeholder-slate-700 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer bg-transparent border-none"
                >
                  Forgot password?
                </button>
              </div>

              {/* Input with toggle */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full bg-[#080a0e] border border-[#1e2330] text-white text-sm px-4 py-2.5 pr-11 rounded-lg placeholder-slate-700 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-none p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-2.5 text-sm font-bold text-[#080a0e] bg-emerald-400 rounded-xl hover:bg-emerald-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-[0_0_24px_rgba(110,231,183,0.15)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#080a0e]/30 border-t-[#080a0e] rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#1a1f2e]" />
            <span className="text-[11px] text-slate-700">or</span>
            <div className="flex-1 h-px bg-[#1a1f2e]" />
          </div>

          {/* Register */}
          <p className="text-center text-xs text-slate-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors cursor-pointer bg-transparent border-none"
            >
              Create one free →
            </button>
          </p>
        </div>

        {/* Trust */}
        <p className="text-center text-[11px] text-slate-700 mt-5">
          🔒 Your data is encrypted and never shared.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GuestRoute>
      <LoginForm />
    </GuestRoute>
  );
}