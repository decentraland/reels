import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"

import { Image } from "../@types/image"
import ReelService from "../api/ReelService"

export type FetchListOptions = {
  offset: number
  limit: number
}

export default function useImagesByUser(
  address: string | undefined,
  options: FetchListOptions
) {
  return useAsyncMemo(
    async () => {
      try {
        return ReelService.get().getImagesByWallet(address!, options)
      } catch (error) {
        console.log(error)
        return [] as Image[]
      }
    },
    [address],
    { callWithTruthyDeps: true, initialValue: [] as Image[] }
  )
}
