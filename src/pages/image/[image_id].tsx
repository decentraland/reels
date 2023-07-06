import React, { useMemo } from "react"

import { Helmet } from "react-helmet"

import { RouteComponentProps } from "@gatsbyjs/reach-router"
import NotFound from "decentraland-gatsby/dist/components/Layout/NotFound"

import ImageViewer from "../../components/ImageViewer/ImageViewer"
import useImageById from "../../hooks/useImageById"

export type EventPageState = {
  updating: Record<string, boolean>
}

export default function ImagePage({
  image_id,
}: RouteComponentProps<{ image_id: string }>) {
  const [photoFetch, photoState] = useImageById(image_id)

  const photo = useMemo(() => photoFetch, [photoFetch])

  if (photoState.loaded && !photoState.loading && !photo) {
    return <NotFound />
  }

  return (
    <>
      <Helmet>
        <title>Image title</title>
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
      <div>{!photoState.loading && <ImageViewer image={photo!} />}</div>
    </>
  )
}
