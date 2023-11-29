// reducers/productReducer.js

const initialState = {
  products: [],
  cart: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };

   // reducers/productReducer.js

   case 'ADD_TO_CART':
      const productId = action.payload;
      const productToAdd = state.products.find((product) => product.id === productId);

      if (productToAdd) {
        const existingCartItem = state.cart.find((item) => item.id === productId);

        if (existingCartItem) {
          // If the item is already in the cart, update its quantity
          return {
            ...state,
            cart: state.cart.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        } else {
          // If the item is not in the cart, add it with quantity 1
          return {
            ...state,
            cart: [...state.cart, { ...productToAdd, quantity: 1 }],
          };
        }
      } else {
        return state;
      }

      case 'REMOVE_FROM_CART':
        const productToRemoveId = action.payload;
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== productToRemoveId),
        };
  
      case 'INCREASE_QUANTITY':
        const productToIncreaseId = action.payload;
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === productToIncreaseId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
  
      case 'DECREASE_QUANTITY_OR_REMOVE':
        const productToDecreaseId = action.payload;
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === productToDecreaseId
              ? item.quantity === 1
                ? null // This signals that the item should be removed
                : { ...item, quantity: item.quantity - 1 }
              : item
          ).filter((item) => item !== null),
        };
  

    // Add other cases as needed for more actions

    default:
      return state;
  }
};

export default productReducer;
