import React from "react"

import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
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

  const l = useFormatMessage()

  return (
    <div
      className={TokenList.join(["wearable-metadata__container", className])}
    >
      <div className="wearable-metadata__image-container">
        <img
          src={l("component.metadata.wearable_thumbnail_url", {
            wearableUrn: wearableUrn,
          })}
        />
      </div>
      <span>{wearableContentEntity.metadata.name}</span>
    </div>
  )
})
