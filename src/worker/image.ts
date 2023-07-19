import { OpenGraphWriterOptions } from "./writer"
import { Image } from "../@types/image"

const REEL_SERVICE_URL =
  process.env.GATSBY_REEL_SERVICE_URL ||
  "https://camera-reel-service.decentraland.zone"

export async function getImageOpenGraph(imageId: string) {
  try {
    const imageResponse = await fetch(
      `${REEL_SERVICE_URL}/api/images/${imageId}/metadata`
    )

    const imagesResult: Image = await imageResponse.json()

    if (!imagesResult) {
      return null
    }

    const summaryPeople = imagesResult.metadata.visiblePeople.length
    const imageEntry: OpenGraphWriterOptions = {
      title: `${imagesResult.metadata.userName} took this photo in ${imagesResult.metadata.scene.name}`,
      description: `${
        summaryPeople === 0 ? "no one" : `${summaryPeople} avatars`
      } in the image`,
      image: imagesResult.url,
    }

    return imageEntry
  } catch (error) {
    return null
  }
}
