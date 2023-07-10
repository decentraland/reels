import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import { ContentEntityWearable } from "decentraland-gatsby/dist/utils/api/Catalyst.types"

import { Image } from "../@types/image"
import { images } from "../__data__/images"

const GATSBY_CONTENT_ENTITY_ACTIVE =
  process.env.GATSBY_CONTENT_ENTITY_ACTIVE ||
  "https://peer.decentraland.org/content/entities/active"

export default function useImageById(id: string | undefined) {
  return useAsyncMemo(
    async () => {
      const imagesResult = images.find((image) => image.id === id)
      if (
        imagesResult?.metadata.visiblePeople &&
        imagesResult?.metadata.visiblePeople.length
      ) {
        const urns = imagesResult.metadata.visiblePeople
          .map((user) => user.wearables)
          .flat()

        const response = await fetch(GATSBY_CONTENT_ENTITY_ACTIVE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pointers: urns,
          }),
        })

        const wearablesResult: ContentEntityWearable[] = await response.json()

        const wearablesByUrn = wearablesResult.reduce(
          (acc, wearable) => ({
            ...acc,
            [wearable.pointers[0]]: wearable,
          }),
          {} as Record<string, ContentEntityWearable>
        )

        imagesResult.metadata.visiblePeople.forEach((user) => {
          user.wearablesContentEntity = user.wearables.map(
            (wearable) => wearablesByUrn[wearable]
          )
        })
      }
      return imagesResult
    },
    [id],
    { callWithTruthyDeps: true, initialValue: {} as Image }
  )
}
