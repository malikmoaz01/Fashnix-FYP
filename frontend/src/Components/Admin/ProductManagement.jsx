import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    rating: '',
    reviews: '',
    stock: '',
    images: [],
  });

  const cards = [
    { name: "Add New Product", value: "Add a new product to your catalog" },
    { name: "Manage Products", value: "View and manage existing products" },
    { name: "Edit, Delete, View Products", value: "Edit, delete, or view product details" },
  ];

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-red-500 text-white">{part}</span>
      ) : part
    );
  };

  // Add New Product Handler
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to add product.');
      } else {
        alert('Product added successfully!');
        setShowAddForm(false);
        navigate('/products');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Something went wrong!');
    }
  };

  const handleImageChange = (e, index) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = e.target.value;
    setNewProduct({ ...newProduct, images: updatedImages });
  };

  const addImageField = () => {
    setNewProduct({ ...newProduct, images: [...newProduct.images, ''] });
  };

  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Product Management</h2>

        <div className="mb-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 p-3 bg-[#374151] text-white rounded-md"
          />
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-[#374151] rounded-lg shadow-md p-6 cursor-pointer"
              onClick={() => card.name === "Add New Product" && setShowAddForm(true)}
            >
              <h3 className="text-lg font-semibold text-[#9CA3AF]">
                {highlightText(card.name)}
              </h3>
              <p className="text-2xl font-bold text-[#F9FAFB] mt-2">
                {highlightText(card.value)}
              </p>
            </div>
          ))}
        </div>

        {/* No Found Message */}
        {searchTerm && !cards.some(card =>
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.value.toLowerCase().includes(searchTerm.toLowerCase())
        ) && (
          <p className="text-center text-[#F9FAFB] mt-4">No Found</p>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-[#374151] mt-8 p-6 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-3 rounded-md text-black"
                required
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-3 rounded-md text-black"
                required
              />
                <input
                type="text"
                placeholder="Product Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full p-3 rounded-md text-black"
                required
              />
              <input
                type="number"
                placeholder="Price (Rs)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full p-3 rounded-md text-black"
                required
              />
              <input
                type="number"
                placeholder="Discount Price (Rs)"
                value={newProduct.discountPrice}
                onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                className="w-full p-3 rounded-md text-black"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating (e.g., 4.6)"
                value={newProduct.rating}
                onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                className="w-full p-3 rounded-md text-black"
              />
              <input
                type="number"
                placeholder="Reviews Count"
                value={newProduct.reviews}
                onChange={(e) => setNewProduct({ ...newProduct, reviews: e.target.value })}
                className="w-full p-3 rounded-md text-black"
              />
                <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full p-3 rounded-md text-black"
              />

              {/* Images Section */}
              <div>
                <h4 className="mb-2">Product Images (Add at least 3)</h4>
                {newProduct.images.map((image, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Image URL ${index + 1}`}
                    value={image}
                    onChange={(e) => handleImageChange(e, index)}
                    className="w-full p-3 rounded-md text-black mb-2"
                    required
                  />
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
                >
                  + Add Image
                </button>
              </div>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md"
              >
                Add Product
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md ml-4"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
