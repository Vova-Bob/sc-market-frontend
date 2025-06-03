import { FlatSection } from "../../components/paper/Section"
import {
  useMarketGetAggregateByIDQuery,
  useMarketItemsByCategoryQuery,
} from "../../store/market"
import React, { useMemo, useState } from "react"
import { BuyOrderForm } from "../../views/market/BuyOrderForm"
import { Page } from "../../components/metadata/Page"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { SelectGameItemStack } from "../../components/select/SelectGameItem"

export function CreateBuyOrder() {
  const [itemType, setItemType] = useState<string>("Other")
  const [itemName, setItemName] = useState<string | null>(null)

  const { data: items } = useMarketItemsByCategoryQuery(itemType!, {
    skip: !itemType,
  })

  const item_name_value = useMemo(
    () =>
      itemName
        ? (items || []).find((o) => o.name === itemName)?.id || null
        : null,
    [items, itemName],
  )

  const { data: aggregate } = useMarketGetAggregateByIDQuery(item_name_value!, {
    skip: !item_name_value,
  })

  return (
    <Page title={"Create Buy Order"}>
      <ContainerGrid sidebarOpen={true}>
        <FlatSection title={"Select Item"}>
          <SelectGameItemStack
            onItemChange={(value) => setItemName(value)}
            onTypeChange={(value) => {
              setItemType(value)
              setItemName(null)
            }}
            item_type={itemType}
            item_name={itemName}
          />
        </FlatSection>

        {item_name_value && aggregate && <BuyOrderForm aggregate={aggregate} />}
      </ContainerGrid>
    </Page>
  )
}
