import API from "decentraland-gatsby/dist/utils/api/API"
import Options from "decentraland-gatsby/dist/utils/api/Options"
import env from "decentraland-gatsby/dist/utils/env"

import { Image } from "../@types/image"
import { FetchListOptions } from "../hooks/useImagesByUser"

export type FetchListResult = {
  images: Image[]
  current_images: number
  max_images: number
}
export default class ReelService extends API {
  static Url = env(
    `REEL_SERVICE_URL`,
    `https://camera-reel-service.decentraland.zone`
  )

  static Cache = new Map<string, ReelService>()

  static from(url: string) {
    if (!this.Cache.has(url)) {
      this.Cache.set(url, new ReelService(url))
    }

    return this.Cache.get(url)!
  }

  static get() {
    return this.from(env("REEL_SERVICE_URL", this.Url))
  }

  async fetch<T extends Record<string, any>>(
    url: string,
    options: Options = new Options({})
  ) {
    return await super.fetch<T>(url, options)
  }

  async fetchMany(
    url: string,
    options: Options = new Options({})
  ): Promise<Image[]> {
    const result = (await this.fetch(url, options)) as Image[]
    return result || []
  }

  async fetchOne(
    url: string,
    options: Options = new Options({})
  ): Promise<Image> {
    const result = (await this.fetch(url, options)) as any
    return result
  }

  async getImageById(id: string) {
    return this.fetchOne(`/api/images/${id}/metadata`, this.options())
  }

  async getImagesByWallet(
    address: string,
    options?: Partial<FetchListOptions>
  ) {
    const query = options ? API.searchParams(options).toString() : ""
    const result = await super.fetch<FetchListResult>(
      `/api/users/${address}/images?${query}`,
      this.options()
    )

    return result
  }
}
