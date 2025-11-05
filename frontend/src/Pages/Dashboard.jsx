import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const addProduct = () => {
    navigate("/admin/add-product");
  };
  React.useEffect(() => {
    let data = axios.get("http://localhost:3000/api/products/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    console.log(data);
    data.then((res) => setProducts(res.data));
    data.catch((err) => console.error(err));
  }, []);

  if (!localStorage.getItem("adminToken")) {
    navigate("/admin");
  }

  return (
    <>
      <h1>Products</h1>

      <button className="btn btn-sm btn-success" onClick={addProduct}>
        Add
      </button>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Image</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        {products.map((product, index) => (
          <tbody key={product._id}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{product.title}</td>
              <td>
                <img src={product.mainImage} alt={product.name} width="50" />
              </td>
              <td>
                <button className="btn btn-sm btn-primary me-2">Edit</button>
                <button className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </>
  );
};

export default Dashboard;
