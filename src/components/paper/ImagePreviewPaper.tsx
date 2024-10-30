import { ImagePreviewModal } from "../modal/ImagePreviewModal"
import { IconButton, Paper } from "@mui/material"
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  ZoomInRounded,
} from "@mui/icons-material"
import React, { useState } from "react"

export function ImagePreviewPaper(props: { photos: string[] }) {
  const { photos } = props
  const [imageIndex, setImageIndex] = useState(0)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  return (
    <>
      <ImagePreviewModal
        images={photos}
        index={imageIndex}
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
      <Paper
        sx={{
          borderRadius: 3,
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
          maxHeight: 600,
          height: 400,
          width: "100%",
          position: "relative",
        }}
        onClick={() => setImageModalOpen((o) => !o)}
      >
        {imageIndex > 0 && (
          <IconButton
            sx={{ top: "50%", right: 4, position: "absolute" }}
            onClick={(event) => {
              setImageIndex((index) => Math.max(index - 1, 0))
              event.preventDefault()
              event.stopPropagation()
            }}
          >
            <KeyboardArrowRight style={{ color: "white" }} />
          </IconButton>
        )}

        {imageIndex < photos.length - 1 && (
          <IconButton
            sx={{ top: "50%", left: 4, position: "absolute" }}
            onClick={(event) => {
              setImageIndex((index) => Math.min(index + 1, photos.length - 1))
              event.preventDefault()
              event.stopPropagation()
            }}
          >
            <KeyboardArrowLeft style={{ color: "white" }} />
          </IconButton>
        )}

        <IconButton sx={{ top: 4, right: 4, position: "absolute" }}>
          <ZoomInRounded />
        </IconButton>
        <img
          // component="img"
          style={{
            display: "block",
            maxHeight: "100%",
            maxWidth: "100%",
            margin: "auto",
          }}
          src={
            photos[imageIndex] ||
            "https://cdn.robertsspaceindustries.com/static/images/Temp/default-image.png"
          }
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src =
              "https://cdn.robertsspaceindustries.com/static/images/Temp/default-image.png"
          }}
        />
      </Paper>
    </>
  )
}
