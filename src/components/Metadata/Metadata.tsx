import React, { useMemo } from "react"

import Avatar from "decentraland-gatsby/dist/components/Profile/Avatar"
import useFeatureFlagContext from "decentraland-gatsby/dist/context/FeatureFlag/useFeatureFlagContext"
import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import Link from "decentraland-gatsby/dist/plugins/intl/Link"
import Time from "decentraland-gatsby/dist/utils/date/Time"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon"

import UserMetadata from "./UserMetadata"
import { Metadata, User } from "../../@types/image"
import { FeatureFlags } from "../../modules/ff"
import { SegmentImage } from "../../modules/segment"
import { getExplorerUrl, getPlacesUrl } from "../../modules/utils"
import LoadingText from "../Loading/LoadingText"

import "./Metadata.css"

export type MetadataProps = {
  metadata: Metadata
  loading: boolean
  className?: string
}

const USER_PROFILE_URL =
  process.env.GATSBY_USER_PROFILE_URL || "https://profile.decentraland.zone"

const handleSort = (a: User, b: User) => {
  if (!a.isGuest && b.isGuest) {
    return -1
  }
  if (a.isGuest && !b.isGuest) {
    return 1
  }
  return 0
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

  const profileUrl = useMemo(
    () =>
      metadata?.userAddress
        ? `${USER_PROFILE_URL}/${metadata.userAddress}`
        : "",
    [metadata]
  )

  const [ff] = useFeatureFlagContext()

  const jumpInUrl = useMemo(() => getExplorerUrl(metadata), [metadata])

  return (
    <div className={TokenList.join(["metadata__container", className])}>
      <div className="metadata__wrapper">
        {!loading && (
          <h1 className="metadata__title">{l("component.metadata.title")}</h1>
        )}
        {loading && <LoadingText type="p" size="medium" />}
        <div className="metadata__date">
          {!loading &&
            metadata?.dateTime &&
            Time(Number(metadata.dateTime) * 1000)
              .utc()
              .format("MMMM DD YYYY")}
          {loading && <LoadingText type="span" size="large" />}
        </div>
        <div className="metadata__user">
          <Avatar
            size="medium"
            key={metadata?.userAddress}
            address={metadata?.userAddress}
            loading={loading}
          />{" "}
          {!loading && (
            <span>
              {l("component.metadata.photo_taken_by")}{" "}
              {!ff.flags[FeatureFlags.HideUserProfileLink] && (
                <Link className="metadata__user-name" href={profileUrl}>
                  {metadata?.userName}
                </Link>
              )}
              {ff.flags[FeatureFlags.HideUserProfileLink] && metadata?.userName}
            </span>
          )}
          {loading && <LoadingText type="span" size="medium" />}
        </div>
        {!loading && (
          <h1 className="metadata__title">{l("component.metadata.place")}</h1>
        )}
        {loading && <LoadingText type="p" size="small" />}
        {!loading && metadata && (
          <div className="metadata__place">
            <div className="metadata__place--wrapper">
              <Icon name="map marker alternate" />{" "}
              {placeUrl && (
                <Link href={placeUrl}>
                  {metadata.scene.name} {metadata.scene.location.x},
                  {metadata.scene.location.y}
                </Link>
              )}
              {!placeUrl && (
                <span>
                  {metadata.scene.name} - {metadata.scene.location.x},
                  {metadata.scene.location.y}
                </span>
              )}
            </div>
            <Button
              primary
              as="a"
              href={jumpInUrl}
              target="_blank"
              data-event={SegmentImage.JumpIn}
              data-scene={`${metadata.scene.location.x},${metadata?.scene.location.y}`}
              loading={loading}
            >
              {l("component.metadata.jump_in")}
            </Button>
          </div>
        )}
        {loading && <LoadingText type="span" size="large" />}
      </div>

      <div className="metadata__divider" />
      {!loading && metadata?.visiblePeople.length > 0 && (
        <div className="metadata__people-container">
          <h1 className="metadata__title-people">
            {l("component.metadata.people")}
          </h1>
          <div className="metadata__user-wrapper">
            {metadata.visiblePeople.sort(handleSort).map((user) => (
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
