//Libs
import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"

//Imports
import { pingRoutes } from "./App/routes/ping"
import { userRoutes } from "./App/routes/users/users"
import { productRoutes } from "./App/routes/products/products"
import { authRoutes } from "./App/routes/auth/auth"
import { companyRoutes } from "./App/routes/companies/companies"
import { orderRoutes } from "./App/routes/orders/orders"
import { notificationRoutes } from "./App/routes/notifications/notifications"
import { postRoutes } from "./App/routes/posts/posts"
import { analyticsRoutes } from "./App/routes/analytics/analytics"

//Main
const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: "API Hub BUM",
        version: "1.0.0"
      },
      tags: [
        { name: "Integridade", description: "Endpoints relacionados à integridade e saúde da aplicação" },
        { name: "Usuários", description: "Endpoints de gerenciamento e consulta de usuários" },
        { name: "Produtos", description: "Endpoints de catálogo e e-commerce" },
        { name: "Autenticação", description: "Endpoints de login e sessão fake" },
        { name: "Empresas", description: "Endpoints de gestão de empresas" },
        { name: "Pedidos", description: "Endpoints de transações e pedidos" },
        { name: "Notificações", description: "Endpoints de avisos e alertas" },
        { name: "Feed / Posts", description: "Endpoints de listagem de artigos e posts" },
        { name: "Dashboard Analytics", description: "Endpoints de gráficos e relatórios" }
      ]
    }
  }))
  .use(pingRoutes)
  .group("/mock", (app) => app
    .use(userRoutes)
    .use(productRoutes)
    .use(authRoutes)
    .use(companyRoutes)
    .use(orderRoutes)
    .use(notificationRoutes)
    .use(postRoutes)
    .use(analyticsRoutes)
  )
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
