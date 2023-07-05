import * as fs from "fs/promises"
import * as path from "path"

const EXCLUDE_PREFIX = [
  "app-",
  "commons-",
  "component---src-pages-",
  "framework-",
  "polyfill-",
  "styles.",
  "webpack-runtime-",
]

function toHeadersConfig(
  file: string,
  data: Record<string, string>,
  exclude: string[] = []
) {
  return [
    file,
    ...Object.entries(data).map(([key, value]) => `  ${key}: ${value}`),
    ...exclude.map((header) => `  ! ${header}`),
  ].join("\n")
}

Promise.resolve()
  .then(async () => {
    const source = path.resolve(__dirname, "../_redirects")
    const target = path.resolve(__dirname, "../public/_redirects")
    await fs.copyFile(source, target)
    console.log(`✅ created file:`, "./" + path.relative(process.cwd(), target))
  })
  .then(async () => {
    const [routes, stats, headers] = await Promise.all([
      import("../_routes.json"),
      import("../public/webpack.stats.json"),
      fs.readFile(path.resolve(__dirname, "../_headers"), "utf-8"),
    ])

    const list: string[] = Array.from(
      new Set(
        Object.values(stats.assetsByChunkName)
          .flat()
          .filter(
            (file) => !EXCLUDE_PREFIX.some((prefix) => file.startsWith(prefix))
          )
      )
    )

    return Promise.all([
      (async () => {
        let content = headers
        content += "\n"
        content += EXCLUDE_PREFIX.map((file) =>
          toHeadersConfig(`/${file}*`, {
            "Cache-Control": "public,max-age=31536000,immutable",
          })
        ).join(`\n\n`)
        content += "\n\n"
        content += list
          .map((file) =>
            toHeadersConfig(`/${file}`, {
              "Cache-Control": "public,max-age=31536000,immutable",
            })
          )
          .join(`\n\n`)
        content += "\n"

        const target = path.resolve(__dirname, "../public/_headers")
        await fs.writeFile(target, content, "utf-8")
        console.log(
          `✅ created file:`,
          "./" + path.relative(process.cwd(), target),
          `(size: ${list.length + EXCLUDE_PREFIX.length})`
        )
      })(),
      (async () => {
        routes.default.exclude.push(
          ...EXCLUDE_PREFIX.map((prefix) => `/${prefix}*`)
        )
        routes.default.exclude.push(...list.map((file) => `/${file}`))
        const target = path.resolve(__dirname, "../public/_routes.json")
        await fs.writeFile(
          target,
          JSON.stringify(routes.default, null, 2),
          "utf-8"
        )
        console.log(
          `✅ created file:`,
          "./" + path.relative(process.cwd(), target),
          `(size: ${
            routes.default.include.length + routes.default.exclude.length
          })`
        )
      })(),
    ])
  })
  .catch(console.error)
