//Libs
import { Elysia, t } from "elysia"

//Types
type Company = {
  name: string
  department: string
}

type User = {
  id: number
  name: string
  email: string
  role: "admin" | "user"
  avatar: string
  phone: string
  bio: string
  status: "active" | "inactive" | "pending"
  createdAt: string
  company: Company
}

type UsersResponse = {
  success: boolean
  data: Partial<User>[]
}

type ErrorResponse = {
  success: false
  error: {
    code: "INVALID_COUNT"
    message: string
  }
}

//Swagger Details
let swaggerDetails = {
  params: t.Object({
    count: t.Numeric({
      description: "A quantidade de usuários a serem retornados (mínimo 1, máximo 100)"
    })
  }),
  query: t.Object({
    id: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'id' no retorno."
    })),
    name: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'name' no retorno."
    })),
    email: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'email' no retorno."
    })),
    role: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'role' no retorno."
    })),
    avatar: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'avatar' no retorno."
    })),
    phone: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'phone' no retorno."
    })),
    bio: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'bio' no retorno."
    })),
    status: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'status' no retorno."
    })),
    createdAt: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'createdAt' no retorno."
    })),
    company: t.Optional(t.String({
      description: "Defina como '1' para incluir o campo 'company' no retorno."
    })),
    simulateError: t.Optional(t.String({
      description: "Defina como 'true' para forçar e testar um erro 400 no endpoint."
    }))
  }),
  response: {
    200: t.Object({
      success: t.Boolean(),
      data: t.Array(
        t.Object({
          id: t.Optional(t.Number()),
          name: t.Optional(t.String()),
          email: t.Optional(t.String()),
          role: t.Optional(t.Union([t.Literal("admin"), t.Literal("user")])),
          avatar: t.Optional(t.String()),
          phone: t.Optional(t.String()),
          bio: t.Optional(t.String()),
          status: t.Optional(t.Union([t.Literal("active"), t.Literal("inactive"), t.Literal("pending")])),
          createdAt: t.Optional(t.String()),
          company: t.Optional(
            t.Object({
              name: t.String(),
              department: t.String()
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
    summary: "Obter uma lista de usuários com campos filtráveis",
    description: "Retorna a quantidade solicitada de usuários mockados de forma dinâmica. Permite especificar quais campos retornar via Query Parameters."
  }
}

//Funcs
function generateUsers(count: number): User[] {
  let users: User[] = []
  let i = 1

  let firstNames = [
    "Gabriel", "Lucas", "Mateus", "Pedro", "João", "Guilherme", "Gustavo", "Felipe", "Rafael", "Thiago",
    "Bruno", "Vitor", "Daniel", "André", "Leonardo", "Rodrigo", "Diego", "Arthur", "Enzo", "Miguel",
    "Heitor", "Davi", "Lorenzo", "Samuel", "Bernardo", "Benjamin", "Murilo", "Matheus", "Vinicius", "Caio",
    "Lucca", "Cauã", "Vicente", "Isaac", "Benício", "Theo", "Joaquim", "Nicolas", "Henrique", "Marcos",
    "Douglas", "Eduardo", "Alexandre", "Fábio", "Otávio", "Filipe", "Ruan", "Augusto", "Renan", "Marcelo",
    "Ana", "Maria", "Julia", "Sofia", "Alice", "Beatriz", "Laura", "Mariana", "Heloisa", "Manuela",
    "Valentina", "Clara", "Luiza", "Giovanna", "Isabella", "Lara", "Yasmin", "Camila", "Letícia", "Amanda",
    "Bruna", "Carolina", "Bianca", "Gabriela", "Isadora", "Helena", "Cecília", "Lorena", "Lívia", "Antonella",
    "Catarina", "Emanuelly", "Melissa", "Nicole", "Vitória", "Rafaela", "Elisa", "Mirella", "Jéssica", "Larissa",
    "Fernanda", "Patrícia", "Aline", "Talita", "Priscila", "Débora", "Juliana", "Vanessa", "Bruna", "Juliana"
  ]

  let lastNames = [
    "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes",
    "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa",
    "Rocha", "Dias", "Nascimento", "Andrade", "Moreira", "Nunes", "Marques", "Machado", "Mendes", "Freitas",
    "Cardoso", "Tavares", "Melo", "Pinto", "Teixeira", "Borges", "Santana", "Arantes", "Campos", "Cavalcanti",
    "Vasconcelos", "Menezes", "Batista", "Miranda", "Barros", "Cunha", "Guimarães", "Pires", "Ramos", "Brito",
    "Neves", "Figueiredo", "Cruz", "Santiago", "Monteiro", "Macedo", "Azevedo", "Farias", "Castelo", "Fonseca",
    "Furtado", "Nogueira", "Dantas", "Pacheco", "Lins", "Lacerda", "Viana", "Siqueira", "Pinheiro", "Castro",
    "Resende", "Guerra", "Peixoto", "Guedes", "Porto", "Moraes", "Motta", "Couto", "Assis", "Lobato",
    "Bandeira", "Prado", "Lemos", "Sales", "Garrido", "Rangel", "Maldonado", "Ortega", "Queiroz", "Rezende",
    "Sanches", "Coutinho", "Lustosa", "Valente", "Rios", "Fontes"
  ]

  let departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales"
  ]

  let companies = [
    "TechCorp",
    "InnovateLtd",
    "SoftSystems",
    "CloudSphere",
    "LogicWorks"
  ]

  let bios = [
    "Software Developer passionate about scalable APIs and modern web architectures.",
    "Product Manager focused on user experiences and developer tools.",
    "UI/UX Designer who loves creating minimalist interfaces.",
    "Growth Marketer addicted to analytical metrics and user retention.",
    "Sales Director bridging high-tech solutions to business goals."
  ]

  while (i <= count) {
    let index = (i - 1) % 5
    let dept = departments[index]
    let comp = companies[index]
    let biography = bios[index]

    let firstName = firstNames[(i - 1) % 100] || "User"
    let lastName = lastNames[(i - 1) % 100] || ("" + i)
    let fullName = firstName + " " + lastName
    let emailAddress = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@example.com"

    users.push({
      id: i,
      name: fullName,
      email: emailAddress,
      role: i % 2 === 0 ? "admin" : "user",
      avatar: "https://picsum.photos/id/" + (i + 10) + "/200/200",
      phone: "+55 (11) 9" + (9000 + i) + "-" + (1000 + i),
      bio: biography || "API Hub developer.",
      status: i % 3 === 0 ? "inactive" : i % 3 === 1 ? "active" : "pending",
      createdAt: "2026-05-" + (i < 10 ? "0" + i : i) + "T10:00:00.000Z",
      company: {
        name: comp || "TechCorp",
        department: dept || "Engineering"
      }
    })
    i++
  }

  return users
}

function filterUserFields(user: User, query: {
  id?: string
  name?: string
  email?: string
  role?: string
  avatar?: string
  phone?: string
  bio?: string
  status?: string
  createdAt?: string
  company?: string
  simulateError?: string
}): Partial<User> {
  let hasSelection = query.id === "1" ||
    query.name === "1" ||
    query.email === "1" ||
    query.role === "1" ||
    query.avatar === "1" ||
    query.phone === "1" ||
    query.bio === "1" ||
    query.status === "1" ||
    query.createdAt === "1" ||
    query.company === "1"

  if (!hasSelection) {
    return user
  }

  let filteredUser: Partial<User> = {}

  if (query.id === "1") {
    filteredUser.id = user.id
  }
  if (query.name === "1") {
    filteredUser.name = user.name
  }
  if (query.email === "1") {
    filteredUser.email = user.email
  }
  if (query.role === "1") {
    filteredUser.role = user.role
  }
  if (query.avatar === "1") {
    filteredUser.avatar = user.avatar
  }
  if (query.phone === "1") {
    filteredUser.phone = user.phone
  }
  if (query.bio === "1") {
    filteredUser.bio = user.bio
  }
  if (query.status === "1") {
    filteredUser.status = user.status
  }
  if (query.createdAt === "1") {
    filteredUser.createdAt = user.createdAt
  }
  if (query.company === "1") {
    filteredUser.company = user.company
  }

  return filteredUser
}

//Main
let userRoutes = new Elysia({
  detail: {
    tags: ["Usuários"]
  }
})
  .get("/users/:count", function ({ params, query, set }) {
    if (query.simulateError === "true") {
      set.status = 400
      let errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: "INVALID_COUNT",
          message: "Erro simulado pelo usuário para fins de testes no Swagger."
        }
      }
      return errorResponse
    }

    let count = params.count

    if (count < 1 || count > 100) {
      set.status = 400
      let errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: "INVALID_COUNT",
          message: "A quantidade de usuários deve ser entre 1 e 100."
        }
      }
      return errorResponse
    }

    let allUsers = generateUsers(count)
    let filteredUsers: Partial<User>[] = []
    let i = 0

    while (i < allUsers.length) {
      let user = allUsers[i]
      if (user) {
        filteredUsers.push(filterUserFields(user, query))
      }
      i++
    }

    let response: UsersResponse = {
      success: true,
      data: filteredUsers
    }

    return response
  }, 
  swaggerDetails
)

export { userRoutes }
