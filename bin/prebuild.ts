import * as fs from "fs"

import dev from "../src/config/dev.json"
import local from "../src/config/local.json"
import prod from "../src/config/prod.json"
import stg from "../src/config/stg.json"

let updated = false
function set(data: Record<string, string>, key: string, value: string) {
  if (data[key] !== value) {
    data[key] = value
    updated = true
  }
}

function envs(
  data: Record<string, string | number | boolean | undefined | null>
) {
  Object.keys(data).forEach((key) => {
    const raw = data[key]
    key = key.startsWith("GATSBY_") ? key : `GATSBY_${key}`
    if (raw !== null && raw !== undefined) {
      const value = raw.toString()
      console.log(`updation ${key} to ${value}`)
      set(local, key, value)
      set(dev, key, value)
      set(stg, key, value)
      set(prod, key, value)
    }
  })
}

function store() {
  if (updated) {
    fs.writeFileSync("./src/config/local.json", JSON.stringify(local, null, 2))
    fs.writeFileSync("./src/config/dev.json", JSON.stringify(dev, null, 2))
    fs.writeFileSync("./src/config/prod.json", JSON.stringify(prod, null, 2))
    fs.writeFileSync("./src/config/stg.json", JSON.stringify(stg, null, 2))
  }
}

// Cloudflare Pages Build
// https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables
if (process.env.CF_PAGES) {
  envs({
    ENVIRONMENT: "production",
    COMMIT_SHA: process.env.CF_PAGES_COMMIT_SHA,
    COMMIT_BRANCH: process.env.CF_PAGES_BRANCH,
  })
}

if (process.env.ENVIRONMENT) {
  envs({ ENVIRONMENT: process.env.ENVIRONMENT })
}

store()
