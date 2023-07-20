import React from "react"

import { Helmet } from "react-helmet"

import { RouteComponentProps, navigate } from "@gatsbyjs/reach-router"
import useFeatureFlagContext from "decentraland-gatsby/dist/context/FeatureFlag/useFeatureFlagContext"

import NotPhoto from "../../components/NotPhoto/NotPhoto"
import useImagesByUser from "../../hooks/useImagesByUser"
import { FeatureFlags } from "../../modules/ff"
import locations from "../../modules/locations"

import "./index.css"

const PAGE_SIZE = 24

export default function ListPage({
  address,
}: RouteComponentProps<{ address: string }>) {
  const [photoFetch, photoState] = useImagesByUser(address, {
    limit: PAGE_SIZE,
    offset: 0,
  })

  const [ff] = useFeatureFlagContext()

  if (!ff.flags[FeatureFlags.ShowUserImages]) {
    return <NotPhoto />
  }

  return (
    <>
      <Helmet>
        <title>{"Reel"}</title>
        <meta name="description" content={""} />
      </Helmet>

      <div className="images-container">
        {photoFetch.length > 0 && (
          <h1 className="images-title">
            User: {photoFetch[0].metadata.userName}
          </h1>
        )}
        {photoState.loaded && photoFetch.length === 0 && <NotPhoto />}
        <div className="images-wrapper">
          {photoFetch.length > 0 &&
            photoFetch.map((image) => (
              <div
                key={image.id}
                onClick={() => navigate(locations.image(image.id))}
                className="images-item"
              >
                <img src={image.url} />
              </div>
            ))}
        </div>
      </div>
    </>
  )
}
