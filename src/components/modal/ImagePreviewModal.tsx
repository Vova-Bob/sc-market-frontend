import React from "react"
import { Box, Modal } from "@mui/material"
import { useTheme } from "@mui/material/styles"

export function ImagePreviewModal(props: {
  images: string[]
  open: boolean
  onClose: () => void
  index?: number
}) {
  const { images, open, onClose, index } = props
  const theme = useTheme()

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        paddingTop: "10vh",
        paddingLeft: 4,
        paddingRight: 4,
      }}
    >
      <img
        style={{
          maxHeight: "80vh",
          maxWidth: theme.breakpoints.values["md"],
          margin: "0px auto",
          display: "block",
          borderRadius: 4,
        }}
        src={images[index || 0]}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null
          currentTarget.src =
            "https://cdn.robertsspaceindustries.com/static/images/Temp/default-image.png"
        }}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          return false
        }}
      />
    </Modal>
  )
}
