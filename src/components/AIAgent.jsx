export default function AIAgent({ data, cardStyle, dark, t }) {
  function fmt(n) { return Math.round(n).toLocaleString("en") }

  const totalRev = data.reduce((s,r)=>s+parseFloat(r.NET_PRICE||0),0)
  const byBranch = {}
  data.forEach(r=>{ byBranch[r.LOCATION_DESC]=(byBranch[r.LOCATION_DESC]||0)+parseFloat(r.NET_PRICE||0) })
  const branchArr    = Object.entries(byBranch).sort((a,b)=>b[1]-a[1])
  const topBranch    = branchArr[0]
  const bottomBranch = branchArr[branchArr.length-1]

  const byProduct = {}
  data.forEach(r=>{ byProduct[r.ITM_DESC]=(byProduct[r.ITM_DESC]||0)+parseFloat(r.NET_PRICE||0) })
  const topProduct = Object.entries(byProduct).sort((a,b)=>b[1]-a[1])[0]

  const byMonth = {}
  data.forEach(r=>{ byMonth[r.MONTH]=(byMonth[r.MONTH]||0)+parseFloat(r.NET_PRICE||0) })
  const monthArr = Object.entries(byMonth).sort((a,b)=>parseInt(a[0])-parseInt(b[0]))
  const monthNames = {1:t.jan,2:t.feb,3:t.mar,4:t.apr,5:t.may,6:t.jun,7:t.jul,8:t.aug,9:t.sep,10:t.oct,11:t.nov,12:t.dec}

  const mom = monthArr.length>=2
    ? ((monthArr[monthArr.length-1][1]-monthArr[monthArr.length-2][1])/monthArr[monthArr.length-2][1]*100).toFixed(1)
    : null

  const prices  = data.map(r=>parseFloat(r.NET_PRICE||0))
  const mean    = totalRev/(prices.length||1)
  const sorted  = [...prices].sort((a,b)=>a-b)
  const median  = sorted.length%2===0?(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2:sorted[Math.floor(sorted.length/2)]
  const stdDev  = Math.sqrt(prices.reduce((s,v)=>s+Math.pow(v-mean,2),0)/(prices.length||1))

  const lastRev      = monthArr.length>=1?monthArr[monthArr.length-1][1]:0
  const prevRev      = monthArr.length>=2?monthArr[monthArr.length-2][1]:0
  const forecast     = Math.round(lastRev+(lastRev-prevRev))
  const forecastLow  = Math.round(lastRev*0.8)
  const forecastHigh = Math.round(lastRev*1.2)

  const leftBg    = dark?"#052e16":"#dcfce7"
  const leftColor = dark?"#86efac":"#166534"
  const rightBg    = dark?"#1e1b4b":"#f3e8ff"
  const rightColor = dark?"#c4b5fd":"#6b21a8"

  const prevMonthName = monthNames[parseInt(monthArr[monthArr.length-2]?.[0])] || ""
  const lastMonthName = monthNames[parseInt(monthArr[monthArr.length-1]?.[0])] || ""

  const leftInsights = [
    {
      icon:"🏆", title:t.topBranch,
      text:`${topBranch?.[0]} ${t.leads} SAR ${fmt(topBranch?.[1])} — ${fmt(topBranch?.[1]/totalRev*100)}% ${t.ofRevenue}`
    },
    {
      icon:"⚠️", title:t.bottomBranch,
      text:`${bottomBranch?.[0]} ${t.lowestAt} SAR ${fmt(bottomBranch?.[1])}. ${t.considerReviewing}`
    },
    mom ? {
      icon: parseFloat(mom)>=0?"📈":"📉", title: t.momGrowth,
      text: `${t.revenuGrew} ${parseFloat(mom)>=0?t.grew:t.dropped} ${Math.abs(mom)}% ${t.fromMonth} ${prevMonthName} ${t.toMonth} ${lastMonthName}.`
    } : null
  ].filter(Boolean)

  const rightInsights = [
    {
      icon:"🛍️", title:t.bestProduct,
      text:`${topProduct?.[0]} ${t.topProductText} SAR ${fmt(topProduct?.[1])} — ${fmt(topProduct?.[1]/totalRev*100)}% ${t.ofRevenue}`
    },
    {
      icon:"📊", title:t.statSummary,
      text:`${t.meanVsMedian}: SAR ${fmt(mean)} | ${t.median}: SAR ${fmt(median)} | ${t.gap}: SAR ${fmt(mean-median)} | ${t.stdDevLabel}: SAR ${fmt(stdDev)}`
    },
    monthArr.length>=2 ? {
      icon:"🔮", title:t.forecast,
      text:`${t.conservative2}: SAR ${fmt(forecastLow)} · ${t.base2}: SAR ${fmt(forecast)} · ${t.optimistic2}: SAR ${fmt(forecastHigh)}`
    } : null
  ].filter(Boolean)

  return (
    <div style={{ ...cardStyle, padding:"20px", marginTop:"1.5rem" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {leftInsights.map((ins,i)=>(
            <div key={i} style={{ background:leftBg, borderRadius:"8px", padding:"14px" }}>
              <p style={{ fontSize:"13px", fontWeight:"500", color:leftColor, marginBottom:"6px" }}>{ins.icon} {ins.title}</p>
              <p style={{ fontSize:"12px", color:leftColor, lineHeight:"1.7", opacity:0.9 }}>{ins.text}</p>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {rightInsights.map((ins,i)=>(
            <div key={i} style={{ background:rightBg, borderRadius:"8px", padding:"14px" }}>
              <p style={{ fontSize:"13px", fontWeight:"500", color:rightColor, marginBottom:"6px" }}>{ins.icon} {ins.title}</p>
              <p style={{ fontSize:"12px", color:rightColor, lineHeight:"1.7", opacity:0.9 }}>{ins.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}