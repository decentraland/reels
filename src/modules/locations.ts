import API from "decentraland-gatsby/dist/utils/api/API"

const BASE_URL = process.env.GATSBY_BASE_URL || "https://reels.decentraland.org"

export default {
  image: (image: string) => {
    return API.url(BASE_URL, `/${image}`)
  },
}
