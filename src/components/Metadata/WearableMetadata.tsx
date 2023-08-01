import React, { useMemo } from "react"

import Link from "decentraland-gatsby/dist/plugins/intl/Link"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"

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

  return (
    <Link
      href={marketplaceUrl}
      className={TokenList.join(["wearable-metadata__container", className])}
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
