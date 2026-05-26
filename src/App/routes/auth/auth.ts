//Libs
import { Elysia, t } from "elysia"

//Swagger Details
const loginSwagger = {
  body: t.Object({
    email: t.String({ description: "E-mail do usuário (qualquer e-mail válido funciona no mock)" }),
    password: t.String({ description: "Senha (qualquer senha funciona)" })
  }),
  response: {
    200: t.Object({
      success: t.Boolean(),
      token: t.String(),
      user: t.Object({
        id: t.Number(),
        name: t.String(),
        email: t.String(),
        role: t.String(),
        avatar: t.String()
      })
    }),
    401: t.Object({
      success: t.Literal(false),
      error: t.Object({
        code: t.Literal("UNAUTHORIZED"),
        message: t.String()
      })
    })
  },
  detail: {
    summary: "Mock de Login",
    description: "Recebe credenciais e retorna um token falso mais os dados básicos do usuário."
  }
}

const meSwagger = {
  headers: t.Object({
    authorization: t.Optional(t.String({ description: "Bearer token" }))
  }),
  response: {
    200: t.Object({
      success: t.Boolean(),
      user: t.Object({
        id: t.Number(),
        name: t.String(),
        email: t.String(),
        role: t.String(),
        avatar: t.String()
      })
    }),
    401: t.Object({
      success: t.Literal(false),
      error: t.Object({
        code: t.Literal("UNAUTHORIZED"),
        message: t.String()
      })
    })
  },
  detail: {
    summary: "Mock de Sessão Atual (/me)",
    description: "Retorna os dados do usuário a partir do token (qualquer token com a palavra Bearer funciona)."
  }
}

//Main
const authRoutes = new Elysia({ detail: { tags: ["Autenticação"] } })
  .post("/auth/login", function({ body, set }) {
    if (!body.email || !body.password) {
      set.status = 401
      return {
        success: false as const,
        error: { code: "UNAUTHORIZED" as const, message: "E-mail ou senha ausentes." }
      }
    }

    if (body.email === "error@example.com") {
      set.status = 401
      return {
        success: false as const,
        error: { code: "UNAUTHORIZED" as const, message: "Credenciais inválidas." }
      }
    }

    return {
      success: true,
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-mock-token",
      user: {
        id: 1,
        name: "Mock Admin",
        email: body.email,
        role: "admin",
        avatar: "https://picsum.photos/id/10/200/200"
      }
    }
  }, loginSwagger)
  .get("/auth/me", function({ headers, set }) {
    const authHeader = headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401
      return {
        success: false as const,
        error: { code: "UNAUTHORIZED" as const, message: "Token ausente ou inválido." }
      }
    }

    return {
      success: true,
      user: {
        id: 1,
        name: "Mock Admin",
        email: "admin@example.com",
        role: "admin",
        avatar: "https://picsum.photos/id/10/200/200"
      }
    }
  }, meSwagger)

export { authRoutes }
