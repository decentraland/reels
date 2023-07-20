import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import { ContentEntityWearable } from "decentraland-gatsby/dist/utils/api/Catalyst.types"

import { Image } from "../@types/image"
import ReelService from "../api/ReelService"

const CATALYST_URL =
  process.env.GATSBY_CATALYST_URL || "https://peer.decentraland.org"

export default function useImageById(id: string | undefined) {
  return useAsyncMemo(
    async () => {
      try {
        const imagesResult = await ReelService.get().getImageById(id!)

        if (
          !imagesResult ||
          !imagesResult.metadata.visiblePeople ||
          imagesResult.metadata.visiblePeople.length === 0
        ) {
          return imagesResult
        }

        const urns = imagesResult.metadata.visiblePeople
          .map((user) => user.wearables)
          .flat()

        if (urns.length > 0) {
          const response = await fetch(
            `${CATALYST_URL}/content/entities/active`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pointers: urns,
              }),
            }
          )

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
        } else {
          imagesResult.metadata.visiblePeople.forEach((user) => {
            user.wearablesContentEntity = []
          })
        }
        return imagesResult
      } catch (error) {
        console.log(error)
        return null
      }
    },
    [id],
    { callWithTruthyDeps: true, initialValue: {} as Image }
  )
}
