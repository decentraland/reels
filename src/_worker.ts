import { WorkerRouter } from "@worker-tools/router"

import type { RouteContext } from "@worker-tools/router"

const router = new WorkerRouter<RouteContext>()
  .get("/*", async (req, ctx) => {
    const url = new URL(req.url)
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1)
      return new Response("", {
        status: 302,
        headers: {
          location: url.toString(),
        },
      })
    }

    return ctx.env.ASSETS.fetch(req.url)
  })
  .recover("*", async (_req, ctx) => {
    console.log(ctx.error)
    return new Response(`Something went wrong.`, { status: 500 })
  })

export default router
