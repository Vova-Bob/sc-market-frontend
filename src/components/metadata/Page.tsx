import React, { PropsWithChildren, useEffect } from "react"
import { CURRENT_CUSTOM_ORG } from "../../hooks/contractor/CustomDomain"
import { Helmet } from "react-helmet"
import { useGetContractorBySpectrumIDQuery } from "../../store/contractor"
import { CircularProgress } from "@mui/material"
import { Stack } from "@mui/system"
import { Navigate, useLocation, useRouteError } from "react-router-dom"

export function Page(props: { title: string } & PropsWithChildren<any>) {
  useEffect(() => {
    document.title = props.title ? `${props.title} - SC Market` : "SC Market"
  }, [props.title])

  const { data: customOrgData } = useGetContractorBySpectrumIDQuery(
    CURRENT_CUSTOM_ORG!,
    { skip: !CURRENT_CUSTOM_ORG },
  )

  const location = useLocation()
  useEffect(() => {
    console.log(location)
  }, [location])

  const error = useRouteError()
  if (error) {
    return (
      <Navigate
        to={
          "/error?" +
          new URLSearchParams([
            ["message", error.toString()],
            ["target", location.pathname],
          ]).toString()
        }
      />
    )
  }

  return CURRENT_CUSTOM_ORG && customOrgData ? (
    <>
      <Helmet>
        <link rel="icon" type="image/png" href={customOrgData.avatar} />
      </Helmet>
      {props.children}
    </>
  ) : (
    props.children
  )
}

export function PageFallback() {
  return (
    <Stack width={"100%"} spacing={2}>
      <CircularProgress />
    </Stack>
  )
}
