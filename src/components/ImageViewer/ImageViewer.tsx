import React, { useCallback, useState } from "react"

import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"

import { Image } from "../../@types/image"
import ImageActions from "../ImageActions/ImageActions"

import "./ImageViewer.css"

export type ImageViewerProps = {
  image: Image
  loading: boolean
  className?: string
}

export default React.memo(function ImageViewer(props: ImageViewerProps) {
  const { image, loading, className } = props

  const [showMetadata, setShowMetadata] = useState(false)
  const handleShowMetadata = useCallback(() => {
    setShowMetadata(!showMetadata)
  }, [showMetadata, setShowMetadata])

  return (
    <div
      className={TokenList.join([
        "image-viewer__container",
        className,
        showMetadata && "show-metadata",
      ])}
    >
      <div
        className="image-viewer__image"
        style={{ backgroundImage: !loading ? `url(${image.url})` : "" }}
      >
        {loading && <Loader size="big" active />}
      </div>
      <ImageActions
        image={image}
        onClick={handleShowMetadata}
        loading={loading}
      />
    </div>
  )
})
