import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../service/user.service";
import GuestRoute from "./GuestRoute";

function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ fullName: "", email: "", password: "" });

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    const errors = { fullName: "", email: "", password: "" };
    let valid = true;

    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required.";
      valid = false;
    } else if (form.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters.";
      valid = false;
    }

    if (!form.email.trim()) {
      errors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email address.";
      valid = false;
    }

    if (!form.password) {
      errors.password = "Password is required.";
      valid = false;
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear field error on type
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    try {
      await registerUser(form);
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Password strength ────────────────────────────────────────
  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { score: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score === 2) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score === 3) return { score, label: "Good", color: "bg-blue-400" };
    return { score, label: "Strong", color: "bg-emerald-400" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[#080a0e] flex items-center justify-center px-4 relative overflow-hidden">

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap'); *, body { font-family: 'Sora', sans-serif; }`}</style>

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
      <div className="relative z-10 w-full max-w-md py-10">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-400 transition-colors duration-200 mb-8 cursor-pointer bg-transparent border-none"
        >
          ← Back to home
        </button>

        <div className="bg-[#0d1017] border border-[#1a1f2e] rounded-2xl p-8">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-emerald-400 text-xl">◈</span>
            <span className="text-white font-bold text-base tracking-tight">ResumeAI</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Free forever. No credit card required.
          </p>

          {/* Global error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg mb-6">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                className={`w-full bg-[#080a0e] border text-white text-sm px-4 py-3 rounded-lg placeholder-slate-700 focus:outline-none transition-all duration-200
                  ${fieldErrors.fullName
                    ? "border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20"
                    : "border-[#1e2330] focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20"
                  }`}
              />
              {fieldErrors.fullName && (
                <p className="text-xs text-red-400 mt-0.5">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={`w-full bg-[#080a0e] border text-white text-sm px-4 py-3 rounded-lg placeholder-slate-700 focus:outline-none transition-all duration-200
                  ${fieldErrors.email
                    ? "border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20"
                    : "border-[#1e2330] focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20"
                  }`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-400 mt-0.5">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                className={`w-full bg-[#080a0e] border text-white text-sm px-4 py-3 rounded-lg placeholder-slate-700 focus:outline-none transition-all duration-200
                  ${fieldErrors.password
                    ? "border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20"
                    : "border-[#1e2330] focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20"
                  }`}
              />

              {/* Password strength bar */}
              {form.password && (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-[#1a1f2e]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    strength.score <= 1 ? "text-red-400" :
                    strength.score === 2 ? "text-yellow-400" :
                    strength.score === 3 ? "text-blue-400" : "text-emerald-400"
                  }`}>
                    {strength.label} password
                  </p>
                </div>
              )}

              {fieldErrors.password && (
                <p className="text-xs text-red-400 mt-0.5">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3 text-sm font-bold text-[#080a0e] bg-emerald-400 rounded-xl hover:bg-emerald-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-[0_0_24px_rgba(110,231,183,0.15)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#080a0e]/30 border-t-[#080a0e] rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1a1f2e]" />
            <span className="text-xs text-slate-700">or</span>
            <div className="flex-1 h-px bg-[#1a1f2e]" />
          </div>

          {/* Login link */}
          <p className="text-center text-xs text-slate-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors duration-200 cursor-pointer bg-transparent border-none"
            >
              Sign in →
            </button>
          </p>
        </div>

        {/* Trust note */}
        <p className="text-center text-xs text-slate-700 mt-5">
          🔒 Your data is encrypted and never shared.
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <GuestRoute>
      <RegisterForm />
    </GuestRoute>
  );
}