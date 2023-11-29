import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, decreaseQuantity, increaseQuantity } from '@/redux/productActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const totalPrice = useSelector((state) => calculateTotalPrice(state.cart));


  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };
  const handleDecreaseQuantity = (productId) => {
    const existingCartItem1 = cartItems.find((item) => item.id === productId);

    if (existingCartItem1) {
      if (existingCartItem1.quantity === 1) {
        // If the quantity is 1, remove the item from the cart directly
        dispatch(removeFromCart(productId));
      } else {
        // If the quantity is greater than 1, decrease the quantity
        dispatch(decreaseQuantity(productId));
      }
    }
  };


  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  function calculateTotalPrice(cart) {
    return cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  }
  const router = useRouter()
  return (
    <>
     
      <div className="Cart">
        <div className="container">
        {cartItems.length === 0 ? (
          <>
          <div className="d-flex" style={{minHeight:'75vh'}}>

        <h5 className='text-center'>Your cart is empty.</h5>
       <div className="d-flex">
       <button className='btn1' onClick={()=>{router.push('/shop')}}>Shop Now</button>
       </div>
          </div>
          </>
      ) : (
<div className="row">
            <div className="col-lg-8">
              <div className="shopping__cart__table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className="product__cart__item">
                          <div className="product__cart__item__pic">
                            <img src={item.productImages[0]} alt="" className='img-fluid'/>
                          </div>
                          <div className="product__cart__item__text">
                            <h6>{item.productName}</h6>
                            <h5>${item.productPrice}</h5>
                          </div>
                        </td>
                        <td className="quantity__item">
                          <div className="quantity">
                            <div className="pro-qty-2">
                              <span
                                className="fa fa-angle-left dec qtybtn"
                                onClick={() => handleDecreaseQuantity(item.id)}
                              ><FontAwesomeIcon icon={faAngleLeft}/></span>
                              <input type="text" value={item.quantity} readOnly disabled/>
                              <span
                                className="fa fa-angle-right inc qtybtn"
                                onClick={() => handleIncreaseQuantity(item.id)}
                              >
                                <FontAwesomeIcon icon={faAngleRight}/>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="cart__price">{item.productPrice}</td>
                        <td className="cart__close">
                          <i
                            className="fa fa-close"
                            onClick={() => handleRemoveFromCart(item.id)}
                          ><FontAwesomeIcon icon={faTimes}/></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-4">
            <li>
                    Subtotal <span>${totalPrice.toFixed(2)}</span>
                  </li></div>
          </div>
       )}
       </div>
         
      </div>
    </>
  );
}

export default Cart;
