import React from "react"

import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"

import { Image } from "../../@types/image"
import ImageActions from "../ImageActions/ImageActions"

import "./ImageViewer.css"

export type ImageViewerProps = {
  image: Image
  className?: string
}

export default React.memo(function ImageViewer(props: ImageViewerProps) {
  const { image, className } = props
  return (
    <div className={TokenList.join(["image-viewer__container", className])}>
      <div
        className="image-viewer__image"
        style={{ backgroundImage: `url(${image.url})` }}
      ></div>
      <ImageActions image={image} />
    </div>
  )
})
