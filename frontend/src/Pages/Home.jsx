import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(productData);
    } else {
      const filtered = productData.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, productData]);

  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/`);
      console.log("Products fetched:", res.data.products);
      setProductData(res.data.products || []);
      setFilteredProducts(res.data.products || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productTitle) => {
    if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`);
        alert('Product deleted successfully!');
        getData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleView = (productId) => {
    navigate(`/admin/products/detail/${productId}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div>
        <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
        <div className="container">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
      <div className="container">
        {searchQuery && (
          <div className="search-results-info">
            Found {filteredProducts.length} product(s) for "{searchQuery}"
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h2>
              {searchQuery ? `No products found for "${searchQuery}"` : "No products found"}
            </h2>
            <p>Add some products to get started!</p>
            <Link to="/admin/products/add" className="add-product-btn">
              Add First Product
            </Link>
          </div>
        ) : (
          filteredProducts.map((elem, index) => {
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
                  <div className="admin-hint">
                    <i className="ri-settings-line"></i>
                    Admin: Manage product details
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
