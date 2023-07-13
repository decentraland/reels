/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from "react"
import "core-js/features/set-immediate"

import "./src/config"

// eslint-disable-next-line css-import-order/css-import-order
import "semantic-ui-css/semantic.min.css"
// eslint-disable-next-line css-import-order/css-import-order
import "balloon-css/balloon.min.css"
// eslint-disable-next-line css-import-order/css-import-order
import "decentraland-ui/dist/themes/base-theme.css"
// eslint-disable-next-line css-import-order/css-import-order
import "decentraland-ui/dist/themes/alternative/light-theme.css"
// eslint-disable-next-line css-import-order/css-import-order
import "decentraland-gatsby/dist/variables.css"
// eslint-disable-next-line css-import-order/css-import-order
import "./src/theme.css"

import FeatureFlagProvider from "decentraland-gatsby/dist/context/FeatureFlag/FeatureFlagProvider"
import { IntlProvider } from "decentraland-gatsby/dist/plugins/intl"
import segment from "decentraland-gatsby/dist/utils/development/segment"

export const registerServiceWorker = () => true

export const wrapRootElement = ({ element }) => (
  <FeatureFlagProvider applicationName={["reels", "dapps"]}>
    {element}
  </FeatureFlagProvider>
)

export const wrapPageElement = ({ element, props }) => {
  return <IntlProvider {...props.pageContext.intl}>{element}</IntlProvider>
}

export const onClientEntry = () => {
  segment((analytics) => analytics.page())
}

export const onRouteUpdate = () => {
  segment((analytics) => analytics.page())
}

export const shouldUpdateScroll = ({ prevRouterProps, routerProps }) => {
  if (prevRouterProps?.location?.pathname === routerProps?.location?.pathname) {
    return false
  }

  return true
}

eval("Math.pow = (a, b) => a ** b")
