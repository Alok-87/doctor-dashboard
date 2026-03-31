import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/authSlice'
import profileReducer from '../profile/profileSlice'
import medicineReducer from '../medicine/medicineSlice'
import walletReducer from '../wallet/walletSlice'
import videocallReducer from '../videocall/videocallSlice'

export const store = configureStore({
  reducer: {
    auth:authReducer,
    profile:profileReducer,
    medicine :medicineReducer,
    wallet: walletReducer,
    videocall: videocallReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch