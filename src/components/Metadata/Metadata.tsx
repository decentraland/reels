import React, { useMemo } from "react"

import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import Link from "decentraland-gatsby/dist/plugins/intl/Link"
import Time from "decentraland-gatsby/dist/utils/date/Time"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon"

import UserMetadata from "./UserMetadata"
import { Metadata, User } from "../../@types/image"
import { SegmentImage } from "../../modules/segment"
import { getExplorerUrl, getPlacesUrl } from "../../modules/utils"
import LoadingText from "../Loading/LoadingText"

import "./Metadata.css"

export type MetadataProps = {
  metadata: Metadata
  loading: boolean
  className?: string
}

export default React.memo(function Metadata(props: MetadataProps) {
  const { metadata, loading, className } = props
  const l = useFormatMessage()

  const [placeUrl] = useAsyncMemo(
    async () => getPlacesUrl(metadata),
    [metadata],
    {
      callWithTruthyDeps: true,
    }
  )

  const jumpInUrl = useMemo(() => getExplorerUrl(metadata), [metadata])

  return (
    <div className={TokenList.join(["metadata__container", className])}>
      <div className="metadata__wrapper">
        {!loading && (
          <h1 className="metadata__title">{l("component.metadata.title")}</h1>
        )}
        {loading && <LoadingText type="p" size="medium" />}
        <div className="metadata__date">
          {!loading && Time(metadata.dateTime).utc().format("MMMM DD YYYY")}
          {loading && <LoadingText type="span" size="large" />}
        </div>
        {!loading && (
          <h1 className="metadata__title">{l("component.metadata.place")}</h1>
        )}
        {loading && <LoadingText type="p" size="small" />}
        {!loading && (
          <div className="metadata__place">
            <Icon name="map marker alternate" />{" "}
            {placeUrl && (
              <Link href={placeUrl}>
                {metadata.scene.name} - {metadata.scene.location.x},
                {metadata.scene.location.y}
              </Link>
            )}
            {!placeUrl && (
              <span>
                {metadata.scene.name} - {metadata.scene.location.x},
                {metadata.scene.location.y}
              </span>
            )}
            <Button
              primary
              as="a"
              href={jumpInUrl}
              target="_blank"
              data-event={SegmentImage.JumpIn}
              data-scene={`${metadata.scene.location.x},${metadata.scene.location.y}`}
              loading={loading}
            >
              {l("component.metadata.jump_in")}
            </Button>
          </div>
        )}
        {loading && <LoadingText type="span" size="large" />}
      </div>

      <div className="metadata__divider" />
      {!loading && metadata.visiblePeople.length > 0 && (
        <div className="metadata__people-container">
          <h1 className="metadata__title-people">
            {l("component.metadata.people")}
          </h1>
          <div className="metadata__user-wrapper">
            {metadata.visiblePeople.map((user) => (
              <UserMetadata key={user.userAddress} user={user} />
            ))}
          </div>
        </div>
      )}
      {loading && (
        <div className="metadata__people-container">
          <h1 className="metadata__title-people">
            <LoadingText type="p" size="small" />
          </h1>
          <div className="metadata__user-wrapper">
            {Array.from(Array(3), (_, key) => (
              <UserMetadata key={key} user={{} as User} loading />
            ))}
          </div>
        </div>
      )}
    </div>
  )
})
