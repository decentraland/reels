import React from "react"

import DclLogo from "decentraland-gatsby/static/decentraland.svg"

import DclText from "../../images/dcl-text.svg"

import "./index.css"

export default React.memo(function Logo() {
  return (
    <div className="logo-container">
      <img className="logo-image" src={DclLogo} />
      <img className="logo-text" src={DclText} />
    </div>
  )
})
