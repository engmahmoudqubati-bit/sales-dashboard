import { useState, useEffect } from "react"
import { T } from "./lang"
import KPICards from "./components/KPICards"
import BranchChart from "./components/BranchChart"
import PieChartProduct from "./components/PieChartProduct"
import PieChartBranch from "./components/PieChartBranch"
import MonthComparison from "./components/MonthComparison"
import StatsPanel from "./components/StatsPanel"
import AIAgent from "./components/AIAgent"
import Filters from "./components/Filters"
import Top5Products from "./components/Top5Products"

export default function App() {
  const [data,    setData]    = useState([])
  const [dark,    setDark]    = useState(false)
  const [lang,    setLang]    = useState("en")
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ branch:"All", product:"All", month:"All" })

  const t   = T[lang]
  const dir = lang==="ar" ? "rtl" : "ltr"

  useEffect(() => {
    fetch("https://sales-api-production-da66.up.railway.app/api/sales")
      .then(res => res.json())
      .then(apiData => {
        const formatted = apiData.map(r => ({
          LOCATION_DESC: r.location_desc,
          ITM_DESC:      r.itm_desc,
          BARCODE:       r.barcode,
          ITM_CODE:      r.itm_code,
          SCN_CODE:      r.scn_code,
          SCN_DESC:      r.scn_desc,
          UNIT_DESC:     r.unit_desc,
          QTY:           String(r.qty),
          UNIT_PRICE:    String(r.unit_price),
          NET_PRICE:     String(r.net_price),
          MONTH:         String(r.month),
          YEAR:          String(r.year),
          DAY:           String(r.day)
        }))
        setData(formatted)
        setLoading(false)
      })
      .catch(err => {
        console.error("API Error:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir)
    const root = document.documentElement
    if(dark){
      root.style.setProperty("--bg",         "#0f172a")
      root.style.setProperty("--card",       "#1e293b")
      root.style.setProperty("--text",       "#f1f5f9")
      root.style.setProperty("--text-muted", "#94a3b8")
      root.style.setProperty("--border",     "#334155")
      root.style.setProperty("--accent",     "#38bdf8")
      document.body.style.background = "#0f172a"
    } else {
      root.style.setProperty("--bg",         "#f3f4f6")
      root.style.setProperty("--card",       "#ffffff")
      root.style.setProperty("--text",       "#111827")
      root.style.setProperty("--text-muted", "#6b7280")
      root.style.setProperty("--border",     "#e5e7eb")
      root.style.setProperty("--accent",     "#2563eb")
      document.body.style.background = "#f3f4f6"
    }
  }, [dark, dir])

  const filtered = data.filter(r => {
    const matchBranch  = filters.branch==="All"  || r.LOCATION_DESC===filters.branch
    const matchProduct = filters.product==="All" || r.ITM_DESC===filters.product
    const matchMonth   = filters.month==="All"   || r.MONTH===filters.month
    return matchBranch && matchProduct && matchMonth
  })

  const cardStyle = {
    background:"var(--card)", color:"var(--text)", borderRadius:"10px",
    boxShadow: dark?"0 1px 4px rgba(0,0,0,0.4)":"0 1px 4px rgba(0,0,0,0.08)"
  }

  if(loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", fontSize:"18px", color:"#6b7280" }}>
      Loading dashboard... ⏳
    </div>
  )

  return (
    <div style={{ padding:"2rem", maxWidth:"1400px", margin:"0 auto", color:"var(--text)", direction:dir }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <h1 style={{ fontSize:"26px", fontWeight:"700", color:"var(--text)" }}>{t.title}</h1>
          {filtered.length!==data.length&&(
            <p style={{ fontSize:"12px", color:"var(--accent)", marginTop:"4px" }}>
              {t.showing} {filtered.length} {t.of} {data.length} {t.records}
            </p>
          )}
        </div>
        <div style={{ display:"flex", gap:"10px", alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:"13px", color:"var(--text-muted)" }}>Live data ✅</span>
          <button onClick={()=>setLang(l=>l==="en"?"ar":"en")}
            style={{ padding:"8px 16px", borderRadius:"8px", border:"0.5px solid var(--border)", background:"var(--card)", color:"var(--text)", fontSize:"13px", cursor:"pointer", fontWeight:"500" }}>
            {lang==="en"?t.arabic:t.english}
          </button>
          <button onClick={()=>setDark(d=>!d)}
            style={{ padding:"8px 16px", borderRadius:"8px", border:"0.5px solid var(--border)", background:"var(--card)", color:"var(--text)", fontSize:"13px", cursor:"pointer", fontWeight:"500" }}>
            {dark?t.light:t.dark}
          </button>
        </div>
      </div>

      {data.length>0&&(
        <>
          <Filters         data={data}     filters={filters} setFilters={setFilters} t={t} dir={dir} />
          <KPICards        data={filtered} cardStyle={cardStyle} dark={dark} t={t} />
          <MonthComparison data={filtered} cardStyle={cardStyle} dark={dark} t={t} dir={dir} />
          <StatsPanel      data={filtered} cardStyle={cardStyle} dark={dark} t={t} />
          <BranchChart     data={filtered} cardStyle={cardStyle} dark={dark} t={t} dir={dir} />
          <Top5Products    data={filtered} cardStyle={cardStyle} dark={dark} t={t} dir={dir} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginTop:"1.5rem" }}>
            <PieChartProduct data={filtered} cardStyle={cardStyle} t={t} />
            <PieChartBranch  data={filtered} cardStyle={cardStyle} t={t} />
          </div>
          <AIAgent data={filtered} cardStyle={cardStyle} dark={dark} t={t} />
        </>
      )}
    </div>
  )
}