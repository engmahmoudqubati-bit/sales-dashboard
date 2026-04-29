export default function Filters({ data, filters, setFilters, t, dir }) {
  const branches = ["All", ...new Set(data.map(r => r.LOCATION_DESC).filter(Boolean))]
  const products = ["All", ...new Set(data.map(r => r.ITM_DESC).filter(Boolean))]
  const months   = ["All", ...new Set(data.map(r => r.MONTH).filter(Boolean))].sort()
  const monthNames = {1:t.jan,2:t.feb,3:t.mar,4:t.apr,5:t.may,6:t.jun,7:t.jul,8:t.aug,9:t.sep,10:t.oct,11:t.nov,12:t.dec}

  const selectStyle = {
    padding:"8px 12px", borderRadius:"8px",
    border:"0.5px solid var(--border)",
    background:"var(--card)", color:"var(--text)",
    fontSize:"13px", cursor:"pointer", outline:"none", direction:dir
  }

  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", marginBottom:"1.5rem", alignItems:"center", direction:dir }}>
      <span style={{ fontSize:"13px", color:"var(--text-muted)", fontWeight:"500" }}>{t.filterBy}</span>
      <select style={selectStyle} value={filters.branch} onChange={e=>setFilters(f=>({...f,branch:e.target.value}))}>
        {branches.map(b=><option key={b} value={b}>{b==="All"?t.allBranches:b}</option>)}
      </select>
      <select style={selectStyle} value={filters.product} onChange={e=>setFilters(f=>({...f,product:e.target.value}))}>
        {products.map(p=><option key={p} value={p}>{p==="All"?t.allProducts:p}</option>)}
      </select>
      <select style={selectStyle} value={filters.month} onChange={e=>setFilters(f=>({...f,month:e.target.value}))}>
        {months.map(m=><option key={m} value={m}>{m==="All"?t.allMonths:monthNames[parseInt(m)]||m}</option>)}
      </select>
      {(filters.branch!=="All"||filters.product!=="All"||filters.month!=="All") && (
        <button onClick={()=>setFilters({branch:"All",product:"All",month:"All"})}
          style={{ padding:"8px 14px", borderRadius:"8px", border:"0.5px solid #ef4444", background:"transparent", color:"#ef4444", fontSize:"13px", cursor:"pointer" }}>
          {t.clear}
        </button>
      )}
    </div>
  )
}