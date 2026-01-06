import {
  getTokenIdAndAssetUrn,
  isExtendedUrn,
  parseUrn,
} from "@dcl/urn-resolver"
import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"

import { Image } from "../@types/image"
import ReelService from "../api/ReelService"
import { WearableParsedProps, getWearablesList } from "../modules/utils"

const THE_GRAPH_API_ETH_URL =
  process.env.GATSBY_THE_GRAPH_API_ETH_URL ||
  "https://subgraph.decentraland.org/collections-ethereum-mainnet"
const THE_GRAPH_API_MATIC_URL =
  process.env.GATSBY_THE_GRAPH_API_MATIC_URL ||
  "https://subgraph.decentraland.org/collections-matic-mainnet"

/**
 * Strips the tokenId from a wearable URN if present.
 * Extended URNs have the format: urn:decentraland:{network}:collections-v{version}:{contract}:{itemId}:{tokenId}
 * Base URNs have the format: urn:decentraland:{network}:collections-v{version}:{contract}:{itemId}
 * The Graph expects base URNs without the tokenId suffix.
 */
async function getBaseUrn(urn: string): Promise<string> {
  try {
    const parsed = await parseUrn(urn)
    if (!parsed) {
      return urn
    }

    if (isExtendedUrn(parsed)) {
      const { assetUrn } = getTokenIdAndAssetUrn(urn)
      return assetUrn.toString()
    }

    return urn
  } catch {
    return urn
  }
}

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
          // Build the urn to base URN mapping once for all URNs
          const urnToBaseUrn = new Map<string, string>()
          await Promise.all(
            urns.map(async (urn) => {
              const baseUrn = await getBaseUrn(urn)
              urnToBaseUrn.set(urn, baseUrn)
            })
          )

          const urnsL1 = urns.filter((urn) =>
            urn.startsWith("urn:decentraland:ethereum")
          )
          const urnsL2 = urns.filter((urn) =>
            urn.startsWith("urn:decentraland:matic")
          )

          // Derive deduplicated base URNs from the map (no extra getBaseUrn calls)
          const baseUrnsL1 = [
            ...new Set(urnsL1.map((urn) => urnToBaseUrn.get(urn)!)),
          ]
          const baseUrnsL2 = [
            ...new Set(urnsL2.map((urn) => urnToBaseUrn.get(urn)!)),
          ]

          const wearablesL1 =
            baseUrnsL1.length > 0
              ? await getWearablesList(THE_GRAPH_API_ETH_URL, baseUrnsL1)
              : []

          const wearablesL2 =
            baseUrnsL2.length > 0
              ? await getWearablesList(THE_GRAPH_API_MATIC_URL, baseUrnsL2)
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
              .map((wearable) => {
                const baseUrn = urnToBaseUrn.get(wearable) || wearable
                return wearablesByUrn[baseUrn] || null
              })
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
