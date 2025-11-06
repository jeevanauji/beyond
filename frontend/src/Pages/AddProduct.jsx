import React from "react";
import axios from "axios";

const AddProduct = () => {
  const addProduct = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const productData = {
      title: formData.get("pname"),
      description: formData.get("pdesc"),
      priceStart: formData.get("pprice"),
    };

    const data = new FormData();

    data.append("title", productData.title);
    data.append("description", productData.description);
    data.append("priceStart", productData.priceStart);

    const mainImage = formData.get("pimage");
    const thumbnails = formData.getAll("pthumbnail");

    if (mainImage) {
      data.append("pimage", mainImage);
    }

    if (thumbnails && thumbnails.length > 0) {
      thumbnails.forEach((thumbnail) => {
        data.append("pthumbnail", thumbnail);
      });
    }

    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    axios
      .post("http://localhost:3000/api/products/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((res) => {
        alert("✅ Product Added Successfully!");
        e.target.reset();
      })
      .catch((err) => {
        console.error("❌ Error adding product:", err);
        alert("Error adding product. Check console for details.");
      });
  };

  return (
    <form onSubmit={addProduct} className="p-5">
      <div className="form-group mb-3">
        <label>Product Name</label>
        <input type="text" name="pname" className="form-control" required />
      </div>

      <div className="form-group mb-3">
        <label>Product Description</label>
        <input type="text" name="pdesc" className="form-control" required />
      </div>

      <div className="form-group mb-3">
        <label>Main Product Image</label>
        <input
          type="file"
          name="pimage"
          className="form-control"
          accept="image/*"
          required
        />
      </div>

      <div className="form-group mb-3">
        <label>Thumbnail Images</label>
        <input
          type="file"
          name="pthumbnail"
          className="form-control"
          accept="image/*"
          multiple
        />
      </div>

      <div className="form-group mb-3">
        <label>Price</label>
        <input type="number" name="pprice" className="form-control" required />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default AddProduct;
