import API from "decentraland-gatsby/dist/utils/api/API"

const GATSBY_BASE_URL = process.env.GATSBY_BASE_URL || "/"

export default {
  image: (image: string) => {
    return API.url(GATSBY_BASE_URL, `/image/${image}`)
  },
}
