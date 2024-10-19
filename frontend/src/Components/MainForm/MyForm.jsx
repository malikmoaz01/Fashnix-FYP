import React, { useState } from 'react';

const MyForm = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: '',
    price: '',
    stock: '',
    description: ''
  });
  const [editProductId, setEditProductId] = useState(null);
  const [currentView, setCurrentView] = useState('menu');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Make handleSubmit async
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editProductId !== null) {
      const updatedProducts = products.map((product, index) =>
        index === editProductId ? formData : product
      );
      setProducts(updatedProducts);
      setEditProductId(null);
    } else {
      // Adding a new product
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newProduct = await response.json();
          setProducts([...products, newProduct]); // Update local state with the new product
        } else {
          console.error('Failed to add product:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }

    // Reset form data
    setFormData({
      productName: '',
      productCategory: '',
      price: '',
      stock: '',
      description: ''
    });
    setCurrentView('menu');
  };

  const handleEdit = (index) => {
    setFormData(products[index]);
    setEditProductId(index);
    setCurrentView('add');
  };

  const handleDelete = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  if (currentView === 'menu') {
    return (
      <div className='bg-black min-h-screen'>
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="bg-gray-800 p-4 rounded-lg text-white cursor-pointer" onClick={() => setCurrentView('add')}>
            <h3 className="font-bold text-center">Add Product</h3>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-white cursor-pointer" onClick={() => setCurrentView('update')}>
            <h3 className="font-bold text-center">Update Product</h3>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-white cursor-pointer" onClick={() => setCurrentView('delete')}>
            <h3 className="font-bold text-center">Delete Product</h3>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'add') {
    return (
      <div className='myForm bg-black text-white md:h-full p-4 rounded-xl'>
        <form onSubmit={handleSubmit}>
          <label htmlFor="productName" className='text-sm font-light'>Product Name</label> <br />
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder='Enter product name'
            className='w-full mt-2.5 bg-transparent rounded-lg border border-[#322F66] py-1.5 px-2 text-white'
          /><br />

          <label htmlFor="productCategory" className='text-sm mt-2.5 font-light'>Category</label> <br />
          <select
            id="productCategory"
            name="productCategory"
            value={formData.productCategory}
            onChange={handleChange}
            className='w-full mt-2.5 bg-transparent rounded-xl border border-[#322F66] py-1.5 px-2 text-gray-400'
          >
            <option className='bg-black'>Select Category</option>
            <option className='bg-black' value="electronics">Electronics</option>
            <option className='bg-black' value="clothing">Clothing</option>
            <option className='bg-black' value="accessories">Accessories</option>
          </select><br />

          <label htmlFor="price" className='text-sm mt-2.5 font-light'>Price</label> <br />
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder='Enter product price'
            className='w-full mt-2.5 bg-transparent rounded-xl border border-[#322F66] py-1.5 px-2 text-white'
          /><br />

          <label htmlFor="stock" className='text-sm mt-2.5 font-light'>Stock Quantity</label> <br />
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder='Enter stock quantity'
            className='w-full mt-2.5 bg-transparent rounded-xl border border-[#322F66] py-1.5 px-2 text-white'
          /><br />

          <label htmlFor="description" className='text-sm mt-2.5 font-light'>Description</label> <br />
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder='Enter product description'
            className='w-full mt-2.5 bg-transparent rounded-xl border border-[#322F66] py-1.5 px-2 text-white'
          /><br />

          <button
            type="submit"
            className='bg-orange-500 text-black w-full py-2.5 rounded-lg mt-6'
          >
            {editProductId !== null ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        <button
          onClick={() => setCurrentView('menu')}
          className="bg-gray-600 text-white mt-4 p-2 rounded-lg"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  if (currentView === 'update') {
    return (
      <div className='bg-black min-h-screen p-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {products.map((product, index) => (
            <div key={index} className='bg-gray-800 p-4 rounded-lg text-white'>
              <h3 className='font-bold'>{product.productName}</h3>
              <p>Category: {product.productCategory}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Description: {product.description}</p>
              <button
                onClick={() => handleEdit(index)}
                className='bg-blue-500 px-3 py-1 rounded-lg text-white mt-2'
              >
                Edit Product
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentView('menu')}
          className="bg-gray-600 text-white mt-4 p-2 rounded-lg"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  if (currentView === 'delete') {
    return (
      <div className='bg-black min-h-screen p-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {products.map((product, index) => (
            <div key={index} className='bg-gray-800 p-4 rounded-lg text-white'>
              <h3 className='font-bold'>{product.productName}</h3>
              <p>Category: {product.productCategory}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Description: {product.description}</p>
              <button
                onClick={() => handleDelete(index)}
                className='bg-red-500 px-3 py-1 rounded-lg text-white mt-2'
              >
                Delete Product
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentView('menu')}
          className="bg-gray-600 text-white mt-4 p-2 rounded-lg"
        >
          Back to Menu
        </button>
      </div>
    );
  }
};

export default MyForm;
