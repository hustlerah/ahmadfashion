// pages/checkout.js
import { useRouter } from 'next/router';

function Checkout() {
  const router = useRouter();
  const { cartItems, subtotal, discountPercentage } = router.query;

  // Convert stringified JSON back to an array
  const parsedCartItems = JSON.parse(cartItems);

  return (
    <section className="payment-form dark">
      <div className="container">
        <div className="block-heading">
          <h2>Payment</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc quam urna, dignissim nec auctor in, mattis vitae leo.</p>
        </div>
        <form>
          <div className="products">
            <h3 className="title">Checkout</h3>
            {parsedCartItems.map((item) => (
              <div key={item.id} className="item">
                <span className="price">${(item.productPrice * item.quantity).toFixed(2)}</span>
                <p className="item-name">{item.productName}</p>
                <p className="item-description">{item.productDescription}</p>
              </div>
            ))}
            <div className="total">Total<span className="price">${((parseFloat(subtotal) * (100 - discountPercentage)) / 100).toFixed(2)}</span></div>
          </div>
          <div className="card-details">
            <h3 className="title">Credit Card Details</h3>
            <div className="row">
              <div className="form-group col-sm-7">
                <label htmlFor="card-holder">Card Holder</label>
                <input id="card-holder" type="text" className="form-control" placeholder="Card Holder" aria-label="Card Holder" aria-describedby="basic-addon1" />
              </div>
              <div className="form-group col-sm-5">
                <label htmlFor="">Expiration Date</label>
                <div className="input-group expiration-date">
                  <input type="text" className="form-control" placeholder="MM" aria-label="MM" aria-describedby="basic-addon1" />
                  <span className="date-separator">/</span>
                  <input type="text" className="form-control" placeholder="YY" aria-label="YY" aria-describedby="basic-addon1" />
                </div>
              </div>
              <div className="form-group col-sm-8">
                <label htmlFor="card-number">Card Number</label>
                <input id="card-number" type="text" className="form-control" placeholder="Card Number" aria-label="Card Holder" aria-describedby="basic-addon1" />
              </div>
              <div className="form-group col-sm-4">
                <label htmlFor="cvc">CVC</label>
                <input id="cvc" type="text" className="form-control" placeholder="CVC" aria-label="Card Holder" aria-describedby="basic-addon1" />
              </div>
              <div className="form-group col-sm-12">
                <button type="button" className="btn btn-dark btn-block w-100">Proceed</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Checkout;
