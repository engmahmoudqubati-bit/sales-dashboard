import { useEffect, useState } from "react"

// ── Adjust these to your real business goals ──────────────────
const TARGETS = {
  revenue:  5000000,  // SAR 5,000,000
  qty:      50000,    // 50,000 units
  branches: 10,       // 10 branches
  products: 200,      // 200 products
}

function AnimatedNumber({ target, prefix="", suffix="" }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if(!target) return
    const duration = 1500
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if(current >= target) {
        setValue(target)
        clearInterval(timer)
      } else {
        setValue(Math.round(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return <span>{prefix}{value.toLocaleString()}{suffix}</span>
}

function ProgressBar({ value, target, dark }) {
  const [width, setWidth] = useState(0)
  const pct = Math.min(Math.round((value / target) * 100), 100)

  const barColor   = pct >= 80 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#f87171"
  const trackBg    = dark ? "#0f172a" : "#f1f5f9"
  const labelColor = pct >= 80 ? (dark?"#86efac":"#166534") : pct >= 50 ? (dark?"#fde68a":"#92400e") : (dark?"#fca5a5":"#991b1b")
  const labelBg    = pct >= 80 ? (dark?"#052e16":"#dcfce7") : pct >= 50 ? (dark?"#451a03":"#fef3c7") : (dark?"#450a0a":"#fee2e2")

  const fmtTarget = t =>
    t >= 1000000 ? `SAR ${(t/1000000).toFixed(1)}M` :
    t >= 1000    ? `${(t/1000).toFixed(0)}K` :
    t.toLocaleString()

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 120)
    return () => clearTimeout(timer)
  }, [pct])

  return (
    <div style={{ marginTop:"12px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
        <span style={{ fontSize:"10px", color:"var(--text-muted)", letterSpacing:"0.04em" }}>TARGET</span>
        <span style={{ fontSize:"11px", fontWeight:"600", padding:"2px 7px", borderRadius:"20px", background:labelBg, color:labelColor }}>
          {pct}%
        </span>
      </div>
      <div style={{ height:"5px", borderRadius:"99px", background:trackBg, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:"99px", background:barColor, width:`${width}%`, transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <div style={{ marginTop:"4px", fontSize:"10px", color:"var(--text-muted)", textAlign:"right" }}>
        of {fmtTarget(target)}
      </div>
    </div>
  )
}

export default function KPICards({ data, cardStyle, dark, t }) {
  const totalRevenue = data.reduce((s,r)=>s+parseFloat(r.NET_PRICE||0),0)
  const totalQty     = data.reduce((s,r)=>s+parseFloat(r.QTY||0),0)
  const branches     = [...new Set(data.map(r=>r.LOCATION_DESC))].length
  const products     = [...new Set(data.map(r=>r.ITM_DESC))].length

  const cards = [
    { label:t.totalRevenue, value:Math.round(totalRevenue), prefix:"SAR ", accent:"#38bdf8", target:TARGETS.revenue  },
    { label:t.unitsSold,    value:Math.round(totalQty),     prefix:"",     accent:"#34d399", target:TARGETS.qty      },
    { label:t.branches,     value:branches,                 prefix:"",     accent:"#f472b6", target:TARGETS.branches  },
    { label:t.products,     value:products,                 prefix:"",     accent:"#fb923c", target:TARGETS.products  },
  ]

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"1.5rem" }}>
      {cards.map(c=>(
        <div key={c.label} style={{ ...cardStyle, padding:"20px", borderTop:`3px solid ${c.accent}` }}>
          <p style={{ fontSize:"11px", color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"8px" }}>{c.label}</p>
          <p style={{ fontSize:"24px", fontWeight:"500", color:"var(--text)", margin:0 }}>
            <AnimatedNumber target={c.value} prefix={c.prefix} />
          </p>
          <ProgressBar value={c.value} target={c.target} dark={dark} />
        </div>
      ))}
    </div>
  )
}
