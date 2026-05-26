//Libs
import { Elysia, t } from "elysia"

//Types
type OrderItem = {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
}

type Order = {
  id: string
  customerId: number
  date: string
  totalValue: number
  paymentMethod: "credit_card" | "pix" | "boleto"
  status: "pending" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
}

//Swagger Details
const swaggerDetails = {
  params: t.Object({
    count: t.Numeric({
      description: "A quantidade de pedidos a serem retornados (mínimo 1, máximo 100)"
    })
  }),
  response: {
    200: t.Object({
      success: t.Boolean(),
      data: t.Array(
        t.Object({
          id: t.String(),
          customerId: t.Number(),
          date: t.String(),
          totalValue: t.Number(),
          paymentMethod: t.Union([t.Literal("credit_card"), t.Literal("pix"), t.Literal("boleto")]),
          status: t.Union([t.Literal("pending"), t.Literal("shipped"), t.Literal("delivered"), t.Literal("cancelled")]),
          items: t.Array(
            t.Object({
              productId: t.Number(),
              productName: t.String(),
              quantity: t.Number(),
              unitPrice: t.Number()
            })
          )
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
    summary: "Obter uma lista de pedidos",
    description: "Retorna transações/pedidos de exemplo para uso em dashboards e e-commerces."
  }
}

//Funcs
function generateOrders(count: number): Order[] {
  const orders: Order[] = []
  let i = 1

  const methods = ["credit_card", "pix", "boleto"] as const
  const statuses = ["pending", "shipped", "delivered", "cancelled"] as const

  while (i <= count) {
    const itemCount = (i % 3) + 1 // 1 a 3 items
    const items: OrderItem[] = []
    let total = 0

    for (let j = 1; j <= itemCount; j++) {
      const price = 50 + (i * 10) + (j * 5)
      items.push({
        productId: i * 10 + j,
        productName: `Product ${i}-${j}`,
        quantity: j,
        unitPrice: price
      })
      total += price * j
    }

    orders.push({
      id: `ORD-${2026}${i.toString().padStart(4, '0')}`,
      customerId: (i % 50) + 1,
      date: `2026-05-${(i % 28 + 1).toString().padStart(2, '0')}T12:00:00Z`,
      totalValue: total,
      paymentMethod: methods[i % methods.length]!,
      status: statuses[i % statuses.length]!,
      items
    })
    i++
  }

  return orders
}

//Main
const orderRoutes = new Elysia({ detail: { tags: ["Pedidos"] } })
  .get("/orders/:count", function ({ params, set }) {
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
      data: generateOrders(count)
    }
  }, swaggerDetails
)

export { orderRoutes }
