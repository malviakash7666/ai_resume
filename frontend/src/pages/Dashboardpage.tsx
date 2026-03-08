import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../service/user.service";
import { uploadResume, fetchUserResumes } from "../service/resume.service";

interface User {
  fullName: string;
  email: string;
}

interface Resume {
  _id: string;
  originalName?: string;
  filename?: string;
  name?: string;
  createdAt?: string;
  uploadedAt?: string;
  score?: number;
  status?: string;
  fileSize?: number;
  size?: number;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

const navItems = [
  { icon: "◎", label: "Dashboard", active: true },
  { icon: "◈", label: "My Resumes" },
  { icon: "◇", label: "Analysis" },
  { icon: "⬡", label: "Settings" },
];

const tips = [
  "Use strong action verbs like 'Led', 'Built', or 'Optimized'.",
  "Quantify achievements — numbers stand out to ATS systems.",
  "Keep your resume to 1 page if under 10 years of experience.",
  "Tailor your resume keywords to each job description.",
  "Avoid tables and columns — they confuse most ATS parsers.",
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Resume list
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);

  // Upload state
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Tip rotation
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Fetch user + resumes on mount
  useEffect(() => {
    const init = async () => {
      try {
        const res = await getCurrentUser();
        if (res.data?.user) {
          setUser(res.data.user);
          loadResumes();
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
        setTimeout(() => setVisible(true), 60);
      }
    };
    init();
  }, [navigate]);

  const loadResumes = async () => {
    setResumesLoading(true);
    try {
      const data = await fetchUserResumes();
      // handle both { data: [...] } and [...] shapes
      setResumes(Array.isArray(data) ? data : data?.data ?? []);
    } catch {
      setResumes([]);
    } finally {
      setResumesLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logoutUser(); } catch {}
    navigate("/", { replace: true });
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-slate-500";
    if (score >= 70) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score?: number) => {
    if (!score) return "bg-slate-500/10 border-slate-500/20";
    if (score >= 70) return "bg-emerald-400/10 border-emerald-400/20";
    if (score >= 50) return "bg-yellow-400/10 border-yellow-400/20";
    return "bg-red-400/10 border-red-400/20";
  };

  // ── Upload logic ────────────────────────────────────────────
  const handleFile = (file: File) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      setUploadError("Only PDF or Word documents are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File must be under 5MB.");
      return;
    }
    setSelectedFile(file);
    setUploadError("");
    setUploadStatus("idle");
    setUploadResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadStatus("uploading");
    setUploadProgress(0);
    setUploadError("");

    const progressInterval = setInterval(() => {
      setUploadProgress((p) => (p < 85 ? p + Math.random() * 15 : p));
    }, 300);

    try {
      const result = await uploadResume(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
      setUploadStatus("success");
      // Refresh resume list after upload
      loadResumes();
    } catch (err: any) {
      clearInterval(progressInterval);
      setUploadStatus("error");
      setUploadError(err?.response?.data?.message || "Upload failed. Please try again.");
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadResult(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── Loading screen ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen bg-[#080a0e] flex flex-col items-center justify-center gap-4">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap'); *, body { font-family: 'Sora', sans-serif; }`}</style>
        <div className="w-8 h-8 rounded-full border-2 border-[#1a1f2e] border-t-emerald-400 animate-spin" />
        <p className="text-xs text-slate-600 tracking-widest uppercase">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#080a0e] text-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        *, body { font-family: 'Sora', sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1017; }
        ::-webkit-scrollbar-thumb { background: #1a1f2e; border-radius: 2px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside
        className={`bg-[#0d1017] border-r border-[#1a1f2e] flex flex-col py-7 flex-shrink-0 w-56 ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
        }`}
        style={{ transition: "opacity 0.5s ease, transform 0.5s ease" }}
      >
        <div className="flex items-center gap-2.5 px-5 pb-7 border-b border-[#1a1f2e] mb-5">
          <span className="text-emerald-400 text-xl">◈</span>
          <span className="text-white font-bold text-sm tracking-tight">ResumeAI</span>
        </div>

        <nav className="flex flex-col gap-1 px-3 flex-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-all duration-200 ${
                item.active
                  ? "bg-emerald-400/10 text-emerald-400 font-semibold"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="tracking-wide">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 px-4 pt-5 border-t border-[#1a1f2e] mt-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/40 flex items-center justify-center text-xs font-bold text-emerald-400 flex-shrink-0">
            {user ? getInitials(user.fullName) : "?"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
            <p className="text-[10px] text-slate-600">Free Plan</p>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-7">

        {/* Top Bar */}
        <header className={`flex justify-between items-start transition-all duration-500 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
          <div>
            <p className="text-[11px] text-slate-600 uppercase tracking-widest mb-1">{getGreeting()},</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {user?.fullName?.split(" ")[0]} <span>👋</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Ready to land your next job?</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 text-xs text-slate-500 border border-[#1a1f2e] rounded-lg hover:border-slate-600 hover:text-slate-300 transition-all duration-200 cursor-pointer bg-transparent disabled:opacity-40"
          >
            {loggingOut ? "Signing out..." : "Sign Out →"}
          </button>
        </header>

        {/* ── UPLOAD SECTION ── */}
        <section className={`transition-all duration-500 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Upload Resume</h2>
            {selectedFile && uploadStatus !== "uploading" && (
              <button onClick={resetUpload} className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer bg-transparent border-none">
                ✕ Clear
              </button>
            )}
          </div>

          {/* Drop zone */}
          {!selectedFile && uploadStatus === "idle" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 ${
                dragOver ? "border-emerald-400/60 bg-emerald-400/5" : "border-[#1a1f2e] hover:border-emerald-400/30 hover:bg-white/[0.02]"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-2xl">📄</div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white mb-1">Drop your resume here</p>
                <p className="text-xs text-slate-600">or <span className="text-emerald-400">click to browse</span> — PDF or Word, max 5MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileInput} className="hidden" />
            </div>
          )}

          {/* File selected */}
          {selectedFile && uploadStatus === "idle" && (
            <div className="bg-[#0d1017] border border-[#1a1f2e] rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-xl flex-shrink-0">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-600 mt-0.5">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                onClick={handleUpload}
                className="px-5 py-2.5 text-xs font-bold text-[#080a0e] bg-emerald-400 rounded-xl hover:bg-emerald-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex-shrink-0 shadow-[0_0_20px_rgba(110,231,183,0.15)]"
              >
                Analyze →
              </button>
            </div>
          )}

          {/* Uploading */}
          {uploadStatus === "uploading" && (
            <div className="bg-[#0d1017] border border-[#1a1f2e] rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Analyzing your resume...</p>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedFile?.name}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="h-1.5 bg-[#1a1f2e] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* Success */}
          {uploadStatus === "success" && (
            <div className="bg-[#0d1017] border border-emerald-400/20 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-xl flex-shrink-0">✅</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white mb-0.5">Analysis Complete!</p>
                  <p className="text-xs text-slate-500">{selectedFile?.name}</p>
                </div>
                <button onClick={resetUpload} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer bg-transparent border-none font-semibold">
                  Upload New →
                </button>
              </div>
              {uploadResult?.score !== undefined && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "ATS Score", value: `${uploadResult.score}%`, color: uploadResult.score >= 70 ? "text-emerald-400" : uploadResult.score >= 50 ? "text-yellow-400" : "text-red-400" },
                    { label: "Skill Match", value: uploadResult.skillMatch ? `${uploadResult.skillMatch}%` : "—", color: "text-blue-400" },
                    { label: "Suggestions", value: uploadResult.suggestions ?? "—", color: "text-violet-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#080a0e] border border-[#1a1f2e] rounded-xl p-4 text-center">
                      <p className={`text-2xl font-extrabold tracking-tight ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
              {uploadResult?.message && !uploadResult?.score && (
                <p className="text-sm text-slate-400 bg-[#080a0e] border border-[#1a1f2e] rounded-xl px-4 py-3">{uploadResult.message}</p>
              )}
            </div>
          )}

          {/* Error */}
          {(uploadStatus === "error" || uploadError) && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mt-3">
              <span>⚠</span>
              <span>{uploadError}</span>
              <button onClick={resetUpload} className="ml-auto text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none font-semibold">Try Again</button>
            </div>
          )}
        </section>

        {/* ── MY RESUMES ── */}
        <section className={`transition-all duration-500 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">My Resumes</h2>
              {resumes.length > 0 && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                  {resumes.length}
                </span>
              )}
            </div>
            <button
              onClick={loadResumes}
              disabled={resumesLoading}
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1.5 disabled:opacity-40"
            >
              {resumesLoading ? (
                <span className="w-3 h-3 border border-slate-600 border-t-slate-400 rounded-full animate-spin" />
              ) : "↻"} Refresh
            </button>
          </div>

          {/* Loading skeleton */}
          {resumesLoading && resumes.length === 0 && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#0d1017] border border-[#1a1f2e] rounded-xl p-4 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1f2e]" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3 bg-[#1a1f2e] rounded w-2/5" />
                    <div className="h-2.5 bg-[#1a1f2e] rounded w-1/4" />
                  </div>
                  <div className="w-12 h-6 bg-[#1a1f2e] rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!resumesLoading && resumes.length === 0 && (
            <div className="bg-[#0d1017] border border-dashed border-[#1a1f2e] rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#1a1f2e] flex items-center justify-center text-xl">📂</div>
              <p className="text-sm font-semibold text-slate-400">No resumes yet</p>
              <p className="text-xs text-slate-600">Upload your first resume above to get started.</p>
            </div>
          )}

          {/* Resume list */}
          {resumes.length > 0 && (
            <div className="flex flex-col gap-3">
              {resumes.map((resume, i) => {
                const name = resume.originalName || resume.filename || resume.name || `Resume ${i + 1}`;
                const date = resume.createdAt || resume.uploadedAt;
                const size = resume.fileSize || resume.size;
                const score = resume.score;

                return (
                  <div
                    key={resume._id}
                    className="bg-[#0d1017] border border-[#1a1f2e] rounded-xl p-4 flex items-center gap-4 hover:border-emerald-400/20 hover:bg-[#0f1520] transition-all duration-200 group"
                  >
                    {/* File icon */}
                    <div className="w-10 h-10 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-base flex-shrink-0">
                      📄
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-emerald-100 transition-colors">
                        {name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-600">{formatDate(date)}</span>
                        {size && (
                          <>
                            <span className="text-slate-700">·</span>
                            <span className="text-[10px] text-slate-600">{formatSize(size)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    {resume.status && (
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border hidden sm:inline-flex ${
                        resume.status === "analyzed"
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                          : resume.status === "processing"
                          ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                          : "text-slate-500 bg-slate-500/10 border-slate-500/20"
                      }`}>
                        {resume.status}
                      </span>
                    )}

                    {/* ATS Score */}
                    {score !== undefined ? (
                      <div className={`text-center px-3 py-1.5 rounded-lg border flex-shrink-0 ${getScoreBg(score)}`}>
                        <p className={`text-sm font-extrabold leading-none ${getScoreColor(score)}`}>{score}%</p>
                        <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-0.5">ATS</p>
                      </div>
                    ) : (
                      <div className="text-center px-3 py-1.5 rounded-lg border border-[#1a1f2e] bg-[#080a0e] flex-shrink-0">
                        <p className="text-sm font-extrabold leading-none text-slate-600">—</p>
                        <p className="text-[9px] text-slate-700 uppercase tracking-widest mt-0.5">ATS</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── BOTTOM ROW ── */}
        <div className="grid grid-cols-3 gap-5">

          {/* Tips */}
          <div className={`bg-[#0d1017] border border-[#1a1f2e] rounded-2xl p-6 flex flex-col gap-4 col-span-2 transition-all duration-500 delay-[450ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Resume Tips</h2>
              <span className="text-[10px] text-slate-700">{tipIndex + 1} / {tips.length}</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-emerald-400 text-lg mt-0.5 flex-shrink-0">💡</span>
              <p className="text-sm text-slate-300 leading-relaxed">{tips[tipIndex]}</p>
            </div>
            <div className="flex gap-1.5 mt-auto">
              {tips.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setTipIndex(i)}
                  className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${i === tipIndex ? "w-6 bg-emerald-400" : "w-1.5 bg-[#1a1f2e] hover:bg-slate-600"}`}
                />
              ))}
            </div>
          </div>

          {/* Profile */}
          <div className={`bg-[#0d1017] border border-[#1a1f2e] rounded-2xl p-6 flex flex-col gap-4 transition-all duration-500 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Profile</h2>
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border-2 border-emerald-400/40 flex items-center justify-center text-xl font-extrabold text-emerald-400">
                  {user ? getInitials(user.fullName) : "?"}
                </div>
                <div className="absolute -inset-1.5 border border-emerald-400/15 rounded-[18px]" />
              </div>
              <p className="text-sm font-bold text-white mt-1">{user?.fullName}</p>
              <p className="text-xs text-slate-600">{user?.email}</p>
              <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">● Free Plan</span>
            </div>
            <div className="flex items-center bg-[#080a0e] border border-[#1a1f2e] rounded-xl overflow-hidden">
              {[
                { num: String(resumes.length), label: "Resumes" },
                { num: String(resumes.filter(r => r.score !== undefined).length), label: "Analyzed" },
              ].map((s, i) => (
                <div key={s.label} className={`flex-1 py-3 flex flex-col items-center gap-1 ${i === 0 ? "border-r border-[#1a1f2e]" : ""}`}>
                  <span className="text-lg font-extrabold text-white tracking-tight">{s.num}</span>
                  <span className="text-[9px] text-slate-600 uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}