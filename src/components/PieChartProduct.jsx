import { Treemap, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ["#38bdf8","#f472b6","#34d399","#fb923c","#a78bfa","#facc15","#f87171","#2dd4bf","#e879f9","#818cf8"]

const CustomContent = ({ x, y, width, height, name, value, index }) => {
  if (width < 30 || height < 20) return null
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={COLORS[index % COLORS.length]} rx={6} stroke="var(--card)" strokeWidth={2} />
      {width > 60 && height > 35 && (
        <>
          <text x={x+width/2} y={y+height/2-8} textAnchor="middle" fill="#fff" fontSize={11} fontWeight="700">{name}</text>
          <text x={x+width/2} y={y+height/2+10} textAnchor="middle" fill="#fff" fontSize={11} fontWeight="600">SAR {value?.toLocaleString()}</text>
        </>
      )}
    </g>
  )
}

export default function PieChartProduct({ data, cardStyle, t }) {
  const productMap = {}
  data.forEach(r => {
    const p = r.ITM_DESC||"Unknown"
    productMap[p] = (productMap[p]||0)+parseFloat(r.NET_PRICE||0)
  })
  const chartData = Object.entries(productMap)
    .map(([name,value])=>({ name, value:Math.round(value) }))
    .sort((a,b)=>b.value-a.value)

  return (
    <div style={{ ...cardStyle, padding:"20px" }}>
      <h2 style={{ fontSize:"15px", fontWeight:"500", marginBottom:"16px", color:"var(--text)" }}>{t.revenueProduct}</h2>
      <ResponsiveContainer width="100%" height={360}>
        <Treemap data={chartData} dataKey="value" aspectRatio={4/3} content={<CustomContent />}>
          <Tooltip contentStyle={{ background:"var(--card)", border:"0.5px solid var(--border)", color:"var(--text)", borderRadius:"8px", fontSize:"12px" }} formatter={v=>`SAR ${v.toLocaleString()}`} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}