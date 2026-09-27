"use client"

import Link from "next/link"

const LOGO = "/images/logo-kisavi.jpeg"
const LOGO1 = "/images/kisavi-logo-updated.png"

export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",color:"#1a1a1a",background:"#fff",minHeight:"100vh"}}>

      {/* ── Simple header ─────────────────────────────────────────── */}
      <header style={{
        borderBottom:"1px solid #e0f0e8",padding:"0 5%",
        position:"sticky",top:0,background:"rgba(255,255,255,0.97)",
        backdropFilter:"blur(12px)",zIndex:50
      }}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
          <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
            <div style={{
              width:60,height:60,borderRadius:30,flexShrink:0, 
              backgroundColor:"#fff",
              backgroundImage:`url(${LOGO1})`,
              backgroundSize:"100% auto",
              backgroundPosition:"60% 5%",
              backgroundRepeat:"no-repeat",
              boxShadow:"0 4px 14px rgba(26,122,82,0.25)"
            }}/>
            <span style={{fontSize:20,fontWeight:700,color:"#1a7a52",letterSpacing:-0.5}}>Kisavi</span>
          </Link>
          <Link href="/" style={{
            color:"#1a7a52",fontSize:14,fontWeight:600,textDecoration:"none",
            border:"1.5px solid #1a7a52",padding:"7px 16px",borderRadius:20
          }}>← Back to Home</Link>
        </div>
      </header>

      {/* ── Page content ──────────────────────────────────────────── */}
      <main style={{maxWidth:900,margin:"0 auto",padding:"60px 5% 100px"}}>
        <span style={{color:"#1a7a52",fontWeight:700,fontSize:13,letterSpacing:2,textTransform:"uppercase"}}>Legal</span>
        <h1 style={{fontSize:"clamp(28px,4vw,42px)",fontWeight:800,marginTop:8,marginBottom:8,color:"#0f2d1e"}}>{title}</h1>
        <p style={{color:"#888",fontSize:14,marginBottom:44}}>Last updated: {lastUpdated}</p>

        <div className="legal-body" style={{fontSize:15.5,lineHeight:1.85,color:"#3a3a3a"}}>
          {children}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer style={{background:"#0f2d1e",padding:"48px 5% 24px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            paddingBottom:24,borderBottom:"1px solid rgba(255,255,255,0.08)",
            flexWrap:"wrap",gap:16
          }}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{
                width:70,height:70,borderRadius:11,flexShrink:0,
                backgroundColor:"#fff",
                backgroundImage:`url(${LOGO})`,
                backgroundSize:"100% auto",
                backgroundPosition:"50% 6%",
                backgroundRepeat:"no-repeat"
              }}/>
              <span style={{fontSize:16,fontWeight:700,color:"#fff"}}>Kisavi</span>
            </div>
            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
              <Link href="/" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Home</Link>
              <Link href="/terms" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Terms & Conditions</Link>
              <Link href="/privacy" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Privacy Policy</Link>
            </div>
          </div>
          <div style={{paddingTop:20,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <p style={{color:"#5a8a6a",fontSize:13,margin:0}}>© 2026 Kisavi · Andhra Pradesh, India</p>
            <p style={{color:"#5a8a6a",fontSize:13,margin:0}}>kisaviofficial@gmail.com · +91 7075330899</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .legal-body h2 {
          font-size: 22px; font-weight: 800; color: #0f2d1e;
          margin: 40px 0 14px;
        }
        .legal-body h2:first-child { margin-top: 0; }
        .legal-body h3 {
          font-size: 17px; font-weight: 700; color: #1a7a52;
          margin: 24px 0 10px;
        }
        .legal-body p { margin: 0 0 14px; }
        .legal-body ul, .legal-body ol { margin: 0 0 14px; padding-left: 22px; }
        .legal-body li { margin-bottom: 8px; }
        .legal-body strong { color: #0f2d1e; }
        .legal-body a { color: #1a7a52; }
      `}</style>
    </div>
  )
}