import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, ReferenceLine, Cell } from "recharts"

const COLORS = ["#7dd3fc","#6ee7b7","#f9a8d4","#fdba74","#c4b5fd","#fde68a","#86efac","#fca5a5","#67e8f9","#d8b4fe","#bbf7d0","#fed7aa","#bae6fd","#a5f3fc","#e9d5ff"]

export default function BranchChart({ data, cardStyle, dark, t, dir }) {
  const branchMap = {}
  data.forEach(r => {
    const b = r.LOCATION_DESC||"Unknown"
    branchMap[b] = (branchMap[b]||0)+parseFloat(r.NET_PRICE||0)
  })
  const chartData = Object.entries(branchMap)
    .map(([branch,revenue])=>({ branch, revenue:Math.round(revenue) }))
    .sort((a,b)=>b.revenue-a.revenue)

  const avg = Math.round(chartData.reduce((s,d)=>s+d.revenue,0)/(chartData.length||1))
  const axisColor = dark?"#e2e8f0":"#374151"
  const gridColor = dark?"#334155":"#e5e7eb"

  return (
    <div style={{ ...cardStyle, padding:"20px", marginBottom:"1.5rem" }}>
      <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"16px", color:"var(--text)" }}>{t.revenueBranch}</h2>
      <ResponsiveContainer width="100%" height={460}>
        <BarChart
          data={chartData}
          margin={{ top:36, right: dir==="rtl"?10:30, left: dir==="rtl"?110:10, bottom:130 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="branch"
            tick={{ fontSize:12, fontWeight:"800", fill:axisColor }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            orientation={dir==="rtl"?"right":"left"}
            tick={{ fontSize:12, fontWeight:"700", fill:axisColor }}
            tickFormatter={v=>`SAR ${v.toLocaleString()}`}
            width={105}
          />
          <Tooltip
            contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px" }}
            formatter={v=>[`SAR ${v.toLocaleString()}`,"Revenue"]}
          />
          <ReferenceLine y={avg} stroke="#f472b6" strokeDasharray="5 5" strokeWidth={2}
            label={{ value:`${t.mean}: SAR ${avg.toLocaleString()}`, position:"insideTopRight", fill:"#f472b6", fontSize:11, fontWeight:"700" }}
          />
          <Bar dataKey="revenue" radius={[6,6,0,0]}>
            {chartData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
            <LabelList dataKey="revenue" position="top" formatter={v=>`SAR ${v.toLocaleString()}`}
              style={{ fontSize:"11px", fontWeight:"700", fill:axisColor }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}