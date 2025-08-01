import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProducts.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AddProducts = () => {
    const navigate = useNavigate();
    const [title, settitle] = useState('');
    const [image, setimage] = useState('');
    const [description, setdescription] = useState('');
    const [category, setcategory] = useState('');
    const [price, setprice] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/`);
            console.log("Products fetched:", response.data.products);
            setProducts(response.data.products || []);
            setFilteredProducts(response.data.products || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/products/add`, formData)
            .then((res) => {
                console.log("Product added:", res.data);
                alert('Product added successfully!');
                // Reset form
                settitle('');
                setimage('');
                setdescription('');
                setcategory('');
                setprice('');
                // Refresh products list
                fetchProducts();
            })
            .catch((err) => {
                console.error('Error adding product:', err);
                alert('Failed to add product');
            });
    };

    const handleDelete = async (productId, productTitle) => {
        if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`);
                alert('Product deleted successfully!');
                fetchProducts(); // Refresh the list
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <div>
            <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
            <div className="admin-container">
                <div className="form-section">
                    <h2>Add New Product</h2>
                    <form onSubmit={handleSubmit} className='formContainer'>
                        <div className="formGroup">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                placeholder="Enter product title"
                                value={title}
                                onChange={(e) => settitle(e.target.value)}
                                name="title"
                                id="title"
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="image">Image</label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                onChange={(e) => setimage(e.target.files[0])}
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="description">Description</label>
                            <textarea
                                placeholder="Enter product description"
                                name="description"
                                id="description"
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                placeholder="Enter product category"
                                name="category"
                                id="category"
                                value={category}
                                onChange={(e) => setcategory(e.target.value)}
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                placeholder="Enter product price"
                                name="price"
                                id="price"
                                value={price}
                                onChange={(e) => setprice(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn">Add Product</button>
                    </form>
                </div>

                <div className="products-section">
                    <h2>Existing Products</h2>
                    
                    {searchQuery && (
                        <div className="search-results-info">
                            Found {filteredProducts.length} product(s) for "{searchQuery}"
                        </div>
                    )}

                    {loading ? (
                        <div className="loading">Loading products...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="no-products">
                            <p>
                                {searchQuery 
                                    ? `No products found for "${searchQuery}". Add your first product above!`
                                    : "No products found. Add your first product above!"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="product-card">
                                    <div className="product-image">
                                        <img src={product.image} alt={product.title} />
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.title}</h3>
                                        <p className="product-description">{product.description}</p>
                                        <p className="product-price">₹{product.price}</p>
                                        <div className="product-actions">
                                            <button
                                                onClick={() => handleDelete(product._id, product.title)}
                                                className="delete-product-btn"
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddProducts;