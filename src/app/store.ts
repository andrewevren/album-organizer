import { configureStore } from "@reduxjs/toolkit";
import { firestoreApi } from "src/api/firestoreApi";

export default configureStore({
    reducer: {
        [firestoreApi.reducerPath]: firestoreApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(firestoreApi.middleware)
});