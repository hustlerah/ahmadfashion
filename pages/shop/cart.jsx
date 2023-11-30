import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, decreaseQuantity, increaseQuantity } from '@/redux/productActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/backend/firebase';

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice(cartItems));

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    const existingCartItem = cartItems.find((item) => item.id === productId);

    if (existingCartItem) {
      if (existingCartItem.quantity === 1) {
        dispatch(removeFromCart(productId));
      } else {
        dispatch(decreaseQuantity(productId));
      }
    }
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = async () => {
    try {
      const couponRef = doc(db, 'coupons', couponCode);
      const couponDoc = await getDoc(couponRef);

      if (couponDoc.exists()) {
        const discount = couponDoc.data().discountPercentage;
        setDiscountPercentage(discount);
        const discountedPrice = totalPrice - (totalPrice * discount) / 100;
        setTotalPrice(discountedPrice);
        setCouponApplied(true);
      } else {
        console.error('Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(cartItems));
  }, [cartItems]);

  function calculateTotalPrice(cart) {
    return cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  }

  const router = useRouter();
  const handleProceedToCheckout = () => {
    // You can pass necessary data to the checkout page using the query object
    router.push({
      pathname: '/shop/checkout',
      query: {
        cartItems: JSON.stringify(cartItems),
        subtotal: totalPrice.toFixed(2),
        discountPercentage: discountPercentage,
      },
    });
  };
  const handleRemoveCoupon = () => {
    setCouponCode('');
    setDiscountPercentage(0);
    setTotalPrice(calculateTotalPrice(cartItems));
    setCouponApplied(false);
  };

  return (
    <>
      <div className="Cart">
        <div className="container">
          {cartItems.length === 0 ? (
            <>
              <div className="d-flex" style={{ minHeight: '75vh' }}>
                <h5 className="text-center">Your cart is empty.</h5>
                <div className="d-flex">
                  <button className="btn1" onClick={() => router.push('/shop')}>
                    Shop Now
                  </button>
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
                              <img src={item.productImages[0]} alt="" className="img-fluid" />
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
                                >
                                  <FontAwesomeIcon icon={faAngleLeft} />
                                </span>
                                <input type="text" value={item.quantity} readOnly disabled />
                                <span
                                  className="fa fa-angle-right inc qtybtn"
                                  onClick={() => handleIncreaseQuantity(item.id)}
                                >
                                  <FontAwesomeIcon icon={faAngleRight} />
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="cart__price">{item.productPrice}$</td>
                          <td className="cart__close">
                            <i
                              style={{ cursor: 'pointer' }}
                              className="fa fa-close"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="coupon">
                <div className="cart__discount">
      <h6>Discount codes</h6>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleApplyCoupon();
        }}
      >
        <input
          type="text"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={couponApplied}
        />
        <button type="submit" >
          {couponApplied ? (
            <>
            <button className='' onClick={handleRemoveCoupon}>  Remove</button>
            </>
          ) : (
            'Apply'
          )}
        </button>
      </form>
    </div>
                  <div className="cart__total">
                    <h6>Cart total</h6>
                    <ul>
                      <li>
                        Subtotal <span>${totalPrice.toFixed(2)}</span>
                      </li>
                      {discountPercentage > 0 && (
                        <li>
Discount ({discountPercentage}%): <span>-${((totalPrice * discountPercentage) / 100).toFixed(2)}</span>
                        </li>
                      )}
                    </ul>
                    <div className="d-flex align-items-center-justify-content-center">
                      <button className="btn primary-btn" onClick={handleProceedToCheckout}>Proceed to checkout</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
