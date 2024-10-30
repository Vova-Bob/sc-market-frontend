import React, { PropsWithChildren, Suspense } from "react"
import { Page } from "../metadata/Page"

export function SuspendedRoute(props: PropsWithChildren) {
  return <Suspense fallback={<Page></Page>}>{props.children}</Suspense>
}
