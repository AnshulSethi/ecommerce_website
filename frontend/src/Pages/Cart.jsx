import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import UserNav from './usersPage/UserNav';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('https://ecommerce-website-backend-ux1z.onrender.com/cart');
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or negative
        await axios.delete(`https://ecommerce-website-backend-ux1z.onrender.com/cart/remove/${productId}`);
      } else {
        // Update quantity
        await axios.put(`https://ecommerce-website-backend-ux1z.onrender.com/cart/update/${productId}`, {
          quantity: newQuantity
        });
      }
      fetchCartItems(); // Refresh cart
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`https://ecommerce-website-backend-ux1z.onrender.comcart/remove/${productId}`);
      fetchCartItems(); // Refresh cart
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('https://ecommerce-website-backend-ux1z.onrender.com/cart/clear');
      fetchCartItems(); // Refresh cart
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div>
        <UserNav />
        <div className="cart-container">
          <div className="loading">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserNav />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="ri-shopping-cart-line"></i>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img src={item.productId.image} alt={item.productId.title} />
                  </div>
                  <div className="item-details">
                    <h3>{item.productId.title}</h3>
                    <p className="item-description">{item.productId.description}</p>
                    <p className="item-price">₹{item.productId.price}</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    <p>₹{item.productId.price * item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="remove-btn"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-item">
                <span>Total Items:</span>
                <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart; 