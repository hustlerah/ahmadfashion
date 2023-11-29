import React, { useState, useEffect } from 'react';
import { db } from '@/backend/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ImageGallery = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsQuery = collection(db, 'products');
        const productsSnapshot = await getDocs(productsQuery);

        const productsData = [];
        productsSnapshot.forEach((doc) => {
          const product = { id: doc.id, ...doc.data() };
          productsData.push(product);
        });

        setProducts(productsData);

        // Extract unique categories from products
        const uniqueCategories = Array.from(
          new Set(productsData.map((product) => product.category))
        );

        // Create category objects
        const categoryData = uniqueCategories.map((category) => ({
          id: category,
          name: category,
        }));

        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const filteredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  return (
    <div className="wrapper">
      <nav>
        <div className="items">
          {categories.map((category) => (
            <span
              key={category.id}
              className={category.id === activeCategory ? 'active' : ''}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </span>
          ))}
        </div>
      </nav>

      <div className="gallery">
        {filteredProducts.map((product) => (
          <div key={product.id} className={`image img-fluid`}>
            <span>
              <Carousel>
                {product.productImages.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Product ${index + 1}`} />
                  </div>
                ))}
              </Carousel>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
