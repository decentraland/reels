import React from "react"

import Link from "decentraland-gatsby/dist/plugins/intl/Link"
import DclLogo from "decentraland-gatsby/static/decentraland.svg"

import DclText from "../../images/dcl-text.svg"

import "./Logo.css"

const DECENTRALAND_HOMEPAGE_URL =
  process.env.GATSBY_DECENTRALAND_HOMEPAGE_URL || "https://decentraland.org"

export default React.memo(function Logo() {
  return (
    <Link href={DECENTRALAND_HOMEPAGE_URL} className="logo-container">
      <img className="logo-image" src={DclLogo} />
      <img className="logo-text" src={DclText} />
    </Link>
  )
})
