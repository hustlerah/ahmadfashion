// actions/productActions.js

export const setProducts = (products) => ({
    type: 'SET_PRODUCTS',
    payload: products,
  });
  
  export const addToCart = (productId) => ({
    type: 'ADD_TO_CART',
    payload: productId,
  });
  
  export const removeFromCart = (productId) => ({
    type: 'REMOVE_FROM_CART',
    payload: productId,
  });
  // productActions.js
export const increaseQuantity = (productId) => ({
  type: 'INCREASE_QUANTITY',
  payload: productId,
});
// productActions.js

// other actions...
export const decreaseQuantity = (productId) => ({
  type: 'DECREASE_QUANTITY_OR_REMOVE',
  payload: productId,
});
