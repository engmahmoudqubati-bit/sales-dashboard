export const T = {
  en: {
    title: "Sales Dashboard",
    showing: "Showing", of: "of", records: "records",
    filterBy: "Filter by:", allBranches: "All Branches", allProducts: "All Products", allMonths: "All Months", clear: "✕ Clear",
    totalRevenue: "Total Revenue", unitsSold: "Units Sold", branches: "Branches", products: "Products",
    monthComparison: "Month Comparison", statisticalAnalysis: "Statistical Analysis",
    mean: "Mean", median: "Median", stdDev: "Std Dev", min: "Min", max: "Max",
    revenueBranch: "Revenue by Branch", revenueProduct: "Revenue by Product", revenueByBranch: "Revenue by Branch",
    top5Products: "Top 5 Products by Revenue",
    topBranch: "Top performing branch", bottomBranch: "Branch needs attention",
    bestProduct: "Best selling product", statSummary: "Statistical summary",
    momGrowth: "Month over month growth", forecast: "Next month forecast",
    grew: "grew", dropped: "dropped",
    conservative: "Conservative", base: "Base", optimistic: "Optimistic",
    dark: "🌙 Dark", light: "☀️ Light", arabic: "🌐 Arabic", english: "🌐 English",
    leads: "leads with", lowestAt: "is the lowest at", considerReviewing: "Consider reviewing its performance.",
    topProductText: "is the top product generating", ofRevenue: "of revenue.",
    meanVsMedian: "Mean", gap: "gap", stdDevLabel: "Std Dev",
    revenuGrew: "Revenue", fromMonth: "from", toMonth: "to",
    conservative2: "Conservative", base2: "Base", optimistic2: "Optimistic",
    jan:"Jan",feb:"Feb",mar:"Mar",apr:"Apr",may:"May",jun:"Jun",
    jul:"Jul",aug:"Aug",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Dec",
  },
  ar: {
    title: "لوحة تحكم المبيعات",
    showing: "عرض", of: "من", records: "سجل",
    filterBy: "تصفية:", allBranches: "كل الفروع", allProducts: "كل المنتجات", allMonths: "كل الأشهر", clear: "✕ مسح",
    totalRevenue: "إجمالي الإيرادات", unitsSold: "الوحدات المباعة", branches: "الفروع", products: "المنتجات",
    monthComparison: "مقارنة الأشهر", statisticalAnalysis: "التحليل الإحصائي",
    mean: "المتوسط", median: "الوسيط", stdDev: "الانحراف المعياري", min: "الأدنى", max: "الأقصى",
    revenueBranch: "الإيرادات حسب الفرع", revenueProduct: "الإيرادات حسب المنتج", revenueByBranch: "الإيرادات حسب الفرع",
    top5Products: "أفضل 5 منتجات حسب الإيرادات",
    topBranch: "أفضل فرع أداءً", bottomBranch: "فرع يحتاج اهتمام",
    bestProduct: "أكثر منتج مبيعاً", statSummary: "الملخص الإحصائي",
    momGrowth: "النمو الشهري", forecast: "توقعات الشهر القادم",
    grew: "نما", dropped: "انخفض",
    conservative: "متحفظ", base: "أساسي", optimistic: "متفائل",
    dark: "🌙 داكن", light: "☀️ فاتح", arabic: "🌐 العربية", english: "🌐 English",
    leads: "يتصدر بـ", lowestAt: "هو الأدنى بـ", considerReviewing: "يُنصح بمراجعة أدائه.",
    topProductText: "هو أفضل منتج بإيرادات", ofRevenue: "من الإيرادات.",
    meanVsMedian: "المتوسط الحسابي", gap: "الفجوة", stdDevLabel: "الانحراف المعياري",
    revenuGrew: "الإيرادات", fromMonth: "من", toMonth: "إلى",
    conservative2: "متحفظ", base2: "أساسي", optimistic2: "متفائل",
    jan:"يناير",feb:"فبراير",mar:"مارس",apr:"أبريل",may:"مايو",jun:"يونيو",
    jul:"يوليو",aug:"أغسطس",sep:"سبتمبر",oct:"أكتوبر",nov:"نوفمبر",dec:"ديسمبر",
  }
}

export const monthName = (num, t) => {
  const map = {1:t.jan,2:t.feb,3:t.mar,4:t.apr,5:t.may,6:t.jun,7:t.jul,8:t.aug,9:t.sep,10:t.oct,11:t.nov,12:t.dec}
  return map[parseInt(num)] || num
}