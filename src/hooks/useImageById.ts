import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import { ContentEntityWearable } from "decentraland-gatsby/dist/utils/api/Catalyst.types"

import { Image } from "../@types/image"
import { images } from "../__data__/images"

const GATSBY_CONTENT_ENTITY_ACTIVE =
  process.env.GATSBY_CONTENT_ENTITY_ACTIVE ||
  "https://peer.decentraland.org/content/entities/active"
const GATSBY_REEL_API =
  process.env.GATSBY_REEL_API ||
  "https://camera-reel-service.decentraland.zone/api"

export default function useImageById(id: string | undefined) {
  return useAsyncMemo(
    async () => {
      const imageResponse = await fetch(
        `${GATSBY_REEL_API}/images/${id}/metadata`
      )

      const imagesResult: Image = await imageResponse.json()

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
          user.wearablesContentEntity = user.wearables
            .map((wearable) => wearablesByUrn[wearable] || null)
            .filter((wearable) => wearable !== null)
        })
      }
      return imagesResult
    },
    [id],
    { callWithTruthyDeps: true, initialValue: {} as Image }
  )
}
