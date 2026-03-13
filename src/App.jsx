import { useState, useEffect } from "react";
import VibeSpot from "./VibeSpot.jsx";

const PASSWORD = "kickbaron2025";

function MaintenancePage({ onUnlock }) {
  const [dots, setDots] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = () => {
    if (pw === PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Outfit:wght@300;400;500;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Outfit',sans-serif; background:#FAF8F5; color:#1A1A1A; -webkit-font-smoothing:antialiased; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
        @keyframes shake { 0%,100% { transform:translateX(0); } 20%,60% { transform:translateX(-6px); } 40%,80% { transform:translateX(6px); } }
      `}</style>
      <div style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", textAlign:"center",
        padding:"40px 24px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:"-20%", right:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(196,112,90,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-10%", left:"-5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(232,221,211,0.4) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ animation:"fadeUp 0.6s ease both", marginBottom:48 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg, #C4705A, #D4907E)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white"/></svg>
            </div>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, letterSpacing:"-0.02em" }}>VibeSpot</span>
          </div>
        </div>

        <div style={{ animation:"fadeUp 0.6s ease 0.1s both, float 3s ease-in-out infinite", marginBottom:32 }}>
          <div style={{ width:80, height:80, borderRadius:20, background:"white", boxShadow:"0 8px 30px rgba(26,26,26,0.06)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C4705A" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
            </svg>
          </div>
        </div>

        <h1 style={{
          fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px, 6vw, 52px)",
          fontWeight:600, lineHeight:1.15, letterSpacing:"-0.03em",
          animation:"fadeUp 0.6s ease 0.2s both", marginBottom:16,
        }}>
          Something <span style={{ color:"#C4705A", fontStyle:"italic" }}>exciting</span><br />is brewing
        </h1>

        <p style={{
          fontSize:"clamp(15px, 2vw, 18px)", lineHeight:1.6, color:"#6B6560",
          maxWidth:460, animation:"fadeUp 0.6s ease 0.3s both", marginBottom:40,
        }}>
          We're upgrading VibeSpot with AI-powered search and real place discovery. We'll be back very soon.
        </p>

        <div style={{
          display:"inline-flex", alignItems:"center", gap:10,
          padding:"12px 24px", borderRadius:50,
          background:"white", boxShadow:"0 2px 12px rgba(26,26,26,0.04)",
          border:"1px solid #E8E2DC", animation:"fadeUp 0.6s ease 0.4s both",
        }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#C4705A", animation:"pulse 1.5s ease-in-out infinite" }} />
          <span style={{ fontSize:14, fontWeight:500, color:"#6B6560" }}>Upgrading{dots}</span>
        </div>

        <button onClick={() => setShowLogin(!showLogin)} style={{
          position:"fixed", bottom:24, right:24, width:40, height:40,
          borderRadius:"50%", border:"none", cursor:"pointer",
          background: showLogin ? "#C4705A" : "rgba(155,149,144,0.15)",
          color: showLogin ? "white" : "#9B9590",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.3s ease", zIndex:100,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </button>

        {showLogin && (
          <div style={{
            position:"fixed", bottom:76, right:24,
            background:"white", borderRadius:16,
            boxShadow:"0 12px 40px rgba(26,26,26,0.12)",
            border:"1px solid #E8E2DC",
            padding:20, width:260, zIndex:100,
            animation:"scaleIn 0.2s ease both",
            transformOrigin:"bottom right",
          }}>
            <p style={{ fontSize:13, fontWeight:600, color:"#6B6560", marginBottom:12, textAlign:"left" }}>Admin access</p>
            <div style={{ display:"flex", gap:8, animation: shaking ? "shake 0.4s ease" : "none" }}>
              <input
                type="password" value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="Password" autoFocus
                style={{
                  flex:1, padding:"8px 12px", borderRadius:8,
                  border: `1.5px solid ${error ? "#e74c3c" : "#E8E2DC"}`,
                  outline:"none", fontSize:14, fontFamily:"'Outfit',sans-serif",
                  background: error ? "#fef2f2" : "white",
                  transition:"border-color 0.2s, background 0.2s",
                }}
              />
              <button onClick={handleSubmit} style={{
                padding:"8px 14px", borderRadius:8, border:"none",
                background:"#C4705A", color:"white", cursor:"pointer",
                fontSize:13, fontWeight:600, fontFamily:"'Outfit',sans-serif",
              }}>→</button>
            </div>
            {error && <p style={{ fontSize:12, color:"#e74c3c", marginTop:6, textAlign:"left" }}>Wrong password</p>}
          </div>
        )}

        <p style={{ position:"absolute", bottom:32, left:0, right:0, fontSize:13, color:"#9B9590", animation:"fadeUp 0.6s ease 0.5s both" }}>
          © 2026 VibeSpot · Amsterdam
        </p>
      </div>
    </>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem("vs_ok") === "1"; } catch { return false; }
  });

  const handleUnlock = () => {
    try { sessionStorage.setItem("vs_ok", "1"); } catch {}
    setUnlocked(true);
  };

  if (!unlocked) return <MaintenancePage onUnlock={handleUnlock} />;
  return <VibeSpot />;
}
