import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:3000/");
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="container mt-100">
        <div className="row">
          {data?.map((product) => (
            <div className="col-md-4 col-sm-6" key={product._id}>
              <div className="card mb-30">
                <a className="card-img-tiles" href="#" data-abc="true">
                  <div className="inner">
                    <div className="main-img">
                      <img src={product.mainImage} alt={product.title} />
                    </div>
                    <div className="thumblist">
                      {product.thumbnails.map((thumb, i) => (
                        <img key={i} src={thumb} alt={product.title} />  
                      ))}
                    </div>
                  </div>
                </a>
                <div className="card-body text-center">
                  <h4 className="card-title">{product.title}</h4>
                  <p className="text-muted">Price ${product.priceStart}</p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate("/order", { state: { product } })}
                    data-abc="true"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
