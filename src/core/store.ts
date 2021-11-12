import { configureStore, createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from './reducers'

/**
 * ## configureStore
 * @param {Object} the state
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    createSerializableStateInvariantMiddleware({
      isSerializable: () => true,
    }),
  ],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
