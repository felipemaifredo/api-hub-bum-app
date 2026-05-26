//Libs
import { Elysia, t } from "elysia"

//Types
type SeriesData = {
  date: string
  value: number
}

type AnalyticsData = {
  revenueSeries: SeriesData[]
  visitorsSeries: SeriesData[]
  totalRevenue: number
  totalVisitors: number
  conversionRate: number
}


//Swagger Details
const swaggerDetails = {
  response: {
    200: t.Object({
      success: t.Boolean(),
      data: t.Object({
        revenueSeries: t.Array(
          t.Object({
            date: t.String(),
            value: t.Number()
          })
        ),
        visitorsSeries: t.Array(
          t.Object({
            date: t.String(),
            value: t.Number()
          })
        ),
        totalRevenue: t.Number(),
        totalVisitors: t.Number(),
        conversionRate: t.Number()
      })
    })
  },
  detail: {
    summary: "Obter dados para dashboard",
    description: "Retorna séries temporais e métricas gerais pré-definidas para renderização de gráficos."
  }
}

//Funcs
function generateAnalytics(): AnalyticsData {
  const revenueSeries: SeriesData[] = []
  const visitorsSeries: SeriesData[] = []
  let totalRevenue = 0
  let totalVisitors = 0

  for (let i = 1; i <= 30; i++) {
    const rev = 5000 + Math.floor(Math.random() * 5000)
    const vis = 1000 + Math.floor(Math.random() * 500)
    
    revenueSeries.push({
      date: `2026-04-${i.toString().padStart(2, '0')}`,
      value: rev
    })
    
    visitorsSeries.push({
      date: `2026-04-${i.toString().padStart(2, '0')}`,
      value: vis
    })

    totalRevenue += rev
    totalVisitors += vis
  }

  return {
    revenueSeries,
    visitorsSeries,
    totalRevenue,
    totalVisitors,
    conversionRate: 3.5 // percentage
  }
}

//Main
const analyticsRoutes = new Elysia({ detail: { tags: ["Dashboard Analytics"] } })
  .get("/analytics", function () {
    return {
      success: true,
      data: generateAnalytics()
    }
  }, swaggerDetails)

export { analyticsRoutes }
