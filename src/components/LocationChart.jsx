import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, Cell, Legend } from "recharts"

const COLORS = ["#7dd3fc","#6ee7b7","#f9a8d4","#fdba74","#c4b5fd","#fde68a","#86efac","#fca5a5","#67e8f9","#d8b4fe","#bbf7d0","#fed7aa","#bae6fd","#a5f3fc","#e9d5ff"]

export default function LocationChart({ data, cardStyle, dark, t, dir }) {
  const locationMap = {}
  data.forEach(r => {
    const loc = r.LOCATION_DESC||"Unknown"
    if(!locationMap[loc]) locationMap[loc] = { total:0, byMonth:{} }
    locationMap[loc].total += parseFloat(r.NET_PRICE||0)
    const m = r.MONTH
    locationMap[loc].byMonth[m] = (locationMap[loc].byMonth[m]||0)+parseFloat(r.NET_PRICE||0)
  })

  const totalRevenue = Object.values(locationMap).reduce((s,v)=>s+v.total,0)
  const months = [...new Set(data.map(r=>r.MONTH))].sort()

  const chartData = Object.entries(locationMap)
    .map(([name,v])=>{
      const pct = parseFloat((v.total/totalRevenue*100).toFixed(1))
      let growth = 0
      if(months.length>=2){
        const last = v.byMonth[months[months.length-1]]||0
        const prev = v.byMonth[months[months.length-2]]||0
        growth = prev>0 ? parseFloat(((last-prev)/prev*100).toFixed(1)) : 0
      }
      return { name, revenue:Math.round(v.total), pct, growth }
    })
    .sort((a,b)=>b.revenue-a.revenue)

  const axisColor = dark?"#e2e8f0":"#374151"
  const gridColor = dark?"#334155":"#e5e7eb"
  const isRTL = dir==="rtl"

  return (
    <div style={{ ...cardStyle, padding:"20px", marginTop:"1.5rem", marginBottom:"1.5rem" }}>
      <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"4px", color:"var(--text)" }}>
        Location Performance
      </h2>
      <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"16px" }}>
        Bars = Revenue Share % · Line = MoM Growth %
      </p>
      <ResponsiveContainer width="100%" height={460}>
        <ComposedChart data={chartData}
          margin={{ top:20, right: isRTL?10:60, left: isRTL?60:10, bottom:160 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name"
            tick={{ fontSize:11, fontWeight:"700", fill:axisColor }}
            angle={-45} textAnchor="end" interval={0}
            height={160}
          />
          <YAxis yAxisId="left" orientation={isRTL?"right":"left"}
            tick={{ fontSize:11, fontWeight:"700", fill:axisColor }}
            tickFormatter={v=>`${v}%`} width={45} />
          <YAxis yAxisId="right" orientation={isRTL?"left":"right"}
            tick={{ fontSize:11, fontWeight:"700", fill:"#f472b6" }}
            tickFormatter={v=>`${v}%`} width={45} />
          <Tooltip
            contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px", fontSize:"12px" }}
            formatter={(v,name)=>[`${v}%`, name==="pct"?"Revenue Share %":"MoM Growth %"]}
          />
          <Legend wrapperStyle={{ fontSize:"11px", color:"var(--text)", paddingTop:"8px" }} />
          <Bar yAxisId="left" dataKey="pct" name="Revenue Share %" radius={[6,6,0,0]}>
            {chartData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="growth" name="MoM Growth %"
            stroke="#f472b6" strokeWidth={2.5} dot={{ fill:"#f472b6", r:4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}