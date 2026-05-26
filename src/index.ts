//Libs
import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"

//Imports
import { pingRoutes } from "./App/routes/ping"
import { userRoutes } from "./App/routes/users/users"

//Main
let app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: "API Hub BUM",
        version: "1.0.0"
      },
      tags: [
        { name: "Integridade", description: "Endpoints relacionados à integridade e saúde da aplicação" },
        { name: "Usuários", description: "Endpoints de gerenciamento e consulta de usuários" }
      ]
    }
  }))
  .use(pingRoutes)
  .use(userRoutes)
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
