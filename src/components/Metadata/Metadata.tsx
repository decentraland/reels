import React, { useMemo } from "react"

import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import Time from "decentraland-gatsby/dist/utils/date/Time"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon"

import UserMetadata from "./UserMetadata"
import { Metadata } from "../../@types/image"
import { SegmentImage } from "../../modules/segment"
import { explorerUrl } from "../../modules/utils"

import "./Metadata.css"

export type MetadataProps = {
  metadata: Metadata
  className?: string
}

export default React.memo(function Metadata(props: MetadataProps) {
  const { metadata, className } = props
  const l = useFormatMessage()

  const jumpInUrl = useMemo(() => explorerUrl(metadata), [metadata])

  return (
    <div className={TokenList.join(["metadata__container", className])}>
      <div className="metadata__wrapper">
        <h1 className="metadata__title">{l("component.metadata.title")}</h1>
        <div className="metadata__date">
          {Time(metadata.dateTime).utc().format("MMMM DD YYYY")}
        </div>
        <h1 className="metadata__title">{l("component.metadata.place")}</h1>
        <div className="metadata__place">
          <Icon name="map marker alternate" />{" "}
          <span>
            {metadata.scene.name} - {metadata.scene.location.x},
            {metadata.scene.location.y}
          </span>
          <Button
            primary
            as="a"
            href={jumpInUrl}
            target="_blank"
            data-event={SegmentImage.JumpIn}
            data-scene={`${metadata.scene.location.x},${metadata.scene.location.y}`}
          >
            {l("component.metadata.jump_in")}
          </Button>
        </div>
      </div>

      <div className="metadata__divider" />
      {metadata.visiblePeople.length > 0 && (
        <>
          <h1 className="metadata__title-people">
            {l("component.metadata.people")}
          </h1>
          <div className="metadata__user-wrapper">
            {metadata.visiblePeople.map((user) => (
              <UserMetadata key={user.userAddress} user={user} />
            ))}
          </div>
        </>
      )}
    </div>
  )
})
