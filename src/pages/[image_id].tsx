import React, { useMemo } from "react"

import { Helmet } from "react-helmet"

import { RouteComponentProps } from "@gatsbyjs/reach-router"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"

import ImageViewer from "../components/ImageViewer/ImageViewer"
import Metadata from "../components/Metadata/Metadata"
import NotPhoto from "../components/NotPhoto/NotPhoto"
import useImageById from "../hooks/useImageById"

export default function ImagePage({
  image_id,
}: RouteComponentProps<{ image_id: string }>) {
  const [photoFetch, photoState] = useImageById(image_id)

  const photo = useMemo(() => photoFetch, [photoFetch])

  const l = useFormatMessage()

  if (photoState.loaded && !photoState.loading && !photo) {
    return <NotPhoto />
  }

  return (
    <>
      <Helmet>
        <title>
          {photo?.metadata
            ? `${photo.metadata.userName} took this photo in ${photo.metadata.scene.name}`
            : l("component.no_photo.title")}
        </title>
        <meta name="description" content={"image description"} />

        <meta property="og:title" content={"og:title"} />
        <meta property="og:description" content={"og:description"} />
        <meta property="og:image" content={photo?.url} />
        <meta property="og:site" content={"og:site"} />

        <meta name="twitter:title" content={"twitter:title"} />
        <meta name="twitter:description" content={"twitter:description"} />
        <meta name="twitter:image" content={photo?.url} />
        <meta name="twitter:card" content={"summary_large_image"} />
        <meta name="twitter:creator" content={"twitter:creator"} />
        <meta name="twitter:site" content={"twitter:site"} />
      </Helmet>
      <div>
        <ImageViewer image={photo!} loading={photoState.loading} />
        {photo!.metadata && (
          <Metadata metadata={photo!.metadata} loading={photoState.loading} />
        )}
      </div>
    </>
  )
}
