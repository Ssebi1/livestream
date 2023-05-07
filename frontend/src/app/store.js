import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import streamReducer from '../features/streams/streamSlice'
import streamerReducer from '../features/streamers/streamerSlice'
import categoriesReducer from '../features/categories/categorySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    streams: streamReducer,
    streamers: streamerReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})