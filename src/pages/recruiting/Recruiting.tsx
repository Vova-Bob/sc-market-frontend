import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React, { useCallback, useRef, useState } from "react"
import {
  Button,
  Divider,
  Grid,
  IconButton,
  TablePagination,
} from "@mui/material"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import CloseIcon from "@mui/icons-material/CloseRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"
import { Page } from "../../components/metadata/Page"
import { RecruitingSidebar } from "../../views/recruiting/RecruitingSidebar"
import { RecruitingSidebarContext } from "../../hooks/recruiting/RecruitingSidebar"
import {
  RecruitingSearchContext,
  RecruitingSearchState,
} from "../../hooks/recruiting/RecruitingSearch"
import {
  useRecruitingGetAllPostsQuery,
  useRecruitingGetPostByOrgQuery,
} from "../../store/recruiting"
import {
  RecruitingPostItem,
  RecruitingPostSkeleton,
} from "../../views/recruiting/RecruitingList"
import { NoteAddRounded } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"

export function Recruiting() {
  const [perPage, setPerPage] = useState(15)
  const [page, setPage] = useState(0)
  const [searchState, setSearchState] = useState<RecruitingSearchState>({
    sorting: "activity",
    query: "",
    fields: [],
    rating: 0,
  })

  const { data: posts, isLoading } = useRecruitingGetAllPostsQuery({
    index: page,
    pageSize: perPage,
    ...searchState,
  })
  const [currentOrg] = useCurrentOrg()
  const { data: mypost, isSuccess: alreadyPosted } =
    useRecruitingGetPostByOrgQuery(currentOrg?.spectrum_id!, {
      skip: !currentOrg?.spectrum_id,
    })

  const ref = useRef<HTMLDivElement>(null)

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage)
      if (ref.current) {
        ref.current.scrollIntoView({
          block: "end",
          behavior: "smooth",
        })
      }
    },
    [ref],
  )

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const [drawerOpen] = useDrawerOpen()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Page title={"Recruiting Orgs"}>
      <RecruitingSidebarContext.Provider value={[sidebarOpen, setSidebarOpen]}>
        <RecruitingSearchContext.Provider value={[searchState, setSearchState]}>
          <IconButton
            color="secondary"
            aria-label="toggle market sidebar"
            sx={{
              position: "absolute",
              zIndex: 50,
              left: (drawerOpen ? sidebarDrawerWidth : 0) + 24,
              top: 64 + 24,
              transition: "0.3s",
            }}
            onClick={() => {
              setSidebarOpen(true)
            }}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          <RecruitingSidebar />
          <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
            <div ref={ref} />
            <Grid
              item
              container
              justifyContent={"space-between"}
              spacing={2}
              xs={12}
            >
              <HeaderTitle lg={7} xl={7}>
                Recruiting Orgs
              </HeaderTitle>
              {currentOrg && (
                <Grid item>
                  {alreadyPosted ? (
                    <Link
                      to={`/recruiting/post/${mypost?.post_id}/update`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      <Button
                        startIcon={<NoteAddRounded />}
                        variant={"contained"}
                      >
                        Update Post
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      to={"/recruiting/post/create"}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      <Button
                        startIcon={<NoteAddRounded />}
                        variant={"contained"}
                      >
                        Create Post
                      </Button>
                    </Link>
                  )}
                </Grid>
              )}
            </Grid>
            {!isLoading
              ? (posts?.items || []).map((item, index) => (
                  <RecruitingPostItem post={item} key={index} index={index} />
                ))
              : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <RecruitingPostSkeleton key={i} />
                ))}

            <Grid item xs={12}>
              <Divider light />
            </Grid>

            <Grid item xs={12}>
              <TablePagination
                rowsPerPageOptions={[5, 15, 25]}
                component="div"
                count={posts?.total || 0}
                rowsPerPage={perPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                color={"primary"}
                nextIconButtonProps={{ color: "primary" }}
                backIconButtonProps={{ color: "primary" }}
              />
            </Grid>
          </ContainerGrid>
        </RecruitingSearchContext.Provider>
      </RecruitingSidebarContext.Provider>
    </Page>
  )
}
