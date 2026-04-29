import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, ReferenceLine, Cell } from "recharts"
import { monthName } from "../lang"

const BAR_COLORS = ["#7dd3fc","#6ee7b7","#f9a8d4","#fdba74","#c4b5fd","#fde68a"]

export default function MonthComparison({ data, cardStyle, dark, t, dir }) {
  const monthMap = {}
  data.forEach(r => {
    const m = r.MONTH||"?"
    if(!monthMap[m]) monthMap[m] = { month: monthName(m,t), revenue:0 }
    monthMap[m].revenue += parseFloat(r.NET_PRICE||0)
  })
  const chartData = Object.values(monthMap).map(m=>({...m, revenue:Math.round(m.revenue)}))
  const arr = Object.entries(monthMap).sort((a,b)=>parseInt(a[0])-parseInt(b[0]))
  const mom = arr.length>=2
    ? (((arr[arr.length-1][1].revenue-arr[arr.length-2][1].revenue)/arr[arr.length-2][1].revenue)*100).toFixed(1)
    : null
  const avg = Math.round(chartData.reduce((s,d)=>s+d.revenue,0)/(chartData.length||1))
  const axisColor = dark?"#e2e8f0":"#374151"
  const gridColor = dark?"#334155":"#e5e7eb"

  return (
    <div style={{ ...cardStyle, padding:"20px", marginBottom:"1.5rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
        <h2 style={{ fontSize:"15px", fontWeight:"500", color:"var(--text)" }}>{t.monthComparison}</h2>
        {mom && (
          <span style={{ fontSize:"13px", background:parseFloat(mom)>=0?"#dcfce7":"#fee2e2", color:parseFloat(mom)>=0?"#166534":"#991b1b", padding:"4px 10px", borderRadius:"20px", fontWeight:"600" }}>
            {parseFloat(mom)>=0?"+":""}{mom}% MoM
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top:36, right: dir==="rtl"?10:30, left: dir==="rtl"?100:10, bottom:5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fontSize:13, fontWeight:"700", fill:axisColor }} />
          <YAxis
            orientation={dir==="rtl"?"right":"left"}
            tick={{ fontSize:12, fontWeight:"700", fill:axisColor }}
            tickFormatter={v=>`SAR ${v.toLocaleString()}`}
            width={90}
          />
          <Tooltip
            contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px" }}
            formatter={v=>[`SAR ${v.toLocaleString()}`,"Revenue"]}
          />
          <ReferenceLine y={avg} stroke="#f472b6" strokeDasharray="5 5" strokeWidth={2}
            label={{ value:`${t.mean}: SAR ${avg.toLocaleString()}`, position:"insideTopRight", fill:"#f472b6", fontSize:11, fontWeight:"700" }}
          />
          <Bar dataKey="revenue" radius={[6,6,0,0]}>
            {chartData.map((_,i)=><Cell key={i} fill={BAR_COLORS[i%BAR_COLORS.length]} />)}
            <LabelList dataKey="revenue" position="top" formatter={v=>`SAR ${v.toLocaleString()}`}
              style={{ fontSize:"12px", fontWeight:"700", fill:axisColor }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}