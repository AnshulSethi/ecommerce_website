import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./productDetail.css";
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${productData.title}"?`)) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`);
        alert('Product deleted successfully!');
        navigate('/admin/'); // Redirect to admin dashboard
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleEdit = () => {
    // You can implement edit functionality here
    alert('Edit functionality coming soon!');
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="product-container">
          <div className="loading">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!productData._id) {
    return (
      <div>
        <Navbar />
        <div className="product-container">
          <div className="error">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
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
            
            <div className="admin-actions">
              <button onClick={handleEdit} className="edit-btn">
                <i className="ri-edit-line"></i>
                Edit Product
              </button>
              <button onClick={handleDelete} className="delete-btn">
                <i className="ri-delete-bin-line"></i>
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
