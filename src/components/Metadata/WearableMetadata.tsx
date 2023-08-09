import React, { useCallback, useMemo } from "react"

import useTrackContext from "decentraland-gatsby/dist/context/Track/useTrackContext"
import Link from "decentraland-gatsby/dist/plugins/intl/Link"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"

import { SegmentImage } from "../../modules/segment"
import { WearableParsedProps } from "../../modules/utils"

import "./WearableMetadata.css"

const MARKETPLACE_URL =
  process.env.GATSBY_MARKETPLACE_URL || "https://market.decentraland.org"

export type WearableMetadataProps = {
  wearableParsed: WearableParsedProps
  className?: string
}

export default React.memo(function WearableMetadata(
  props: WearableMetadataProps
) {
  const { wearableParsed, className } = props
  const marketplaceUrl = useMemo(
    () =>
      `${MARKETPLACE_URL}/contracts/${wearableParsed.collection}/items/${wearableParsed.blockchainId}`,
    [wearableParsed]
  )

  const track = useTrackContext()

  const handleWearableClick = useCallback(() => {
    track(SegmentImage.ClickWearable, {
      link: marketplaceUrl,
      wearableId: wearableParsed.id,
      wearableCollection: wearableParsed.collection,
      wearableBlockchainId: wearableParsed.blockchainId,
      wearableImage: wearableParsed.image,
      wearableUrn: wearableParsed.urn,
      wearableName: wearableParsed.name,
      wearableRarity: wearableParsed.rarity,
    })
  }, [wearableParsed, track, marketplaceUrl])

  return (
    <Link
      href={marketplaceUrl}
      className={TokenList.join(["wearable-metadata__container", className])}
      onClick={handleWearableClick}
    >
      <div
        className={TokenList.join([
          "wearable-metadata__image-container",
          wearableParsed.rarity,
        ])}
      >
        <img src={wearableParsed.image} />
      </div>
      <span>{wearableParsed.name}</span>
    </Link>
  )
})
