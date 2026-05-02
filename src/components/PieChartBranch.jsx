import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = ["#7dd3fc","#6ee7b7","#f9a8d4","#fdba74","#c4b5fd","#fde68a","#86efac","#fca5a5","#67e8f9","#d8b4fe"]

const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  if(percent < 0.03) return null
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 45
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const shortName = name?.length > 12 ? name.substring(0, 12) + '...' : name
  return (
    <text x={x} y={y} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central"
      style={{ fontSize:"10px", fontWeight:"600", fill:"var(--text)" }}>
      {`${shortName} ${(percent*100).toFixed(1)}%`}
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
      <ResponsiveContainer width="100%" height={420}>
        <PieChart margin={{ top:20, right:80, bottom:20, left:80 }}>
          <Pie data={chartData} dataKey="value" nameKey="name"
            cx="50%" cy="50%" innerRadius={70} outerRadius={130}
            labelLine={{ stroke:"var(--text-muted)", strokeWidth:0.5 }}
            label={renderLabel}>
            {chartData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} stroke="none" />)}
          </Pie>
          <Tooltip
            contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px", fontSize:"12px" }}
            formatter={v=>`SAR ${v.toLocaleString()}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}