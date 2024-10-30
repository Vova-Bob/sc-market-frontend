import {
  Box,
  Button,
  ButtonBase,
  CardMedia,
  Grid,
  ImageListItem,
  imageListItemClasses,
  Modal,
  Paper,
  TextField,
} from "@mui/material"
import React, { useCallback, useEffect, useState } from "react"
import { Section } from "../../components/paper/Section"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { external_resource_regex } from "../people/ViewProfile"
import { ExtendedTheme, MISSING_IMAGE_URL } from "../../hooks/styles/Theme"
import { store } from "../../store/store"
import throttle from "lodash/throttle"
import { transformSearchResults, wikiRestApi } from "../../store/wiki"
import { useTheme } from "@mui/material/styles"

export function ImageSearch(props: {
  open: boolean
  setOpen: (val: boolean) => void
  callback: (arg: string | null) => void
}) {
  const { callback, open, setOpen } = props
  const [image, setImage] = useState<string | null>(null)
  const [query, setQuery] = useState<string | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const theme = useTheme<ExtendedTheme>()

  const fetchOptions = useCallback(
    async (query: string) => {
      if (query.length < 3) {
        return
      }

      const { status, data, error } = await store.dispatch(
        wikiRestApi.endpoints.searchImages.initiate(query),
      )

      setOptions(data ? transformSearchResults(data) : [])
    },
    [setOptions],
  )

  const retrieve = React.useMemo(
    () => throttle((query: string) => fetchOptions(query), 800),
    [fetchOptions],
  )

  useEffect(() => {
    if (query) {
      retrieve(query)
    } else {
      setOptions([])
    }
  }, [query, retrieve])

  return (
    <Modal open={open} onClose={() => callback(image)}>
      <ContainerGrid sidebarOpen={false} maxWidth={"md"} noFooter>
        <Section
          title={"Select Image"}
          xs={12}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            return false
          }}
        >
          <Grid item xs={12} md={3}>
            <CardMedia
              component="img"
              loading="lazy"
              height={200}
              image={image || MISSING_IMAGE_URL}
              alt={image || ""}
              sx={{
                borderRadius: 3,
                transition: "0.5s",
              }}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ marginBottom: 2 }}>
              <TextField
                variant={"outlined"}
                label={"Image URL"}
                fullWidth
                focused
                multiline
                helperText={
                  "Must be a direct URL to the image, from Imgur, RSI, or starcitizen.tools"
                }
                onChange={(event: React.ChangeEvent<{ value: string }>) => {
                  setImage(event.target.value)
                }}
                value={image}
                error={!!image && !image.match(external_resource_regex)}
              />
            </Box>
            <Box>
              <TextField
                variant={"outlined"}
                label={"Image Search"}
                fullWidth
                focused
                multiline
                helperText={
                  "Search query to search for images from starcitizen.tools"
                }
                onChange={(event: React.ChangeEvent<{ value: string }>) => {
                  setQuery(event.target.value)
                }}
                value={query}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Paper
              variant={"outlined"}
              sx={{ border: "2px solid", color: theme.palette.secondary.main }}
            >
              <Box
                sx={{
                  display: "grid",
                  width: "100%",
                  // height: 400,
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(4, 1fr)",
                    xl: "repeat(4, 1fr)",
                  },
                  // standard variant from here:
                  // https://github.com/mui-org/material-ui/blob/3e679ac9e368aeb170d564d206d59913ceca7062/packages/mui-material/src/ImageListItem/ImageListItem.js#L42-L43
                  [`& .${imageListItemClasses.root}`]: {
                    display: "flex",
                    flexDirection: "column",
                  },
                }}
              >
                {options.map((item, i) => (
                  <ImageListItem key={i}>
                    <ButtonBase onClick={() => setImage(item)}>
                      <CardMedia
                        component="img"
                        loading="lazy"
                        height={200}
                        width={200}
                        image={item}
                        alt={""}
                        sx={{
                          borderRadius: 3,
                          transition: "0.5s",
                        }}
                      />
                    </ButtonBase>
                  </ImageListItem>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                color={"error"}
                variant={"contained"}
                onClick={() => {
                  setOpen(false)
                  callback(null)
                }}
                sx={{ marginRight: 1 }}
              >
                Cancel
              </Button>
              <Button
                color={"primary"}
                variant={"contained"}
                onClick={() => {
                  setOpen(false)
                  callback(image)
                }}
              >
                Save and Close
              </Button>
            </Box>
          </Grid>
        </Section>
      </ContainerGrid>
    </Modal>
  )
}
