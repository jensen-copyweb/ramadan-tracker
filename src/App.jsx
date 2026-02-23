import { useState, useEffect } from "react";

// ═══ CONFIG ═══════════════════════════════════════════════════
const SB = "https://qatzbvvgyewxmbsezwwk.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdHpidnZneWV3eG1ic2V6d3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODAzNzEsImV4cCI6MjA4NzM1NjM3MX0.33V2FXCXJwDYQ71UuIyMiNyQWTgC70DewqOsyW-0hqA";

// ═══ RAMADAN 2026 CAPE TOWN TIMETABLE ═════════════════════════
const RAMADAN_TIMES = {
  "2026-02-19": { Fajr:"05:04", Sunrise:"06:25", Ishraaq:"06:45", Dhuhr:"13:03", AsrS:"16:40", AsrH:"17:42", Maghrib:"19:38", Isha:"20:50" },
  "2026-02-20": { Fajr:"05:05", Sunrise:"06:26", Ishraaq:"06:46", Dhuhr:"13:03", AsrS:"16:39", AsrH:"17:41", Maghrib:"19:37", Isha:"20:49" },
  "2026-02-21": { Fajr:"05:07", Sunrise:"06:27", Ishraaq:"06:47", Dhuhr:"13:03", AsrS:"16:39", AsrH:"17:40", Maghrib:"19:36", Isha:"20:48" },
  "2026-02-22": { Fajr:"05:08", Sunrise:"06:28", Ishraaq:"06:48", Dhuhr:"13:03", AsrS:"16:39", AsrH:"17:39", Maghrib:"19:35", Isha:"20:46" },
  "2026-02-23": { Fajr:"05:09", Sunrise:"06:28", Ishraaq:"06:48", Dhuhr:"13:03", AsrS:"16:38", AsrH:"17:39", Maghrib:"19:34", Isha:"20:45" },
  "2026-02-24": { Fajr:"05:10", Sunrise:"06:29", Ishraaq:"06:49", Dhuhr:"13:02", AsrS:"16:38", AsrH:"17:38", Maghrib:"19:32", Isha:"20:42" },
  "2026-02-25": { Fajr:"05:11", Sunrise:"06:30", Ishraaq:"06:50", Dhuhr:"13:02", AsrS:"16:37", AsrH:"17:37", Maghrib:"19:31", Isha:"20:41" },
  "2026-02-26": { Fajr:"05:12", Sunrise:"06:31", Ishraaq:"06:51", Dhuhr:"13:02", AsrS:"16:37", AsrH:"17:36", Maghrib:"19:30", Isha:"20:40" },
  "2026-02-27": { Fajr:"05:13", Sunrise:"06:32", Ishraaq:"06:52", Dhuhr:"13:02", AsrS:"16:36", AsrH:"17:35", Maghrib:"19:29", Isha:"20:38" },
  "2026-02-28": { Fajr:"05:14", Sunrise:"06:33", Ishraaq:"06:53", Dhuhr:"13:02", AsrS:"16:36", AsrH:"17:35", Maghrib:"19:28", Isha:"20:38" },
  "2026-03-01": { Fajr:"05:15", Sunrise:"06:33", Ishraaq:"06:53", Dhuhr:"13:02", AsrS:"16:35", AsrH:"17:34", Maghrib:"19:26", Isha:"20:37" },
  "2026-03-02": { Fajr:"05:16", Sunrise:"06:34", Ishraaq:"06:54", Dhuhr:"13:02", AsrS:"16:34", AsrH:"17:33", Maghrib:"19:25", Isha:"20:35" },
  "2026-03-03": { Fajr:"05:17", Sunrise:"06:35", Ishraaq:"06:55", Dhuhr:"13:01", AsrS:"16:34", AsrH:"17:32", Maghrib:"19:24", Isha:"20:34" },
  "2026-03-04": { Fajr:"05:18", Sunrise:"06:35", Ishraaq:"06:55", Dhuhr:"13:01", AsrS:"16:33", AsrH:"17:31", Maghrib:"19:23", Isha:"20:32" },
  "2026-03-05": { Fajr:"05:19", Sunrise:"06:36", Ishraaq:"06:56", Dhuhr:"13:01", AsrS:"16:33", AsrH:"17:30", Maghrib:"19:21", Isha:"20:31" },
  "2026-03-06": { Fajr:"05:20", Sunrise:"06:37", Ishraaq:"06:57", Dhuhr:"13:01", AsrS:"16:32", AsrH:"17:29", Maghrib:"19:20", Isha:"20:30" },
  "2026-03-07": { Fajr:"05:21", Sunrise:"06:38", Ishraaq:"06:58", Dhuhr:"13:00", AsrS:"16:31", AsrH:"17:28", Maghrib:"19:19", Isha:"20:28" },
  "2026-03-08": { Fajr:"05:22", Sunrise:"06:40", Ishraaq:"07:00", Dhuhr:"13:00", AsrS:"16:31", AsrH:"17:27", Maghrib:"19:17", Isha:"20:27" },
  "2026-03-09": { Fajr:"05:23", Sunrise:"06:40", Ishraaq:"07:00", Dhuhr:"13:00", AsrS:"16:30", AsrH:"17:26", Maghrib:"19:16", Isha:"20:25" },
  "2026-03-10": { Fajr:"05:24", Sunrise:"06:41", Ishraaq:"07:01", Dhuhr:"13:00", AsrS:"16:29", AsrH:"17:25", Maghrib:"19:15", Isha:"20:24" },
  "2026-03-11": { Fajr:"05:25", Sunrise:"06:42", Ishraaq:"07:02", Dhuhr:"12:59", AsrS:"16:28", AsrH:"17:24", Maghrib:"19:14", Isha:"20:22" },
  "2026-03-12": { Fajr:"05:26", Sunrise:"06:43", Ishraaq:"07:03", Dhuhr:"12:59", AsrS:"16:28", AsrH:"17:23", Maghrib:"19:12", Isha:"20:21" },
  "2026-03-13": { Fajr:"05:27", Sunrise:"06:44", Ishraaq:"07:04", Dhuhr:"12:59", AsrS:"16:27", AsrH:"17:22", Maghrib:"19:11", Isha:"20:20" },
  "2026-03-14": { Fajr:"05:28", Sunrise:"06:44", Ishraaq:"07:04", Dhuhr:"12:58", AsrS:"16:26", AsrH:"17:21", Maghrib:"19:10", Isha:"20:18" },
  "2026-03-15": { Fajr:"05:29", Sunrise:"06:45", Ishraaq:"07:05", Dhuhr:"12:58", AsrS:"16:25", AsrH:"17:20", Maghrib:"19:08", Isha:"20:17" },
  "2026-03-16": { Fajr:"05:30", Sunrise:"06:46", Ishraaq:"07:06", Dhuhr:"12:58", AsrS:"16:25", AsrH:"17:19", Maghrib:"19:07", Isha:"20:15" },
  "2026-03-17": { Fajr:"05:30", Sunrise:"06:47", Ishraaq:"07:07", Dhuhr:"12:58", AsrS:"16:24", AsrH:"17:18", Maghrib:"19:05", Isha:"20:14" },
  "2026-03-18": { Fajr:"05:31", Sunrise:"06:48", Ishraaq:"07:08", Dhuhr:"12:57", AsrS:"16:23", AsrH:"17:17", Maghrib:"19:04", Isha:"20:12" },
  "2026-03-19": { Fajr:"05:32", Sunrise:"06:48", Ishraaq:"07:08", Dhuhr:"12:57", AsrS:"16:22", AsrH:"17:15", Maghrib:"19:03", Isha:"20:11" },
  "2026-03-20": { Fajr:"05:33", Sunrise:"06:49", Ishraaq:"07:09", Dhuhr:"12:57", AsrS:"16:21", AsrH:"17:14", Maghrib:"19:01", Isha:"20:10" },
};

const RAMADAN_START = new Date("2026-02-19");
const RAMADAN_END   = new Date("2026-03-20");

// ═══ SUPABASE API ═════════════════════════════════════════════
async function api(path, method = "GET", body = null, token = null, xhdrs = {}) {
  try {
    const r = await fetch(SB + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        apikey: KEY,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...xhdrs,
      },
      ...(body != null && { body: JSON.stringify(body) }),
    });
    const txt = await r.text();
    let data = null;
    try { data = txt ? JSON.parse(txt) : null; } catch {}
    return { ok: r.ok, status: r.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { message: `Network error: ${e.message}` } };
  }
}

const auth = {
  signUp: (email, password, name) =>
    api("/auth/v1/signup", "POST", { email, password, data: { name } }),
  signIn: (email, password) =>
    api("/auth/v1/token?grant_type=password", "POST", { email, password }),
  getUser: (tok) => api("/auth/v1/user", "GET", null, tok),
  signOut: (tok) => api("/auth/v1/logout", "POST", null, tok),
  resetPassword: (email) =>
    api("/auth/v1/recover", "POST", { email }),
};

function db(token) {
  const RR = { Prefer: "return=representation" };
  const fil = (f) => Object.entries(f || {}).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join("&");
  return {
    sel: (tbl, cols = "*", filters = {}, opts = {}) => {
      let p = `/rest/v1/${tbl}?select=${cols}`;
      const f = fil(filters); if (f) p += "&" + f;
      if (opts.order) p += `&order=${opts.order}`;
      if (opts.limit) p += `&limit=${opts.limit}`;
      return api(p, "GET", null, token);
    },
    ins: (tbl, data) => api(`/rest/v1/${tbl}`, "POST", data, token, RR),
    ups: (tbl, data, conflict) =>
      api(`/rest/v1/${tbl}${conflict ? `?on_conflict=${conflict}` : ""}`, "POST", data, token,
        { Prefer: "return=representation,resolution=merge-duplicates" }),
    upd: (tbl, data, filters) =>
      api(`/rest/v1/${tbl}?${fil(filters)}`, "PATCH", data, token, RR),
    delById: (tbl, id) =>
      api(`/rest/v1/${tbl}?id=eq.${id}`, "DELETE", null, token),
  };
}

// ═══ HELPERS ══════════════════════════════════════════════════
const toDate = (d = new Date()) => d.toISOString().split("T")[0];

function getRamadanDay(date = new Date()) {
  const start = new Date(RAMADAN_START); start.setHours(0,0,0,0);
  const d = new Date(date); d.setHours(0,0,0,0);
  const diff = Math.round((d - start) / 86400000);
  return diff >= 0 && diff < 30 ? diff + 1 : null;
}

function getRamadanDate(dayNum) {
  const d = new Date(RAMADAN_START);
  d.setDate(d.getDate() + dayNum - 1);
  return toDate(d);
}

function isRamadanOver() {
  const today = new Date(); today.setHours(0,0,0,0);
  const end = new Date(RAMADAN_END); end.setHours(0,0,0,0);
  return today > end;
}

function getTodayTimes(date = new Date()) {
  return RAMADAN_TIMES[toDate(date)] || null;
}

function parseTime(str, ref = new Date()) {
  const [h, m] = (str || "").split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  const d = new Date(ref); d.setHours(h, m, 0, 0); return d;
}

const fmt = (d) => d ? d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--";
const fmtDT = (s) => s ? new Date(s).toLocaleString("en-ZA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

function fmtCd(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms/1000), h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sc = s%60;
  return [h,m,sc].map(x => String(x).padStart(2,"0")).join(":");
}

// ═══ LOCAL STORAGE ════════════════════════════════════════════
const store = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? { value: v } : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

// ═══ UI PRIMITIVES ════════════════════════════════════════════
const Card = ({ children, style = {} }) => (
  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, marginBottom: 12, ...style }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, color = "#7c3aed", style = {}, disabled = false, small = false }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? "#2a2040" : color, color: "#fff", border: "none",
    borderRadius: small ? 8 : 12, padding: small ? "7px 14px" : "11px 20px",
    fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    fontSize: small ? 13 : 14, opacity: disabled ? 0.5 : 1, ...style
  }}>{children}</button>
);

function StarRating({ value, onChange, size = 26 }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} onClick={() => onChange(i)}
          style={{ fontSize: size, cursor: "pointer", color: i <= value ? "#f59e0b" : "#3a3560", lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

function Toast({ msg, type = "purple", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "green" ? "#059669" : type === "gold" ? "#d97706" : "#7c3aed";
  return (
    <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: bg, color: "#fff", padding: "12px 22px", borderRadius: 12, fontWeight: 600, zIndex: 2000, maxWidth: 320, textAlign: "center", boxShadow: `0 4px 24px ${bg}66`, fontSize: 14 }}>
      {msg}
    </div>
  );
}

// ═══ EID MUBARAK SCREEN ═══════════════════════════════════════
function EidScreen({ session, user }) {
  const [stats, setStats] = useState(null);
  const d = db(session);
  const uid = user?.id;

  useEffect(() => {
    (async () => {
      const [fasts, gyms, ratings, waters, coffees] = await Promise.all([
        d.sel("fast_logs", "*", { user_id: uid }),
        d.sel("gym_sessions", "*", { user_id: uid }),
        d.sel("daily_ratings", "*", { user_id: uid }),
        d.sel("water_logs", "*", { user_id: uid }),
        d.sel("coffee_logs", "*", { user_id: uid }),
      ]);
      const F = Array.isArray(fasts.data) ? fasts.data : [];
      const G = Array.isArray(gyms.data) ? gyms.data : [];
      const R = Array.isArray(ratings.data) ? ratings.data : [];
      const W = Array.isArray(waters.data) ? waters.data : [];
      const C = Array.isArray(coffees.data) ? coffees.data : [];
      const avg = (arr, key) => arr.length > 0 ? (arr.reduce((a,b)=>a+(b[key]||0),0)/arr.length).toFixed(1) : "—";
      const totalWater = W.reduce((a,b)=>a+Number(b.amount),0);
      const totalGymMin = G.reduce((a,b)=>a+(b.duration||0),0);
      setStats({
        fasts: F.length,
        gyms: G.length,
        totalWater,
        totalGymMin,
        coffees: C.length,
        avgMood: avg(R,"mood"),
        avgEnergy: avg(R,"energy"),
        avgSleep: avg(R,"sleep"),
        avgHunger: avg(R,"hunger"),
        daysRated: R.length,
        avgGym: G.length > 0 ? (G.reduce((a,b)=>a+(b.rating||0),0)/G.length).toFixed(1) : "—",
      });
    })();
  }, []);

  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "Friend";

  const downloadStats = () => {
    if (!stats) return;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Ramadan 2026 Stats — ${name}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0a0616; color: #e8e0f0; max-width: 600px; margin: 40px auto; padding: 30px; }
    h1 { color: #a78bfa; font-size: 32px; margin-bottom: 4px; }
    .sub { color: #6d6a80; margin-bottom: 32px; font-size: 15px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .stat { background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.25); border-radius: 14px; padding: 20px; text-align: center; }
    .stat .val { font-size: 36px; font-weight: 900; color: #a78bfa; }
    .stat .lbl { font-size: 13px; color: #9d9ab0; margin-top: 6px; }
    .footer { color: #4a4560; font-size: 12px; margin-top: 32px; text-align: center; }
  </style>
</head>
<body>
  <h1>🌙 Eid Mubarak, ${name}!</h1>
  <div class="sub">Ramadan 2026 • Cape Town • Your Personal Stats</div>
  <div class="grid">
    <div class="stat"><div class="val">${stats.fasts}</div><div class="lbl">Days Fasted 🌙</div></div>
    <div class="stat"><div class="val">${stats.gyms}</div><div class="lbl">Gym Sessions 🏋️</div></div>
    <div class="stat"><div class="val">${stats.totalWater}L</div><div class="lbl">Total Water Drank 💧</div></div>
    <div class="stat"><div class="val">${stats.totalGymMin > 0 ? stats.totalGymMin+"m" : "—"}</div><div class="lbl">Total Gym Time ⏱️</div></div>
    <div class="stat"><div class="val">${stats.daysRated}</div><div class="lbl">Days Rated ⭐</div></div>
    <div class="stat"><div class="val">${stats.coffees}</div><div class="lbl">Coffees Logged ☕</div></div>
  </div>
  <div class="grid">
    <div class="stat"><div class="val">${stats.avgMood}★</div><div class="lbl">Avg Mood 😊</div></div>
    <div class="stat"><div class="val">${stats.avgEnergy}★</div><div class="lbl">Avg Energy ⚡</div></div>
    <div class="stat"><div class="val">${stats.avgSleep}★</div><div class="lbl">Avg Sleep 😴</div></div>
    <div class="stat"><div class="val">${stats.avgGym}★</div><div class="lbl">Avg Gym Rating 🏋️</div></div>
  </div>
  <div class="footer">Generated by Ramadan Tracker 🌙 • Ramadan 1447 AH</div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Ramadan-2026-Stats-${name}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0a0616 0%, #1a0830 50%, #080d18 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 8, animation: "pulse 2s infinite" }}>🌙</div>
      <h1 style={{ fontSize: 34, fontWeight: 900, color: "#a78bfa", margin: "0 0 6px" }}>Eid Mubarak!</h1>
      <p style={{ color: "#c4b5fd", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>عيد مبارك</p>
      <p style={{ color: "#6d6a80", fontSize: 14, margin: "0 0 32px" }}>Ramadan 1447 AH • Cape Town</p>

      {stats ? (
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#a78bfa", marginBottom: 18 }}>🏆 Your Ramadan 2026 Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: "🌙", val: stats.fasts + "/30", lbl: "Days Fasted", color: "#a78bfa" },
                { icon: "🏋️", val: stats.gyms, lbl: "Gym Sessions", color: "#10b981" },
                { icon: "💧", val: stats.totalWater + "L", lbl: "Total Water", color: "#3b82f6" },
                { icon: "⭐", val: stats.daysRated + "/30", lbl: "Days Rated", color: "#f59e0b" },
                { icon: "😊", val: stats.avgMood + "★", lbl: "Avg Mood", color: "#f59e0b" },
                { icon: "😴", val: stats.avgSleep + "★", lbl: "Avg Sleep", color: "#818cf8" },
              ].map(({ icon, val, lbl, color }) => (
                <div key={lbl} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "14px 10px" }}>
                  <div style={{ fontSize: 20 }}>{icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1.2, marginTop: 4 }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#9d9ab0", marginTop: 4 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <Btn onClick={downloadStats} color="#7c3aed" style={{ width: "100%", padding: 15, fontSize: 15, borderRadius: 16 }}>
            ⬇️ Download My Stats
          </Btn>
          <p style={{ color: "#4a4560", fontSize: 12, marginTop: 12 }}>Downloads as an HTML file — open in your browser and print to PDF</p>
        </div>
      ) : (
        <div style={{ color: "#9d9ab0" }}>⏳ Loading your stats...</div>
      )}

      <div style={{ marginTop: 36, color: "#4a4560", fontSize: 13, lineHeight: 1.8 }}>
        <div>May Allah accept your fasts, prayers, and good deeds. 🤲</div>
        <div>Taqabbal Allahu minna wa minkum.</div>
      </div>
    </div>
  );
}

// ═══ AUTH SCREEN ══════════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState(""), [pass, setPass] = useState(""), [name, setName] = useState("");
  const [err, setErr] = useState(""), [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState(""), [resetLoading, setResetLoading] = useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    if (tab === "signup") {
      if (!name.trim()) { setErr("Name is required"); setLoading(false); return; }
      if (pass.length < 6) { setErr("Password must be at least 6 characters"); setLoading(false); return; }
      const { ok, data } = await auth.signUp(email, pass, name);
      if (!ok) { setErr(`${data?.error_description || data?.message || data?.msg || "Signup failed"}`); setLoading(false); return; }
      if (!data?.access_token) { setErr("✅ Account created! Check your email to confirm, then sign in."); setTab("login"); setLoading(false); return; }
      const { data: u } = await auth.getUser(data.access_token);
      onLogin(data.access_token, u);
    } else {
      const { ok, data } = await auth.signIn(email, pass);
      if (ok && data?.access_token) {
        const { data: u } = await auth.getUser(data.access_token);
        onLogin(data.access_token, u);
      } else {
        setErr(data?.error_description || data?.message || data?.msg || "Invalid email or password");
      }
    }
    setLoading(false);
  };

  const sendReset = async () => {
    if (!resetEmail.trim()) { setResetMsg("❌ Please enter your email address."); return; }
    setResetLoading(true); setResetMsg("");
    const { ok } = await auth.resetPassword(resetEmail.trim());
    setResetLoading(false);
    if (ok) setResetMsg("✅ Reset email sent! Check your inbox and follow the link to set a new password.");
    else setResetMsg("❌ Couldn't send reset email. Please check the address and try again.");
  };

  const inp = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#e8e0f0", fontSize: 15, width: "100%", boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0a0616 0%, #130e22 60%, #080d18 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 60, marginBottom: 8 }}>🌙</div>
          <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 800, color: "#a78bfa" }}>Ramadan Tracker</h1>
          <p style={{ color: "#6d6a80", margin: 0, fontSize: 14 }}>Cape Town • Ramadan 2026</p>
        </div>

        {/* ── Forgot Password Panel ── */}
        {showReset ? (
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 18, padding: 24, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#a78bfa", marginBottom: 6 }}>🔑 Reset Password</div>
            <div style={{ fontSize: 13, color: "#9d9ab0", marginBottom: 18 }}>Enter your email and we'll send you a link to reset your password.</div>
            <input placeholder="Your email address" value={resetEmail} onChange={e => setResetEmail(e.target.value)} type="email"
              style={{ ...inp, marginBottom: 12 }} onKeyDown={e => e.key === "Enter" && sendReset()} />
            {resetMsg && (
              <div style={{ fontSize: 13, marginBottom: 12, textAlign: "center", borderRadius: 8, padding: "8px 12px",
                color: resetMsg.startsWith("✅") ? "#10b981" : "#f87171",
                background: resetMsg.startsWith("✅") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" }}>
                {resetMsg}
              </div>
            )}
            <Btn onClick={sendReset} disabled={resetLoading} style={{ width: "100%", padding: 13, fontSize: 15, marginBottom: 10 }}>
              {resetLoading ? "⏳ Sending..." : "Send Reset Email"}
            </Btn>
            <button onClick={() => { setShowReset(false); setResetMsg(""); setResetEmail(""); }}
              style={{ width: "100%", background: "none", border: "none", color: "#6d6a80", cursor: "pointer", fontSize: 13, padding: "6px 0" }}>
              ← Back to Sign In
            </button>
          </div>
        ) : (
          /* ── Normal Login / Signup ── */
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 18, padding: 24, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", marginBottom: 20, background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: 4 }}>
              {["login","signup"].map(t => (
                <button key={t} onClick={() => { setTab(t); setErr(""); }}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", background: tab === t ? "#7c3aed" : "transparent", color: tab === t ? "#fff" : "#6d6a80", fontWeight: 600, fontSize: 14 }}>
                  {t === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
            {tab === "signup" && <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={{ ...inp, marginBottom: 10 }} />}
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" style={{ ...inp, marginBottom: 10 }} />
            <input placeholder="Password (min 6 chars)" value={pass} onChange={e => setPass(e.target.value)} type="password" style={{ ...inp, marginBottom: tab === "login" ? 8 : 14 }}
              onKeyDown={e => e.key === "Enter" && submit()} />
            {tab === "login" && (
              <div style={{ textAlign: "right", marginBottom: 14 }}>
                <button onClick={() => { setShowReset(true); setResetEmail(email); setErr(""); }}
                  style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  Forgot password?
                </button>
              </div>
            )}
            {err && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12, textAlign: "center", background: "rgba(239,68,68,0.1)", borderRadius: 8, padding: "8px 12px" }}>{err}</div>}
            <Btn onClick={submit} disabled={loading} style={{ width: "100%", padding: 13, fontSize: 15 }}>
              {loading ? "⏳ Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ HEADER ═══════════════════════════════════════════════════
function Header({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const day = getRamadanDay();
  return (
    <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "rgba(10,6,22,0.95)", zIndex: 100, backdropFilter: "blur(12px)" }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#a78bfa" }}>🌙 Ramadan 2026</div>
        {day && <div style={{ fontSize: 11, color: "#6d6a80" }}>Day {day} of 30 • Cape Town</div>}
      </div>
      <div style={{ position: "relative" }}>
        <button onClick={() => setOpen(!open)}
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, padding: "7px 14px", color: "#a78bfa", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          {name.split(" ")[0]} ▾
        </button>
        {open && (
          <div style={{ position: "absolute", right: 0, top: "110%", background: "#130e22", border: "1px solid #3a2a5a", borderRadius: 12, overflow: "hidden", zIndex: 200, minWidth: 140, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
            <button onClick={onLogout} style={{ display: "block", width: "100%", padding: "11px 16px", background: "none", border: "none", color: "#f87171", textAlign: "left", cursor: "pointer", fontSize: 13 }}>↩ Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ NAVBAR ═══════════════════════════════════════════════════
function NavBar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "home", icon: "🌙", label: "Home" },
    { id: "log", icon: "💧", label: "Log" },
    { id: "gym", icon: "🏋️", label: "Gym" },
    { id: "rate", icon: "⭐", label: "Rate" },
    { id: "stats", icon: "📊", label: "Stats" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(10,6,22,0.97)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", zIndex: 300, backdropFilter: "blur(16px)" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActiveTab(t.id)}
          style={{ flex: 1, padding: "10px 4px 12px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: activeTab === t.id ? "#a78bfa" : "#4a4560", fontSize: 10, fontWeight: activeTab === t.id ? 700 : 400 }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          {t.label}
          {activeTab === t.id && <div style={{ width: 18, height: 2, background: "#7c3aed", borderRadius: 1 }} />}
        </button>
      ))}
    </div>
  );
}

// ═══ CATCH-UP FASTS COMPONENT ═════════════════════════════════
function CatchUpFasts({ session, user, fastedDates, onSaved }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const d = db(session);
  const uid = user?.id;
  const today = new Date(); today.setHours(0,0,0,0);
  const ramadanDay = getRamadanDay();

  // Build list of days before today that haven't been fasted
  const missedDays = [];
  for (let i = 1; i < (ramadanDay || 1); i++) {
    const date = getRamadanDate(i);
    if (!fastedDates.has(date)) missedDays.push({ day: i, date });
  }

  if (missedDays.length === 0) return null;

  const toggle = (date) => setSelected(s => ({ ...s, [date]: !s[date] }));
  const selectAll = () => {
    const all = {};
    missedDays.forEach(({ date }) => { all[date] = true; });
    setSelected(all);
  };

  const save = async () => {
    const toSave = missedDays.filter(({ date }) => selected[date]);
    if (toSave.length === 0) { setToast({ msg: "Select at least one day", type: "gold" }); return; }
    setSaving(true);
    await Promise.all(toSave.map(({ date, day }) =>
      d.ups("fast_logs", { user_id: uid, date, fasted: true }, "user_id,date").then(() =>
        d.ins("activity_logs", { user_id: uid, action: `🌙 Backfilled fast for Day ${day} (${date})` })
      )
    ));
    setSaving(false);
    setSelected({});
    setOpen(false);
    setToast({ msg: `✅ ${toSave.length} day${toSave.length > 1 ? "s" : ""} saved! Masha'Allah 🌙`, type: "green" });
    onSaved();
  };

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Card style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)" }}>
        <button onClick={() => setOpen(!open)}
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", textAlign: "left" }}>📅 Catch Up on Missed Fasts</div>
            <div style={{ fontSize: 12, color: "#9d9ab0", marginTop: 3, textAlign: "left" }}>{missedDays.length} day{missedDays.length > 1 ? "s" : ""} before today not yet logged</div>
          </div>
          <span style={{ color: "#f59e0b", fontSize: 18 }}>{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div style={{ marginTop: 14 }}>
            <button onClick={selectAll} style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "6px 14px", color: "#f59e0b", cursor: "pointer", fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
              Select All
            </button>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {missedDays.map(({ day, date }) => {
                const checked = !!selected[date];
                return (
                  <button key={date} onClick={() => toggle(date)}
                    style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${checked ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.1)"}`,
                      background: checked ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.03)",
                      color: checked ? "#f59e0b" : "#9d9ab0", cursor: "pointer", fontSize: 12, fontWeight: checked ? 700 : 400,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: 16 }}>{checked ? "✅" : "🌙"}</span>
                    <span>Day {day}</span>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{date.slice(5)}</span>
                  </button>
                );
              })}
            </div>
            <Btn onClick={save} disabled={saving} color="#d97706" style={{ width: "100%" }}>
              {saving ? "Saving..." : `✓ Save ${Object.values(selected).filter(Boolean).length || 0} Selected Day${Object.values(selected).filter(Boolean).length === 1 ? "" : "s"}`}
            </Btn>
          </div>
        )}
      </Card>
    </>
  );
}

// ═══ HOME TAB ═════════════════════════════════════════════════
function HomeTab({ session, user }) {
  const [times] = useState(() => getTodayTimes());
  const [now, setNow] = useState(new Date());
  const [toast, setToast] = useState(null);
  const [fastedToday, setFastedToday] = useState(false);
  const [fastedDates, setFastedDates] = useState(new Set());
  const [marking, setMarking] = useState(false);
  const d = db(session);
  const uid = user?.id;
  const today = toDate();
  const ramadanDay = getRamadanDay();

  const loadFasts = async () => {
    const r = await d.sel("fast_logs", "*", { user_id: uid });
    if (r.ok && Array.isArray(r.data)) {
      const dates = new Set(r.data.map(f => f.date));
      setFastedDates(dates);
      setFastedToday(dates.has(today));
    }
  };

  useEffect(() => { loadFasts(); }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const markFast = async () => {
    setMarking(true);
    await d.ups("fast_logs", { user_id: uid, date: today, fasted: true }, "user_id,date");
    await d.ins("activity_logs", { user_id: uid, action: `🌙 Marked fast for Day ${ramadanDay}` });
    await loadFasts();
    setToast({ msg: "🌙 Fast marked! Masha'Allah!", type: "purple" });
    setMarking(false);
  };

  const fajr = times ? parseTime(times.Fajr) : null;
  const maghrib = times ? parseTime(times.Maghrib) : null;

  let state = "loading", countdown = 0, label = "";
  if (fajr && maghrib) {
    if (now < fajr) { state = "suhoor"; countdown = fajr - now; label = "Fast begins in"; }
    else if (now < maghrib) { state = "fasting"; countdown = maghrib - now; label = "Iftar in"; }
    else { state = "iftar"; countdown = new Date(fajr.getTime() + 86400000) - now; label = "Next Fajr in"; }
  }

  const progress = fajr && maghrib && state === "fasting"
    ? Math.min(100, ((now - fajr) / (maghrib - fajr)) * 100) : 0;
  const stateColor = state === "fasting" ? "#a78bfa" : state === "iftar" ? "#10b981" : "#f59e0b";

  return (
    <div style={{ padding: "14px 14px 0" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {ramadanDay ? (
        <Card style={{ textAlign: "center", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", padding: "18px 16px" }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>🌙</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#a78bfa" }}>Day {ramadanDay} of Ramadan</div>
          <div style={{ fontSize: 13, color: "#9d9ab0", marginTop: 4 }}>Ramadan Kareem 🤲</div>
          <div style={{ marginTop: 14 }}>
            {fastedToday ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, padding: "8px 18px", color: "#10b981", fontSize: 14, fontWeight: 700 }}>
                ✅ Fast logged today
              </div>
            ) : (
              <Btn onClick={markFast} disabled={marking} color="#059669" style={{ borderRadius: 20, padding: "9px 22px" }}>
                {marking ? "Saving..." : "✓ Mark Today's Fast"}
              </Btn>
            )}
          </div>
        </Card>
      ) : (
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, color: "#f59e0b" }}>Ramadan 2026</div>
          <div style={{ fontSize: 13, color: "#9d9ab0", marginTop: 4 }}>19 Feb – 20 Mar • Cape Town SAST</div>
        </Card>
      )}

      {/* Catch-up missed fasts — only shown during Ramadan */}
      {ramadanDay && ramadanDay > 1 && (
        <CatchUpFasts session={session} user={user} fastedDates={fastedDates} onSaved={loadFasts} />
      )}

      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 12 }}>🕌 Today's Prayer Times</div>
        {times ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Suhoor ends / Fajr", time: fmt(fajr), icon: "🌅", note: "fast begins", hi: state === "suhoor" },
              { label: "Ishraaq", time: times.Ishraaq, icon: "🌤️", hi: false },
              { label: "Dhuhr", time: times.Dhuhr, icon: "☀️", hi: false },
              { label: "Asr (Hanafi)", time: times.AsrH, icon: "🌤️", hi: false },
              { label: "Maghrib (Iftar)", time: fmt(maghrib), icon: "🌅", note: "break fast", hi: state === "iftar" },
              { label: "Isha", time: times.Isha, icon: "🌙", hi: false },
            ].map(({ label, time, icon, note, hi }) => (
              <div key={label} style={{ background: hi ? "rgba(245,158,11,0.12)" : "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 12px", border: hi ? "1px solid rgba(245,158,11,0.3)" : "1px solid transparent" }}>
                <div style={{ fontSize: 11, color: "#9d9ab0" }}>{icon} {label}</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: hi ? "#f59e0b" : "#e8e0f0", marginTop: 2 }}>{time}</div>
                {note && <div style={{ fontSize: 10, color: "#7c3aed", marginTop: 2 }}>{note}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#9d9ab0", fontSize: 13, textAlign: "center", padding: "12px 0" }}>No timetable for today — outside Ramadan 2026.</div>
        )}
      </Card>

      {times && (
        <Card style={{ textAlign: "center", border: `1px solid ${stateColor}33` }}>
          <div style={{ fontSize: 12, color: "#9d9ab0", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: stateColor, letterSpacing: 3, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {fmtCd(countdown)}
          </div>
          {state === "fasting" && (
            <>
              <div style={{ marginTop: 14, background: "rgba(255,255,255,0.06)", borderRadius: 8, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 8, transition: "width 1s linear" }} />
              </div>
              <div style={{ fontSize: 12, color: "#9d9ab0", marginTop: 6 }}>{progress.toFixed(1)}% of fast complete 🤲</div>
            </>
          )}
          {state === "suhoor" && <div style={{ marginTop: 10, fontSize: 14, color: "#f59e0b" }}>🌙 Suhoor time — don't forget your Niyyah!</div>}
          {state === "iftar" && <div style={{ marginTop: 10, fontSize: 14, color: "#10b981" }}>🌙 Alhamdulillah! Iftar — JazakAllah Khair ❤️</div>}
        </Card>
      )}

      <Card style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.18)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>🤲 Niyyah</div>
        <div style={{ fontSize: 13, color: "#e8e0f0", lineHeight: 1.7, fontStyle: "italic" }}>"I intend to fast today for the sake of Allah during the month of Ramadan."</div>
        <div style={{ fontSize: 13, color: "#a78bfa", marginTop: 8, lineHeight: 1.7, direction: "rtl", textAlign: "right" }}>نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالَى</div>
      </Card>

      <Card style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)", marginBottom: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>🌙 Dua at Iftar</div>
        <div style={{ fontSize: 13, color: "#e8e0f0", lineHeight: 1.7, fontStyle: "italic" }}>"O Allah! I fasted for You, I believe in You, I put my trust in You, and I break my fast with Your sustenance."</div>
        <div style={{ fontSize: 13, color: "#a78bfa", marginTop: 8, lineHeight: 1.7, direction: "rtl", textAlign: "right" }}>اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ</div>
      </Card>
    </div>
  );
}

// ═══ LOG TAB ══════════════════════════════════════════════════
function LogTab({ session, user }) {
  const [waterLogs, setWaterLogs] = useState([]);
  const [coffeeLogs, setCoffeeLogs] = useState([]);
  const [suppLogs, setSuppLogs] = useState([]);
  const [activity, setActivity] = useState([]);
  const [toast, setToast] = useState(null);
  const d = db(session);
  const uid = user?.id;
  const today = toDate();

  const load = async () => {
    const [w, c, s, a] = await Promise.all([
      d.sel("water_logs", "*", { user_id: uid, date: today }, { order: "logged_at.desc" }),
      d.sel("coffee_logs", "*", { user_id: uid, date: today }, { order: "logged_at.desc" }),
      d.sel("supplement_logs", "*", { user_id: uid, date: today }),
      d.sel("activity_logs", "*", { user_id: uid }, { order: "logged_at.desc", limit: 25 }),
    ]);
    if (w.ok && Array.isArray(w.data)) setWaterLogs(w.data);
    if (c.ok && Array.isArray(c.data)) setCoffeeLogs(c.data);
    if (s.ok && Array.isArray(s.data)) setSuppLogs(s.data);
    if (a.ok && Array.isArray(a.data)) setActivity(a.data);
  };

  useEffect(() => { load(); }, []);

  const logAct = (action) => d.ins("activity_logs", { user_id: uid, action });

  // ── Water ──
  const addWater = async () => {
    await d.ins("water_logs", { user_id: uid, date: today, amount: 1 });
    const newTotal = waterLogs.reduce((a, b) => a + Number(b.amount), 0) + 1;
    await logAct("💧 Logged +1L water");
    await load();
    if (newTotal >= 8) setToast({ msg: "💧 Amazing hydration! 🏆", type: "green" });
    else if (newTotal === 3) setToast({ msg: "💧 3L water — keep going!", type: "purple" });
    else setToast({ msg: "💧 +1L water logged!", type: "purple" });
  };

  const removeWater = async () => {
    if (waterLogs.length === 0) return;
    const last = waterLogs[0]; // sorted desc, so first = most recent
    await d.delById("water_logs", last.id);
    await logAct("💧 Removed 1L water");
    await load();
    setToast({ msg: "💧 1L water removed", type: "gold" });
  };

  // ── Coffee ──
  const addCoffee = async () => {
    if (coffeeLogs.length >= 5) { setToast({ msg: "☕ 5 coffees — take it easy!", type: "gold" }); return; }
    await d.ins("coffee_logs", { user_id: uid, date: today });
    await logAct("☕ Logged coffee");
    await load();
    if (coffeeLogs.length + 1 >= 3) setToast({ msg: "☕ 3+ coffees — high caffeine!", type: "gold" });
    else setToast({ msg: "☕ Coffee logged!", type: "purple" });
  };

  const removeCoffee = async () => {
    if (coffeeLogs.length === 0) return;
    const last = coffeeLogs[0]; // sorted desc
    await d.delById("coffee_logs", last.id);
    await logAct("☕ Removed 1 coffee");
    await load();
    setToast({ msg: "☕ 1 coffee removed", type: "gold" });
  };

  const addSupp = async (type) => {
    await d.ins("supplement_logs", { user_id: uid, date: today, type });
    await logAct(`💊 Logged ${type}`);
    await load();
    setToast({ msg: `✓ ${type} logged!`, type: "purple" });
  };

  const waterTotal = waterLogs.reduce((a, b) => a + Number(b.amount), 0);
  const supps = ["Salt 🧂", "Creatine 💪", "Electrolytes ⚡", "Omega-3 🐟", "Vitamin D ☀️", "Magnesium 🌿", "Zinc 🦠", "Multivitamin 💊"];

  return (
    <div style={{ padding: "14px 14px 0" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Water Card ── */}
      <Card style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#93c5fd", marginBottom: 10 }}>💧 Water Today</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 42, fontWeight: 900, color: "#3b82f6", lineHeight: 1 }}>{waterTotal}L</div>
            <div style={{ fontSize: 11, color: "#9d9ab0", marginTop: 2 }}>{waterLogs.length} log{waterLogs.length !== 1 ? "s" : ""} today</div>
          </div>
          {/* +/- controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={removeWater} disabled={waterLogs.length === 0}
              style={{ width: 46, height: 46, borderRadius: 14, background: waterLogs.length === 0 ? "rgba(255,255,255,0.03)" : "rgba(239,68,68,0.15)", border: `1px solid ${waterLogs.length === 0 ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.35)"}`, color: waterLogs.length === 0 ? "#3a3560" : "#f87171", fontSize: 24, cursor: waterLogs.length === 0 ? "not-allowed" : "pointer", fontWeight: 700, lineHeight: 1 }}>
              −
            </button>
            <button onClick={addWater}
              style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(29,78,216,0.4)", border: "1px solid rgba(59,130,246,0.4)", color: "#93c5fd", fontSize: 24, cursor: "pointer", fontWeight: 700, lineHeight: 1 }}>
              +
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 7, borderRadius: 4, background: i < waterTotal ? "#3b82f6" : "rgba(255,255,255,0.07)" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#9d9ab0" }}>Goal: 8L/day after Iftar</div>
      </Card>

      {/* ── Coffee Card ── */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#d97706", marginBottom: 10 }}>☕ Coffee Today</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 42, fontWeight: 900, color: coffeeLogs.length >= 3 ? "#ef4444" : "#f59e0b", lineHeight: 1 }}>{coffeeLogs.length}</div>
            {coffeeLogs.length >= 3 && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>⚠️ High caffeine</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={removeCoffee} disabled={coffeeLogs.length === 0}
              style={{ width: 46, height: 46, borderRadius: 14, background: coffeeLogs.length === 0 ? "rgba(255,255,255,0.03)" : "rgba(239,68,68,0.15)", border: `1px solid ${coffeeLogs.length === 0 ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.35)"}`, color: coffeeLogs.length === 0 ? "#3a3560" : "#f87171", fontSize: 24, cursor: coffeeLogs.length === 0 ? "not-allowed" : "pointer", fontWeight: 700, lineHeight: 1 }}>
              −
            </button>
            <button onClick={addCoffee}
              style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(146,64,14,0.35)", border: "1px solid rgba(245,158,11,0.35)", color: "#f59e0b", fontSize: 24, cursor: "pointer", fontWeight: 700, lineHeight: 1 }}>
              +
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 12 }}>💊 Supplements</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {supps.map(s => {
            const cnt = suppLogs.filter(x => x.type === s).length;
            return (
              <button key={s} onClick={() => addSupp(s)}
                style={{ background: cnt > 0 ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.04)", border: `1px solid ${cnt > 0 ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "8px 12px", color: cnt > 0 ? "#a78bfa" : "#9d9ab0", cursor: "pointer", fontSize: 12, fontWeight: cnt > 0 ? 700 : 400 }}>
                {s}{cnt > 0 && <span style={{ color: "#c4b5fd" }}> ×{cnt}</span>}
              </button>
            );
          })}
        </div>
      </Card>

      <Card style={{ marginBottom: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>📋 Activity Log</div>
        {activity.length === 0 ? (
          <div style={{ color: "#9d9ab0", fontSize: 13, textAlign: "center", padding: "16px 0" }}>No activity yet — start logging! 🌙</div>
        ) : (
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {activity.map(a => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", gap: 8 }}>
                <span style={{ color: "#e8e0f0", fontSize: 13, flex: 1 }}>{a.action}</span>
                <span style={{ color: "#4a4560", fontSize: 11, whiteSpace: "nowrap" }}>{fmtDT(a.logged_at)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ═══ GYM TAB ══════════════════════════════════════════════════
function GymTab({ session, user }) {
  const TYPES = ["Upper Body", "Lower Body", "Cardio", "Skipping", "Abs", "Full Body", "HIIT", "Yoga/Stretch"];
  const [sel, setSel] = useState([]);
  const [rating, setRating] = useState(0);
  const [dur, setDur] = useState("");
  const [sessions, setSessions] = useState([]);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const d = db(session);
  const uid = user?.id;

  const load = async () => {
    const r = await d.sel("gym_sessions", "*", { user_id: uid }, { order: "log_date.desc", limit: 20 });
    if (r.ok && Array.isArray(r.data)) setSessions(r.data);
  };
  useEffect(() => { load(); }, []);

  const toggle = (t) => setSel(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);

  const save = async () => {
    if (sel.length === 0) { setToast({ msg: "Select at least one workout type", type: "gold" }); return; }
    if (!rating) { setToast({ msg: "Please add a star rating", type: "gold" }); return; }
    setSaving(true);
    const res = await d.ins("gym_sessions", { user_id: uid, log_date: toDate(), types: sel, rating, duration: parseInt(dur) || null });
    if (!res.ok) { setToast({ msg: "❌ Error saving session.", type: "gold" }); setSaving(false); return; }
    await d.ins("activity_logs", { user_id: uid, action: `🏋️ Gym: ${sel.join(", ")} — ${rating}⭐${dur ? ` — ${dur}min` : ""}` });
    setSel([]); setRating(0); setDur("");
    await load();
    setToast({ msg: "💪 Gym session logged!", type: "green" });
    setSaving(false);
  };

  const inp = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "10px 12px", color: "#e8e0f0", fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ padding: "14px 14px 0" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 14 }}>🏋️ Log Gym Session</div>
        <div style={{ fontSize: 12, color: "#9d9ab0", marginBottom: 8 }}>Workout Type (multi-select)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => toggle(t)}
              style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${sel.includes(t) ? "#7c3aed" : "rgba(255,255,255,0.09)"}`, background: sel.includes(t) ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.03)", color: sel.includes(t) ? "#a78bfa" : "#9d9ab0", cursor: "pointer", fontSize: 13, fontWeight: sel.includes(t) ? 700 : 400 }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#9d9ab0", marginBottom: 8 }}>Session Rating</div>
        <div style={{ marginBottom: 16 }}><StarRating value={rating} onChange={setRating} size={34} /></div>
        <input placeholder="Duration (minutes)" value={dur} onChange={e => setDur(e.target.value)} type="number" style={{ ...inp, marginBottom: 10 }} />
        <Btn onClick={save} disabled={saving} style={{ width: "100%", marginTop: 6 }}>{saving ? "Saving..." : "💪 Log Session"}</Btn>
      </Card>
      <Card style={{ marginBottom: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>📅 Recent Sessions</div>
        {sessions.length === 0 ? (
          <div style={{ color: "#9d9ab0", fontSize: 13, textAlign: "center", padding: "16px 0" }}>No sessions logged yet 🏋️</div>
        ) : sessions.map(s => (
          <div key={s.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, color: "#e8e0f0", fontSize: 14 }}>{Array.isArray(s.types) ? s.types.join(", ") : s.types}</span>
              <span style={{ color: "#f59e0b" }}>{"★".repeat(s.rating || 0)}</span>
            </div>
            <div style={{ fontSize: 12, color: "#9d9ab0", marginTop: 3 }}>{s.log_date}{s.duration ? ` • ${s.duration}min` : ""}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ═══ RATE TAB ═════════════════════════════════════════════════
function RateTab({ session, user }) {
  const [mood, setMood] = useState(0), [energy, setEnergy] = useState(0);
  const [hunger, setHunger] = useState(0), [sleep, setSleep] = useState(0);
  const [existing, setExisting] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const d = db(session);
  const uid = user?.id;
  const today = toDate();

  useEffect(() => {
    (async () => {
      const r = await d.sel("daily_ratings", "*", { user_id: uid, date: today });
      if (r.ok && r.data?.length > 0) {
        const e = r.data[0];
        setExisting(e); setMood(e.mood||0); setEnergy(e.energy||0); setHunger(e.hunger||0); setSleep(e.sleep||0);
      }
    })();
  }, []);

  const save = async () => {
    if (!mood || !energy || !hunger || !sleep) { setToast({ msg: "Please rate all 4 categories ⭐", type: "gold" }); return; }
    setSaving(true);
    const data = { user_id: uid, date: today, mood, energy, hunger, sleep };
    if (existing) await d.upd("daily_ratings", { mood, energy, hunger, sleep }, { user_id: uid, date: today });
    else await d.ups("daily_ratings", data, "user_id,date");
    await d.ins("activity_logs", { user_id: uid, action: `⭐ Day ${getRamadanDay()||"?"} rated — Mood:${mood} Energy:${energy} Hunger:${hunger} Sleep:${sleep}` });
    setExisting(data); setSaving(false);
    setToast({ msg: "⭐ Day rated! Jazak Allah Khair 🌙", type: "green" });
  };

  const ratings = [
    { label: "😊 Mood", value: mood, set: setMood, desc: "Overall mood today?" },
    { label: "⚡ Energy", value: energy, set: setEnergy, desc: "Energy levels?" },
    { label: "🍽️ Hunger", value: hunger, set: setHunger, desc: "Hunger manageable?" },
    { label: "😴 Sleep", value: sleep, set: setSleep, desc: "Sleep quality?" },
  ];

  return (
    <div style={{ padding: "14px 14px 0" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 2 }}>⭐ End of Day Rating</div>
        <div style={{ fontSize: 12, color: "#6d6a80", marginBottom: 18 }}>{today} • Day {getRamadanDay() || "—"} of Ramadan</div>
        {ratings.map(({ label, value, set, desc }) => (
          <div key={label} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: 11, color: "#6d6a80" }}>{desc}</div>
            </div>
            <StarRating value={value} onChange={set} size={38} />
          </div>
        ))}
        <Btn onClick={save} disabled={saving} style={{ width: "100%", marginTop: 6 }}>
          {saving ? "Saving..." : existing ? "✏️ Update Rating" : "⭐ Save Today's Rating"}
        </Btn>
      </Card>
      {existing && (
        <Card style={{ textAlign: "center", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 0 }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>✅</div>
          <div style={{ color: "#10b981", fontWeight: 700, fontSize: 16 }}>Today is rated!</div>
          <div style={{ fontSize: 14, color: "#9d9ab0", marginTop: 8, display: "flex", justifyContent: "center", gap: 16 }}>
            <span>😊 {mood}★</span><span>⚡ {energy}★</span><span>🍽️ {hunger}★</span><span>😴 {sleep}★</span>
          </div>
        </Card>
      )}
    </div>
  );
}

// ═══ STATS TAB ════════════════════════════════════════════════
function StatsTab({ session, user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const d = db(session);
  const uid = user?.id;

  useEffect(() => {
    (async () => {
      const [fasts, waters, coffees, gyms, ratings] = await Promise.all([
        d.sel("fast_logs", "*", { user_id: uid }),
        d.sel("water_logs", "*", { user_id: uid }),
        d.sel("coffee_logs", "*", { user_id: uid }),
        d.sel("gym_sessions", "*", { user_id: uid }, { order: "log_date.desc" }),
        d.sel("daily_ratings", "*", { user_id: uid }, { order: "date.desc" }),
      ]);
      const F = Array.isArray(fasts.data) ? fasts.data : [];
      const W = Array.isArray(waters.data) ? waters.data : [];
      const C = Array.isArray(coffees.data) ? coffees.data : [];
      const G = Array.isArray(gyms.data) ? gyms.data : [];
      const R = Array.isArray(ratings.data) ? ratings.data : [];

      const byDay = {};
      W.forEach(w => { byDay[w.date] = (byDay[w.date]||0) + Number(w.amount); });
      const dayVals = Object.values(byDay);
      const avgWater = dayVals.length > 0 ? (dayVals.reduce((a,b)=>a+b,0)/dayVals.length).toFixed(1) : 0;
      const avgGym = G.length > 0 ? (G.reduce((a,b)=>a+(b.rating||0),0)/G.length).toFixed(1) : 0;
      const totalGymMin = G.reduce((a,b)=>a+(b.duration||0),0);
      const avg = (arr, key) => arr.length > 0 ? (arr.reduce((a,b)=>a+(b[key]||0),0)/arr.length).toFixed(1) : 0;

      const fastSet = new Set(F.map(f => f.date));
      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const dd = new Date(); dd.setDate(dd.getDate() - i);
        if (fastSet.has(toDate(dd))) streak++; else if (i > 0) break;
      }
      setStats({ F, W, C, G, R, avgWater, avgGym, totalGymMin, streak,
        avgMood: avg(R,"mood"), avgEnergy: avg(R,"energy"), avgHunger: avg(R,"hunger"), avgSleep: avg(R,"sleep") });
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#9d9ab0" }}>⏳ Loading stats...</div>;

  const S = stats;
  const SC = ({ icon, label, val, sub, color="#a78bfa" }) => (
    <div style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 11, color: "#9d9ab0", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: "#6d6a80", marginTop: 3 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ padding: "14px 14px 0" }}>
      <Card style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 14 }}>📊 Personal Dashboard</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <SC icon="🌙" label="Days Fasted" val={S.F.length} color="#a78bfa" sub="this Ramadan" />
          <SC icon="🔥" label="Current Streak" val={`${S.streak}d`} color="#f59e0b" sub="consecutive days" />
          <SC icon="💧" label="Total Water" val={`${S.W.reduce((a,b)=>a+Number(b.amount),0)}L`} sub={`${S.avgWater}L avg/day`} color="#3b82f6" />
          <SC icon="🏋️" label="Gym Sessions" val={S.G.length} sub={S.avgGym > 0 ? `${S.avgGym}★ avg` : "none yet"} color="#10b981" />
          <SC icon="☕" label="Coffees Logged" val={S.C.length || "—"} color="#d97706" sub="total" />
          <SC icon="⏱️" label="Total Gym Time" val={S.totalGymMin > 0 ? `${S.totalGymMin}m` : "—"} sub="minutes trained" color="#ec4899" />
        </div>
      </Card>

      {S.R.length > 0 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 14 }}>😊 Average Daily Ratings</div>
          {[
            { l:"Mood", v:S.avgMood, i:"😊", c:"#f59e0b" },
            { l:"Energy", v:S.avgEnergy, i:"⚡", c:"#10b981" },
            { l:"Hunger", v:S.avgHunger, i:"🍽️", c:"#ef4444" },
            { l:"Sleep", v:S.avgSleep, i:"😴", c:"#3b82f6" },
          ].map(({ l, v, i, c }) => (
            <div key={l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ fontSize:14, minWidth:90 }}>{i} {l}</div>
              <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, marginLeft:12 }}>
                <div style={{ flex:1, height:7, background:"rgba(255,255,255,0.07)", borderRadius:4 }}>
                  <div style={{ height:"100%", width:`${(v/5)*100}%`, background:c, borderRadius:4 }} />
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:c, minWidth:32 }}>{v}★</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {S.R.length > 0 && (
        <Card style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>📅 Recent Day Ratings</div>
          {S.R.slice(0,7).map(r => (
            <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ color:"#9d9ab0", fontSize:12 }}>Day {getRamadanDay(new Date(r.date))||"—"} ({r.date})</div>
              <div style={{ display:"flex", gap:10, fontSize:13 }}>
                <span>😊{r.mood}</span><span>⚡{r.energy}</span><span>🍽️{r.hunger}</span><span>😴{r.sleep}</span>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ═══ ROOT ═════════════════════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    (async () => {
      try {
        const s = store.get("ramadan_tok");
        if (s?.value) {
          const { ok, data } = await auth.getUser(s.value);
          if (ok && data?.id) { setSession(s.value); setUser(data); }
          else store.del("ramadan_tok");
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const handleLogin = (tok, userData) => {
    store.set("ramadan_tok", tok);
    setSession(tok); setUser(userData);
  };

  const handleLogout = async () => {
    try { await auth.signOut(session); } catch {}
    store.del("ramadan_tok");
    setSession(null); setUser(null);
  };

  if (loading) return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#0a0616", color:"#a78bfa", gap:16 }}>
      <div style={{ fontSize:52 }}>🌙</div>
      <div style={{ fontSize:16, fontWeight:600 }}>Loading Ramadan Tracker...</div>
    </div>
  );

  if (!session) return <AuthScreen onLogin={handleLogin} />;

  // ── Eid screen after Ramadan ends ──
  if (isRamadanOver()) return <EidScreen session={session} user={user} />;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0616 0%,#130e22 60%,#080d18 100%)", color:"#e8e0f0", fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif", maxWidth:480, margin:"0 auto", position:"relative" }}>
      <Header user={user} onLogout={handleLogout} />
      <div style={{ paddingBottom:80 }}>
        {activeTab === "home"  && <HomeTab  session={session} user={user} />}
        {activeTab === "log"   && <LogTab   session={session} user={user} />}
        {activeTab === "gym"   && <GymTab   session={session} user={user} />}
        {activeTab === "rate"  && <RateTab  session={session} user={user} />}
        {activeTab === "stats" && <StatsTab session={session} user={user} />}
      </div>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}