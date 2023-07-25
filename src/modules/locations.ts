import API from "decentraland-gatsby/dist/utils/api/API"

const BASE_URL = process.env.GATSBY_BASE_URL || "https://reels.decentraland.org"
const SHORT_URL = process.env.GATSBY_SHORT_URL || "https://dcl.gg"

export default {
  image: (image: string) => {
    return API.url(BASE_URL, `/${image}`)
  },
  shortUrl: (image: string) => {
    return API.url(SHORT_URL, `/reels`, API.searchParams({ image: image }))
  },
}
