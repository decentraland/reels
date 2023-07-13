import React, { useCallback, useMemo } from "react"

import useTrackContext from "decentraland-gatsby/dist/context/Track/useTrackContext"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import Link from "decentraland-gatsby/dist/plugins/intl/Link"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"

import downloadIcon from "../../images/download-icon.svg"
import infoIcon from "../../images/info-icon.svg"
import linkIcon from "../../images/link-icon.svg"
import twitterIcon from "../../images/twitter-icon.svg"
import locations from "../../modules/locations"
import { SegmentImage } from "../../modules/segment"
import { ImageViewerProps } from "../ImageViewer/ImageViewer"

import "./ImageActions.css"

type ImageActionsProps = ImageViewerProps & {
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export default React.memo(function ImageActions(props: ImageActionsProps) {
  const { image, loading, className, onClick } = props

  const l = useFormatMessage()
  const track = useTrackContext()

  const [isBadgeVisible, setIsBadgeVisible] = React.useState(false)

  const twitterLink = useMemo(
    () =>
      encodeURI(
        l("component.image_actions.uri.twitter", {
          url: locations.image(image.id),
          description: l("component.image_actions.image_share"),
        })
      ),
    [image]
  )

  const handleCopyLink = useCallback(
    (e) => {
      e.preventDefault()
      track(SegmentImage.CopyLink, { image })
      navigator.clipboard.writeText(window.location.href)
      if (!isBadgeVisible) {
        setIsBadgeVisible(true)

        setTimeout(() => {
          setIsBadgeVisible(false)
        }, 2000)
      }
    },
    [image, track, isBadgeVisible]
  )

  const handleDownload = useCallback(
    async (e) => {
      e.preventDefault()
      track(SegmentImage.Download, { image })

      const response = await fetch(image.url)

      const blobImage = await response.blob()

      const href = URL.createObjectURL(blobImage)

      const anchorElement = document.createElement("a")
      anchorElement.href = href
      anchorElement.download = "image.jpg"

      document.body.appendChild(anchorElement)
      anchorElement.click()

      document.body.removeChild(anchorElement)
      window.URL.revokeObjectURL(href)
    },
    [image, track]
  )

  if (loading) return <></>

  return (
    <div className={TokenList.join(["image-actions", className])}>
      <Link href={twitterLink} target="_blank" rel="noopener noreferrer">
        <img src={twitterIcon} alt="Twitter" />
      </Link>
      <div
        className={TokenList.join(["link-copy", isBadgeVisible && "copied"])}
      >
        <img src={linkIcon} alt="Link" onClick={handleCopyLink} />
      </div>
      <img src={downloadIcon} alt="Download" onClick={handleDownload} />
      <div className="image-actions__spacer" />
      <img src={infoIcon} alt="Info" className="info" onClick={onClick} />
    </div>
  )
})
