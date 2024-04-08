import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../../App';

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    list: [],
  },
  reducers: {
    addToFavorites: (state, action) => {
      const newItem = action.payload;
      const isDuplicate = state.list.some(item => item.label === newItem.label);

      if (!isDuplicate) {
        state.list.push(newItem);
        storage.set('favouritesListData', JSON.stringify(state.list));
      }
    },
    removeFromFavorites: (state, action) => {
      state.list = state.list.filter(item => item.label !== action.payload?.label);
      console.log("🚀 ~ file: favoritesSlice.js:21 ~ action.payload?.label:", action.payload?.label)
      storage.set('favouritesListData', JSON.stringify(state.list));
    },
    setFavoritesList: (state, action) => {
      state.list = action.payload;
      storage.set('favouritesListData', JSON.stringify(state.list));
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavoritesList } = favoritesSlice.actions;

export default favoritesSlice.reducer;