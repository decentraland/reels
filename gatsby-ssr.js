/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import React from "react"

import Intercom from "decentraland-gatsby/dist/components/Development/Intercom"
import Rollbar from "decentraland-gatsby/dist/components/Development/Rollbar"
import Segment from "decentraland-gatsby/dist/components/Development/Segment"
export { wrapPageElement, wrapRootElement } from "./gatsby-browser"

/**
 * @see https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/#onPreRenderHTML
 */
export function onPreRenderHTML({
  getHeadComponents,
  replaceHeadComponents,
  getPostBodyComponents,
  replacePostBodyComponents,
}) {
  const headComponents = getHeadComponents().map((component) => {
    if (component.type !== "style" || !component.props["data-href"]) {
      return component
    }

    return (
      <link
        rel="stylesheet"
        id={component.props.id}
        href={component.props["data-href"]}
      />
    )
  })

  const postBodyComponents = [...getPostBodyComponents()]

  postBodyComponents.push(<Segment key="segment" trackPage={false} />)
  postBodyComponents.push(<Intercom key="intercom" />)
  postBodyComponents.push(<Rollbar key="rollbar" />)

  replaceHeadComponents(headComponents)
  replacePostBodyComponents(postBodyComponents)
}
