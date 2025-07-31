import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get("https://ecommerce-website-backend-ux1z.onrender.com/");
      console.log(res.data.products);
      setProductData(res.data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productTitle) => {
    if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      try {
        await axios.delete(`https://ecommerce-website-backend-ux1z.onrender.com/products/${productId}`);
        alert('Product deleted successfully!');
        getData(); // Refresh the product list
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleView = (productId) => {
    navigate(`/admin/products/detail/${productId}`);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        {productData.length === 0 ? (
          <div className="no-products">
            <h2>No products found</h2>
            <p>Add some products to get started!</p>
            <Link to="/admin/products/add" className="add-product-btn">
              Add First Product
            </Link>
          </div>
        ) : (
          productData.map((elem, index) => {
            return (
              <div className="card" key={elem._id}>
                <div className="top">
                  <img src={elem.image} alt={elem.title} />
                </div>
                <div className="bottom">
                  <Link to={`/admin/products/detail/${elem._id}`}>
                    {elem.title}
                  </Link>
                  <p>{elem.description}</p>
                  <h2>Price : ₹{elem.price}</h2>
                  <div className="card-actions">
                    <button 
                      onClick={() => handleView(elem._id)}
                      className="view-btn"
                    >
                      <i className="ri-eye-line"></i>
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(elem._id, elem.title)}
                      className="delete-btn"
                    >
                      <i className="ri-delete-bin-line"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
