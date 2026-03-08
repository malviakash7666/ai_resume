import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../service/user.service";

const features = [
  {
    icon: "◎",
    title: "ATS Score",
    desc: "Instantly check how well your resume passes applicant tracking systems.",
  },
  {
    icon: "◈",
    title: "Skill Match",
    desc: "Compare your skills against job descriptions in seconds.",
  },
  {
    icon: "◇",
    title: "Smart Suggestions",
    desc: "Get AI-powered line-by-line improvements to boost your chances.",
  },
];

const proofColors = ["bg-orange-400", "bg-blue-500", "bg-emerald-500", "bg-violet-500"];

export default function HomePage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res.data?.user) {
          navigate("/dashboard", { replace: true });
          return;
        }
      } catch {
        // not logged in
      } finally {
        setChecking(false);
        setTimeout(() => setVisible(true), 60);
      }
    };
    checkUser();
  }, [navigate]);

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#080a0e]">
        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0e] text-white font-sans overflow-x-hidden flex flex-col items-center relative">

      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap'); body, * { font-family: 'Sora', sans-serif; }`}</style>

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow top */}
      <div className="fixed top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(110,231,183,0.08) 0%, transparent 70%)" }} />

      {/* Glow bottom-right */}
      <div className="fixed bottom-0 right-[-100px] w-[400px] h-[400px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />

      {/* ── NAV ── */}
      <nav
        className={`w-full max-w-5xl flex justify-between items-center px-8 py-6 relative z-10 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-xl">◈</span>
          <span className="text-white font-bold text-base tracking-tight">ResumeAI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm text-slate-400 border border-[#1e2330] rounded-lg hover:border-slate-600 hover:text-slate-200 transition-all duration-200 cursor-pointer bg-transparent"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 text-sm font-bold text-[#080a0e] bg-emerald-400 rounded-lg hover:bg-emerald-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="flex flex-col items-center text-center px-8 pt-16 pb-14 max-w-2xl relative z-10">

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold tracking-widest px-4 py-1.5 rounded-full uppercase mb-7 transition-all duration-500 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          AI-Powered Resume Analysis
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-[-0.04em] mb-5 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Land Your Dream Job
          <br />
          <span className="text-emerald-400 italic">Faster.</span>
        </h1>

        {/* Subtext */}
        <p
          className={`text-base text-slate-500 leading-relaxed mb-9 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Upload your resume and get instant feedback — ATS score,
          <br className="hidden sm:block" />
          skill gaps, and actionable suggestions in under 10 seconds.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 mb-9 transition-all duration-700 delay-[400ms] ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <button
            onClick={() => navigate("/register")}
            className="px-7 py-3.5 text-sm font-bold text-[#080a0e] bg-emerald-400 rounded-xl hover:bg-emerald-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-[0_0_32px_rgba(110,231,183,0.2)] hover:shadow-[0_0_40px_rgba(110,231,183,0.35)]"
          >
            Analyze My Resume →
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-slate-500 border border-[#1e2330] px-5 py-3.5 rounded-xl hover:border-slate-600 hover:text-slate-300 transition-all duration-200 cursor-pointer bg-transparent"
          >
            Already have an account?
          </button>
        </div>

        {/* Social Proof */}
        <div
          className={`flex items-center gap-3 transition-all duration-700 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center">
            {proofColors.map((color, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 border-[#080a0e] ${color}`}
                style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: 4 - i }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-600">
            Trusted by <strong className="text-slate-300">2,400+</strong> job seekers
          </span>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full px-8 pb-16 relative z-10">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`bg-[#0d1017] border border-[#1a1f2e] rounded-xl p-6 flex flex-col gap-3 hover:border-emerald-400/20 hover:bg-[#0f141d] hover:-translate-y-1 transition-all duration-250 cursor-default ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${500 + i * 100}ms`, transitionDuration: "600ms" }}
          >
            <span className="text-emerald-400 text-xl">{f.icon}</span>
            <h3 className="text-sm font-bold text-white tracking-tight">{f.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <footer
        className={`flex gap-3 text-xs text-slate-700 pb-8 relative z-10 transition-all duration-500 delay-[800ms] ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span>© 2025 ResumeAI</span>
        <span>·</span>
        <span>Built with AI, designed for humans.</span>
      </footer>
    </div>
  );
}