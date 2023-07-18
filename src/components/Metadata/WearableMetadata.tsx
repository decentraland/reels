import React, { useMemo } from "react"

import Link from "decentraland-gatsby/dist/plugins/intl/Link"
import { ContentEntityWearable } from "decentraland-gatsby/dist/utils/api/Catalyst.types"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"

import "./WearableMetadata.css"

const MARKETPLACE_URL =
  process.env.GATSBY_MARKETPLACE_URL || "https://market.decentraland.org"

const GATSBY_CATALYST_URL =
  process.env.GATSBY_GATSBY_CATALYST_URL || "https://peer.decentraland.org"

export type WearableMetadataProps = {
  wearableUrn: string
  wearableContentEntity: ContentEntityWearable
  className?: string
}

export default React.memo(function WearableMetadata(
  props: WearableMetadataProps
) {
  const { wearableUrn, wearableContentEntity, className } = props

  const [marketplaceUrl, thumbnailUrl] = useMemo(() => {
    const urnSplitted = wearableUrn.split(":")
    const wearableContract = urnSplitted[urnSplitted.length - 2]
    const wearableItem = urnSplitted[urnSplitted.length - 1]
    return [
      `${MARKETPLACE_URL}/contracts/${wearableContract}/items/${wearableItem}`,
      `${GATSBY_CATALYST_URL}/lambdas/collections/contents/${wearableUrn}/thumbnail`,
    ]
  }, [wearableUrn])

  return (
    <Link
      href={marketplaceUrl}
      className={TokenList.join(["wearable-metadata__container", className])}
    >
      <div className="wearable-metadata__image-container">
        <img src={thumbnailUrl} />
      </div>
      <span>{wearableContentEntity.metadata.name}</span>
    </Link>
  )
})
