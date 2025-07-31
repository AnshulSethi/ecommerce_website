import axios from "axios";
import React, { useEffect, useState } from "react";
// import "../Home.css";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import UserNav from "./UserNav";
const UserHome = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get("https://ecommerce-website-backend-ux1z.onrender.com/")
      .then((res) => {
        console.log(res.data.products);
        setProductData(res.data.products);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
   <div>
        <UserNav/>
     <div className="container">

      {productData.map((elem, index) => {
        return <div className="card" key={index}>
          <div className="top">
            <img
              src={elem.image}
              alt=""
            />
          </div>
          <div className="bottom">
            <Link to={`/products/detail/${elem._id}`}>{elem.title}</Link>
            <p>
              {elem.description}
            </p>
            <h2>Price : {elem.price}</h2>
          </div>
        </div>;
      })}
    </div>
   </div>
  );
};

export default UserHome;
