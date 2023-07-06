export type Metadata = {
  id: string
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
  visiblePeople: {
    userName: string
    userAddress: string
    wearables: string[]
  }[]
}

export type Image = {
  id: string
  url: string
  metadata?: Metadata
}
