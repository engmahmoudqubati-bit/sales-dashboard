import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = ["#7dd3fc","#6ee7b7","#f9a8d4","#fdba74","#c4b5fd","#fde68a","#86efac","#fca5a5","#67e8f9","#d8b4fe"]

const renderLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  if(percent < 0.04) return null
  const RADIAN = Math.PI/180
  const radius = outerRadius+35
  const x = cx+radius*Math.cos(-midAngle*RADIAN)
  const y = cy+radius*Math.sin(-midAngle*RADIAN)
  return (
    <text x={x} y={y} textAnchor={x>cx?"start":"end"} dominantBaseline="central"
      style={{ fontSize:"11px", fontWeight:"700", fill:"var(--text)" }}>
      {`${(percent*100).toFixed(1)}%`}
    </text>
  )
}

export default function PieChartBranch({ data, cardStyle, t }) {
  const branchMap = {}
  data.forEach(r => {
    const b = r.LOCATION_DESC||"Unknown"
    branchMap[b] = (branchMap[b]||0)+parseFloat(r.NET_PRICE||0)
  })
  const chartData = Object.entries(branchMap)
    .map(([name,value])=>({ name, value:Math.round(value) }))
    .sort((a,b)=>b.value-a.value)
    .slice(0,10)

  return (
    <div style={{ ...cardStyle, padding:"20px" }}>
      <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"16px", color:"var(--text)" }}>{t.revenueByBranch}</h2>
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name"
            cx="50%" cy="50%" innerRadius={60} outerRadius={110}
            labelLine label={renderLabel}>
            {chartData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} stroke="none" />)}
          </Pie>
          <Tooltip
            contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px", fontSize:"12px" }}
            formatter={v=>`SAR ${v.toLocaleString()}`}
          />
          <Legend wrapperStyle={{ fontSize:"11px", color:"var(--text)" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}