import { Stack } from "@mui/system"
import { Avatar, Box, ButtonBase, Fab, Paper } from "@mui/material"
import { AddAPhotoRounded, CloseRounded } from "@mui/icons-material"
import React, { useState } from "react"
import { ImageSearch } from "../../views/market/ImageSearch"

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

export function SelectPhotosArea(props: {
  setPhotos: (photos: string[]) => void
  photos: string[]
}) {
  const { photos, setPhotos } = props
  const [photoOpen, setPhotoOpen] = useState(false)

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
              }}
            >
              <AddAPhotoRounded />
            </Box>
          </ButtonBase>
        </Paper>

        {photos.map((url, index) => (
          <PhotoEntry
            url={url}
            key={index}
            onClose={() => setPhotos(photos.toSpliced(index, 1))}
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
