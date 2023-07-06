export default function handleShare(
  e: React.MouseEvent<HTMLButtonElement>,
  url: string
) {
  e.preventDefault()
  const width = 600
  const height = 350
  const top = Math.ceil(window.outerHeight / 2 - height / 2)
  const left = Math.ceil(window.outerWidth / 2 - width / 2)
  window.open(
    url,
    "targetWindow",
    `toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`
  )
}
