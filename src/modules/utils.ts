import { ApiResponseBody } from "decentraland-gatsby/dist/entities/Route/wkc/response/ApiResponse"

import { Metadata } from "../@types/image"
const DECENTRALAND_URL =
  process.env.GATSBY_DECENTRALAND_URL || "https://play.decentraland.org"

const PLACES_URL =
  process.env.GATSBY_PLACES_URL || "https://places.decentraland.org"

export function getExplorerUrl(
  metadata: Pick<Metadata, "scene" | "realm">
): string {
  const target = new URL("/", DECENTRALAND_URL)
  if (metadata) {
    target.searchParams.set(
      "position",
      `${metadata.scene.location.x},${metadata.scene.location.y}`
    )
    target.searchParams.set("realm", metadata.realm)
  }

  return target.toString()
}

export async function getPlacesUrl(
  metadata: Pick<Metadata, "scene">
): Promise<string | null> {
  const response = await fetch(
    `${PLACES_URL}/api/places/?positions=${metadata.scene.location.x},${metadata.scene.location.y}`
  )

  const place: ApiResponseBody<any[], { total: string }> = await response.json()
  if (place.total === "0") {
    return null
  }
  return `${PLACES_URL}/place/?position=${metadata.scene.location.x},${metadata.scene.location.y}`
}

const getWearableQuery = (ids: string[]) => `
  query {
    items(where: {urn_in: ${JSON.stringify(ids)}}) {
      id
      collection {
        id
      }
      blockchainId
      image
      urn
      metadata {
        wearable {
          name
          rarity
        }
        emote {
          name
          rarity
        }
      }
    }
  }
`

type WearableProps = {
  id: string
  collection: {
    id: string
  }
  blockchainId: string
  image: string
  urn: string
  metadata: {
    wearable: {
      name: string
      rarity: string
    }
    emote: {
      name: string
      rarity: string
    }
  }
}

export type WearableParsedProps = {
  id: string
  collection: string
  blockchainId: string
  image: string
  urn: string
  name: string
  rarity: string
}

function parseWearables(wearables: WearableProps[]): WearableParsedProps[] {
  return wearables.map((wearable) => ({
    id: wearable.id,
    collection: wearable.collection.id,
    blockchainId: wearable.blockchainId,
    image: wearable.image,
    urn: wearable.urn,
    name: wearable.metadata.wearable.name || wearable.metadata.emote.name,
    rarity: wearable.metadata.wearable.rarity || wearable.metadata.emote.rarity,
  }))
}

export async function getWearablesList(
  url: string,
  ids: string[]
): Promise<WearableParsedProps[]> {
  const query = getWearableQuery(ids)
  const graphql = JSON.stringify({
    query,
    variables: {},
  })

  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: graphql,
    redirect: "follow",
  }

  const wearableResponse = await fetch(url, requestOptions)
  const wearableJson: { data: { items: WearableProps[] } } =
    await wearableResponse.json()
  return parseWearables(wearableJson.data.items)
}
