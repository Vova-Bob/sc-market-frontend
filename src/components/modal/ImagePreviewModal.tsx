import React, { useEffect, useRef } from "react"
import { Box, Modal } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useTranslation } from "react-i18next"

export function ImagePreviewModal(props: {
  images: string[]
  open: boolean
  onClose: () => void
  index?: number
}) {
  const { images, open, onClose, index } = props
  const theme = useTheme()
  const { t } = useTranslation()
  const imageRef = useRef<HTMLImageElement>(null)

  // Focus management for modal
  useEffect(() => {
    if (open && imageRef.current) {
      imageRef.current.focus()
    }
  }, [open])

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        paddingTop: "10vh",
        paddingLeft: 4,
        paddingRight: 4,
      }}
      aria-labelledby="image-preview-title"
      aria-describedby="image-preview-description"
    >
      <Box>
        <img
          ref={imageRef}
          style={{
            maxHeight: "80vh",
            maxWidth: theme.breakpoints.values["md"],
            margin: "0px auto",
            display: "block",
            borderRadius: 4,
          }}
          src={images[index || 0]}
          alt={t(
            "accessibility.imagePreview",
            "Image preview {{index}} of {{total}}",
            {
              index: (index || 0) + 1,
              total: images.length,
            },
          )}
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
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              onClose()
            }
          }}
          tabIndex={0}
          role="img"
          aria-label={t(
            "accessibility.enlargedImage",
            "Enlarged image view - press Escape to close",
          )}
        />
        <div id="image-preview-title" className="sr-only">
          {t("accessibility.imageModalTitle", "Image Preview")}
        </div>
        <div id="image-preview-description" className="sr-only">
          {t(
            "accessibility.imageModalDescription",
            "Viewing image {{index}} of {{total}}. Press Escape to close.",
            {
              index: (index || 0) + 1,
              total: images.length,
            },
          )}
        </div>
      </Box>
    </Modal>
  )
}
