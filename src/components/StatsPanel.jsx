import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts"

function GaugeCard({ label, value, max, color, format, dark }) {
  const pct = max > 0 ? Math.min((value/max)*100, 100) : 0
  const data = [{ value: pct }]
  return (
    <div style={{ background:"var(--card)", borderRadius:"10px", border:"0.5px solid var(--border)", padding:"16px", textAlign:"center" }}>
      <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"4px", fontWeight:"500" }}>{label}</p>
      <div style={{ position:"relative", height:"110px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="85%" innerRadius="55%" outerRadius="95%"
            startAngle={180} endAngle={0} data={data}>
            <PolarAngleAxis type="number" domain={[0,100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: dark?"#334155":"#e5e7eb" }}
              dataKey="value" cornerRadius={6} fill={color} angleAxisId={0} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ position:"absolute", bottom:"4px", left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap" }}>
          <p style={{ fontSize:"14px", fontWeight:"700", color:"var(--text)", margin:0 }}>{format(value)}</p>
        </div>
      </div>
    </div>
  )
}

export default function StatsPanel({ data, cardStyle, dark, t }) {
  if(!data.length) return null

  const prices  = data.map(r=>parseFloat(r.NET_PRICE||0))
  const total   = prices.reduce((s,v)=>s+v,0)
  const mean    = total/(prices.length||1)
  const sorted  = [...prices].sort((a,b)=>a-b)
  const median  = sorted.length%2===0
    ? (sorted[sorted.length/2-1]+sorted[sorted.length/2])/2
    : sorted[Math.floor(sorted.length/2)]
  const stdDev  = Math.sqrt(prices.reduce((s,v)=>s+Math.pow(v-mean,2),0)/(prices.length||1))
  const max     = sorted[sorted.length-1]
  const min     = sorted[0]

  const fmtK = v => v >= 1000 ? `SAR ${(v/1000).toFixed(1)}K` : `SAR ${Math.round(v)}`

  const gauges = [
    { label:t.mean,   value:mean,   color:"#38bdf8" },
    { label:t.median, value:median, color:"#34d399" },
    { label:t.stdDev, value:stdDev, color:"#f472b6" },
    { label:t.max,    value:max,    color:"#fb923c" },
    { label:t.min,    value:min,    color:"#a78bfa" },
  ]

  return (
    <div style={{ ...cardStyle, padding:"20px", marginBottom:"1.5rem" }}>
      <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"16px", color:"var(--text)" }}>
        {t.statisticalAnalysis}
      </h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"12px" }}>
        {gauges.map(g=>(
          <GaugeCard key={g.label} label={g.label} value={g.value}
            max={max} color={g.color} format={fmtK} dark={dark} />
        ))}
      </div>
    </div>
  )
}