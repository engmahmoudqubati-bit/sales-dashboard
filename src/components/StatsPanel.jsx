import { monthName } from "../lang"
export default function StatsPanel({ data, cardStyle, dark, t }) {
  function calcStats(arr) {
    if(!arr.length) return {}
    const sorted = [...arr].sort((a,b)=>a-b)
    const mean   = arr.reduce((s,v)=>s+v,0)/arr.length
    const median = sorted.length%2===0?(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2:sorted[Math.floor(sorted.length/2)]
    const stdDev = Math.sqrt(arr.reduce((s,v)=>s+Math.pow(v-mean,2),0)/arr.length)
    return { mean:Math.round(mean), median:Math.round(median), stdDev:Math.round(stdDev), min:Math.round(sorted[0]), max:Math.round(sorted[sorted.length-1]) }
  }
  const months = [...new Set(data.map(r=>r.MONTH))].sort()
  return (
    <div style={{ ...cardStyle, padding:"20px", marginBottom:"1.5rem" }}>
      <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"16px", color:"var(--text)" }}>{t.statisticalAnalysis}</h2>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.max(months.length,1)},1fr)`, gap:"16px" }}>
        {months.map(m=>{
          const s = calcStats(data.filter(r=>r.MONTH===m).map(r=>parseFloat(r.NET_PRICE||0)))
          return (
            <div key={m} style={{ border:"0.5px solid var(--border)", borderRadius:"8px", padding:"16px" }}>
              <p style={{ fontSize:"13px", fontWeight:"500", color:"var(--accent)", marginBottom:"12px", textAlign:"center" }}>
                {monthName(m,t)} {data.find(r=>r.MONTH===m)?.YEAR||""}
              </p>
              {[[t.mean,s.mean],[t.median,s.median],[t.stdDev,s.stdDev],[t.min,s.min],[t.max,s.max]].map(([label,val])=>(
                <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"0.5px solid var(--border)" }}>
                  <span style={{ fontSize:"12px", color:"var(--text-muted)" }}>{label}</span>
                  <span style={{ fontSize:"12px", fontWeight:"500", color:"var(--text)" }}>SAR {val?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}