import { Metadata } from "../@types/image"

const DECENTRALAND_URL =
  process.env.GATSBY_DECENTRALAND_URL ||
  process.env.DECENTRALAND_URL ||
  "https://play.decentraland.org"

export function explorerUrl(
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
