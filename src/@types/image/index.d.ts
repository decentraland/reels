import { ContentEntityWearable } from "decentraland-gatsby/dist/utils/api/Catalyst.types"

export type User = {
  userName: string
  userAddress: string
  isGuest: boolean
  wearables: string[]
  wearablesContentEntity?: ContentEntityWearable[]
}

export type Metadata = {
  userName: string
  userAddress: string
  dateTime: string
  realm: string
  scene: {
    name: string
    location: {
      x: string
      y: string
    }
  }
  visiblePeople: User[]
}

export type Image = {
  id: string
  url: string
  thumbnailUrl: string
  metadata: Metadata
}
