import React, { useEffect, useState } from 'react';
import { db, auth, storage } from '@/backend/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';

const Dashboard = () => {
    
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [isOnSale, setIsOnSale] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [orders, setOrders] = useState([]);

  const [couponId, setCouponId] = useState('');
  const [discountPercentage, setdiscountPercentage] = useState('');

  const fetchDataForProducts = async () => {
    const q = collection(db, 'products');
    const querySnap = await getDocs(q);

    const data = [];
    querySnap.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    setProducts(data);
  };

  useEffect(() => {
    fetchDataForProducts();
  }, []);
 
  const fetchRemainingOrders = async () => {
    try {
      const q = collection(db, 'remainingOrders'); // Replace 'remainingOrders' with the actual collection name
      const querySnap = await getDocs(q);

      const orderData = [];
      querySnap.forEach((doc) => {
        orderData.push({ id: doc.id, ...doc.data() });
      });

      setOrders(orderData);
    } catch (error) {
      console.error('Error fetching remaining orders', error);
    }
  }; useEffect(() => {
    fetchDataForProducts();
    fetchRemainingOrders();
  }, []);

  const handleAddCoupon = async () => {
    if (couponId && discountPercentage) {
      try {
        const couponRef = doc(db, 'coupons', couponId);
        const couponDoc = await getDoc(couponRef);

        if (!couponDoc.exists()) {
          // Coupon does not exist, add it
          await setDoc(couponRef, { discountPercentage: Number(discountPercentage) });
          console.log('Coupon added successfully');
        } else {
          console.error('Coupon with the same ID already exists');
        }
      } catch (error) {
        console.error('Error adding coupon:', error);
      }
    } else {
      console.error('Please enter both coupon ID and discounted percentage');
    }
  };
  const [productImages, setProductImages] = useState([]);

  // ... (existing code)

  const handleAddProduct = async () => {
    const user = auth.currentUser;

    if (
      user &&
      productName &&
      productImages.length > 0 && // Ensure at least one image is selected
      productDescription &&
      productPrice &&
      productCategory
    ) {
      try {
        const imageDownloadURLs = await Promise.all(
          Array.from(productImages).map(async (image) => {
            const fileName = `${user.uid}_${image.name}`;
            const storageRef = ref(storage, `product_images/${fileName}`);
            await uploadBytes(storageRef, image);
            return getDownloadURL(storageRef);
          })
        );

        if (selectedProductId) {
          // Update existing product
          const productRef = doc(db, 'products', selectedProductId);
          await updateDoc(productRef, {
            productName,
            productImages: imageDownloadURLs,
            productDescription,
            productPrice,
            productCategory,
            isOnSale,
          });
        } else {
          // Add a new product to Firestore
          await addDoc(collection(db, 'products'), {
            productName,
            productImages: imageDownloadURLs,
            productDescription,
            productPrice,
            productCategory,
            isOnSale,
          });
        }

        console.log('Product added/updated successfully');
        // ... (reset state variables and fetch data as before)
      } catch (error) {
        console.error('Error adding/updating product', error);
      }
    }
  };

  const handleEditProduct = (productId) => {
    const selectedProduct = products.find((product) => product.id === productId);
    setProductName(selectedProduct.productName);
    setProductDescription(selectedProduct.productDescription);
    setProductPrice(selectedProduct.productPrice);
    setProductCategory(selectedProduct.productCategory);
    setIsOnSale(selectedProduct.isOnSale);
    setSelectedProductId(productId);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);

      console.log('Product deleted successfully');
      fetchDataForProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };
  const handleUpdateProduct = async () => {
    const user = auth.currentUser;

    if (
      user &&
      selectedProductId && // Ensure a product is selected for update
      productName &&
      productImages.length > 0 && // Ensure at least one image is selected
      productDescription &&
      productPrice &&
      productCategory
    ) {
      try {
        const imageDownloadURLs = await Promise.all(
          Array.from(productImages).map(async (image) => {
            const fileName = `${user.uid}_${image.name}`;
            const storageRef = ref(storage, `product_images/${fileName}`);
            await uploadBytes(storageRef, image);
            return getDownloadURL(storageRef);
          })
        );

        // Update existing product
        const productRef = doc(db, 'products', selectedProductId);
        await updateDoc(productRef, {
          productName,
          productImages: imageDownloadURLs,
          productDescription,
          productPrice,
          productCategory,
          isOnSale,
        });

        console.log('Product updated successfully');
        // ... (reset state variables and fetch data as before)
      } catch (error) {
        console.error('Error updating product', error);
      }
    }
  };
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Dashboard</h1>

      {/* Form for adding/updating a product */}
      <div>
        <label htmlFor="productName">Product Name:</label>
        <input type="text" id="productName" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} />

        <label htmlFor="productImages" className="mt-2">
          Product Images:
        </label>
        <input
          type="file"
          id="productImages"
          className="form-control"
          accept="image/*"
          multiple
          onChange={(e) => setProductImages(e.target.files)}
        />

        <label htmlFor="productDescription" className="mt-2">Product Description:</label>
        <textarea id="productDescription" className="form-control" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />

        <label htmlFor="productPrice" className="mt-2">Product Price:</label>
        <input type="number" id="productPrice" className="form-control" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />

        <label htmlFor="productCategory" className="mt-2">Product Category:</label>
        <input type="text" id="productCategory" className="form-control" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} />

        <label htmlFor="isOnSale" className="mt-2">Is on Sale:</label>
        <input type="checkbox" id="isOnSale" className="form-check-input" checked={isOnSale} onChange={() => setIsOnSale(!isOnSale)} />

        <button onClick={handleAddProduct} className="btn btn-primary mt-3">Add Product</button>
        
        {/* Add an additional button for updating existing products */}
        {selectedProductId && (
          <button onClick={handleUpdateProduct} className="btn btn-success mt-3 ms-2">Update Existing Product</button>
        )}
      </div>

      {/* Display the list of products */}
      <div className="mt-4">
        <h2>Product List</h2>
        <ul className="list-group">
          {products.map((product) => (
            <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {/* Render multiple images */}
                {product.productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '5px' }}
                  />
                ))}
                <p>{product.productName}</p>
                <p>{product.productDescription}</p>
                <p>{product.productPrice}</p>
                <p>{product.productCategory}</p>
                <p>On Sale: {product.isOnSale ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <button onClick={() => handleEditProduct(product.id)} className="btn btn-warning me-2">Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)} className="btn btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h2>Remaining Orders</h2>
        {orders.length === 0 ? (
          <p>No remaining orders</p>
        ) : (
          <ul className="list-group">
            {orders.map((order) => (
              <li key={order.id} className="list-group-item">
                <div>
                  <p>Product Name: {order.productName}</p>
                  <p>Product Price: {order.productPrice}</p>
                  <p>User Address: {order.userAddress}</p>
                  {/* Add other order details as needed */}
                </div>
              </li>
            ))}
          </ul>
        )}
          {/* Form for adding a coupon */}
      <div className="mt-4">
        <h2>Add Coupon</h2>
        <label htmlFor="couponId">Coupon ID:</label>
        <input type="text" id="couponId" className="form-control" value={couponId} onChange={(e) => setCouponId(e.target.value)} />

        <label htmlFor="discountPercentage" className="mt-2">Discounted Percentage:</label>
        <input type="number" id="discountPercentage" className="form-control" value={discountPercentage} onChange={(e) => setdiscountPercentage(e.target.value)} />

        <button onClick={handleAddCoupon} className="btn btn-primary mt-3">Add Coupon</button>
      </div>

      </div>
    </div>
  );
};

export default Dashboard;
