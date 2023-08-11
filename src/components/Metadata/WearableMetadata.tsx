import React, { useCallback, useMemo } from "react"

import useTrackContext from "decentraland-gatsby/dist/context/Track/useTrackContext"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import Link from "decentraland-gatsby/dist/plugins/intl/Link"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"
import { Button } from "decentraland-ui/dist/components/Button/Button"

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
  const l = useFormatMessage()
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
      <div className="wearable-metadata__wrapper">
        <div
          className={TokenList.join([
            "wearable-metadata__image-container",
            wearableParsed.rarity,
          ])}
        >
          <img src={wearableParsed.image} />
        </div>
        <span>{wearableParsed.name}</span>
      </div>
      <Button primary>{l("component.wearable.buy")}</Button>
    </Link>
  )
})
