//Libs
import { Elysia, t } from "elysia"

//Types
type PingResponse = {
  status: string
  timestamp: string
  uptime: number
  environment: string
}

type ErrorResponse = {
  success: false
  error: {
    code: "INTERNAL_SERVER_ERROR" | "SERVICE_UNAVAILABLE"
    message: string
  }
}

//Swagger Details
let swaggerDetails = {
  query: t.Object({
    simulateError: t.Optional(t.String({
      description: "Defina como 'true' para forçar e testar um erro 500 no endpoint."
    }))
  }),
  response: {
    200: t.Object({
      status: t.String(),
      timestamp: t.String(),
      uptime: t.Number(),
      environment: t.String()
    }),
    500: t.Object({
      success: t.Literal(false),
      error: t.Object({
        code: t.Union([
          t.Literal("INTERNAL_SERVER_ERROR"),
          t.Literal("SERVICE_UNAVAILABLE")
        ]),
        message: t.String()
      })
    })
  },
  detail: {
    summary: "Verifica a integridade da API",
    description: "Retorna o status de saúde, uptime, ambiente e timestamp atual da aplicação. Permite simular erros para testes."
  }
}

//Main
let pingRoutes = new Elysia({
  detail: {
    tags: ["Integridade"]
  }
}).get("/ping", function({ query, set }) {
    if (query.simulateError === "true") {
      set.status = 500
      let errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro simulado pelo usuário para fins de testes no Swagger."
        }
      }
      return errorResponse
    }

    let response: PingResponse = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development"
    }

    return response

  }, swaggerDetails)

export { pingRoutes }
