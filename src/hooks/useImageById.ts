import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"

import { Image } from "../@types/image"
import ReelService from "../api/ReelService"
import { WearableParsedProps, getWearablesList } from "../modules/utils"

const THE_GRAPH_API_ETH_URL =
  process.env.GATSBY_THE_GRAPH_API_ETH_URL ||
  "https://api.thegraph.com/subgraphs/name/decentraland/collections-ethereum-mainnet"
const THE_GRAPH_API_MATIC_URL =
  process.env.GATSBY_THE_GRAPH_API_MATIC_URL ||
  "https://api.thegraph.com/subgraphs/name/decentraland/collections-matic-mainnet"

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
          const urnsL1 = urns.filter((urn) =>
            urn.startsWith("urn:decentraland:ethereum")
          )
          const urnsL2 = urns.filter((urn) =>
            urn.startsWith("urn:decentraland:matic")
          )

          const wearablesL1 =
            urnsL1.length > 0
              ? await getWearablesList(THE_GRAPH_API_ETH_URL, urnsL1)
              : []

          const wearablesL2 =
            urnsL2.length > 0
              ? await getWearablesList(THE_GRAPH_API_MATIC_URL, urnsL2)
              : []

          const wearables = wearablesL1.concat(wearablesL2)

          const wearablesByUrn = wearables.reduce(
            (acc, wearable) => ({
              ...acc,
              [wearable.urn]: wearable,
            }),
            {} as Record<string, WearableParsedProps>
          )

          imagesResult.metadata.visiblePeople.forEach((user) => {
            user.wearablesParsed = user.wearables
              .map((wearable) => wearablesByUrn[wearable] || null)
              .filter((wearable) => wearable !== null)
          })
        } else {
          imagesResult.metadata.visiblePeople.forEach((user) => {
            user.wearablesParsed = []
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
