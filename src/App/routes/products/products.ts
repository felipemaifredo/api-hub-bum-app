//Libs
import { Elysia, t } from "elysia"

//Types
type Product = {
  id: number
  name: string
  description: string
  price: number
  discountPrice: number | null
  category: string
  images: string[]
  rating: number
  stock: number
}

//Swagger Details
const swaggerDetails = {
  params: t.Object({
    count: t.Numeric({
      description: "A quantidade de produtos a serem retornados (mínimo 1, máximo 100)"
    })
  }),
  query: t.Object({
    id: t.Optional(t.String({ description: "Defina como '1' para incluir o campo 'id'." })),
    name: t.Optional(t.String({ description: "Defina como '1' para incluir o campo 'name'." })),
    description: t.Optional(t.String({ description: "Defina como '1' para incluir o campo 'description'." })),
    price: t.Optional(t.String({ description: "Defina como '1' para incluir o campo 'price'." })),
    discountPrice: t.Optional(t.String({ description: "Defina como '1' para incluir o campo 'discountPrice'." })),
    category: t.Optional(t.String({ description: "Defina como '1' para incluir o campo 'category'." })),
    images: t.Optional(t.String({ description: "Defina como '1' para incluir o campo 'images'." })),
    rating: t.Optional(t.String({ description: "Defina como '1' para incluir o campo 'rating'." })),
    stock: t.Optional(t.String({ description: "Defina como '1' para incluir o campo 'stock'." })),
    simulateError: t.Optional(t.String({ description: "Defina como 'true' para forçar e testar um erro 400." }))
  }),
  response: {
    200: t.Object({
      success: t.Boolean(),
      data: t.Array(
        t.Object({
          id: t.Optional(t.Number()),
          name: t.Optional(t.String()),
          description: t.Optional(t.String()),
          price: t.Optional(t.Number()),
          discountPrice: t.Optional(t.Union([t.Number(), t.Null()])),
          category: t.Optional(t.String()),
          images: t.Optional(t.Array(t.String())),
          rating: t.Optional(t.Number()),
          stock: t.Optional(t.Number())
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
    summary: "Obter uma lista de produtos",
    description: "Retorna a quantidade solicitada de produtos mockados de forma dinâmica."
  }
}

//Funcs
function generateProducts(count: number): Product[] {
  const products: Product[] = []
  let i = 1

  const names = [
    "Smartphone", "Laptop", "Wireless Mouse", "Mechanical Keyboard", "Monitor",
    "Headphones", "Smartwatch", "Tablet", "Camera", "Microphone"
  ]
  const categories = ["Electronics", "Computers", "Accessories", "Audio", "Photography"]

  while (i <= count) {
    const nameIndex = (i - 1) % names.length
    const categoryIndex = (i - 1) % categories.length
    
    products.push({
      id: i,
      name: `${names[nameIndex]} Pro ${i}`,
      description: `Description for a high-quality ${names[nameIndex]} that meets all your needs.`,
      price: 100 + (i * 15.5),
      discountPrice: i % 3 === 0 ? 90 + (i * 10) : null,
      category: categories[categoryIndex]!,
      images: [
        `https://picsum.photos/seed/prod${i}a/300/300`,
        `https://picsum.photos/seed/prod${i}b/300/300`
      ],
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // Between 3.0 and 5.0
      stock: i % 5 === 0 ? 0 : 10 + i * 2
    })
    i++
  }

  return products
}

function filterProductFields(product: Product, query: any): Partial<Product> {
  const hasSelection = query.id === "1" ||
    query.name === "1" || query.description === "1" ||
    query.price === "1" || query.discountPrice === "1" ||
    query.category === "1" || query.images === "1" ||
    query.rating === "1" || query.stock === "1"

  if (!hasSelection) return product

  const filtered: Partial<Product> = {}

  if (query.id === "1") filtered.id = product.id
  if (query.name === "1") filtered.name = product.name
  if (query.description === "1") filtered.description = product.description
  if (query.price === "1") filtered.price = product.price
  if (query.discountPrice === "1") filtered.discountPrice = product.discountPrice
  if (query.category === "1") filtered.category = product.category
  if (query.images === "1") filtered.images = product.images
  if (query.rating === "1") filtered.rating = product.rating
  if (query.stock === "1") filtered.stock = product.stock

  return filtered
}

//Main
const productRoutes = new Elysia({ detail: { tags: ["Produtos"] } })
  .get("/products/:count", function ({ params, query, set }) {
    if (query.simulateError === "true") {
      set.status = 400
      return {
        success: false as const,
        error: { code: "INVALID_COUNT" as const, message: "Erro simulado." }
      }
    }

    const count = params.count

    if (count < 1 || count > 100) {
      set.status = 400
      return {
        success: false as const,
        error: { code: "INVALID_COUNT" as const, message: "A quantidade deve ser entre 1 e 100." }
      }
    }

    const allProducts = generateProducts(count)
    const filteredProducts: Partial<Product>[] = []

    for (let i = 0; i < allProducts.length; i++) {
      filteredProducts.push(filterProductFields(allProducts[i]!, query))
    }

    return {
      success: true,
      data: filteredProducts
    }
  }, 
  swaggerDetails
)

export { productRoutes }
