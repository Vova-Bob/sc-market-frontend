import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React from "react"
import { CustomerList } from "../../views/people/Customers"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Page } from "../../components/metadata/Page"
import { AdminDailyActivity, AdminUserList } from "../../views/people/AllUsers"
import { AdminExpressVerify } from "../../views/authentication/AdminExpressVerify"
import { useTranslation } from "react-i18next"

export function CustomerPage(props: {
  contractors?: boolean
  members?: boolean
  customers?: boolean
  users?: boolean
}) {
  const { t } = useTranslation()

  return (
    <Page title={t("customerList.customers")}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <HeaderTitle>{t("people.title")}</HeaderTitle>

        <CustomerList {...props} />
      </ContainerGrid>
    </Page>
  )
}

export function AdminUserListPage() {
  const { t } = useTranslation()

  return (
    <Page title={t("customerList.customers")}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <HeaderTitle>{t("people.title")}</HeaderTitle>

        <AdminDailyActivity />
        <AdminUserList />
        <AdminExpressVerify />
      </ContainerGrid>
    </Page>
  )
}
