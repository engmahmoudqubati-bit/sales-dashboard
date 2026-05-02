import { useState, useCallback, useRef } from "react"

// ─── Typing animation ──────────────────────────────────────────────────────────
function TypedText({ text }) {
  const [displayed, setDisplayed] = useState("")
  const timerRef = useRef(null)

  // Reset and retype whenever text changes
  useState(() => {
    setDisplayed("")
    let i = 0
    clearInterval(timerRef.current)
    if (!text) return
    timerRef.current = setInterval(() => {
      i += 3
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timerRef.current)
        setDisplayed(text)
      }
    }, 14)
    return () => clearInterval(timerRef.current)
  }, [text])

  return <span>{displayed}</span>
}

// ─── Skeleton loader ───────────────────────────────────────────────────────────
function Skeleton({ dark }) {
  const bg = dark ? "#334155" : "#e5e7eb"
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {[100, 90, 68].map((w, i) => (
        <div
          key={i}
          style={{
            height: 13,
            width: `${w}%`,
            borderRadius: 6,
            background: bg,
            animation: `aiPulse 1.4s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function AIInsightPanel({ data, cardStyle, dark, t, filters, lang }) {
  const [insight, setInsight]   = useState("")
  const [status,  setStatus]    = useState("idle")   // idle | loading | done | error
  const [errMsg,  setErrMsg]    = useState("")
  const [updatedAt, setUpdatedAt] = useState(null)
  const cacheRef  = useRef({})
  const dir = lang === "ar" ? "rtl" : "ltr"

  // ── Build KPI snapshot from real data ──────────────────────────────────────
  function buildContext() {
    const totalRevenue = data.reduce((s, r) => s + parseFloat(r.NET_PRICE || 0), 0)
    const totalQty     = data.reduce((s, r) => s + parseFloat(r.QTY || 0), 0)
    const branches     = [...new Set(data.map(r => r.LOCATION_DESC))]
    const products     = [...new Set(data.map(r => r.ITM_DESC))]

    // Revenue by branch
    const byBranch = {}
    data.forEach(r => { byBranch[r.LOCATION_DESC] = (byBranch[r.LOCATION_DESC] || 0) + parseFloat(r.NET_PRICE || 0) })
    const branchArr    = Object.entries(byBranch).sort((a, b) => b[1] - a[1])
    const topBranch    = branchArr[0]
    const bottomBranch = branchArr[branchArr.length - 1]

    // Revenue by month
    const byMonth = {}
    data.forEach(r => { byMonth[r.MONTH] = (byMonth[r.MONTH] || 0) + parseFloat(r.NET_PRICE || 0) })
    const monthArr   = Object.entries(byMonth).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    const monthNames = { 1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec" }

    // Month-over-month
    const mom = monthArr.length >= 2
      ? ((monthArr[monthArr.length-1][1] - monthArr[monthArr.length-2][1]) / monthArr[monthArr.length-2][1] * 100).toFixed(1)
      : null

    // Top product
    const byProduct = {}
    data.forEach(r => { byProduct[r.ITM_DESC] = (byProduct[r.ITM_DESC] || 0) + parseFloat(r.NET_PRICE || 0) })
    const productArr = Object.entries(byProduct).sort((a, b) => b[1] - a[1])
    const topProduct = productArr[0]

    // Active filters
    const activeFilters = []
    if (filters?.branch && filters.branch !== "All") activeFilters.push(`Branch: ${filters.branch}`)
    if (filters?.month  && filters.month  !== "All") activeFilters.push(`Month: ${monthNames[parseInt(filters.month)] || filters.month}`)

    const fmt = n => `SAR ${Math.round(n).toLocaleString("en")}`

    return {
      summary: {
        totalRevenue:  fmt(totalRevenue),
        totalQty:      Math.round(totalQty).toLocaleString("en"),
        branchCount:   branches.length,
        productCount:  products.length,
        topBranch:     topBranch  ? `${topBranch[0]} (${fmt(topBranch[1])}, ${(topBranch[1]/totalRevenue*100).toFixed(1)}%)` : "N/A",
        bottomBranch:  bottomBranch ? `${bottomBranch[0]} (${fmt(bottomBranch[1])})` : "N/A",
        topProduct:    topProduct ? `${topProduct[0]} (${fmt(topProduct[1])})` : "N/A",
        momGrowth:     mom !== null ? `${parseFloat(mom) >= 0 ? "+" : ""}${mom}%` : "N/A",
        monthTrend:    monthArr.map(([m, v]) => `${monthNames[parseInt(m)] || m}: ${fmt(v)}`).join(", "),
        activeFilters: activeFilters.length ? activeFilters.join(", ") : "None (showing all data)",
      }
    }
  }

  // ── Call Claude API ────────────────────────────────────────────────────────
  const generate = useCallback(async (force = false) => {
    const ctx  = buildContext()
    const key  = JSON.stringify(ctx)

    if (!force && cacheRef.current[key]) {
      setInsight(cacheRef.current[key])
      setStatus("done")
      return
    }

    setStatus("loading")
    setInsight("")

    const { summary } = ctx
    const isAr = lang === "ar"

    const prompt = `You are a sharp sales analyst for a retail business in Saudi Arabia. Analyze this live dashboard data and write a ${isAr ? "ARABIC" : "English"} executive summary of exactly 3 sentences. Be specific — use actual SAR numbers and percentages from the data. Highlight the most important insight, one risk or opportunity, and one actionable recommendation. Write as plain flowing prose, no bullet points, no headers.

LIVE DASHBOARD DATA:
- Total Revenue: ${summary.totalRevenue}
- Units Sold: ${summary.totalQty}
- Active Branches: ${summary.branchCount}
- Active Products: ${summary.productCount}
- Top Branch: ${summary.topBranch}
- Lowest Branch: ${summary.bottomBranch}
- Best Product: ${summary.topProduct}
- Month-over-Month Growth: ${summary.momGrowth}
- Monthly Trend: ${summary.monthTrend}
- Active Filters: ${summary.activeFilters}

${isAr ? "اكتب الملخص باللغة العربية الآن:" : "Write the 3-sentence summary now:"}`

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      })

      if (!res.ok) throw new Error(`API ${res.status}`)

      const json = await res.json()
      const text = json.content.filter(b => b.type === "text").map(b => b.text).join("")

      cacheRef.current[key] = text
      setInsight(text)
      setUpdatedAt(new Date())
      setStatus("done")
    } catch (e) {
      setErrMsg(e.message || "Failed")
      setStatus("error")
    }
  }, [data, filters, lang])

  // ── Derived values for footer badges ──────────────────────────────────────
  const totalRevenue = data.reduce((s, r) => s + parseFloat(r.NET_PRICE || 0), 0)
  const totalQty     = data.reduce((s, r) => s + parseFloat(r.QTY || 0), 0)

  const byMonth = {}
  data.forEach(r => { byMonth[r.MONTH] = (byMonth[r.MONTH] || 0) + parseFloat(r.NET_PRICE || 0) })
  const monthArr = Object.entries(byMonth).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  const mom = monthArr.length >= 2
    ? ((monthArr[monthArr.length-1][1] - monthArr[monthArr.length-2][1]) / monthArr[monthArr.length-2][1] * 100).toFixed(1)
    : null

  // ── Colors matching your existing dark/light system ──────────────────────
  const accentColor   = "#38bdf8"
  const borderTop     = `3px solid ${accentColor}`
  const mutedColor    = "var(--text-muted)"
  const skeletonBg    = dark ? "#334155" : "#e5e7eb"
  const idleBtnBg     = dark ? "#0c4a6e" : "#e0f2fe"
  const idleBtnColor  = dark ? "#7dd3fc" : "#0369a1"
  const errBg         = dark ? "#450a0a" : "#fee2e2"
  const errColor      = dark ? "#fca5a5" : "#991b1b"
  const footerBorder  = dark ? "#334155" : "#e5e7eb"
  const badgeUpBg     = dark ? "#052e16" : "#dcfce7"
  const badgeUpColor  = dark ? "#86efac" : "#166534"
  const badgeDnBg     = dark ? "#450a0a" : "#fee2e2"
  const badgeDnColor  = dark ? "#fca5a5" : "#991b1b"
  const refreshBg     = dark ? "#334155" : "#f1f5f9"
  const refreshHover  = dark ? "#475569" : "#e2e8f0"
  const dotColor      = "#38bdf8"

  const fmtTime = d => d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""

  return (
    <>
      <style>{`
        @keyframes aiPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes aiSpin  { to{transform:rotate(360deg)} }
        @keyframes aiFadeIn{ from{opacity:0;transform:translateY(3px)} to{opacity:1;transform:translateY(0)} }
        .ai-refresh-btn:hover { background: ${refreshHover} !important; }
        .ai-insight-text { animation: aiFadeIn 0.35s ease forwards; }
      `}</style>

      <div style={{ ...cardStyle, padding: "20px", marginTop: "1.5rem", borderTop, direction: dir }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* AI icon box matching your card accent style */}
            <div style={{ width: 32, height: 32, borderRadius: 8, background: idleBtnBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5Z"/>
                <path d="M18 2l.8 2.2L21 5l-2.2.8L18 8l-.8-2.2L15 5l2.2-.8Z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: mutedColor, marginBottom: 2 }}>
                {lang === "ar" ? "تحليل الذكاء الاصطناعي" : "AI Insight"}
              </p>
              <p style={{ fontSize: "11px", color: mutedColor }}>
                {data.length.toLocaleString("en")} {lang === "ar" ? "سجل" : "records"} ·{" "}
                {filters?.branch !== "All" ? filters.branch : lang === "ar" ? "كل الفروع" : "All branches"} ·{" "}
                {filters?.month  !== "All" ? filters.month  : lang === "ar" ? "كل الأشهر"  : "All months"}
              </p>
            </div>
          </div>

          <button
            className="ai-refresh-btn"
            onClick={() => generate(true)}
            disabled={status === "loading"}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: "12px", fontWeight: "500",
              color: mutedColor, background: refreshBg,
              border: "0.5px solid var(--border)", borderRadius: 8,
              padding: "6px 12px", cursor: status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "loading" ? 0.6 : 1, transition: "background 0.15s",
            }}
          >
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: status === "loading" ? "aiSpin 0.8s linear infinite" : "none" }}
            >
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
              <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/>
            </svg>
            {status === "loading"
              ? (lang === "ar" ? "جاري التحليل..." : "Analyzing…")
              : (lang === "ar" ? "تحديث" : "Refresh")}
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ minHeight: 60 }}>
          {status === "idle" && (
            <button
              onClick={() => generate()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: "13px", fontWeight: "500",
                color: idleBtnColor, background: idleBtnBg,
                border: "none", borderRadius: 9, padding: "9px 16px", cursor: "pointer",
              }}
            >
              ✦ {lang === "ar" ? "توليد تحليل ذكي" : "Generate AI summary"}
            </button>
          )}

          {status === "loading" && <Skeleton dark={dark} />}

          {status === "done" && insight && (
            <p
              className="ai-insight-text"
              style={{
                fontSize: "14px", lineHeight: "1.85",
                color: "var(--text)", fontStyle: "normal",
                letterSpacing: lang === "ar" ? "0" : "0.01em",
              }}
            >
              <TypedText text={insight} />
            </p>
          )}

          {status === "error" && (
            <div style={{ background: errBg, borderRadius: 8, padding: "10px 14px" }}>
              <p style={{ fontSize: "13px", color: errColor }}>
                ⚠ {errMsg} —{" "}
                <span
                  onClick={() => generate(true)}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {lang === "ar" ? "حاول مجدداً" : "try again"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* ── Footer: badges + timestamp ── */}
        {status === "done" && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 14, paddingTop: 12,
            borderTop: `1px solid ${footerBorder}`,
            flexWrap: "wrap", gap: 8,
          }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {/* Revenue badge */}
              <span style={{
                fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20,
                background: badgeUpBg, color: badgeUpColor,
              }}>
                SAR {Math.round(totalRevenue).toLocaleString("en")} {lang === "ar" ? "إجمالي" : "total"}
              </span>

              {/* MoM badge */}
              {mom !== null && (
                <span style={{
                  fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20,
                  background: parseFloat(mom) >= 0 ? badgeUpBg : badgeDnBg,
                  color:      parseFloat(mom) >= 0 ? badgeUpColor : badgeDnColor,
                }}>
                  {parseFloat(mom) >= 0 ? "↑" : "↓"} {Math.abs(mom)}% MoM
                </span>
              )}

              {/* Units badge */}
              <span style={{
                fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20,
                background: dark ? "#1e1b4b" : "#ede9fe", color: dark ? "#c4b5fd" : "#6b21a8",
              }}>
                {Math.round(totalQty).toLocaleString("en")} {lang === "ar" ? "وحدة" : "units"}
              </span>
            </div>

            {updatedAt && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: mutedColor }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", background: dotColor,
                  animation: "aiPulse 2s ease-in-out infinite",
                }} />
                {lang === "ar" ? "آخر تحديث" : "Updated"} {fmtTime(updatedAt)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
