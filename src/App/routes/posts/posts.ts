//Libs
import { Elysia, t } from "elysia"

//Types
type PostAuthor = {
  name: string
  avatar: string
}

type Post = {
  id: number
  title: string
  content: string
  coverImage: string
  author: PostAuthor
  likes: number
  commentsCount: number
  publishedAt: string
}

//Swagger Details
const swaggerDetails = {
  params: t.Object({
    count: t.Numeric({
      description: "A quantidade de posts a serem retornados (mínimo 1, máximo 100)"
    })
  }),
  response: {
    200: t.Object({
      success: t.Boolean(),
      data: t.Array(
        t.Object({
          id: t.Number(),
          title: t.String(),
          content: t.String(),
          coverImage: t.String(),
          author: t.Object({
            name: t.String(),
            avatar: t.String()
          }),
          likes: t.Number(),
          commentsCount: t.Number(),
          publishedAt: t.String()
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
    summary: "Obter uma lista de posts",
    description: "Retorna posts de exemplo ideais para feeds infinitos ou listagem de artigos."
  }
}

//Funcs
function generatePosts(count: number): Post[] {
  const posts: Post[] = []
  let i = 1

  while (i <= count) {
    posts.push({
      id: i,
      title: `The Future of Tech in 202${i % 10}`,
      content: `This is a sample content for the post number ${i}. It covers various topics about technology and its impact on society.`,
      coverImage: `https://picsum.photos/seed/post${i}/800/400`,
      author: {
        name: `Author ${i}`,
        avatar: `https://picsum.photos/id/${20 + i}/100/100`
      },
      likes: i * 15,
      commentsCount: i * 3,
      publishedAt: `2026-05-${(i % 28 + 1).toString().padStart(2, '0')}T08:00:00Z`
    })
    i++
  }

  return posts
}

//Main
const postRoutes = new Elysia({ detail: { tags: ["Feed / Posts"] } })
  .get("/posts/:count", function ({ params, set }) {
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
      data: generatePosts(count)
    }
  }, swaggerDetails)

export { postRoutes }
