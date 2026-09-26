// "use client"

// import { useState, useEffect, useRef } from "react"
// import Link from "next/link"

// const NAV_LINKS = ["Home","About","What We Offer","How It Works","Future Plans","Contact"]

// function useInView(threshold=0.15){
//   const ref=useRef(null)
//   const [vis,setVis]=useState(false)
//   useEffect(()=>{
//     const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold})
//     if(ref.current)obs.observe(ref.current)
//     return()=>obs.disconnect()
//   },[threshold])
//   return[ref,vis]
// }

// function AnimSection({children,className="",delay=0,style={}}){
//   const[ref,vis]=useInView()
//   return(
//     <div ref={ref} className={className} style={{
//       ...style,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(40px)",
//       transition:`opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
//     }}>{children}</div>
//   )
// }

// export default function KisaviLanding(){
//   const[menu,setMenu]=useState(false)
//   const[scrolled,setScrolled]=useState(false)
//   const[active,setActive]=useState("Home")

//   useEffect(()=>{
//     const h=()=>setScrolled(window.scrollY>40)
//     window.addEventListener("scroll",h)
//     return()=>window.removeEventListener("scroll",h)
//   },[])

//   const scroll=(id)=>{
//     if(id==="verification"){
//       window.location.href="/verification"
//       return
//     }
//     const el=document.getElementById(id)
//     if(el){el.scrollIntoView({behavior:"smooth"});setMenu(false);setActive(id)}
//   }

//   const sectionId=(label)=>label.toLowerCase().replace(/\s+/g,"-")

//   return(
//     <div className="kisavi-landing" style={{fontFamily:"'Segoe UI',sans-serif",color:"#1a1a1a",background:"#fff",overflowX:"hidden"}}>

//       {/* ── NAV ──────────────────────────────────────────────────── */}
//       <nav style={{
//         position:"fixed",top:0,left:0,right:0,zIndex:100,
//         background:scrolled?"rgba(255,255,255,0.97)":"transparent",
//         backdropFilter:scrolled?"blur(12px)":"none",
//         boxShadow:scrolled?"0 2px 24px rgba(0,0,0,0.08)":"none",
//         transition:"all 0.4s ease",padding:"0 5%"
//       }}>
//         <div className="landing-nav-inner" style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>

//           {/* Logo */}
//           <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>scroll("home")}>
//             <div style={{
//               width:42,height:42,borderRadius:12,
//               background:"linear-gradient(135deg,#1a7a52,#2ea86e)",
//               display:"flex",alignItems:"center",justifyContent:"center",
//               fontSize:20,boxShadow:"0 4px 14px rgba(26,122,82,0.35)"
//             }}>🌿</div>
//             <span style={{fontSize:22,fontWeight:700,color:"#1a7a52",letterSpacing:-0.5}}>Kisavi</span>
//           </div>

//           {/* Desktop nav */}
//           <div style={{display:"flex",gap:6,alignItems:"center"}} className="desktop-nav">
//             {NAV_LINKS.map(l=>(
//               <button key={l} onClick={()=>scroll(sectionId(l))} style={{
//                 background:"none",border:"none",cursor:"pointer",padding:"6px 14px",
//                 borderRadius:20,fontSize:14,fontWeight:500,
//                 color:active===l?"#1a7a52":"#444",
//                 background:active===l?"#e8f5ee":"transparent",
//                 transition:"all 0.2s"
//               }}>{l}</button>
//             ))}
//           </div>

//           {/* CTA buttons */}
//           <div className="landing-nav-actions" style={{display:"flex",gap:8,alignItems:"center"}}>
//             <Link href="/customer" className="nav-login" style={{
//               background:"none",border:"1.5px solid #1a7a52",color:"#1a7a52",
//               padding:"7px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,
//               transition:"all 0.2s",textDecoration:"none"
//             }}>Login</Link>
//             <Link href="/customer" className="nav-signup" style={{
//               background:"linear-gradient(135deg,#1a7a52,#2ea86e)",color:"#fff",border:"none",
//               padding:"8px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,
//               boxShadow:"0 4px 14px rgba(26,122,82,0.3)",transition:"all 0.25s",textDecoration:"none"
//             }}>Sign Up</Link>
//             <Link href="/verification" className="nav-apply" style={{
//               background:"#fff3e0",color:"#e65100",border:"none",
//               padding:"8px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,
//               transition:"all 0.25s",textDecoration:"none"
//             }}>Apply</Link>

//             {/* Hamburger */}
//             <button onClick={()=>setMenu(!menu)} style={{
//               background:"none",border:"none",cursor:"pointer",padding:6,
//               display:"none",fontSize:22,color:"#333"
//             }} className="ham-btn">☰</button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {menu&&(
//           <div style={{
//             background:"#fff",borderTop:"1px solid #eee",padding:"12px 5%",
//             display:"flex",flexDirection:"column",gap:4
//           }}>
//             <Link href="/customer?mode=login" className="mobile-login-link" onClick={()=>setMenu(false)}>Login</Link>
//             {NAV_LINKS.map(l=>(
//               <button key={l} onClick={()=>scroll(sectionId(l))} style={{
//                 background:"none",border:"none",cursor:"pointer",padding:"10px 12px",
//                 borderRadius:10,fontSize:15,fontWeight:500,color:"#333",textAlign:"left",
//                 transition:"background 0.2s"
//               }}
//                 onMouseEnter={e=>e.target.style.background="#e8f5ee"}
//                 onMouseLeave={e=>e.target.style.background="none"}
//               >{l}</button>
//             ))}
//           </div>
//         )}
//       </nav>

//       {/* ── HERO ──────────────────────────────────────────────────── */}
//       <section id="home" className="landing-section landing-hero" style={{
//         minHeight:"100vh",display:"flex",alignItems:"center",
//         background:"linear-gradient(160deg,#f0faf5 0%,#e8f5ee 40%,#fff 100%)",
//         paddingTop:80,position:"relative",overflow:"hidden"
//       }}>
//         {/* Decorative circles */}
//         <div style={{position:"absolute",top:-60,right:-60,width:400,height:400,borderRadius:"50%",background:"rgba(46,168,110,0.07)"}}/>
//         <div style={{position:"absolute",bottom:-80,left:-80,width:300,height:300,borderRadius:"50%",background:"rgba(26,122,82,0.05)"}}/>

//         <div className="hero-content" style={{maxWidth:1200,margin:"0 auto",padding:"60px 5%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center",width:"100%"}}>
//           <div>
//             <div style={{
//               display:"inline-flex",alignItems:"center",gap:8,
//               background:"#e8f5ee",border:"1px solid #b2dfcb",
//               borderRadius:20,padding:"6px 16px",marginBottom:24
//             }}>
//               <span style={{fontSize:14,color:"#1a7a52",fontWeight:600}}>🌱 Farm to Home Delivery</span>
//             </div>
//             <h1 style={{fontSize:"clamp(36px,5vw,58px)",fontWeight:800,lineHeight:1.1,marginBottom:20,color:"#0f2d1e"}}>
//               Fresh from the<br/>
//               <span style={{color:"#1a7a52"}}>farm</span> to your<br/>
//               <span style={{color:"#2ea86e"}}>kitchen</span>
//             </h1>
//             <p style={{fontSize:18,color:"#444",lineHeight:1.7,marginBottom:32,maxWidth:480}}>
//               Kisavi connects local farmers directly with households — no middlemen, no cold storage. 
//               Fresh vegetables and fruits delivered to your door in <strong>2 hours</strong>.
//             </p>
//             <div className="hero-actions" style={{display:"flex",gap:14,flexWrap:"wrap"}}>
//               <Link href="/customer" style={{
//                 background:"linear-gradient(135deg,#1a7a52,#2ea86e)",color:"#fff",border:"none",
//                 padding:"14px 32px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
//                 boxShadow:"0 6px 24px rgba(26,122,82,0.35)",transition:"all 0.3s",textDecoration:"none"
//               }}>Order Fresh Now 🛒</Link>
//               <Link href="/verification/farmer" style={{
//                 background:"#fff",color:"#1a7a52",border:"2px solid #1a7a52",
//                 padding:"14px 32px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
//                 transition:"all 0.3s",textDecoration:"none"
//               }}>Join as Farmer 🌾</Link>
//             </div>
//             <div className="hero-stats" style={{display:"flex",gap:28,marginTop:36}}>
//               {[["500+","Happy Customers"],["50+","Partner Farmers"],["2 hrs","Delivery Time"]].map(([n,l])=>(
//                 <div key={l} style={{textAlign:"center"}}>
//                   <div style={{fontSize:24,fontWeight:800,color:"#1a7a52"}}>{n}</div>
//                   <div style={{fontSize:12,color:"#777",fontWeight:500}}>{l}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Hero visual */}
//           <div className="hero-visual" style={{display:"flex",justifyContent:"center",position:"relative"}}>
//             <div style={{
//               width:340,height:340,borderRadius:"50%",
//               background:"linear-gradient(135deg,#1a7a52,#2ea86e)",
//               display:"flex",alignItems:"center",justifyContent:"center",
//               fontSize:140,boxShadow:"0 20px 60px rgba(26,122,82,0.25)",
//               animation:"float 3s ease-in-out infinite"
//             }} className="hero-produce">🥬</div>
//             {/* Floating badges */}
//             {[
//               {emoji:"🍅",label:"Fresh Tomatoes",top:"5%",left:"-5%",bg:"#fff5f5",border:"#ffcdd2"},
//               {emoji:"🥕",label:"Organic Carrots",top:"5%",right:"-5%",bg:"#fff8e1",border:"#ffe082"},
//               {emoji:"🫛",label:"Garden Peas",bottom:"10%",left:"0%",bg:"#f3e5f5",border:"#ce93d8"},
//               {emoji:"🌽",label:"Farm Corn",bottom:"10%",right:"0%",bg:"#e8f5e9",border:"#a5d6a7"},
//             ].map((b,i)=>(
//               <div key={i} className="hero-badge" style={{
//                 position:"absolute",top:b.top,bottom:b.bottom,left:b.left,right:b.right,
//                 background:b.bg,border:`1.5px solid ${b.border}`,
//                 borderRadius:16,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,
//                 boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
//                 animation:`float ${3+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.5}s`
//               }}>
//                 <span style={{fontSize:22}}>{b.emoji}</span>
//                 <span style={{fontSize:12,fontWeight:600,color:"#333"}}>{b.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── ABOUT ─────────────────────────────────────────────────── */}
//       <section id="about" className="landing-section" style={{padding:"100px 5%",background:"#fff"}}>
//         <div style={{maxWidth:1200,margin:"0 auto"}}>
//           <AnimSection style={{textAlign:"center",marginBottom:60}}>
//             <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>About Kisavi</span>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
//               Built for farmers.<br/>Designed for families.
//             </h2>
//           </AnimSection>

//           <div className="about-layout" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
//             <AnimSection delay={0.1}>
//               <div style={{fontSize:80,marginBottom:20}}>👨‍🌾</div>
//               <p style={{fontSize:16,lineHeight:1.8,color:"#444",marginBottom:20}}>
//                 Kisavi was born from a simple observation — farmers in Andhra Pradesh sell tomatoes 
//                 for <strong>Rs. 40/kg</strong>, but by the time they reach you, you pay <strong>Rs. 80/kg</strong>. 
//                 The difference goes to middlemen who add no real value.
//               </p>
//               <p style={{fontSize:16,lineHeight:1.8,color:"#444",marginBottom:20}}>
//                 We built Kisavi to fix this. Our platform directly connects farmers with households, 
//                 cutting out every unnecessary layer. Farmers earn more. You pay less. And you always 
//                 know exactly which farm your food came from.
//               </p>
//               <div style={{
//                 background:"#e8f5ee",borderRadius:16,padding:20,borderLeft:"4px solid #1a7a52"
//               }}>
//                 <p style={{margin:0,fontStyle:"italic",color:"#1a7a52",fontWeight:600,fontSize:15}}>
//                   "From the farm to your family — no middlemen, just freshness."
//                 </p>
//               </div>
//             </AnimSection>

//             <AnimSection delay={0.2}>
//               <div className="about-features" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
//                 {[
//                   {icon:"🌾",title:"Farmer First",desc:"Farmers set their own prices and earn 15-20% more per kg"},
//                   {icon:"🏠",title:"Home Fresh",desc:"Picked this morning, delivered to your door in 2 hours"},
//                   {icon:"💚",title:"No Middlemen",desc:"Direct connection eliminates agents, wholesalers and retailers"},
//                   {icon:"📱",title:"Tech Powered",desc:"Real-time tracking, WhatsApp alerts, and seamless payments"},
//                 ].map((c,i)=>(
//                   <div key={i} style={{
//                     background:"#f8fffe",border:"1.5px solid #e0f0e8",borderRadius:16,
//                     padding:20,transition:"all 0.3s",cursor:"default"
//                   }}
//                     onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(26,122,82,0.12)"}}
//                     onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}
//                   >
//                     <div style={{fontSize:32,marginBottom:10}}>{c.icon}</div>
//                     <div style={{fontWeight:700,fontSize:15,marginBottom:6,color:"#0f2d1e"}}>{c.title}</div>
//                     <div style={{fontSize:13,color:"#666",lineHeight:1.6}}>{c.desc}</div>
//                   </div>
//                 ))}
//               </div>
//             </AnimSection>
//           </div>
//         </div>
//       </section>

//       {/* ── WHAT WE ARE ──────────────────────────────────────────── */}
//       {/* <section id="what-we-are" className="landing-section" style={{padding:"100px 5%",background:"linear-gradient(160deg,#f0faf5,#e8f5ee)"}}>
//         <div style={{maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
//           <AnimSection>
//             <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>Who We Are</span>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
//               A team of 3 — built from passion
//             </h2>
//             <p style={{fontSize:16,color:"#555",maxWidth:600,margin:"16px auto 50px",lineHeight:1.7}}>
//               Three co-founders who saw a problem, built a solution, and are now bringing it to life 
//               for farmers and families across Andhra Pradesh.
//             </p>
//           </AnimSection>

//           <div className="team-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
//             {[
//               {emoji:"👨‍💻",name:"Aravind",role:"Co-Founder & CEO",tag:"Technology Lead",
//                desc:"Built the entire Kisavi platform from scratch — payments, GPS tracking, WhatsApp notifications, and the admin dashboard.",
//                color:"#e8f5ee",border:"#b2dfcb",accent:"#1a7a52"},
//               {emoji:"👩‍💼",name:"Mamatha",role:"Co-Founder",tag:"Field & Communications",
//                desc:"Handles all farmer onboarding, training, and relationship management. Deep community roots ensure strong supply-side growth.",
//                color:"#fff8e1",border:"#ffe082",accent:"#f57f17"},
//               {emoji:"📱",name:"Manipal",role:"Co-Founder",tag:"Marketing Lead",
//                desc:"Experienced in growth marketing, social media, and customer acquisition strategies for Tier-2 city markets.",
//                color:"#f3e5f5",border:"#ce93d8",accent:"#7b1fa2"},
//             ].map((m,i)=>(
//               <AnimSection key={i} delay={i*0.15}>
//                 <div style={{
//                   background:"#fff",borderRadius:24,padding:32,
//                   border:`2px solid ${m.border}`,transition:"all 0.3s",cursor:"default",
//                   boxShadow:"0 2px 12px rgba(0,0,0,0.06)"
//                 }}
//                   onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.12)`}}
//                   onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.06)"}}
//                 >
//                   <div style={{
//                     width:72,height:72,borderRadius:20,background:m.color,
//                     display:"flex",alignItems:"center",justifyContent:"center",
//                     fontSize:36,margin:"0 auto 16px",border:`1.5px solid ${m.border}`
//                   }}>{m.emoji}</div>
//                   <h3 style={{fontSize:20,fontWeight:800,margin:"0 0 4px",color:"#0f2d1e"}}>{m.name}</h3>
//                   <div style={{fontSize:13,color:m.accent,fontWeight:700,marginBottom:8}}>{m.role}</div>
//                   <div style={{
//                     display:"inline-block",background:m.color,color:m.accent,
//                     fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,marginBottom:14
//                   }}>{m.tag}</div>
//                   <p style={{fontSize:13,color:"#666",lineHeight:1.7,margin:0}}>{m.desc}</p>
//                 </div>
//               </AnimSection>
//             ))}
//           </div>
//         </div>
//       </section> */}

//       {/* ── WHAT WE OFFER ─────────────────────────────────────────── */}
//       <section id="what-we-offer" className="landing-section" style={{padding:"100px 5%",background:"#fff"}}>
//         <div style={{maxWidth:1200,margin:"0 auto"}}>
//           <AnimSection style={{textAlign:"center",marginBottom:60}}>
//             <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>What We Offer</span>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
//               Everything fresh, nothing extra
//             </h2>
//           </AnimSection>

//           {/* Product cards */}
//           <div className="offer-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20,marginBottom:60}}>
//             {[
//               {emoji:"🥬",name:"Leafy Greens",desc:"Spinach, methi, palak — picked at dawn"},
//               {emoji:"🍅",name:"Vine Vegetables",desc:"Tomatoes, brinjal, capsicum — farm to door"},
//               {emoji:"🥕",name:"Root Vegetables",desc:"Carrots, beetroot, radish — straight from soil"},
//               {emoji:"🫛",name:"Legumes & Beans",desc:"Cluster beans, flat beans, fresh peas"},
//               {emoji:"🌽",name:"Seasonal Produce",desc:"What's in season, at its peak freshness"},
//               {emoji:"🌿",name:"Fresh Herbs",desc:"Coriander, curry leaves, mint — daily fresh"},
//             ].map((p,i)=>(
//               <AnimSection key={i} delay={i*0.08}>
//                 <div style={{
//                   background:"#f8fffe",border:"1.5px solid #e0f0e8",borderRadius:20,
//                   padding:24,textAlign:"center",transition:"all 0.3s",cursor:"default"
//                 }}
//                   onMouseEnter={e=>{
//                     e.currentTarget.style.background="#e8f5ee"
//                     e.currentTarget.style.transform="translateY(-6px) scale(1.02)"
//                     e.currentTarget.style.boxShadow="0 12px 32px rgba(26,122,82,0.15)"
//                   }}
//                   onMouseLeave={e=>{
//                     e.currentTarget.style.background="#f8fffe"
//                     e.currentTarget.style.transform="translateY(0) scale(1)"
//                     e.currentTarget.style.boxShadow="none"
//                   }}
//                 >
//                   <div style={{fontSize:48,marginBottom:12}}>{p.emoji}</div>
//                   <div style={{fontWeight:700,fontSize:15,color:"#0f2d1e",marginBottom:6}}>{p.name}</div>
//                   <div style={{fontSize:12,color:"#777",lineHeight:1.5}}>{p.desc}</div>
//                 </div>
//               </AnimSection>
//             ))}
//           </div>

//           {/* How it works */}
//           <AnimSection>
//             <h3 style={{textAlign:"center",fontSize:28,fontWeight:800,color:"#0f2d1e",marginBottom:40}}>How it works</h3>
//           </AnimSection>
//           <div className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,position:"relative"}}>
//             <div className="steps-line" style={{
//               position:"absolute",top:40,left:"12.5%",right:"12.5%",height:2,
//               background:"linear-gradient(90deg,#1a7a52,#2ea86e)",zIndex:0
//             }}/>
//             {[
//               {num:1,icon:"🛒",title:"Browse farms",desc:"See local farmers near you with today's fresh stock"},
//               {num:2,icon:"📱",title:"Place order",desc:"Add items to cart, pay via UPI or card securely"},
//               {num:3,icon:"🛵",title:"Rider picks up",desc:"Our partner collects directly from the farm"},
//               {num:4,icon:"🏠",title:"Delivered fresh",desc:"Fresh vegetables at your door in under 2 hours"},
//             ].map((s,i)=>(
//               <AnimSection key={i} delay={i*0.1} style={{textAlign:"center",position:"relative",zIndex:1}}>
//                 <div style={{
//                   width:72,height:72,borderRadius:"50%",
//                   background:"linear-gradient(135deg,#1a7a52,#2ea86e)",
//                   display:"flex",alignItems:"center",justifyContent:"center",
//                   fontSize:28,margin:"0 auto 16px",
//                   boxShadow:"0 6px 20px rgba(26,122,82,0.3)",border:"4px solid #fff"
//                 }}>{s.icon}</div>
//                 <div style={{
//                   position:"absolute",top:0,left:"50%",transform:"translate(-50%,-8px)",
//                   background:"#0f2d1e",color:"#fff",fontSize:11,fontWeight:700,
//                   width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"
//                 }}>{s.num}</div>
//                 <div style={{fontWeight:700,fontSize:15,color:"#0f2d1e",marginBottom:6}}>{s.title}</div>
//                 <div style={{fontSize:13,color:"#666",lineHeight:1.6,maxWidth:140,margin:"0 auto"}}>{s.desc}</div>
//               </AnimSection>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── HOW IT WORKS / MATH ───────────────────────────────────── */}
//       <section id="how-it-works" className="landing-section" style={{padding:"100px 5%",background:"linear-gradient(160deg,#0f2d1e,#1a7a52)"}}>
//         <div style={{maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
//           <AnimSection>
//             <span style={{color:"#a5d6a7",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>The Kisavi Difference</span>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#fff",marginBottom:16}}>
//               Farmer earns more. You pay less.
//             </h2>
//             <p style={{color:"#b2dfcb",fontSize:16,maxWidth:560,margin:"0 auto 50px",lineHeight:1.7}}>
//               Here's the math that makes Kisavi different from every other grocery platform.
//             </p>
//           </AnimSection>

//           <div className="comparison-grid" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:24,alignItems:"center",maxWidth:900,margin:"0 auto"}}>
//             {/* Old system */}
//             <AnimSection delay={0.1}>
//               <div style={{background:"rgba(255,255,255,0.08)",borderRadius:20,padding:28,border:"1px solid rgba(255,255,255,0.15)"}}>
//                 <div style={{color:"#ff8a80",fontWeight:700,marginBottom:16,fontSize:15}}>❌ Old System</div>
//                 {[
//                   ["Farmer earns","Rs. 60/kg"],
//                   ["Agent cuts","Rs. 10"],
//                   ["Wholesaler cuts","Rs. 10"],
//                   ["Retailer cuts","Rs. 10"],
//                   ["You pay","Rs. 80/kg"],
//                 ].map(([l,v])=>(
//                   <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
//                     <span style={{color:"#ccc",fontSize:14}}>{l}</span>
//                     <span style={{color:"#fff",fontWeight:700,fontSize:14}}>{v}</span>
//                   </div>
//                 ))}
//               </div>
//             </AnimSection>

//             <div className="comparison-arrow" style={{fontSize:32}}>→</div>

//             {/* Kisavi system */}
//             <AnimSection delay={0.2}>
//               <div style={{background:"rgba(255,255,255,0.12)",borderRadius:20,padding:28,border:"1.5px solid rgba(165,214,167,0.4)"}}>
//                 <div style={{color:"#a5d6a7",fontWeight:700,marginBottom:16,fontSize:15}}>✅ Kisavi System</div>
//                 {[
//                   ["Farmer earns","Rs. 66.50/kg","#a5d6a7"],
//                   ["Kisavi fee (5%)","Rs. 3.50","#fff"],
//                   ["Rider fee","Rs. 5-25","#fff"],
//                   ["Middlemen","Rs. 0 ✓","#a5d6a7"],
//                   ["You pay","Rs. 70-75/kg","#a5d6a7"],
//                 ].map(([l,v,c])=>(
//                   <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
//                     <span style={{color:"#ccc",fontSize:14}}>{l}</span>
//                     <span style={{color:c,fontWeight:700,fontSize:14}}>{v}</span>
//                   </div>
//                 ))}
//               </div>
//             </AnimSection>
//           </div>

//           <AnimSection delay={0.3}>
//             <div style={{display:"flex",justifyContent:"center",gap:32,marginTop:50,flexWrap:"wrap"}}>
//               {[
//                 {label:"Farmer earns more",value:"Rs. 6.50 extra per kg"},
//                 {label:"Customer saves",value:"Rs. 5-10 per kg"},
//                 {label:"Rider keeps",value:"100% of delivery fee"},
//               ].map((s,i)=>(
//                 <div key={i} style={{
//                   background:"rgba(255,255,255,0.1)",borderRadius:16,padding:"18px 28px",
//                   border:"1px solid rgba(255,255,255,0.15)",textAlign:"center"
//                 }}>
//                   <div style={{color:"#fff",fontWeight:800,fontSize:18,marginBottom:4}}>{s.value}</div>
//                   <div style={{color:"#b2dfcb",fontSize:13}}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </AnimSection>
//         </div>
//       </section>

//       {/* ── FUTURE PLANS ─────────────────────────────────────────── */}
//       <section id="future-plans" className="landing-section" style={{padding:"100px 5%",background:"#fff"}}>
//         <div style={{maxWidth:1200,margin:"0 auto"}}>
//           <AnimSection style={{textAlign:"center",marginBottom:60}}>
//             <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>Future Plans</span>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
//               We are just getting started
//             </h2>
//             <p style={{fontSize:16,color:"#555",maxWidth:580,margin:"16px auto 0",lineHeight:1.7}}>
//               Our vision goes beyond delivery. Kisavi will become the backbone of 
//               agricultural transformation in Andhra Pradesh.
//             </p>
//           </AnimSection>

//           <div className="roadmap-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:40}}>
//             {[
//               {phase:"Phase 1",time:"Now",icon:"🚀",title:"Launch & Grow",
//                items:["Launch in first target city","Onboard 50+ farmers","500+ active customers","60 orders per day"]},
//               {phase:"Phase 2",time:"Month 6",icon:"🏙️",title:"City Expansion",
//                items:["Expand to 3-4 AP cities","200+ farmer network","Mobile app (iOS + Android)","B2B supply to restaurants"]},
//               {phase:"Phase 3",time:"Year 1",icon:"🌱",title:"Invest in Farming",
//                items:[
//                  "Fund farming equipment for partner farmers",
//                  "Invest in farmers who sell through Kisavi",
//                  "Provide seeds, tools and infrastructure support",
//                  "Profit sharing with farmers who tie up long-term"
//                ],highlight:true},
//               {phase:"Phase 4",time:"Year 2",icon:"🇮🇳",title:"Pan-India Scale",
//                items:["Expand to 5 states","50,000+ households served","Series A fundraise","Cold chain infrastructure"]},
//             ].map((p,i)=>(
//               <AnimSection key={i} delay={i*0.1}>
//                 <div style={{
//                   borderRadius:20,padding:28,height:"100%",
//                   background:p.highlight?"linear-gradient(135deg,#e8f5ee,#f0faf5)":"#f8fffe",
//                   border:p.highlight?"2px solid #1a7a52":"1.5px solid #e0f0e8",
//                   transition:"all 0.3s",cursor:"default",boxSizing:"border-box"
//                 }}
//                   onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(26,122,82,0.12)"}}
//                   onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}
//                 >
//                   <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
//                     <div>
//                       <span style={{
//                         background:p.highlight?"#1a7a52":"#e8f5ee",
//                         color:p.highlight?"#fff":"#1a7a52",
//                         fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20
//                       }}>{p.phase}</span>
//                       <span style={{fontSize:11,color:"#999",marginLeft:8}}>{p.time}</span>
//                     </div>
//                     <span style={{fontSize:28}}>{p.icon}</span>
//                   </div>
//                   <h3 style={{fontSize:20,fontWeight:800,color:"#0f2d1e",marginBottom:14}}>{p.title}</h3>
//                   {p.highlight&&(
//                     <div style={{
//                       background:"#1a7a52",color:"#fff",borderRadius:10,padding:"8px 14px",
//                       fontSize:12,fontWeight:600,marginBottom:14
//                     }}>
//                       🌾 We invest in our farmers — not just sell through them
//                     </div>
//                   )}
//                   <ul style={{margin:0,padding:0,listStyle:"none"}}>
//                     {p.items.map((item,j)=>(
//                       <li key={j} style={{
//                         fontSize:14,color:"#555",lineHeight:1.6,
//                         padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,0.05)",
//                         display:"flex",alignItems:"flex-start",gap:8
//                       }}>
//                         <span style={{color:"#1a7a52",fontWeight:700,marginTop:1}}>→</span>{item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </AnimSection>
//             ))}
//           </div>

//           {/* Farmer investment highlight */}
//           <AnimSection delay={0.2}>
//             <div className="investment-highlight" style={{
//               background:"linear-gradient(135deg,#0f2d1e,#1a7a52)",
//               borderRadius:24,padding:40,textAlign:"center",
//               boxShadow:"0 16px 48px rgba(26,122,82,0.25)"
//             }}>
//               <div style={{fontSize:48,marginBottom:16}}>🌾💰</div>
//               <h3 style={{fontSize:26,fontWeight:800,color:"#fff",marginBottom:12}}>
//                 We invest in our partner farmers
//               </h3>
//               <p style={{color:"#b2dfcb",fontSize:15,maxWidth:600,margin:"0 auto 24px",lineHeight:1.7}}>
//                 Farmers who sell through Kisavi are not just suppliers — they are partners. 
//                 We plan to invest in their farming equipment, seeds, and infrastructure. 
//                 When farmers grow, Kisavi grows. When Kisavi grows, farmers grow.
//               </p>
//               <div style={{display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap"}}>
//                 {[
//                   ["Equipment Support","Farming tools funded"],
//                   ["Seed Investment","Quality inputs provided"],
//                   ["Profit Sharing","Long-term tie-up farmers share profits"],
//                 ].map(([t,d])=>(
//                   <div key={t} style={{
//                     background:"rgba(255,255,255,0.12)",borderRadius:14,padding:"14px 20px",
//                     border:"1px solid rgba(255,255,255,0.2)"
//                   }}>
//                     <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{t}</div>
//                     <div style={{color:"#a5d6a7",fontSize:12,marginTop:4}}>{d}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </AnimSection>
//         </div>
//       </section>

//       {/* ── CTA ───────────────────────────────────────────────────── */}
//       <section id="contact" className="landing-section" style={{padding:"100px 5%",background:"linear-gradient(160deg,#f0faf5,#e8f5ee)"}}>
//         <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
//           <AnimSection>
//             <div style={{fontSize:56,marginBottom:16}}>🌿</div>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,color:"#0f2d1e",marginBottom:16}}>
//               Ready to join Kisavi?
//             </h2>
//             <p style={{fontSize:16,color:"#555",lineHeight:1.7,marginBottom:40,maxWidth:500,margin:"0 auto 40px"}}>
//               Whether you are a customer who wants farm-fresh vegetables or a farmer 
//               who wants to earn more — Kisavi is built for you.
//             </p>
//             <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:50}}>
//               <Link href="/customer" style={{
//                 background:"linear-gradient(135deg,#1a7a52,#2ea86e)",color:"#fff",border:"none",
//                 padding:"16px 36px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
//                 boxShadow:"0 6px 24px rgba(26,122,82,0.35)",transition:"all 0.3s",textDecoration:"none"
//               }}>Start Ordering 🛒</Link>
//               <Link href="/verification/farmer" style={{
//                 background:"#fff3e0",color:"#e65100",border:"2px solid #ffb74d",
//                 padding:"16px 36px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
//                 transition:"all 0.3s",textDecoration:"none"
//               }}>Register as Farmer 🌾</Link>
//             </div>

//             <div className="contact-panel" style={{
//               background:"#fff",borderRadius:20,padding:28,
//               border:"1.5px solid #e0f0e8",display:"inline-block",textAlign:"left",
//               boxShadow:"0 4px 20px rgba(26,122,82,0.08)"
//             }}>
//               <div style={{fontSize:14,color:"#1a7a52",fontWeight:700,marginBottom:12,textAlign:"center"}}>Get in Touch</div>
//               <div style={{display:"flex",flexDirection:"column",gap:10}}>
//                 {[
//                   {icon:"📧",label:"Email",val:"kisaviofficial@gmail.com"},
//                   {icon:"📱",label:"WhatsApp",val:"+91 7075330899"},
//                   {icon:"📍",label:"Location",val:"hyderabad, India"},
//                 ].map(({icon,label,val})=>(
//                   <div key={label} style={{display:"flex",alignItems:"center",gap:10,fontSize:14}}>
//                     <span style={{fontSize:18}}>{icon}</span>
//                     <span style={{color:"#999",minWidth:70}}>{label}:</span>
//                     <span style={{color:"#1a7a52",fontWeight:600}}>{val}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </AnimSection>
//         </div>
//       </section>

//       {/* ── FOOTER ────────────────────────────────────────────────── */}
//       <footer style={{background:"#0f2d1e",padding:"40px 5%",textAlign:"center"}}>
//         <div style={{maxWidth:1200,margin:"0 auto"}}>
//           <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:20}}>
//             <div style={{
//               width:36,height:36,borderRadius:10,
//               background:"linear-gradient(135deg,#1a7a52,#2ea86e)",
//               display:"flex",alignItems:"center",justifyContent:"center",fontSize:18
//             }}>🌿</div>
//             <span style={{fontSize:20,fontWeight:700,color:"#fff"}}>Kisavi</span>
//           </div>
//           <p style={{color:"#5a8a6a",fontSize:13,marginBottom:16}}>
//             Farm-to-Home Vegetable Delivery · Andhra Pradesh, India · 2026
//           </p>
//           <p style={{color:"#3a6a4a",fontSize:12}}>
//             "From the farm to your family — no middlemen, just freshness."
//           </p>
//         </div>
//       </footer>

//     </div>
//   )
// }

// "use client"

// import { useState, useEffect, useRef } from "react"
// import Link from "next/link"

// const NAV_LINKS = ["Home","About","What We Offer","How It Works","Future Plans","Contact"]

// // Real photos — hero is your uploaded image (save it to /public/images/farmer-hero.jpg).
// // The rest are free-license Unsplash photos. Swap any URL if it ever breaks.
// const IMG = {
//   hero:   "/images/farmer-bg.png",
//   about:  "https://images.unsplash.com/photo-1671769195087-58336aa02943?auto=format&fit=crop&w=1200&q=80", // Telangana farmland
//   leafy:  "https://images.unsplash.com/photo-1708795300912-fa5ebd3e7977?auto=format&fit=crop&w=800&q=80",  // leafy greens close-up
//   tomato: "https://images.unsplash.com/photo-1513791053024-3b50799fdd7b?auto=format&fit=crop&w=800&q=80",  // vine tomatoes
//   leeks:  "https://images.unsplash.com/photo-1760108273146-c1ad5f5bce30?auto=format&fit=crop&w=800&q=80",  // root veg / leeks
//   basket: "https://images.unsplash.com/photo-1635774855717-0aec182f92cc?auto=format&fit=crop&w=800&q=80",  // mixed veg basket
//   fields: "https://images.unsplash.com/photo-1765260905999-06612390fb07?auto=format&fit=crop&w=1200&q=80", // green Indian farmland
// }

// function useInView(threshold=0.15){
//   const ref=useRef(null)
//   const [vis,setVis]=useState(false)
//   useEffect(()=>{
//     const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold})
//     if(ref.current)obs.observe(ref.current)
//     return()=>obs.disconnect()
//   },[threshold])
//   return[ref,vis]
// }

// function AnimSection({children,className="",delay=0,style={}}){
//   const[ref,vis]=useInView()
//   return(
//     <div ref={ref} className={className} style={{
//       ...style,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(40px)",
//       transition:`opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
//     }}>{children}</div>
//   )
// }

// export default function KisaviLanding(){
//   const[menu,setMenu]=useState(false)
//   const[scrolled,setScrolled]=useState(false)
//   const[active,setActive]=useState("Home")

//   useEffect(()=>{
//     const h=()=>setScrolled(window.scrollY>40)
//     window.addEventListener("scroll",h)
//     return()=>window.removeEventListener("scroll",h)
//   },[])

//   const scroll=(id)=>{
//     if(id==="verification"){
//       window.location.href="/verification"
//       return
//     }
//     const el=document.getElementById(id)
//     if(el){el.scrollIntoView({behavior:"smooth"});setMenu(false);setActive(id)}
//   }

//   const sectionId=(label)=>label.toLowerCase().replace(/\s+/g,"-")

//   const OFFERS = [
//     {img:IMG.leafy,  name:"Leafy Greens",     desc:"Spinach, methi, palak — picked at dawn"},
//     {img:IMG.tomato, name:"Vine Vegetables",  desc:"Tomatoes, brinjal, capsicum — farm to door"},
//     {img:IMG.leeks,  name:"Root Vegetables",  desc:"Carrots, beetroot, radish — straight from soil"},
//     {img:IMG.basket, name:"Legumes & Beans",  desc:"Cluster beans, flat beans, fresh peas"},
//     {img:IMG.fields, name:"Seasonal Produce", desc:"What's in season, at its peak freshness"},
//     {img:IMG.leafy,  name:"Fresh Herbs",      desc:"Coriander, curry leaves, mint — daily fresh"},
//   ]

//   return(
//     <div className="kisavi-landing" style={{fontFamily:"'Segoe UI',sans-serif",color:"#1a1a1a",background:"#fff",overflowX:"hidden"}}>

//       {/* ── NAV ──────────────────────────────────────────────────── */}
//       <nav style={{
//         position:"fixed",top:0,left:0,right:0,zIndex:100,
//         background:scrolled?"rgba(255,255,255,0.97)":"rgba(15,45,30,0.15)",
//         backdropFilter:"blur(12px)",
//         boxShadow:scrolled?"0 2px 24px rgba(0,0,0,0.08)":"none",
//         transition:"all 0.4s ease",padding:"0 5%"
//       }}>
//         <div className="landing-nav-inner" style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>

//           {/* Logo */}
//           <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>scroll("home")}>
//             <div style={{
//               width:42,height:42,borderRadius:12,
//               background:"linear-gradient(135deg,#1a7a52,#2ea86e)",
//               display:"flex",alignItems:"center",justifyContent:"center",
//               fontSize:20,boxShadow:"0 4px 14px rgba(26,122,82,0.35)"
//             }}>🌿</div>
//             <span style={{fontSize:22,fontWeight:700,color:scrolled?"#1a7a52":"#fff",letterSpacing:-0.5,transition:"color 0.4s"}}>Kisavi</span>
//           </div>

//           {/* Desktop nav */}
//           <div style={{display:"flex",gap:6,alignItems:"center"}} className="desktop-nav">
//             {NAV_LINKS.map(l=>{
//               const isActive = active===l
//               return (
//                 <button key={l} onClick={()=>scroll(sectionId(l))} style={{
//                   background:isActive?"#e8f5ee":"transparent",
//                   border:"none",cursor:"pointer",padding:"6px 14px",
//                   borderRadius:20,fontSize:14,fontWeight:500,
//                   color:isActive?"#1a7a52":(scrolled?"#444":"#eafaf0"),
//                   transition:"all 0.2s"
//                 }}>{l}</button>
//               )
//             })}
//           </div>

//           {/* CTA buttons */}
//           <div className="landing-nav-actions" style={{display:"flex",gap:8,alignItems:"center"}}>
//             <Link href="/customer" className="nav-login" style={{
//               background:"none",border:`1.5px solid ${scrolled?"#1a7a52":"#fff"}`,color:scrolled?"#1a7a52":"#fff",
//               padding:"7px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,
//               transition:"all 0.2s",textDecoration:"none"
//             }}>Login</Link>
//             <Link href="/customer" className="nav-signup" style={{
//               background:"linear-gradient(135deg,#1a7a52,#2ea86e)",color:"#fff",border:"none",
//               padding:"8px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,
//               boxShadow:"0 4px 14px rgba(26,122,82,0.3)",transition:"all 0.25s",textDecoration:"none"
//             }}>Sign Up</Link>
//             <Link href="/verification" className="nav-apply" style={{
//               background:"#fff3e0",color:"#e65100",border:"none",
//               padding:"8px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,
//               transition:"all 0.25s",textDecoration:"none"
//             }}>Apply</Link>

//             {/* Hamburger */}
//             <button onClick={()=>setMenu(!menu)} style={{
//               background:"none",border:"none",cursor:"pointer",padding:6,
//               display:"none",fontSize:22,color:scrolled?"#333":"#fff"
//             }} className="ham-btn">☰</button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {menu&&(
//           <div style={{
//             background:"#fff",borderTop:"1px solid #eee",padding:"12px 5%",
//             display:"flex",flexDirection:"column",gap:4
//           }}>
//             <Link href="/customer?mode=login" className="mobile-login-link" onClick={()=>setMenu(false)}>Login</Link>
//             {NAV_LINKS.map(l=>(
//               <button key={l} onClick={()=>scroll(sectionId(l))} style={{
//                 background:"none",border:"none",cursor:"pointer",padding:"10px 12px",
//                 borderRadius:10,fontSize:15,fontWeight:500,color:"#333",textAlign:"left",
//                 transition:"background 0.2s"
//               }}
//                 onMouseEnter={e=>e.target.style.background="#e8f5ee"}
//                 onMouseLeave={e=>e.target.style.background="none"}
//               >{l}</button>
//             ))}
//           </div>
//         )}
//       </nav>

//       {/* ── HERO ── real farmer photo, full-bleed background ───────── */}
//       <section id="home" className="landing-section landing-hero" style={{
//         minHeight:"100vh",display:"flex",alignItems:"center",
//         background:`linear-gradient(105deg, rgba(9,28,18,0.92) 0%, rgba(9,28,18,0.72) 38%, rgba(9,28,18,0.35) 65%, rgba(9,28,18,0.15) 100%), url(${IMG.hero})`,
//         backgroundSize:"cover",backgroundPosition:"center",
//         paddingTop:80,position:"relative",overflow:"hidden",color:"#fff"
//       }}>
//         <div className="hero-content" style={{maxWidth:1200,margin:"0 auto",padding:"60px 5%",width:"100%"}}>
//           <div style={{maxWidth:620}}>
//             <div style={{
//               display:"inline-flex",alignItems:"center",gap:8,
//               background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.35)",
//               backdropFilter:"blur(6px)",
//               borderRadius:20,padding:"6px 16px",marginBottom:24
//             }}>
//               <span style={{width:8,height:8,borderRadius:"50%",background:"#2ea86e",display:"inline-block",boxShadow:"0 0 0 4px rgba(46,168,110,0.25)"}}/>
//               <span style={{fontSize:14,color:"#eafaf0",fontWeight:600}}>Live Farm-to-Home Network</span>
//             </div>
//             <h1 style={{fontSize:"clamp(36px,5vw,58px)",fontWeight:800,lineHeight:1.1,marginBottom:20,color:"#fff"}}>
//               Fresh from the<br/>
//               <span style={{color:"#7fd9a5"}}>farm</span> to your<br/>
//               <span style={{color:"#a8e6c1"}}>kitchen</span>
//             </h1>
//             <p style={{fontSize:18,color:"#e2f2e8",lineHeight:1.7,marginBottom:32,maxWidth:480}}>
//               Kisavi connects local farmers directly with households — no middlemen, no cold storage.
//               Fresh vegetables and fruits delivered to your door in <strong>2 hours</strong>.
//             </p>
//             <div className="hero-actions" style={{display:"flex",gap:14,flexWrap:"wrap"}}>
//               <Link href="/customer" style={{
//                 background:"linear-gradient(135deg,#1a7a52,#2ea86e)",color:"#fff",border:"none",
//                 padding:"14px 32px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
//                 boxShadow:"0 6px 24px rgba(26,122,82,0.45)",transition:"all 0.3s",textDecoration:"none"
//               }}>Order Fresh Now 🛒</Link>
//               <Link href="/verification/farmer" style={{
//                 background:"rgba(255,255,255,0.08)",color:"#fff",border:"2px solid rgba(255,255,255,0.6)",
//                 backdropFilter:"blur(6px)",
//                 padding:"14px 32px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
//                 transition:"all 0.3s",textDecoration:"none"
//               }}>Join as Farmer 🌾</Link>
//             </div>
//             <div className="hero-stats" style={{display:"flex",gap:28,marginTop:40,flexWrap:"wrap"}}>
//               {[["500+","Happy Customers"],["50+","Partner Farmers"],["2 hrs","Delivery Time"]].map(([n,l])=>(
//                 <div key={l} style={{textAlign:"left"}}>
//                   <div style={{fontSize:26,fontWeight:800,color:"#fff"}}>{n}</div>
//                   <div style={{fontSize:12,color:"#c7e8d4",fontWeight:500}}>{l}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Floating info badges over the photo — bottom-right, PawMira-style */}
//         <div className="hero-badge-a" style={{
//           position:"absolute",right:"6%",bottom:"14%",
//           background:"rgba(15,45,30,0.55)",border:"1px solid rgba(255,255,255,0.25)",
//           backdropFilter:"blur(8px)",borderRadius:16,padding:"12px 18px",
//           display:"flex",alignItems:"center",gap:10,color:"#fff",
//           animation:"float 3.5s ease-in-out infinite"
//         }}>
//           <span style={{fontSize:20}}>🌾</span>
//           <div>
//             <div style={{fontSize:13,fontWeight:700}}>Fresh batch harvested</div>
//             <div style={{fontSize:11,color:"#c7e8d4"}}>This morning · Anakapalli</div>
//           </div>
//         </div>
//         <div className="hero-badge-b" style={{
//           position:"absolute",right:"8%",top:"22%",
//           background:"rgba(15,45,30,0.55)",border:"1px solid rgba(255,255,255,0.25)",
//           backdropFilter:"blur(8px)",borderRadius:16,padding:"12px 18px",
//           display:"flex",alignItems:"center",gap:10,color:"#fff",
//           animation:"float 4s ease-in-out infinite",animationDelay:"0.6s"
//         }}>
//           <span style={{fontSize:20}}>🛵</span>
//           <div>
//             <div style={{fontSize:13,fontWeight:700}}>Delivered in 2 hrs</div>
//             <div style={{fontSize:11,color:"#c7e8d4"}}>No cold storage needed</div>
//           </div>
//         </div>
//       </section>

//       {/* ── ABOUT ─────────────────────────────────────────────────── */}
//       <section id="about" className="landing-section" style={{padding:"100px 5%",background:"#fff"}}>
//         <div style={{maxWidth:1200,margin:"0 auto"}}>
//           <AnimSection style={{textAlign:"center",marginBottom:60}}>
//             <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>About Kisavi</span>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
//               Built for farmers.<br/>Designed for families.
//             </h2>
//           </AnimSection>

//           <div className="about-layout" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
//             <AnimSection delay={0.1}>
//               <div style={{
//                 borderRadius:24,overflow:"hidden",marginBottom:24,
//                 boxShadow:"0 20px 50px rgba(15,45,30,0.18)"
//               }}>
//                 <img src={IMG.about} alt="Andhra Pradesh farmland" style={{width:"100%",height:280,objectFit:"cover",display:"block"}}/>
//               </div>
//               <p style={{fontSize:16,lineHeight:1.8,color:"#444",marginBottom:20}}>
//                 Kisavi was born from a simple observation — farmers in Andhra Pradesh sell tomatoes
//                 for <strong>Rs. 40/kg</strong>, but by the time they reach you, you pay <strong>Rs. 80/kg</strong>.
//                 The difference goes to middlemen who add no real value.
//               </p>
//               <div style={{
//                 background:"#e8f5ee",borderRadius:16,padding:20,borderLeft:"4px solid #1a7a52"
//               }}>
//                 <p style={{margin:0,fontStyle:"italic",color:"#1a7a52",fontWeight:600,fontSize:15}}>
//                   "From the farm to your family — no middlemen, just freshness."
//                 </p>
//               </div>
//             </AnimSection>

//             <AnimSection delay={0.2}>
//               <div className="about-features" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
//                 {[
//                   {icon:"🌾",title:"Farmer First",desc:"Farmers set their own prices and earn 15-20% more per kg"},
//                   {icon:"🏠",title:"Home Fresh",desc:"Picked this morning, delivered to your door in 2 hours"},
//                   {icon:"💚",title:"No Middlemen",desc:"Direct connection eliminates agents, wholesalers and retailers"},
//                   {icon:"📱",title:"Tech Powered",desc:"Real-time tracking, WhatsApp alerts, and seamless payments"},
//                 ].map((c,i)=>(
//                   <div key={i} style={{
//                     background:"#f8fffe",border:"1.5px solid #e0f0e8",borderRadius:16,
//                     padding:20,transition:"all 0.3s",cursor:"default"
//                   }}
//                     onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(26,122,82,0.12)"}}
//                     onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}
//                   >
//                     <div style={{fontSize:32,marginBottom:10}}>{c.icon}</div>
//                     <div style={{fontWeight:700,fontSize:15,marginBottom:6,color:"#0f2d1e"}}>{c.title}</div>
//                     <div style={{fontSize:13,color:"#666",lineHeight:1.6}}>{c.desc}</div>
//                   </div>
//                 ))}
//               </div>
//             </AnimSection>
//           </div>
//         </div>
//       </section>

//       {/* ── WHAT WE OFFER ─────────────────────────────────────────── */}
//       <section id="what-we-offer" className="landing-section" style={{padding:"100px 5%",background:"#f8fffe"}}>
//         <div style={{maxWidth:1200,margin:"0 auto"}}>
//           <AnimSection style={{textAlign:"center",marginBottom:60}}>
//             <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>What We Offer</span>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
//               Everything fresh, nothing extra
//             </h2>
//           </AnimSection>

//           {/* Product cards — real photos, caption overlay */}
//           <div className="offer-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20,marginBottom:60}}>
//             {OFFERS.map((p,i)=>(
//               <AnimSection key={i} delay={i*0.08}>
//                 <div style={{
//                   position:"relative",borderRadius:20,overflow:"hidden",height:220,
//                   cursor:"default",transition:"transform 0.3s, box-shadow 0.3s",
//                   boxShadow:"0 6px 20px rgba(15,45,30,0.1)"
//                 }}
//                   onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 16px 36px rgba(15,45,30,0.22)"}}
//                   onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 6px 20px rgba(15,45,30,0.1)"}}
//                 >
//                   <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/>
//                   <div style={{
//                     position:"absolute",inset:0,
//                     background:"linear-gradient(180deg, rgba(15,45,30,0) 40%, rgba(15,45,30,0.85) 100%)"
//                   }}/>
//                   <div style={{position:"absolute",left:18,right:18,bottom:16,color:"#fff"}}>
//                     <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{p.name}</div>
//                     <div style={{fontSize:12,color:"#dcefe3",lineHeight:1.4}}>{p.desc}</div>
//                   </div>
//                 </div>
//               </AnimSection>
//             ))}
//           </div>

//           {/* How it works */}
//           <AnimSection>
//             <h3 style={{textAlign:"center",fontSize:28,fontWeight:800,color:"#0f2d1e",marginBottom:40}}>How it works</h3>
//           </AnimSection>
//           <div className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,position:"relative"}}>
//             <div className="steps-line" style={{
//               position:"absolute",top:40,left:"12.5%",right:"12.5%",height:2,
//               background:"linear-gradient(90deg,#1a7a52,#2ea86e)",zIndex:0
//             }}/>
//             {[
//               {num:1,icon:"🛒",title:"Browse farms",desc:"See local farmers near you with today's fresh stock"},
//               {num:2,icon:"📱",title:"Place order",desc:"Add items to cart, pay via UPI or card securely"},
//               {num:3,icon:"🛵",title:"Rider picks up",desc:"Our partner collects directly from the farm"},
//               {num:4,icon:"🏠",title:"Delivered fresh",desc:"Fresh vegetables at your door in under 2 hours"},
//             ].map((s,i)=>(
//               <AnimSection key={i} delay={i*0.1} style={{textAlign:"center",position:"relative",zIndex:1}}>
//                 <div style={{
//                   width:72,height:72,borderRadius:"50%",
//                   background:"linear-gradient(135deg,#1a7a52,#2ea86e)",
//                   display:"flex",alignItems:"center",justifyContent:"center",
//                   fontSize:28,margin:"0 auto 16px",
//                   boxShadow:"0 6px 20px rgba(26,122,82,0.3)",border:"4px solid #f8fffe"
//                 }}>{s.icon}</div>
//                 <div style={{
//                   position:"absolute",top:0,left:"50%",transform:"translate(-50%,-8px)",
//                   background:"#0f2d1e",color:"#fff",fontSize:11,fontWeight:700,
//                   width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"
//                 }}>{s.num}</div>
//                 <div style={{fontWeight:700,fontSize:15,color:"#0f2d1e",marginBottom:6}}>{s.title}</div>
//                 <div style={{fontSize:13,color:"#666",lineHeight:1.6,maxWidth:140,margin:"0 auto"}}>{s.desc}</div>
//               </AnimSection>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── HOW IT WORKS / MATH ───────────────────────────────────── */}
//       <section id="how-it-works" className="landing-section" style={{padding:"100px 5%",background:"linear-gradient(160deg,#0f2d1e,#1a7a52)"}}>
//         <div style={{maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
//           <AnimSection>
//             <span style={{color:"#a5d6a7",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>The Kisavi Difference</span>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#fff",marginBottom:16}}>
//               Farmer earns more. You pay less.
//             </h2>
//             <p style={{color:"#b2dfcb",fontSize:16,maxWidth:560,margin:"0 auto 50px",lineHeight:1.7}}>
//               Here's the math that makes Kisavi different from every other grocery platform.
//             </p>
//           </AnimSection>

//           <div className="comparison-grid" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:24,alignItems:"center",maxWidth:900,margin:"0 auto"}}>
//             <AnimSection delay={0.1}>
//               <div style={{background:"rgba(255,255,255,0.08)",borderRadius:20,padding:28,border:"1px solid rgba(255,255,255,0.15)"}}>
//                 <div style={{color:"#ff8a80",fontWeight:700,marginBottom:16,fontSize:15}}>❌ Old System</div>
//                 {[
//                   ["Farmer earns","Rs. 60/kg"],
//                   ["Agent cuts","Rs. 10"],
//                   ["Wholesaler cuts","Rs. 10"],
//                   ["Retailer cuts","Rs. 10"],
//                   ["You pay","Rs. 80/kg"],
//                 ].map(([l,v])=>(
//                   <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
//                     <span style={{color:"#ccc",fontSize:14}}>{l}</span>
//                     <span style={{color:"#fff",fontWeight:700,fontSize:14}}>{v}</span>
//                   </div>
//                 ))}
//               </div>
//             </AnimSection>

//             <div className="comparison-arrow" style={{fontSize:32}}>→</div>

//             <AnimSection delay={0.2}>
//               <div style={{background:"rgba(255,255,255,0.12)",borderRadius:20,padding:28,border:"1.5px solid rgba(165,214,167,0.4)"}}>
//                 <div style={{color:"#a5d6a7",fontWeight:700,marginBottom:16,fontSize:15}}>✅ Kisavi System</div>
//                 {[
//                   ["Farmer earns","Rs. 66.50/kg","#a5d6a7"],
//                   ["Kisavi fee (5%)","Rs. 3.50","#fff"],
//                   ["Rider fee","Rs. 5-25","#fff"],
//                   ["Middlemen","Rs. 0 ✓","#a5d6a7"],
//                   ["You pay","Rs. 70-75/kg","#a5d6a7"],
//                 ].map(([l,v,c])=>(
//                   <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
//                     <span style={{color:"#ccc",fontSize:14}}>{l}</span>
//                     <span style={{color:c,fontWeight:700,fontSize:14}}>{v}</span>
//                   </div>
//                 ))}
//               </div>
//             </AnimSection>
//           </div>

//           <AnimSection delay={0.3}>
//             <div style={{display:"flex",justifyContent:"center",gap:32,marginTop:50,flexWrap:"wrap"}}>
//               {[
//                 {label:"Farmer earns more",value:"Rs. 6.50 extra per kg"},
//                 {label:"Customer saves",value:"Rs. 5-10 per kg"},
//                 {label:"Rider keeps",value:"100% of delivery fee"},
//               ].map((s,i)=>(
//                 <div key={i} style={{
//                   background:"rgba(255,255,255,0.1)",borderRadius:16,padding:"18px 28px",
//                   border:"1px solid rgba(255,255,255,0.15)",textAlign:"center"
//                 }}>
//                   <div style={{color:"#fff",fontWeight:800,fontSize:18,marginBottom:4}}>{s.value}</div>
//                   <div style={{color:"#b2dfcb",fontSize:13}}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </AnimSection>
//         </div>
//       </section>

//       {/* ── FUTURE PLANS ─────────────────────────────────────────── */}
//       <section id="future-plans" className="landing-section" style={{padding:"100px 5%",background:"#fff"}}>
//         <div style={{maxWidth:1200,margin:"0 auto"}}>
//           <AnimSection style={{textAlign:"center",marginBottom:60}}>
//             <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>Future Plans</span>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
//               We are just getting started
//             </h2>
//             <p style={{fontSize:16,color:"#555",maxWidth:580,margin:"16px auto 0",lineHeight:1.7}}>
//               Our vision goes beyond delivery. Kisavi will become the backbone of
//               agricultural transformation in Andhra Pradesh.
//             </p>
//           </AnimSection>

//           <div className="roadmap-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:40}}>
//             {[
//               {phase:"Phase 1",time:"Now",icon:"🚀",title:"Launch & Grow",
//                items:["Launch in first target city","Onboard 50+ farmers","500+ active customers","60 orders per day"]},
//               {phase:"Phase 2",time:"Month 6",icon:"🏙️",title:"City Expansion",
//                items:["Expand to 3-4 AP cities","200+ farmer network","Mobile app (iOS + Android)","B2B supply to restaurants"]},
//               {phase:"Phase 3",time:"Year 1",icon:"🌱",title:"Invest in Farming",
//                items:[
//                  "Fund farming equipment for partner farmers",
//                  "Invest in farmers who sell through Kisavi",
//                  "Provide seeds, tools and infrastructure support",
//                  "Profit sharing with farmers who tie up long-term"
//                ],highlight:true},
//               {phase:"Phase 4",time:"Year 2",icon:"🇮🇳",title:"Pan-India Scale",
//                items:["Expand to 5 states","50,000+ households served","Series A fundraise","Cold chain infrastructure"]},
//             ].map((p,i)=>(
//               <AnimSection key={i} delay={i*0.1}>
//                 <div style={{
//                   borderRadius:20,padding:28,height:"100%",
//                   background:p.highlight?"linear-gradient(135deg,#e8f5ee,#f0faf5)":"#f8fffe",
//                   border:p.highlight?"2px solid #1a7a52":"1.5px solid #e0f0e8",
//                   transition:"all 0.3s",cursor:"default",boxSizing:"border-box"
//                 }}
//                   onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(26,122,82,0.12)"}}
//                   onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}
//                 >
//                   <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
//                     <div>
//                       <span style={{
//                         background:p.highlight?"#1a7a52":"#e8f5ee",
//                         color:p.highlight?"#fff":"#1a7a52",
//                         fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20
//                       }}>{p.phase}</span>
//                       <span style={{fontSize:11,color:"#999",marginLeft:8}}>{p.time}</span>
//                     </div>
//                     <span style={{fontSize:28}}>{p.icon}</span>
//                   </div>
//                   <h3 style={{fontSize:20,fontWeight:800,color:"#0f2d1e",marginBottom:14}}>{p.title}</h3>
//                   {p.highlight&&(
//                     <div style={{
//                       background:"#1a7a52",color:"#fff",borderRadius:10,padding:"8px 14px",
//                       fontSize:12,fontWeight:600,marginBottom:14
//                     }}>
//                       🌾 We invest in our farmers — not just sell through them
//                     </div>
//                   )}
//                   <ul style={{margin:0,padding:0,listStyle:"none"}}>
//                     {p.items.map((item,j)=>(
//                       <li key={j} style={{
//                         fontSize:14,color:"#555",lineHeight:1.6,
//                         padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,0.05)",
//                         display:"flex",alignItems:"flex-start",gap:8
//                       }}>
//                         <span style={{color:"#1a7a52",fontWeight:700,marginTop:1}}>→</span>{item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </AnimSection>
//             ))}
//           </div>

//           {/* Farmer investment highlight — real field photo background */}
//           <AnimSection delay={0.2}>
//             <div className="investment-highlight" style={{
//               position:"relative",overflow:"hidden",
//               background:`linear-gradient(120deg, rgba(9,28,18,0.92) 0%, rgba(15,45,30,0.85) 60%), url(${IMG.fields})`,
//               backgroundSize:"cover",backgroundPosition:"center",
//               borderRadius:24,padding:40,textAlign:"center",
//               boxShadow:"0 16px 48px rgba(26,122,82,0.25)"
//             }}>
//               <div style={{fontSize:48,marginBottom:16}}>🌾💰</div>
//               <h3 style={{fontSize:26,fontWeight:800,color:"#fff",marginBottom:12}}>
//                 We invest in our partner farmers
//               </h3>
//               <p style={{color:"#b2dfcb",fontSize:15,maxWidth:600,margin:"0 auto 24px",lineHeight:1.7}}>
//                 Farmers who sell through Kisavi are not just suppliers — they are partners.
//                 We plan to invest in their farming equipment, seeds, and infrastructure.
//                 When farmers grow, Kisavi grows. When Kisavi grows, farmers grow.
//               </p>
//               <div style={{display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap"}}>
//                 {[
//                   ["Equipment Support","Farming tools funded"],
//                   ["Seed Investment","Quality inputs provided"],
//                   ["Profit Sharing","Long-term tie-up farmers share profits"],
//                 ].map(([t,d])=>(
//                   <div key={t} style={{
//                     background:"rgba(255,255,255,0.12)",borderRadius:14,padding:"14px 20px",
//                     border:"1px solid rgba(255,255,255,0.2)"
//                   }}>
//                     <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{t}</div>
//                     <div style={{color:"#a5d6a7",fontSize:12,marginTop:4}}>{d}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </AnimSection>
//         </div>
//       </section>

//       {/* ── CTA ───────────────────────────────────────────────────── */}
//       <section id="contact" className="landing-section" style={{padding:"100px 5%",background:"linear-gradient(160deg,#f0faf5,#e8f5ee)"}}>
//         <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
//           <AnimSection>
//             <div style={{fontSize:56,marginBottom:16}}>🌿</div>
//             <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,color:"#0f2d1e",marginBottom:16}}>
//               Ready to join Kisavi?
//             </h2>
//             <p style={{fontSize:16,color:"#555",lineHeight:1.7,marginBottom:40,maxWidth:500,margin:"0 auto 40px"}}>
//               Whether you are a customer who wants farm-fresh vegetables or a farmer
//               who wants to earn more — Kisavi is built for you.
//             </p>
//             <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:50}}>
//               <Link href="/customer" style={{
//                 background:"linear-gradient(135deg,#1a7a52,#2ea86e)",color:"#fff",border:"none",
//                 padding:"16px 36px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
//                 boxShadow:"0 6px 24px rgba(26,122,82,0.35)",transition:"all 0.3s",textDecoration:"none"
//               }}>Start Ordering 🛒</Link>
//               <Link href="/verification/farmer" style={{
//                 background:"#fff3e0",color:"#e65100",border:"2px solid #ffb74d",
//                 padding:"16px 36px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
//                 transition:"all 0.3s",textDecoration:"none"
//               }}>Register as Farmer 🌾</Link>
//             </div>

//             <div className="contact-panel" style={{
//               background:"#fff",borderRadius:20,padding:28,
//               border:"1.5px solid #e0f0e8",display:"inline-block",textAlign:"left",
//               boxShadow:"0 4px 20px rgba(26,122,82,0.08)"
//             }}>
//               <div style={{fontSize:14,color:"#1a7a52",fontWeight:700,marginBottom:12,textAlign:"center"}}>Get in Touch</div>
//               <div style={{display:"flex",flexDirection:"column",gap:10}}>
//                 {[
//                   {icon:"📧",label:"Email",val:"kisaviofficial@gmail.com"},
//                   {icon:"📱",label:"WhatsApp",val:"+91 7075330899"},
//                   {icon:"📍",label:"Location",val:"Hyderabad, India"},
//                 ].map(({icon,label,val})=>(
//                   <div key={label} style={{display:"flex",alignItems:"center",gap:10,fontSize:14}}>
//                     <span style={{fontSize:18}}>{icon}</span>
//                     <span style={{color:"#999",minWidth:70}}>{label}:</span>
//                     <span style={{color:"#1a7a52",fontWeight:600}}>{val}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </AnimSection>
//         </div>
//       </section>

//       {/* ── FOOTER — Quick Links ─────────────────────────────────── */}
//       <footer style={{background:"#0f2d1e",padding:"64px 5% 24px"}}>
//         <div style={{maxWidth:1200,margin:"0 auto"}}>
//           <div className="footer-grid" style={{
//             display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1fr",gap:40,
//             paddingBottom:40,borderBottom:"1px solid rgba(255,255,255,0.08)"
//           }}>
//             {/* Brand column */}
//             <div>
//               <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
//                 <div style={{
//                   width:36,height:36,borderRadius:10,
//                   background:"linear-gradient(135deg,#1a7a52,#2ea86e)",
//                   display:"flex",alignItems:"center",justifyContent:"center",fontSize:18
//                 }}>🌿</div>
//                 <span style={{fontSize:20,fontWeight:700,color:"#fff"}}>Kisavi</span>
//               </div>
//               <p style={{color:"#8fb89e",fontSize:13,lineHeight:1.7,maxWidth:260,marginBottom:20}}>
//                 Farm-to-home vegetable delivery connecting local farmers with families across Andhra Pradesh — no middlemen, just freshness.
//               </p>
//               <div style={{display:"flex",gap:10}}>
//                 {["𝕏","in","IG","YT"].map(s=>(
//                   <a key={s} href="#" style={{
//                     width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.08)",
//                     display:"flex",alignItems:"center",justifyContent:"center",
//                     color:"#cfe9d9",fontSize:12,fontWeight:700,textDecoration:"none",
//                     border:"1px solid rgba(255,255,255,0.1)",transition:"all 0.2s"
//                   }}
//                     onMouseEnter={e=>{e.currentTarget.style.background="#1a7a52";e.currentTarget.style.color="#fff"}}
//                     onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.color="#cfe9d9"}}
//                   >{s}</a>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div>
//               <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:18,letterSpacing:0.5,textTransform:"uppercase"}}>Quick Links</div>
//               <div style={{display:"flex",flexDirection:"column",gap:12}}>
//                 {NAV_LINKS.map(l=>(
//                   <button key={l} onClick={()=>scroll(sectionId(l))} style={{
//                     background:"none",border:"none",padding:0,textAlign:"left",cursor:"pointer",
//                     color:"#a8cdb6",fontSize:14,transition:"color 0.2s"
//                   }}
//                     onMouseEnter={e=>e.target.style.color="#fff"}
//                     onMouseLeave={e=>e.target.style.color="#a8cdb6"}
//                   >{l}</button>
//                 ))}
//               </div>
//             </div>

//             {/* For Farmers & Customers */}
//             <div>
//               <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:18,letterSpacing:0.5,textTransform:"uppercase"}}>Get Started</div>
//               <div style={{display:"flex",flexDirection:"column",gap:12}}>
//                 <Link href="/customer" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Order Fresh Produce</Link>
//                 <Link href="/verification/farmer" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Join as a Farmer</Link>
//                 <Link href="/customer" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Login</Link>
//                 <Link href="/customer" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Sign Up</Link>
//                 <Link href="/verification" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Apply / Verification</Link>
//               </div>
//             </div>

//             {/* Contact */}
//             <div>
//               <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:18,letterSpacing:0.5,textTransform:"uppercase"}}>Contact</div>
//               <div style={{display:"flex",flexDirection:"column",gap:12,fontSize:14,color:"#a8cdb6"}}>
//                 <span>📧 kisaviofficial@gmail.com</span>
//                 <span>📱 +91 7075330899</span>
//                 <span>📍 Hyderabad, India</span>
//               </div>
//             </div>
//           </div>

//           <div style={{
//             display:"flex",justifyContent:"space-between",alignItems:"center",
//             paddingTop:24,flexWrap:"wrap",gap:12
//           }}>
//             <p style={{color:"#5a8a6a",fontSize:13,margin:0}}>
//               © 2026 Kisavi · Farm-to-Home Vegetable Delivery · Andhra Pradesh, India
//             </p>
//             <p style={{color:"#3a6a4a",fontSize:12,margin:0}}>
//               "From the farm to your family — no middlemen, just freshness."
//             </p>
//           </div>
//         </div>
//       </footer>

//     </div>
//   )
// }

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const NAV_LINKS = ["Home","About","What We Offer","How It Works","Future Plans","Contact"]

// Real photos — hero is your uploaded farmer photo, logo is your uploaded Kisavi logo.
// Save both under /public/images/. The rest are free-license Unsplash photos.
const IMG = {
  hero:   "/images/farmer-bg.png",
  logo:   "/images/logo-kisavi.jpeg",
  about:  "https://images.unsplash.com/photo-1671769195087-58336aa02943?auto=format&fit=crop&w=1200&q=80", // Telangana farmland
  leafy:  "https://images.unsplash.com/photo-1708795300912-fa5ebd3e7977?auto=format&fit=crop&w=800&q=80",  // leafy greens close-up
  tomato: "https://images.unsplash.com/photo-1513791053024-3b50799fdd7b?auto=format&fit=crop&w=800&q=80",  // vine tomatoes
  leeks:  "https://images.unsplash.com/photo-1760108273146-c1ad5f5bce30?auto=format&fit=crop&w=800&q=80",  // root veg / leeks
  basket: "https://images.unsplash.com/photo-1635774855717-0aec182f92cc?auto=format&fit=crop&w=800&q=80",  // mixed veg basket
  fields: "https://images.unsplash.com/photo-1765260905999-06612390fb07?auto=format&fit=crop&w=1200&q=80", // green Indian farmland
}

function useInView(threshold=0.15){
  const ref=useRef(null)
  const [vis,setVis]=useState(false)
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold})
    if(ref.current)obs.observe(ref.current)
    return()=>obs.disconnect()
  },[threshold])
  return[ref,vis]
}

function AnimSection({children,className="",delay=0,style={}}){
  const[ref,vis]=useInView()
  return(
    <div ref={ref} className={className} style={{
      ...style,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(40px)",
      transition:`opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>{children}</div>
  )
}

export default function KisaviLanding(){
  const[menu,setMenu]=useState(false)
  const[scrolled,setScrolled]=useState(false)
  const[active,setActive]=useState("Home")

  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>40)
    window.addEventListener("scroll",h)
    return()=>window.removeEventListener("scroll",h)
  },[])

  const scroll=(id)=>{
    if(id==="verification"){
      window.location.href="/verification"
      return
    }
    const el=document.getElementById(id)
    if(el){el.scrollIntoView({behavior:"smooth"});setMenu(false);setActive(id)}
  }

  const sectionId=(label)=>label.toLowerCase().replace(/\s+/g,"-")

  const OFFERS = [
    {img:IMG.leafy,  name:"Leafy Greens",     desc:"Spinach, methi, palak — picked at dawn"},
    {img:IMG.tomato, name:"Vine Vegetables",  desc:"Tomatoes, brinjal, capsicum — farm to door"},
    {img:IMG.leeks,  name:"Root Vegetables",  desc:"Carrots, beetroot, radish — straight from soil"},
    {img:IMG.basket, name:"Legumes & Beans",  desc:"Cluster beans, flat beans, fresh peas"},
    {img:IMG.fields, name:"Seasonal Produce", desc:"What's in season, at its peak freshness"},
    {img:IMG.leafy,  name:"Fresh Herbs",      desc:"Coriander, curry leaves, mint — daily fresh"},
  ]

  return(
    <div className="kisavi-landing" style={{fontFamily:"'Segoe UI',sans-serif",color:"#1a1a1a",background:"#fff",overflowX:"hidden"}}>

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        background:scrolled?"rgba(255,255,255,0.97)":"rgba(15,45,30,0.15)",
        backdropFilter:"blur(12px)",
        boxShadow:scrolled?"0 2px 24px rgba(0,0,0,0.08)":"none",
        transition:"all 0.4s ease",padding:"0 5%"
      }}>
        <div className="landing-nav-inner" style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>

         {/* Logo — cropped to just the circular emblem so it fits the nav height */}
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>scroll("home")}>
            <div style={{
              width:60,height:60,borderRadius:12,flexShrink:0,
              backgroundColor:"#fff",
              backgroundImage:`url(${IMG.logo})`,
              backgroundSize:"100% auto",
              backgroundPosition:"50% 6%",
              backgroundRepeat:"no-repeat",
              boxShadow:"0 4px 14px rgba(26,122,82,0.25)"
            }}/>
            <span style={{fontSize:22,fontWeight:700,color:scrolled?"#1a7a52":"#fff",letterSpacing:-0.5,transition:"color 0.4s"}}>Kisavi</span>
          </div>

          {/* Desktop nav */}
          <div style={{display:"flex",gap:6,alignItems:"center"}} className="desktop-nav">
            {NAV_LINKS.map(l=>{
              const isActive = active===l
              return (
                <button key={l} onClick={()=>scroll(sectionId(l))} style={{
                  background:isActive?"#e8f5ee":"transparent",
                  border:"none",cursor:"pointer",padding:"6px 14px",
                  borderRadius:20,fontSize:14,fontWeight:500,
                  color:isActive?"#1a7a52":(scrolled?"#444":"#eafaf0"),
                  transition:"all 0.2s"
                }}>{l}</button>
              )
            })}
          </div>

          {/* CTA buttons */}
          <div className="landing-nav-actions" style={{display:"flex",gap:8,alignItems:"center"}}>
            <Link href="/customer" className="nav-login" style={{
              background:"none",border:`1.5px solid ${scrolled?"#1a7a52":"#fff"}`,color:scrolled?"#1a7a52":"#fff",
              padding:"7px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,
              transition:"all 0.2s",textDecoration:"none"
            }}>Login</Link>
            <Link href="/customer" className="nav-signup" style={{
              background:"linear-gradient(135deg,#1a7a52,#2ea86e)",color:"#fff",border:"none",
              padding:"8px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,
              boxShadow:"0 4px 14px rgba(26,122,82,0.3)",transition:"all 0.25s",textDecoration:"none"
            }}>Sign Up</Link>
            <Link href="/verification" className="nav-apply" style={{
              background:"#fff3e0",color:"#e65100",border:"none",
              padding:"8px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,
              transition:"all 0.25s",textDecoration:"none"
            }}>Apply</Link>

            {/* Hamburger */}
            <button onClick={()=>setMenu(!menu)} style={{
              background:"none",border:"none",cursor:"pointer",padding:6,
              display:"none",fontSize:22,color:scrolled?"#333":"#fff"
            }} className="ham-btn">☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {menu&&(
          <div style={{
            background:"#fff",borderTop:"1px solid #eee",padding:"12px 5%",
            display:"flex",flexDirection:"column",gap:4
          }}>
            <Link href="/customer?mode=login" className="mobile-login-link" onClick={()=>setMenu(false)}>Login</Link>
            {NAV_LINKS.map(l=>(
              <button key={l} onClick={()=>scroll(sectionId(l))} style={{
                background:"none",border:"none",cursor:"pointer",padding:"10px 12px",
                borderRadius:10,fontSize:15,fontWeight:500,color:"#333",textAlign:"left",
                transition:"background 0.2s"
              }}
                onMouseEnter={e=>e.target.style.background="#e8f5ee"}
                onMouseLeave={e=>e.target.style.background="none"}
              >{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── real farmer photo, full-bleed background ───────── */}
      <section id="home" className="landing-section landing-hero" style={{
        minHeight:"100vh",display:"flex",alignItems:"center",
        background:`linear-gradient(105deg, rgba(9,28,18,0.92) 0%, rgba(9,28,18,0.72) 38%, rgba(9,28,18,0.35) 65%, rgba(9,28,18,0.15) 100%), url(${IMG.hero})`,
        backgroundSize:"cover",backgroundPosition:"center",
        paddingTop:80,position:"relative",overflow:"hidden",color:"#fff"
      }}>
        <div className="hero-content" style={{maxWidth:1200,margin:"0 auto",padding:"60px 5%",width:"100%"}}>
          <div style={{maxWidth:620}}>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:8,
              background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.35)",
              backdropFilter:"blur(6px)",
              borderRadius:20,padding:"6px 16px",marginBottom:24
            }}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"#2ea86e",display:"inline-block",boxShadow:"0 0 0 4px rgba(46,168,110,0.25)"}}/>
              <span style={{fontSize:14,color:"#eafaf0",fontWeight:600}}>Live Farm-to-Home Network</span>
            </div>
            <h1 style={{fontSize:"clamp(36px,5vw,58px)",fontWeight:800,lineHeight:1.1,marginBottom:20,color:"#fff"}}>
              Fresh from the<br/>
              <span style={{color:"#7fd9a5"}}>farm</span> to your<br/>
              <span style={{color:"#a8e6c1"}}>kitchen</span>
            </h1>
            <p style={{fontSize:18,color:"#e2f2e8",lineHeight:1.7,marginBottom:32,maxWidth:480}}>
              Kisavi connects local farmers directly with households — no middlemen, no cold storage.
              Fresh vegetables and fruits delivered to your door in <strong>2 hours</strong>.
            </p>
            <div className="hero-actions" style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              <Link href="/customer" style={{
                background:"linear-gradient(135deg,#1a7a52,#2ea86e)",color:"#fff",border:"none",
                padding:"14px 32px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
                boxShadow:"0 6px 24px rgba(26,122,82,0.45)",transition:"all 0.3s",textDecoration:"none"
              }}>Order Fresh Now 🛒</Link>
              <Link href="/verification/farmer" style={{
                background:"rgba(255,255,255,0.08)",color:"#fff",border:"2px solid rgba(255,255,255,0.6)",
                backdropFilter:"blur(6px)",
                padding:"14px 32px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
                transition:"all 0.3s",textDecoration:"none"
              }}>Join as Farmer 🌾</Link>
            </div>
            <div className="hero-stats" style={{display:"flex",gap:28,marginTop:40,flexWrap:"wrap"}}>
              {[["500+","Happy Customers"],["50+","Partner Farmers"],["2 hrs","Delivery Time"]].map(([n,l])=>(
                <div key={l} style={{textAlign:"left"}}>
                  <div style={{fontSize:26,fontWeight:800,color:"#fff"}}>{n}</div>
                  <div style={{fontSize:12,color:"#c7e8d4",fontWeight:500}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating info badges over the photo — bottom-right, PawMira-style */}
        <div className="hero-badge-a" style={{
          position:"absolute",right:"6%",bottom:"14%",
          background:"rgba(15,45,30,0.55)",border:"1px solid rgba(255,255,255,0.25)",
          backdropFilter:"blur(8px)",borderRadius:16,padding:"12px 18px",
          display:"flex",alignItems:"center",gap:10,color:"#fff",
          animation:"float 3.5s ease-in-out infinite"
        }}>
          <span style={{fontSize:20}}>🌾</span>
          <div>
            <div style={{fontSize:13,fontWeight:700}}>Fresh batch harvested</div>
            <div style={{fontSize:11,color:"#c7e8d4"}}>This morning · Anakapalli</div>
          </div>
        </div>
        <div className="hero-badge-b" style={{
          position:"absolute",right:"8%",top:"22%",
          background:"rgba(15,45,30,0.55)",border:"1px solid rgba(255,255,255,0.25)",
          backdropFilter:"blur(8px)",borderRadius:16,padding:"12px 18px",
          display:"flex",alignItems:"center",gap:10,color:"#fff",
          animation:"float 4s ease-in-out infinite",animationDelay:"0.6s"
        }}>
          <span style={{fontSize:20}}>🛵</span>
          <div>
            <div style={{fontSize:13,fontWeight:700}}>Delivered in 2 hrs</div>
            <div style={{fontSize:11,color:"#c7e8d4"}}>No cold storage needed</div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section id="about" className="landing-section" style={{padding:"100px 5%",background:"#fff"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <AnimSection style={{textAlign:"center",marginBottom:60}}>
            <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>About Kisavi</span>
            <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
              Built for farmers.<br/>Designed for families.
            </h2>
          </AnimSection>

          <div className="about-layout" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
            <AnimSection delay={0.1}>
              <div style={{
                borderRadius:24,overflow:"hidden",marginBottom:24,
                boxShadow:"0 20px 50px rgba(15,45,30,0.18)"
              }}>
                <img src={IMG.about} alt="Andhra Pradesh farmland" style={{width:"100%",height:280,objectFit:"cover",display:"block"}}/>
              </div>
              <p style={{fontSize:16,lineHeight:1.8,color:"#444",marginBottom:20}}>
                Kisavi was born from a simple observation — farmers in Andhra Pradesh sell tomatoes
                for <strong>Rs. 40/kg</strong>, but by the time they reach you, you pay <strong>Rs. 80/kg</strong>.
                The difference goes to middlemen who add no real value.
              </p>
              <div style={{
                background:"#e8f5ee",borderRadius:16,padding:20,borderLeft:"4px solid #1a7a52"
              }}>
                <p style={{margin:0,fontStyle:"italic",color:"#1a7a52",fontWeight:600,fontSize:15}}>
                  "From the farm to your family — no middlemen, just freshness."
                </p>
              </div>
            </AnimSection>

            <AnimSection delay={0.2}>
              <div className="about-features" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {[
                  {icon:"🌾",title:"Farmer First",desc:"Farmers set their own prices and earn 15-20% more per kg"},
                  {icon:"🏠",title:"Home Fresh",desc:"Picked this morning, delivered to your door in 2 hours"},
                  {icon:"💚",title:"No Middlemen",desc:"Direct connection eliminates agents, wholesalers and retailers"},
                  {icon:"📱",title:"Tech Powered",desc:"Real-time tracking, WhatsApp alerts, and seamless payments"},
                ].map((c,i)=>(
                  <div key={i} style={{
                    background:"#f8fffe",border:"1.5px solid #e0f0e8",borderRadius:16,
                    padding:20,transition:"all 0.3s",cursor:"default"
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(26,122,82,0.12)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}
                  >
                    <div style={{fontSize:32,marginBottom:10}}>{c.icon}</div>
                    <div style={{fontWeight:700,fontSize:15,marginBottom:6,color:"#0f2d1e"}}>{c.title}</div>
                    <div style={{fontSize:13,color:"#666",lineHeight:1.6}}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ─────────────────────────────────────────── */}
      <section id="what-we-offer" className="landing-section" style={{padding:"100px 5%",background:"#f8fffe"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <AnimSection style={{textAlign:"center",marginBottom:60}}>
            <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>What We Offer</span>
            <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
              Everything fresh, nothing extra
            </h2>
          </AnimSection>

          {/* Product cards — real photos, caption overlay */}
          <div className="offer-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20,marginBottom:60}}>
            {OFFERS.map((p,i)=>(
              <AnimSection key={i} delay={i*0.08}>
                <div style={{
                  position:"relative",borderRadius:20,overflow:"hidden",height:220,
                  cursor:"default",transition:"transform 0.3s, box-shadow 0.3s",
                  boxShadow:"0 6px 20px rgba(15,45,30,0.1)"
                }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 16px 36px rgba(15,45,30,0.22)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 6px 20px rgba(15,45,30,0.1)"}}
                >
                  <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/>
                  <div style={{
                    position:"absolute",inset:0,
                    background:"linear-gradient(180deg, rgba(15,45,30,0) 40%, rgba(15,45,30,0.85) 100%)"
                  }}/>
                  <div style={{position:"absolute",left:18,right:18,bottom:16,color:"#fff"}}>
                    <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{p.name}</div>
                    <div style={{fontSize:12,color:"#dcefe3",lineHeight:1.4}}>{p.desc}</div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>

          {/* How it works */}
          <AnimSection>
            <h3 style={{textAlign:"center",fontSize:28,fontWeight:800,color:"#0f2d1e",marginBottom:40}}>How it works</h3>
          </AnimSection>
          <div className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,position:"relative"}}>
            <div className="steps-line" style={{
              position:"absolute",top:40,left:"12.5%",right:"12.5%",height:2,
              background:"linear-gradient(90deg,#1a7a52,#2ea86e)",zIndex:0
            }}/>
            {[
              {num:1,icon:"🛒",title:"Browse farms",desc:"See local farmers near you with today's fresh stock"},
              {num:2,icon:"📱",title:"Place order",desc:"Add items to cart, pay via UPI or card securely"},
              {num:3,icon:"🛵",title:"Rider picks up",desc:"Our partner collects directly from the farm"},
              {num:4,icon:"🏠",title:"Delivered fresh",desc:"Fresh vegetables at your door in under 2 hours"},
            ].map((s,i)=>(
              <AnimSection key={i} delay={i*0.1} style={{textAlign:"center",position:"relative",zIndex:1}}>
                <div style={{
                  width:72,height:72,borderRadius:"50%",
                  background:"linear-gradient(135deg,#1a7a52,#2ea86e)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:28,margin:"0 auto 16px",
                  boxShadow:"0 6px 20px rgba(26,122,82,0.3)",border:"4px solid #f8fffe"
                }}>{s.icon}</div>
                <div style={{
                  position:"absolute",top:0,left:"50%",transform:"translate(-50%,-8px)",
                  background:"#0f2d1e",color:"#fff",fontSize:11,fontWeight:700,
                  width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"
                }}>{s.num}</div>
                <div style={{fontWeight:700,fontSize:15,color:"#0f2d1e",marginBottom:6}}>{s.title}</div>
                <div style={{fontSize:13,color:"#666",lineHeight:1.6,maxWidth:140,margin:"0 auto"}}>{s.desc}</div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS / MATH ───────────────────────────────────── */}
      <section id="how-it-works" className="landing-section" style={{padding:"100px 5%",background:"linear-gradient(160deg,#0f2d1e,#1a7a52)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
          <AnimSection>
            <span style={{color:"#a5d6a7",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>The Kisavi Difference</span>
            <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#fff",marginBottom:16}}>
              Farmer earns more. You pay less.
            </h2>
            <p style={{color:"#b2dfcb",fontSize:16,maxWidth:560,margin:"0 auto 50px",lineHeight:1.7}}>
              Here's the math that makes Kisavi different from every other grocery platform.
            </p>
          </AnimSection>

          <div className="comparison-grid" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:24,alignItems:"center",maxWidth:900,margin:"0 auto"}}>
            <AnimSection delay={0.1}>
              <div style={{background:"rgba(255,255,255,0.08)",borderRadius:20,padding:28,border:"1px solid rgba(255,255,255,0.15)"}}>
                <div style={{color:"#ff8a80",fontWeight:700,marginBottom:16,fontSize:15}}>❌ Old System</div>
                {[
                  ["Farmer earns","Rs. 60/kg"],
                  ["Agent cuts","Rs. 10"],
                  ["Wholesaler cuts","Rs. 10"],
                  ["Retailer cuts","Rs. 10"],
                  ["You pay","Rs. 80/kg"],
                ].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                    <span style={{color:"#ccc",fontSize:14}}>{l}</span>
                    <span style={{color:"#fff",fontWeight:700,fontSize:14}}>{v}</span>
                  </div>
                ))}
              </div>
            </AnimSection>

            <div className="comparison-arrow" style={{fontSize:32}}>→</div>

            <AnimSection delay={0.2}>
              <div style={{background:"rgba(255,255,255,0.12)",borderRadius:20,padding:28,border:"1.5px solid rgba(165,214,167,0.4)"}}>
                <div style={{color:"#a5d6a7",fontWeight:700,marginBottom:16,fontSize:15}}>✅ Kisavi System</div>
                {[
                  ["Farmer earns","Rs. 66.50/kg","#a5d6a7"],
                  ["Kisavi fee (5%)","Rs. 3.50","#fff"],
                  ["Rider fee","Rs. 5-25","#fff"],
                  ["Middlemen","Rs. 0 ✓","#a5d6a7"],
                  ["You pay","Rs. 70-75/kg","#a5d6a7"],
                ].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                    <span style={{color:"#ccc",fontSize:14}}>{l}</span>
                    <span style={{color:c,fontWeight:700,fontSize:14}}>{v}</span>
                  </div>
                ))}
              </div>
            </AnimSection>
          </div>

          <AnimSection delay={0.3}>
            <div style={{display:"flex",justifyContent:"center",gap:32,marginTop:50,flexWrap:"wrap"}}>
              {[
                {label:"Farmer earns more",value:"Rs. 6.50 extra per kg"},
                {label:"Customer saves",value:"Rs. 5-10 per kg"},
                {label:"Rider keeps",value:"100% of delivery fee"},
              ].map((s,i)=>(
                <div key={i} style={{
                  background:"rgba(255,255,255,0.1)",borderRadius:16,padding:"18px 28px",
                  border:"1px solid rgba(255,255,255,0.15)",textAlign:"center"
                }}>
                  <div style={{color:"#fff",fontWeight:800,fontSize:18,marginBottom:4}}>{s.value}</div>
                  <div style={{color:"#b2dfcb",fontSize:13}}>{s.label}</div>
                </div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── FUTURE PLANS ─────────────────────────────────────────── */}
      <section id="future-plans" className="landing-section" style={{padding:"100px 5%",background:"#fff"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <AnimSection style={{textAlign:"center",marginBottom:60}}>
            <span style={{color:"#1a7a52",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>Future Plans</span>
            <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginTop:8,color:"#0f2d1e"}}>
              We are just getting started
            </h2>
            <p style={{fontSize:16,color:"#555",maxWidth:580,margin:"16px auto 0",lineHeight:1.7}}>
              Our vision goes beyond delivery. Kisavi will become the backbone of
              agricultural transformation in Andhra Pradesh.
            </p>
          </AnimSection>

          <div className="roadmap-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:40}}>
            {[
              {phase:"Phase 1",time:"Now",icon:"🚀",title:"Launch & Grow",
               items:["Launch in first target city","Onboard 50+ farmers","500+ active customers","60 orders per day"]},
              {phase:"Phase 2",time:"Month 6",icon:"🏙️",title:"City Expansion",
               items:["Expand to 3-4 AP cities","200+ farmer network","Mobile app (iOS + Android)","B2B supply to restaurants"]},
              {phase:"Phase 3",time:"Year 1",icon:"🌱",title:"Invest in Farming",
               items:[
                 "Fund farming equipment for partner farmers",
                 "Invest in farmers who sell through Kisavi",
                 "Provide seeds, tools and infrastructure support",
                 "Profit sharing with farmers who tie up long-term"
               ],highlight:true},
              {phase:"Phase 4",time:"Year 2",icon:"🇮🇳",title:"Pan-India Scale",
               items:["Expand to 5 states","50,000+ households served","Series A fundraise","Cold chain infrastructure"]},
            ].map((p,i)=>(
              <AnimSection key={i} delay={i*0.1}>
                <div style={{
                  borderRadius:20,padding:28,height:"100%",
                  background:p.highlight?"linear-gradient(135deg,#e8f5ee,#f0faf5)":"#f8fffe",
                  border:p.highlight?"2px solid #1a7a52":"1.5px solid #e0f0e8",
                  transition:"all 0.3s",cursor:"default",boxSizing:"border-box"
                }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(26,122,82,0.12)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}
                >
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                    <div>
                      <span style={{
                        background:p.highlight?"#1a7a52":"#e8f5ee",
                        color:p.highlight?"#fff":"#1a7a52",
                        fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20
                      }}>{p.phase}</span>
                      <span style={{fontSize:11,color:"#999",marginLeft:8}}>{p.time}</span>
                    </div>
                    <span style={{fontSize:28}}>{p.icon}</span>
                  </div>
                  <h3 style={{fontSize:20,fontWeight:800,color:"#0f2d1e",marginBottom:14}}>{p.title}</h3>
                  {p.highlight&&(
                    <div style={{
                      background:"#1a7a52",color:"#fff",borderRadius:10,padding:"8px 14px",
                      fontSize:12,fontWeight:600,marginBottom:14
                    }}>
                      🌾 We invest in our farmers — not just sell through them
                    </div>
                  )}
                  <ul style={{margin:0,padding:0,listStyle:"none"}}>
                    {p.items.map((item,j)=>(
                      <li key={j} style={{
                        fontSize:14,color:"#555",lineHeight:1.6,
                        padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,0.05)",
                        display:"flex",alignItems:"flex-start",gap:8
                      }}>
                        <span style={{color:"#1a7a52",fontWeight:700,marginTop:1}}>→</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimSection>
            ))}
          </div>

          {/* Farmer investment highlight — real field photo background */}
          <AnimSection delay={0.2}>
            <div className="investment-highlight" style={{
              position:"relative",overflow:"hidden",
              background:`linear-gradient(120deg, rgba(9,28,18,0.92) 0%, rgba(15,45,30,0.85) 60%), url(${IMG.fields})`,
              backgroundSize:"cover",backgroundPosition:"center",
              borderRadius:24,padding:40,textAlign:"center",
              boxShadow:"0 16px 48px rgba(26,122,82,0.25)"
            }}>
              <div style={{fontSize:48,marginBottom:16}}>🌾💰</div>
              <h3 style={{fontSize:26,fontWeight:800,color:"#fff",marginBottom:12}}>
                We invest in our partner farmers
              </h3>
              <p style={{color:"#b2dfcb",fontSize:15,maxWidth:600,margin:"0 auto 24px",lineHeight:1.7}}>
                Farmers who sell through Kisavi are not just suppliers — they are partners.
                We plan to invest in their farming equipment, seeds, and infrastructure.
                When farmers grow, Kisavi grows. When Kisavi grows, farmers grow.
              </p>
              <div style={{display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap"}}>
                {[
                  ["Equipment Support","Farming tools funded"],
                  ["Seed Investment","Quality inputs provided"],
                  ["Profit Sharing","Long-term tie-up farmers share profits"],
                ].map(([t,d])=>(
                  <div key={t} style={{
                    background:"rgba(255,255,255,0.12)",borderRadius:14,padding:"14px 20px",
                    border:"1px solid rgba(255,255,255,0.2)"
                  }}>
                    <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{t}</div>
                    <div style={{color:"#a5d6a7",fontSize:12,marginTop:4}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section id="contact" className="landing-section" style={{padding:"100px 5%",background:"linear-gradient(160deg,#f0faf5,#e8f5ee)"}}>
        <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <AnimSection>

              <div style={{
                background:"#fff",display:"inline-block",borderRadius:16,
                padding:"10px 16px",marginBottom:18
              }}>
                <img src={IMG.logo} alt="Kisavi — Farm to Home" style={{height:64,width:"auto",display:"block"}}/>
              </div>
            <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:800,color:"#0f2d1e",marginBottom:16}}>
              Ready to join Kisavi?
            </h2>
            <p style={{fontSize:16,color:"#555",lineHeight:1.7,marginBottom:40,maxWidth:500,margin:"0 auto 40px"}}>
              Whether you are a customer who wants farm-fresh vegetables or a farmer
              who wants to earn more — Kisavi is built for you.
            </p>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:50}}>
              <Link href="/customer" style={{
                background:"linear-gradient(135deg,#1a7a52,#2ea86e)",color:"#fff",border:"none",
                padding:"16px 36px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
                boxShadow:"0 6px 24px rgba(26,122,82,0.35)",transition:"all 0.3s",textDecoration:"none"
              }}>Start Ordering 🛒</Link>
              <Link href="/verification/farmer" style={{
                background:"#fff3e0",color:"#e65100",border:"2px solid #ffb74d",
                padding:"16px 36px",borderRadius:28,cursor:"pointer",fontSize:16,fontWeight:700,
                transition:"all 0.3s",textDecoration:"none"
              }}>Register as Farmer 🌾</Link>
            </div>

            <div className="contact-panel" style={{
              background:"#fff",borderRadius:20,padding:28,
              border:"1.5px solid #e0f0e8",display:"inline-block",textAlign:"left",
              boxShadow:"0 4px 20px rgba(26,122,82,0.08)"
            }}>
              <div style={{fontSize:14,color:"#1a7a52",fontWeight:700,marginBottom:12,textAlign:"center"}}>Get in Touch</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {icon:"📧",label:"Email",val:"kisaviofficial@gmail.com"},
                  {icon:"📱",label:"WhatsApp",val:"+91 7075330899"},
                  {icon:"📍",label:"Location",val:"Hyderabad, India"},
                ].map(({icon,label,val})=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:10,fontSize:14}}>
                    <span style={{fontSize:18}}>{icon}</span>
                    <span style={{color:"#999",minWidth:70}}>{label}:</span>
                    <span style={{color:"#1a7a52",fontWeight:600}}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── FOOTER — Quick Links ─────────────────────────────────── */}
      <footer style={{background:"#0f2d1e",padding:"64px 5% 24px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div className="footer-grid" style={{
            display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1fr",gap:40,
            paddingBottom:40,borderBottom:"1px solid rgba(255,255,255,0.08)"
          }}>
            {/* Brand column — full logo with wordmark, on a white plate for contrast */}
            <div>
              <div style={{
                background:"#fff",display:"inline-block",borderRadius:16,
                padding:"10px 16px",marginBottom:18
              }}>
                <img src={IMG.logo} alt="Kisavi — Farm to Home" style={{height:64,width:"auto",display:"block"}}/>
              </div>
              <p style={{color:"#8fb89e",fontSize:13,lineHeight:1.7,maxWidth:260,marginBottom:20}}>
                Farm-to-home vegetable delivery connecting local farmers with families across Andhra Pradesh — no middlemen, just freshness.
              </p>
              <div style={{display:"flex",gap:10}}>
                {["𝕏","in","IG","YT"].map(s=>(
                  <a key={s} href="#" style={{
                    width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.08)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    color:"#cfe9d9",fontSize:12,fontWeight:700,textDecoration:"none",
                    border:"1px solid rgba(255,255,255,0.1)",transition:"all 0.2s"
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background="#1a7a52";e.currentTarget.style.color="#fff"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.color="#cfe9d9"}}
                  >{s}</a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:18,letterSpacing:0.5,textTransform:"uppercase"}}>Quick Links</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {NAV_LINKS.map(l=>(
                  <button key={l} onClick={()=>scroll(sectionId(l))} style={{
                    background:"none",border:"none",padding:0,textAlign:"left",cursor:"pointer",
                    color:"#a8cdb6",fontSize:14,transition:"color 0.2s"
                  }}
                    onMouseEnter={e=>e.target.style.color="#fff"}
                    onMouseLeave={e=>e.target.style.color="#a8cdb6"}
                  >{l}</button>
                ))}
              </div>
            </div>

            {/* For Farmers & Customers */}
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:18,letterSpacing:0.5,textTransform:"uppercase"}}>Get Started</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <Link href="/customer" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Order Fresh Produce</Link>
                <Link href="/verification/farmer" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Join as a Farmer</Link>
                <Link href="/customer" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Login</Link>
                <Link href="/customer" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Sign Up</Link>
                <Link href="/verification" style={{color:"#a8cdb6",fontSize:14,textDecoration:"none"}}>Apply / Verification</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:18,letterSpacing:0.5,textTransform:"uppercase"}}>Contact</div>
              <div style={{display:"flex",flexDirection:"column",gap:12,fontSize:14,color:"#a8cdb6"}}>
                <span>📧 kisaviofficial@gmail.com</span>
                <span>📱 +91 7075330899</span>
                <span>📍 Hyderabad, India</span>
              </div>
            </div>
          </div>

          <div style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            paddingTop:24,flexWrap:"wrap",gap:12
          }}>
            <p style={{color:"#5a8a6a",fontSize:13,margin:0}}>
              © 2026 Kisavi · Farm-to-Home Vegetable Delivery · Andhra Pradesh, India
            </p>
            <p style={{color:"#3a6a4a",fontSize:12,margin:0}}>
              "From the farm to your family — no middlemen, just freshness."
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}