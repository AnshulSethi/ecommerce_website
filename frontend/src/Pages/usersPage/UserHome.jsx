import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserNav from "./UserNav";

const UserHome = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState({});

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
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`);
      console.log("Products fetched:", res.data.products);
      setProductData(res.data.products || []);
      setFilteredProducts(res.data.products || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const addToCart = async (productId, productTitle) => {
    try {
      setAddingToCart(prev => ({ ...prev, [productId]: true }));

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cart/add/${productId}`, {
        quantity: 1
      });
      
      alert(`${productTitle} added to cart successfully!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div>
        <UserNav onSearch={handleSearch} searchQuery={searchQuery} />
        <div className="container">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserNav onSearch={handleSearch} searchQuery={searchQuery} />
      <div className="container">
        {searchQuery && (
          <div className="search-results-info">
            Found {filteredProducts.length} product(s) for "{searchQuery}"
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h2>
              {searchQuery ? `No products found for "${searchQuery}"` : "No products available"}
            </h2>
            <p>Check back later for new products!</p>
          </div>
        ) : (
          filteredProducts.map((elem, index) => {
            return (
              <div className="card" key={elem._id}>
                <div className="top">
                  <img src={elem.image} alt={elem.title} />
                  <div className="card-overlay">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(elem._id, elem.title)}
                      disabled={addingToCart[elem._id]}
                    >
                      {addingToCart[elem._id] ? (
                        <i className="ri-loader-4-line"></i>
                      ) : (
                        <i className="ri-shopping-cart-line"></i>
                      )}
                      {addingToCart[elem._id] ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
                <div className="bottom">
                  <Link to={`/products/detail/${elem._id}`}>{elem.title}</Link>
                  <p>{elem.description}</p>
                  <h2>Price : ₹{elem.price}</h2>
                  <div className="cart-hint">
                    <i className="ri-shopping-cart-line"></i>
                    Click here to add to cart
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

export default UserHome;
