import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, Cell } from "recharts"

const TOP_COLORS    = ["#7dd3fc","#6ee7b7","#f9a8d4","#fdba74","#c4b5fd"]
const BOTTOM_COLORS = ["#fca5a5","#fcd34d","#d8b4fe","#a5b4fc","#6ee7b7"]

export default function Top5Products({ data, cardStyle, dark, t, dir }) {
  const productMap = {}
  data.forEach(r => {
    const p = r.ITM_DESC||"Unknown"
    productMap[p] = (productMap[p]||0)+parseFloat(r.NET_PRICE||0)
  })
  const sorted = Object.entries(productMap)
    .map(([name,value])=>({ name, value:Math.round(value) }))
    .sort((a,b)=>b.value-a.value)

  const top5    = sorted.slice(0,5)
  const bottom5 = sorted.slice(-5).reverse()

  const axisColor = dark?"#e2e8f0":"#374151"
  const gridColor = dark?"#334155":"#e5e7eb"

  const chartProps = {
    layout:"vertical",
    margin:{ top:10, right:130, left:10, bottom:10 }
  }

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginTop:"1.5rem" }}>
      {/* Top 5 */}
      <div style={{ ...cardStyle, padding:"20px" }}>
        <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"16px", color:"var(--text)" }}>
          🏆 {t.top5Products}
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={top5} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fontSize:11, fontWeight:"700", fill:axisColor }} tickFormatter={v=>`SAR ${(v/1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize:11, fontWeight:"700", fill:axisColor }} width={130} />
            <Tooltip contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px" }} formatter={v=>[`SAR ${v.toLocaleString()}`,"Revenue"]} />
            <Bar dataKey="value" radius={[0,6,6,0]}>
              {top5.map((_,i)=><Cell key={i} fill={TOP_COLORS[i]} />)}
              <LabelList dataKey="value" position="right" formatter={v=>`SAR ${(v/1000).toFixed(1)}K`} style={{ fontSize:"11px", fontWeight:"700", fill:axisColor }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom 5 */}
      <div style={{ ...cardStyle, padding:"20px" }}>
        <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"16px", color:"var(--text)" }}>
          📉 Bottom 5 Products
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={bottom5} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fontSize:11, fontWeight:"700", fill:axisColor }} tickFormatter={v=>`SAR ${(v/1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize:11, fontWeight:"700", fill:axisColor }} width={130} />
            <Tooltip contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px" }} formatter={v=>[`SAR ${v.toLocaleString()}`,"Revenue"]} />
            <Bar dataKey="value" radius={[0,6,6,0]}>
              {bottom5.map((_,i)=><Cell key={i} fill={BOTTOM_COLORS[i]} />)}
              <LabelList dataKey="value" position="right" formatter={v=>`SAR ${(v/1000).toFixed(1)}K`} style={{ fontSize:"11px", fontWeight:"700", fill:axisColor }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}