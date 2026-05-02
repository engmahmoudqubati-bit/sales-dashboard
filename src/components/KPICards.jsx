import { useEffect, useState } from "react"

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

export default function KPICards({ data, cardStyle, dark, t }) {
  const totalRevenue = data.reduce((s,r)=>s+parseFloat(r.NET_PRICE||0),0)
  const totalQty     = data.reduce((s,r)=>s+parseFloat(r.QTY||0),0)
  const branches     = [...new Set(data.map(r=>r.LOCATION_DESC))].length
  const products     = [...new Set(data.map(r=>r.ITM_DESC))].length

  const cards = [
    { label:t.totalRevenue, value:Math.round(totalRevenue), prefix:"SAR ", accent:"#38bdf8" },
    { label:t.unitsSold,    value:Math.round(totalQty),     prefix:"",     accent:"#34d399" },
    { label:t.branches,     value:branches,                 prefix:"",     accent:"#f472b6" },
    { label:t.products,     value:products,                 prefix:"",     accent:"#fb923c" },
  ]

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"1.5rem" }}>
      {cards.map(c=>(
        <div key={c.label} style={{ ...cardStyle, padding:"20px", borderTop:`3px solid ${c.accent}` }}>
          <p style={{ fontSize:"11px", color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"8px" }}>{c.label}</p>
          <p style={{ fontSize:"24px", fontWeight:"500", color:"var(--text)" }}>
            <AnimatedNumber target={c.value} prefix={c.prefix} />
          </p>
        </div>
      ))}
    </div>
  )
}