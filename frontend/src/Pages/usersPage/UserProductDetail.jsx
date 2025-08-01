import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNav from './UserNav';
import '../productDetail.css';

const UserProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    getProductDetail();
  }, [productId]);

  const getProductDetail = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`);
      console.log("Product detail:", res.data);
      setProductData(res.data.product);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching product:", err);
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      setAddingToCart(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cart/add/${productId}`, {
        quantity: quantity
      });
      alert('Product added to cart successfully!');
      setAddingToCart(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
      setAddingToCart(false);
    }
  };

  const goToCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <div>
        <UserNav />
        <div className="product-container">
          <div className="loading">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!productData._id) {
    return (
      <div>
        <UserNav />
        <div className="product-container">
          <div className="error">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserNav />
      <div className='product-container'>
        <div className="main">
          <div className="left">
            <img src={productData.image} alt={productData.title} />
          </div>
          <div className="right">
            <h1>{productData.title}</h1>
            <p className="description">{productData.description}</p>
            <div className="price-section">
              <h2 className="price">₹{productData.price}</h2>
            </div>

            <div className="quantity-section">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bottom">
              <button 
                className="add-to-cart-btn"
                onClick={addToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button 
                className="view-cart-btn"
                onClick={goToCart}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProductDetail;
