import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isFeatured: true,
    isMenu: true,
    status: 'active',
    price: 0,
    discount: 0,
    order: 0,
    stock: 0,
    categoryName: '',
    brandName: '',
    seller: 'manish',
    images: '',
  });

  // Fetch categories and brands
  useEffect(() => {
    axios.get('/api/categories').then((res) => setCategories(res.data));
    axios.get('/api/brands').then((res) => setBrands(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/products', formData);
    alert('Product created!');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
      />
      <select name="categoryName" onChange={handleChange}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <select name="brandName" onChange={handleChange}>
        <option value="">Select Brand</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.name}>
            {brand.name}
          </option>
        ))}
      </select>
      {/* Other form fields */}
      <button type="submit">Create Product</button>
    </form>
  );
};
export default ProductForm;