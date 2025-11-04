import React from 'react'
import axios from 'axios'

const AddProduct = () => {
    const addproduct = (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        const pdata = {
            title: formdata.get('pname'),
            description: formdata.get('pdesc'),
            mainImage: formdata.get('pimage'),
            priceStart: formdata.get('pprice'),
            thumbnails: formdata.get("pthumbnail"),
        };

        console.log(pdata);
        try {
            let data = axios.post('http://localhost:3000/api/products/add', pdata, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            });
            data.then(res => {
                alert('Product Added Successfully');
            })
            data.catch(err => console.error(err));
        } catch (error) {
            console.error('Error adding product:', error);


        }
    }

    return (
        <>
            <form onSubmit={addproduct}>
                <div className="form-group">
                    <label for="exampleInputEmail1">Product Name</label>
                    <input type="text" name='pname' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">Product Description</label>
                    <input type="text" name='pdesc' className="form-control" id="exampleInputPassword1" />
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">Image Link</label>
                    <input type="text" name='pimage' className="form-control" id="exampleInputPassword1" />
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">Thumbnails</label>
                    <input type="text" name='pthumbnail' className="form-control" id="exampleInputPassword1" />
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">Price</label>
                    <input type="text" name='pprice' className="form-control" id="exampleInputPassword1" />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}

export default AddProduct
