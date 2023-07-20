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

  const loading = !photoState.loaded || photoState.loading
  if (!loading && !photo) {
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
      </Helmet>
      <div>
        <ImageViewer image={photo!} loading={loading} />
        <Metadata metadata={photo!.metadata} loading={loading} />
      </div>
    </>
  )
}
