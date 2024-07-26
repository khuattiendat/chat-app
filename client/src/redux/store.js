import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {combineReducers} from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import userReducer from './userSlice'
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

const persistConfig = {
    key: 'root',
    storage: storage,
    version: 1
}
export const rootReducers = combineReducers({
    user: userReducer,

})
const persistedReducer = persistReducer(persistConfig, rootReducers)
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})
setupListeners(store.dispatch)
export default store
