import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { monthName } from "../lang"

const COLORS = ["#7dd3fc","#6ee7b7","#f9a8d4","#fdba74","#c4b5fd","#fde68a","#86efac","#fca5a5","#67e8f9","#d8b4fe","#bbf7d0","#fed7aa","#bae6fd","#a5f3fc","#e9d5ff"]

export default function LocationMonthChart({ data, cardStyle, dark, t, dir }) {
  const months  = [...new Set(data.map(r=>r.MONTH))].sort((a,b)=>parseInt(a)-parseInt(b))
  const locations = [...new Set(data.map(r=>r.LOCATION_DESC))].filter(Boolean)

  const chartData = months.map(m => {
    const row = { month: monthName(m, t) }
    locations.forEach(loc => {
      const total = data
        .filter(r => r.MONTH===m && r.LOCATION_DESC===loc)
        .reduce((s,r)=>s+parseFloat(r.NET_PRICE||0),0)
      row[loc] = Math.round(total)
    })
    return row
  })

  const axisColor = dark?"#e2e8f0":"#374151"
  const gridColor = dark?"#334155":"#e5e7eb"
  const isRTL = dir==="rtl"

  return (
    <div style={{ ...cardStyle, padding:"20px", marginTop:"1.5rem", marginBottom:"1.5rem" }}>
      <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"4px", color:"var(--text)" }}>
        Sales per Location by Month
      </h2>
      <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"16px" }}>
        Each group = one month · Each bar = one location
      </p>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={chartData}
          margin={{ top:20, right: isRTL?10:30, left: isRTL?90:10, bottom:20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fontSize:12, fontWeight:"700", fill:axisColor }} />
          <YAxis orientation={isRTL?"right":"left"} tick={{ fontSize:11, fontWeight:"700", fill:axisColor }}
            tickFormatter={v=>`${(v/1000).toFixed(0)}K`} width={60} />
          <Tooltip
            contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px", fontSize:"11px" }}
            formatter={(v,name)=>[`SAR ${v.toLocaleString()}`, name]}
          />
          <Legend wrapperStyle={{ fontSize:"11px", color:"var(--text)", paddingTop:"12px" }} />
          {locations.map((loc,i)=>(
            <Bar key={loc} dataKey={loc} fill={COLORS[i%COLORS.length]} radius={[3,3,0,0]} maxBarSize={20} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}