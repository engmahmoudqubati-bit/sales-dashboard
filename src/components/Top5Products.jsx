import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, Cell } from "recharts"

const COLORS = ["#7dd3fc","#6ee7b7","#f9a8d4","#fdba74","#c4b5fd"]

export default function Top5Products({ data, cardStyle, dark, t, dir }) {
  const productMap = {}
  data.forEach(r => {
    const p = r.ITM_DESC||"Unknown"
    productMap[p] = (productMap[p]||0)+parseFloat(r.NET_PRICE||0)
  })
  const chartData = Object.entries(productMap)
    .map(([name,value])=>({ name, value:Math.round(value) }))
    .sort((a,b)=>b.value-a.value)
    .slice(0,5)

  const axisColor = dark?"#e2e8f0":"#374151"
  const gridColor = dark?"#334155":"#e5e7eb"

  return (
    <div style={{ ...cardStyle, padding:"20px", marginTop:"1.5rem" }}>
      <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"16px", color:"var(--text)" }}>{t.top5Products}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top:10, right: dir==="rtl"?10:140, left: dir==="rtl"?140:10, bottom:10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis
            type="number"
            orientation={dir==="rtl"?"top":"bottom"}
            tick={{ fontSize:12, fontWeight:"700", fill:axisColor }}
            tickFormatter={v=>`SAR ${v.toLocaleString()}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            orientation={dir==="rtl"?"right":"left"}
            tick={{ fontSize:12, fontWeight:"700", fill:axisColor }}
            width={140}
          />
          <Tooltip
            contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px" }}
            formatter={v=>[`SAR ${v.toLocaleString()}`,"Revenue"]}
          />
          <Bar dataKey="value" radius={[0,6,6,0]}>
            {chartData.map((_,i)=><Cell key={i} fill={COLORS[i]} />)}
            <LabelList
              dataKey="value"
              position={dir==="rtl"?"left":"right"}
              formatter={v=>`SAR ${v.toLocaleString()}`}
              style={{ fontSize:"12px", fontWeight:"700", fill:axisColor }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}