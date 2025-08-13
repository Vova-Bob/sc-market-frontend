import { Stack } from "@mui/system"
import {
  Avatar,
  Box,
  ButtonBase,
  Fab,
  Paper,
  Button,
  Typography,
} from "@mui/material"
import {
  AddAPhotoRounded,
  CloseRounded,
  CloudUploadRounded,
} from "@mui/icons-material"
import React, { useState, useRef, useCallback } from "react"
import { ImageSearch } from "../../views/market/ImageSearch"
import { useTranslation } from "react-i18next"

export function PhotoEntry(props: { url: string; onClose: () => void }) {
  return (
    <Paper
      sx={{ width: 96, height: 96, bgcolor: "#000000CC", position: "relative" }}
    >
      <Fab
        size={"small"}
        sx={{
          transform: "scale(0.6)",
          position: "absolute",
          top: -4,
          right: -4,
        }}
        onClick={props.onClose}
      >
        <CloseRounded />
      </Fab>
      <Avatar
        src={props.url}
        sx={{ borderRadius: 0, width: "100%", height: "100%" }}
      />
    </Paper>
  )
}

export function PendingPhotoEntry(props: { file: File; onClose: () => void }) {
  const [previewUrl, setPreviewUrl] = useState<string>("")

  React.useEffect(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string)
      }
    }
    reader.readAsDataURL(props.file)
  }, [props.file])

  return (
    <Paper
      sx={{ width: 96, height: 96, bgcolor: "#000000CC", position: "relative" }}
    >
      <Fab
        size={"small"}
        sx={{
          transform: "scale(0.6)",
          position: "absolute",
          top: -4,
          right: -4,
        }}
        onClick={props.onClose}
      >
        <CloseRounded />
      </Fab>
      <Avatar
        src={previewUrl}
        sx={{ borderRadius: 0, width: "100%", height: "100%" }}
      />
    </Paper>
  )
}

export function SelectPhotosArea(props: {
  setPhotos: (photos: string[]) => void
  photos: string[]
  onFileUpload?: (files: File[]) => void
  showUploadButton?: boolean
  pendingFiles?: File[]
  onRemovePendingFile?: (file: File) => void
}) {
  const {
    photos,
    setPhotos,
    onFileUpload,
    showUploadButton = true,
    pendingFiles = [],
    onRemovePendingFile,
  } = props
  const [photoOpen, setPhotoOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files) {
        console.log(`[SelectPhotosArea] File upload initiated:`, {
          file_count: files.length,
          files: Array.from(files).map((f) => ({
            name: f.name,
            size: f.size,
            type: f.type,
          })),
        })

        const fileArray = Array.from(files)
        if (onFileUpload) {
          onFileUpload(fileArray)
        }
      }
      // Reset the input value so the same file can be selected again
      event.target.value = ""
    },
    [onFileUpload],
  )

  const handleRemovePendingFile = (file: File) => {
    console.log(`[SelectPhotosArea] Removing pending file:`, {
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    })
    if (onRemovePendingFile) {
      onRemovePendingFile(file)
    }
  }

  const handleRemovePhoto = (photo: string) => {
    console.log(`[SelectPhotosArea] Removing existing photo:`, {
      photo_url: photo,
    })
    setPhotos(photos.filter((p) => p !== photo))
  }

  return (
    <>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        justifyContent={"left"}
        sx={{
          "& > *": {
            margin: 0.5,
          },
        }}
      >
        <Paper sx={{ width: 96, height: 96, bgcolor: "#00000099" }}>
          <ButtonBase
            sx={{ width: "100%", height: "100%" }}
            onClick={() => {
              setPhotoOpen(true)
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <AddAPhotoRounded />
              <Typography
                variant="caption"
                sx={{ fontSize: "0.7rem", mt: 0.5 }}
              >
                {t("SelectPhotosArea.imageSearch")}
              </Typography>
            </Box>
          </ButtonBase>
        </Paper>

        {showUploadButton && onFileUpload && (
          <Paper sx={{ width: 96, height: 96, bgcolor: "#00000099" }}>
            <ButtonBase
              sx={{ width: "100%", height: "100%" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CloudUploadRounded />
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.7rem", mt: 0.5 }}
                >
                  {t("SelectPhotosArea.upload")}
                </Typography>
              </Box>
            </ButtonBase>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleFileUpload}
            />
          </Paper>
        )}

        {/* Display pending files */}
        {pendingFiles.map((file, index) => (
          <PendingPhotoEntry
            file={file}
            key={`pending-${index}`}
            onClose={() => handleRemovePendingFile(file)}
          />
        ))}

        {/* Display searched images */}
        {photos.map((url, index) => (
          <PhotoEntry
            url={url}
            key={`searched-${index}`}
            onClose={() => handleRemovePhoto(url)}
          />
        ))}
      </Stack>
      <ImageSearch
        open={photoOpen}
        setOpen={setPhotoOpen}
        callback={(arg) => {
          if (arg) {
            setPhotos([...photos, arg])
          }
        }}
      />
    </>
  )
}
