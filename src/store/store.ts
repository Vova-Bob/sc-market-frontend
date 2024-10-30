import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { serviceApi } from "./service"
// import {wikiActionApi, wikiRestApi} from "./wiki";

export const store = configureStore({
  reducer: {
    [serviceApi.reducerPath]: serviceApi.reducer,
    // [wikiRestApi.reducerPath]: wikiRestApi.reducer,
    // [wikiActionApi.reducerPath]: wikiActionApi.reducer,
  },

  middleware: (gDM) =>
    gDM().concat(
      serviceApi.middleware,
      // wikiRestApi.middleware,
      // wikiActionApi.middleware,
    ),
})

setupListeners(store.dispatch)
