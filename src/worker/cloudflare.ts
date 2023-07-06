import { OpenGraphWriter, OpenGraphWriterOptions } from "./writer"

import type { RouteContext } from "@worker-tools/router"

export type RouteContextWithAssets = RouteContext & {
  env: { ASSETS: { fetch: typeof fetch } }
}

export async function fetchAsset(
  pathname: string,
  req: Request,
  ctx: RouteContextWithAssets
) {
  const url = new URL(req.url)
  url.pathname = pathname

  console.log(
    "fetchAsset:",
    "feching asset",
    url.toString(),
    "instead of",
    req.url
  )
  return ctx.env.ASSETS.fetch(url.toString())
}

export function attachOpenGraph(
  res: Response,
  options: OpenGraphWriterOptions | null = null
) {
  if (!options) {
    console.log("attachOpenGraph:", "skipping open graph, no options")
    return new Response(res.body, {
      headers: new Headers(res.headers),
      status: 404,
    })
  }

  console.log("attachOpenGraph:", "attaching open graph", options)
  return new HTMLRewriter()
    .on("title", new OpenGraphWriter(options))
    .transform(res)
}
