import React, { useCallback, useMemo } from "react"

import Avatar from "decentraland-gatsby/dist/components/Profile/Avatar"
import useFeatureFlagContext from "decentraland-gatsby/dist/context/FeatureFlag/useFeatureFlagContext"
import useTrackContext from "decentraland-gatsby/dist/context/Track/useTrackContext"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import Link from "decentraland-gatsby/dist/plugins/intl/Link"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"
import { Filter } from "decentraland-ui/dist/components/Filter/Filter"
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon"
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic"

import WearableMetadata from "./WearableMetadata"
import { User } from "../../@types/image"
import NoWearable from "../../images/wearable-shirt.svg"
import { FeatureFlags } from "../../modules/ff"
import { SegmentImage } from "../../modules/segment"
import LoadingText from "../Loading/LoadingText"

import "./UserMetadata.css"

export type UserMetadataProps = {
  user: User
  initialWearableVisibility?: boolean
  loading?: boolean
  className?: string
}

const USER_PROFILE_URL =
  process.env.GATSBY_USER_PROFILE_URL || "https://profile.decentraland.org"

export default React.memo(function UserMetadata(props: UserMetadataProps) {
  const { user, initialWearableVisibility, loading, className } = props
  const track = useTrackContext()

  const [showWearables, setShowWearables] = React.useState(
    !!initialWearableVisibility
  )

  const toggleWearables = React.useCallback(() => {
    track(
      showWearables ? SegmentImage.HideWearables : SegmentImage.ShowWearables,
      { user }
    )
    setShowWearables(!showWearables)
  }, [showWearables, track, user])

  const [ff] = useFeatureFlagContext()

  const profileUrl = useMemo(
    () =>
      user?.userAddress
        ? `${USER_PROFILE_URL}/accounts/${user.userAddress}`
        : "",
    [user]
  )

  const handleUserProfile = useCallback(() => {
    track(SegmentImage.ClickWearable, {
      user,
      profileUrl,
    })
  }, [user, profileUrl, track])

  const l = useFormatMessage()
  return (
    <div className={TokenList.join(["user-metadata", className])}>
      <div className="user-metadata__container">
        <div className="user-metadata__wrapper">
          <Avatar
            size="medium"
            key={user.userAddress}
            address={user.userAddress}
            loading={loading}
          />{" "}
          {ff.flags[FeatureFlags.ShowUserProfileLink] && !loading && (
            <Link
              className="user-metadata__user-name"
              href={profileUrl}
              onClick={handleUserProfile}
            >
              {user.userName}
            </Link>
          )}
          {!ff.flags[FeatureFlags.ShowUserProfileLink] && !loading && (
            <span>{user.userName}</span>
          )}
          {!loading && user.isGuest && (
            <Filter>{l("component.metadata.guest")}</Filter>
          )}
          {loading && <LoadingText type="span" size="medium" />}
        </div>
        {!loading && !user.isGuest && (
          <Icon
            name={
              TokenList.join([
                "chevron",
                showWearables ? "up" : "down",
              ]) as SemanticICONS
            }
            onClick={toggleWearables}
          />
        )}
      </div>
      {!loading && user.wearablesParsed && (
        <div
          className={TokenList.join([
            "user-metadata__wearable-container",
            showWearables ? "wearable-metadata__wearable--show" : "",
          ])}
        >
          {user.wearablesParsed.length > 0 && (
            <h1 className="wearable-title">
              {l("component.metadata.wearable")}
            </h1>
          )}
          {user.wearablesParsed.length > 0 &&
            user.wearablesParsed.map((wearable, key) => (
              <WearableMetadata key={key} wearableParsed={wearable} />
            ))}
          {user.wearablesParsed.length === 0 && (
            <div className="no-wearables">
              <img src={NoWearable} />
              <p>{l("component.metadata.no_wearable")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
})
