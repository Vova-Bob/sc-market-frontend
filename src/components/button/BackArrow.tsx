import { IconButton } from "@mui/material"
import { KeyboardArrowLeftRounded } from "@mui/icons-material"
import React from "react"
import { useNavigate } from "react-router-dom"

export function BackArrow() {
  const navigate = useNavigate()

  return (
    <IconButton onClick={() => navigate(-1)}>
      <KeyboardArrowLeftRounded />
    </IconButton>
  )
}
