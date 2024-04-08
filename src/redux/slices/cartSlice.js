// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  cart: [],
};

const loadCartFromStorage = async () => {
  try {
    const storedCart = await AsyncStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : initialState;
  } catch (error) {
    console.error('Error loading cart from AsyncStorage:', error);
    return initialState;
  }
};

const saveCartToStorage = async (cart) => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to AsyncStorage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCart: (state, action) => {
      return action.payload;
    },
    addItem: (state, action) => {
      // console.log("action.payload", action.payload);
      const existingItem = state?.cart?.find((item) => item.id === action.payload.id);
      if (!existingItem) {
        state?.cart?.push(action.payload);
        saveCartToStorage(state);
      } else {
        console.warn('Item already exists in the cart!');
      }
    },
    removeItem: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.cart.find((item) => item.id === id);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
        saveCartToStorage(state);
      }
    },
  },
});

export const initializeCart = () => async (dispatch) => {
  const loadedCart = await loadCartFromStorage();
  dispatch(loadCart(loadedCart));
};

export const { loadCart, addItem, removeItem, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
