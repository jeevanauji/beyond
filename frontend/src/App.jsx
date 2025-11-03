import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./App.css";
import Products from "./Compnents/Products";
import Login from "./Compnents/Login";
function App() {
  const login = false;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:3000/");
      // console.log(result);
      setData(result.data);
    };
    fetchData();
  }, []);

  if (!login) {
    return <Login />
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>

      <Products />
    </>
  );
}

export default App;
