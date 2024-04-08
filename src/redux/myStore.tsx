import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './slices/apiSlice';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer, { initializeCart } from './slices/cartSlice';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    favorites: favoritesReducer,
  cart: cartReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);
store.dispatch(initializeCart());

export default store;
