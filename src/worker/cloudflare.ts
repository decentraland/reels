import { OpenGraphWriter, OpenGraphWriterOptions } from "./writer"

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
