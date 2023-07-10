import React from "react"

import Avatar from "decentraland-gatsby/dist/components/Profile/Avatar"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon"
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic"

import WearableMetadata from "./WearableMetadata"
import { User } from "../../@types/image"
import NoWearable from "../../images/wearable-shirt.svg"

import "./UserMetadata.css"

export type UserMetadataProps = {
  user: User
  className?: string
}

export default React.memo(function UserMetadata(props: UserMetadataProps) {
  const { user, className } = props

  const [showWearables, setShowWearables] = React.useState(false)

  const toggleWearables = React.useCallback(() => {
    setShowWearables(!showWearables)
  }, [showWearables])

  const l = useFormatMessage()
  return (
    <div className={TokenList.join(["user-metadata", className])}>
      <div className="user-metadata__container" onClick={toggleWearables}>
        <div className="user-metadata__wrapper">
          <Avatar
            size="medium"
            key={user.userAddress}
            address={user.userAddress}
          />{" "}
          <span>{user.userName}</span>
        </div>
        <Icon
          name={
            TokenList.join([
              "chevron",
              showWearables ? "up" : "down",
            ]) as SemanticICONS
          }
        />
      </div>
      {user.wearablesContentEntity && (
        <div
          className={TokenList.join([
            "user-metadata__wearable-container",
            showWearables ? "wearable-metadata__wearable--show" : "",
          ])}
        >
          {user.wearablesContentEntity.length > 0 && (
            <h1 className="wearable-title">
              {l("component.metadata.wearable")}
            </h1>
          )}
          {user.wearablesContentEntity.length > 0 &&
            user.wearablesContentEntity.map((wearable, key) => (
              <WearableMetadata
                key={key}
                wearableUrn={wearable.pointers[0]}
                wearableContentEntity={wearable}
              />
            ))}
          {user.wearablesContentEntity.length === 0 && (
            <div className="no-wearables">
              <img src={NoWearable} />
              <p>This person doesn't have any equipped collectibles yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
})
