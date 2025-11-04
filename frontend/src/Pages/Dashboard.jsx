import axios from 'axios';
import React from 'react'

const Dashboard = () => {

    const [products, setProducts] = React.useState([]);
    React.useEffect(() => {
        let data = axios.get('http://localhost:3000/api/products/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
        })
        console.log(data);
        data.then(res => setProducts(res.data))
        data.catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Product List</h2>
            <ul>
                {products.map(product => (
                    <li key={product._id}>{product.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard