import React from "react"

import { ContentEntityWearable } from "decentraland-gatsby/dist/utils/api/Catalyst.types"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"

import "./WearableMetadata.css"

export type WearableMetadataProps = {
  wearableUrn: string
  wearableContentEntity: ContentEntityWearable
  className?: string
}

export default React.memo(function WearableMetadata(
  props: WearableMetadataProps
) {
  const { wearableUrn, wearableContentEntity, className } = props

  return (
    <div
      className={TokenList.join(["wearable-metadata__container", className])}
    >
      <div className="wearable-metadata__image-container">
        <img
          src={`https://peer.decentraland.org/lambdas/collections/contents/${wearableUrn}/thumbnail`}
        />
      </div>
      <span>{wearableContentEntity.metadata.name}</span>
    </div>
  )
})
