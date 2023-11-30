import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/productActions';
import { ToastContainer, toast } from 'react-toastify';


function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;

  // Assuming you have a Redux store with the product state
  const products = useSelector((state) => state.products);
  const product = products.find((p) => p.id === id);
  const dispatch = useDispatch(); // Get the dispatch function

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate an API call to load products
    // You should replace this with your actual data fetching logic
    const fetchData = async () => {
      try {
        // Simulating a delay of 2 seconds (you can adjust this)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
   // Check if the page was loaded directly
   const loadedDirectly = typeof window !== 'undefined' && !router.asPath.includes('/shop/');

   useEffect(() => {
     // Redirect if the page was loaded directly
     if (loadedDirectly) {
       router.push('/');
     }
   }, [loadedDirectly, router]);
 
   if (loading) {
    return <div style={{minHeight:'80vh'}}><p className='text-center' style={{paddingTop:'90px'}}>Loading...</p></div>; // You can customize the loader as needed
  }
  const handleAddToCart = () => {
    dispatch(addToCart(id));
    console.log('Product added to cart:', product);
    notify()
  };
  const notify = () => toast.success("Added To Cart");
  if (!product) {
    return (
      <>
       <div  style={{minHeight:'80vh'}}>
       <h1 className='text-center' style={{paddingTop:'90px'}}>Product Not Found</h1>
        <p className='text-center'>The product you are looking for does not exist.</p>
       </div>
        {/* You can customize the 404 page further */}
      </>
    );
  }
  return (
    <>
    <div className="ProductDetails">
    <ToastContainer />

      <div className="ProductDtop">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 ">
          {product.productImages.map((image, index) => (
              <button
                key={index}
                className={'btn2'}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className={'img-fluid'}
                />
              </button>
            ))}
          </div>
          <div className="col-lg-8">
          <img
              src={product.productImages[selectedImageIndex]}
              alt={`Product Image ${selectedImageIndex + 1}`}
              className="img-fluid"
              height={'350px'}
              width={'350px'}
            />
          </div>
        </div>
      </div>
      </div>
      <div className="container mt-5">
        <h2 className='text-center'>{product.productName}</h2>
        <h4 className='text-center'>{product.productPrice}$</h4>
        <p className='text-center mt-4'>{product.productDescription}</p>
        <div className="btnf">
        <button className='btn3 btn' onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default ProductDetails