import { ApiResponseBody } from "decentraland-gatsby/dist/entities/Route/wkc/response/ApiResponse"

import { Metadata } from "../@types/image"
const DECENTRALAND_URL =
  process.env.GATSBY_DECENTRALAND_URL ||
  process.env.DECENTRALAND_URL ||
  "https://play.decentraland.org"

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
