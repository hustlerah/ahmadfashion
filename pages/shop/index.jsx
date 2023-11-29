import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { setProducts, addToCart } from '../../redux/productActions';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../backend/firebase';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

function Shop() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));

      const productData = [];
      querySnapshot.forEach((doc) => {
        productData.push({ id: doc.id, ...doc.data() });
      });

      // Update to show only the first 8 products
      const firstEightProducts = productData.slice(0, 8);

      dispatch(setProducts(firstEightProducts));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId));
    const selectedProduct = products.find((product) => product.id === productId);

    // Log product name and price to the console
    console.log('Product Name:', selectedProduct.productName);
    console.log('Product Price:', selectedProduct.productPrice);
    notify();
  };
  const notify = () => toast.success('Added To Cart');

  return (
    <>
      <div className="Shop">
        <div className="container">
          <h2 className="text-center mt-2">Our Shop</h2>
          <ToastContainer />
          {router.pathname === '/shop' ? (
            loading ? (
              <div className="container" style={{ minHeight: '70vh' }}>
                Loading...
              </div>
            ) : (
              <div className="row mx-auto mt-5  ms-auto">
                {products.map((product) => (
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12" key={product.id}>
                    <div className="mycard mt-4">
                      <div
                        onClick={() => {
                          router.push(`/shop/${product.id}`);
                        }}
                        className="img-fluid product-image"
                        style={{
                          backgroundImage: `url(${product.productImages[0]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                          height: '260px',
                          width: '100%',
                          cursor: 'pointer',
                        }}
                      >
                        {product.isOnSale && <div className="onSale"><p>Sale</p></div>}
                      </div>
                      <h6 className="mt-2">{product.productName}</h6>
                      <div className="d-block">
                        <span>{product.productPrice}$</span>
                      </div>
                      <button className="mbtn mt-2" onClick={() => handleAddToCart(product.id)}>
                        Add to cart <FontAwesomeIcon icon={faPlus} size="sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            loading ? (
              <p>Loading...</p>
            ) : (
              <div className="row mx-auto mt-5  ms-auto">
                {products.map((product) => (
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12" key={product.id}>
                    <div className="mycard mt-4">
                      <div
                        onClick={() => {
                          router.push(`/shop/${product.id}`);
                        }}
                        className="img-fluid product-image"
                        style={{
                          backgroundImage: `url(${product.productImages[0]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                          height: '260px',
                          width: '100%',
                          cursor: 'pointer',
                        }}
                      >
                        {product.isOnSale && <div className="onSale"><p>Sale</p></div>}
                      </div>
                      <h6 className="mt-2">{product.productName}</h6>
                      <div className="d-block">
                        <span>{product.productPrice}$</span>
                      </div>
                      <button className="mbtn mt-2" onClick={() => handleAddToCart(product.id)}>
                        Add to cart <FontAwesomeIcon icon={faPlus} size="sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Shop;