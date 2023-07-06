import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"

import { Image } from "../@types/image"
import { images } from "../__data__/images"

export default function useImageById(id: string | undefined) {
  return useAsyncMemo(
    async () => images.find((image) => image.id === id),
    [id],
    { callWithTruthyDeps: true, initialValue: {} as Image }
  )
}
