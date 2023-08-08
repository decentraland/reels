import env from "decentraland-gatsby/dist/utils/env"

import { OpenGraphWriterOptions } from "./writer"
import { Image } from "../@types/image"

const REEL_SERVICE_URL = env(
  `REEL_SERVICE_URL`,
  `https://camera-reel-service.decentraland.org`
)

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
      title: `${imagesResult.metadata.userName}'s Decentraland snapshot`,
      description: `Check out ${imagesResult.metadata.userName}'s photo taken in ${imagesResult.metadata.scene.name}, Decentraland—comment on who was there and what they were wearing or even jump to the spot directly so you don't miss out!`,
    }

    if (imagesResult.url) {
      imageEntry.image = imagesResult.url
    }

    return imageEntry
  } catch (error) {
    return null
  }
}
