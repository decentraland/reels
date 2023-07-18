import React from "react"

import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"

import NoPhoto from "../../images/no-camera.svg"

import "./NotPhoto.css"

export default React.memo(function NotPhoto() {
  const l = useFormatMessage()
  return (
    <div className="no-photo__container">
      <img src={NoPhoto} />
      <h1>{l("component.no_photo.title")}</h1>
      <h3>{l("component.no_photo.subtitle")}</h3>
    </div>
  )
})
