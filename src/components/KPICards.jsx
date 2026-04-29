export default function KPICards({ data, cardStyle, dark, t }) {
  const totalRevenue = data.reduce((s,r)=>s+parseFloat(r.NET_PRICE||0),0)
  const totalQty     = data.reduce((s,r)=>s+parseFloat(r.QTY||0),0)
  const branches     = [...new Set(data.map(r=>r.LOCATION_DESC))].length
  const products     = [...new Set(data.map(r=>r.ITM_DESC))].length

  const cards = [
    { label:t.totalRevenue, value:`SAR ${Math.round(totalRevenue).toLocaleString()}`, accent:"#38bdf8" },
    { label:t.unitsSold,    value:Math.round(totalQty).toLocaleString(),              accent:"#34d399" },
    { label:t.branches,     value:branches,                                           accent:"#f472b6" },
    { label:t.products,     value:products,                                           accent:"#fb923c" },
  ]

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"1.5rem" }}>
      {cards.map(c=>(
        <div key={c.label} style={{ ...cardStyle, padding:"20px", borderTop:`3px solid ${c.accent}` }}>
          <p style={{ fontSize:"11px", color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"8px" }}>{c.label}</p>
          <p style={{ fontSize:"24px", fontWeight:"500", color:"var(--text)" }}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}