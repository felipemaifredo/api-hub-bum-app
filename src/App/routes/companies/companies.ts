//Libs
import { Elysia, t } from "elysia"

//Types
type CompanyInfo = {
  id: number
  fantasyName: string
  legalName: string
  cnpj: string
  address: string
  industry: string
  estimatedRevenue: number
  status: "active" | "inactive" | "negotiation"
}


//Swagger Details
const swaggerDetails = {
  params: t.Object({
    count: t.Numeric({
      description: "A quantidade de empresas a serem retornadas (mínimo 1, máximo 100)"
    })
  }),
  response: {
    200: t.Object({
      success: t.Boolean(),
      data: t.Array(
        t.Object({
          id: t.Number(),
          fantasyName: t.String(),
          legalName: t.String(),
          cnpj: t.String(),
          address: t.String(),
          industry: t.String(),
          estimatedRevenue: t.Number(),
          status: t.Union([t.Literal("active"), t.Literal("inactive"), t.Literal("negotiation")])
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
    summary: "Obter uma lista de empresas",
    description: "Retorna a quantidade solicitada de empresas mockadas."
  }
}

//Funcs
function generateCompanies(count: number): CompanyInfo[] {
  const companies: CompanyInfo[] = []
  let i = 1

  const fantasyNames = ["Tech Corp", "Alpha Solutions", "Beta Services", "Gamma Industries", "Delta Dynamics"]
  const industries = ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing"]

  while (i <= count) {
    const fName = fantasyNames[(i - 1) % fantasyNames.length] + (i > 5 ? ` ${i}` : "")
    
    companies.push({
      id: i,
      fantasyName: fName,
      legalName: `${fName} LTDA`,
      cnpj: `12.345.678/0001-${(10 + i).toString().padStart(2, '0')}`,
      address: `Av. Paulista, ${1000 + i}, São Paulo - SP`,
      industry: industries[(i - 1) % industries.length]!,
      estimatedRevenue: 1000000 + (i * 50000),
      status: i % 4 === 0 ? "inactive" : i % 3 === 0 ? "negotiation" : "active"
    })
    i++
  }

  return companies
}

//Main
const companyRoutes = new Elysia({ detail: { tags: ["Empresas"] } })
  .get("/companies/:count", function ({ params, set }) {
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
      data: generateCompanies(count)
    }
  }, swaggerDetails)

export { companyRoutes }
