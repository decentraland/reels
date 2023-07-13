import { WorkerRouter } from "@worker-tools/router"

import {
  RouteContextWithAssets,
  attachOpenGraph,
  fetchAsset,
} from "./worker/cloudflare"

const router = new WorkerRouter<RouteContextWithAssets>()
  .get("/image/:id", async (req, ctx) => {
    const [asset] = await Promise.all([
      fetchAsset("/image/[image_id]", req, ctx),
    ])

    return attachOpenGraph(asset, null)
  })
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
