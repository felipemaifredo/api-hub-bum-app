//Libs
import { Elysia, t } from "elysia"

//Types
type Notification = {
  id: number
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  date: string
  read: boolean
}


//Swagger Details
const swaggerDetails = {
  params: t.Object({
    count: t.Numeric({
      description: "A quantidade de notificações a serem retornadas (mínimo 1, máximo 100)"
    })
  }),
  response: {
    200: t.Object({
      success: t.Boolean(),
      data: t.Array(
        t.Object({
          id: t.Number(),
          type: t.Union([t.Literal("success"), t.Literal("error"), t.Literal("info"), t.Literal("warning")]),
          title: t.String(),
          message: t.String(),
          date: t.String(),
          read: t.Boolean()
        })
      )
    }),
    400: t.Object({
      success: t.Literal(false),
      error: t.Object({
        code: t.Literal("INVALID_COUNT"),
        message: t.String()
      })
    })
  },
  detail: {
    summary: "Obter uma lista de notificações",
    description: "Retorna dados para simular painéis de aviso e sininhos de notificações."
  }
}

//Funcs
function generateNotifications(count: number): Notification[] {
  const notifications: Notification[] = []
  let i = 1

  const types = ["success", "error", "info", "warning"] as const
  const titles = ["Novo login detectado", "Pagamento aprovado", "Falha no envio", "Atualização do sistema"]
  const messages = [
    "Sua conta foi acessada de um novo dispositivo.",
    "O seu último pagamento foi processado com sucesso.",
    "Não conseguimos enviar a fatura para o seu e-mail.",
    "A versão 2.0 da plataforma já está disponível."
  ]

  while (i <= count) {
    const idx = (i - 1) % 4
    notifications.push({
      id: i,
      type: types[idx]!,
      title: titles[idx]!,
      message: messages[idx]!,
      date: `2026-05-${(i % 28 + 1).toString().padStart(2, '0')}T10:30:00Z`,
      read: i % 2 !== 0
    })
    i++
  }

  return notifications
}

//Main
const notificationRoutes = new Elysia({ detail: { tags: ["Notificações"] } })
  .get("/notifications/:count", function ({ params, set }) {
    const count = params.count

    if (count < 1 || count > 100) {
      set.status = 400
      return {
        success: false as const,
        error: { code: "INVALID_COUNT" as const, message: "A quantidade deve ser entre 1 e 100." }
      }
    }

    return {
      success: true,
      data: generateNotifications(count)
    }
  }, swaggerDetails)

export { notificationRoutes }
