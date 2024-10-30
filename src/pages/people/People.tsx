import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React from "react"
import { CustomerList } from "../../views/people/Customers"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Page } from "../../components/metadata/Page"
import { AdminDailyActivity, AdminUserList } from "../../views/people/AllUsers"
import { AdminExpressVerify } from "../../views/authentication/AdminExpressVerify"

export function CustomerPage(props: {
  contractors?: boolean
  members?: boolean
  customers?: boolean
  users?: boolean
}) {
  return (
    <Page title={"Customers"}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <HeaderTitle>People</HeaderTitle>

        <CustomerList {...props} />
      </ContainerGrid>
    </Page>
  )
}

export function AdminUserListPage() {
  return (
    <Page title={"Customers"}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <HeaderTitle>People</HeaderTitle>

        <AdminDailyActivity />
        <AdminUserList />
        <AdminExpressVerify />
      </ContainerGrid>
    </Page>
  )
}
