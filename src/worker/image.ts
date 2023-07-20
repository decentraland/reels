import { OpenGraphWriterOptions } from "./writer"
import { Image } from "../@types/image"

const REEL_SERVICE_URL = "https://camera-reel-service.decentraland.zone"

export async function getImageOpenGraph(imageId: string) {
  try {
    const imageResponse = await fetch(
      `${REEL_SERVICE_URL}/api/images/${imageId}/metadata`
    )

    const imagesResult: Image = await imageResponse.json()

    if (!imagesResult) {
      return null
    }

    const imageEntry: OpenGraphWriterOptions = {
      title: `Picture taken by ${imagesResult.metadata.userName}`,
      description:
        "ake a look at this interactive photo, jump to the spot, gossip who was there and what they were wearing! Are you going to miss it?",
    }

    if (imagesResult.url) {
      imageEntry.image = imagesResult.url
    }

    return imageEntry
  } catch (error) {
    return null
  }
}
