import React, { useState } from 'react';
import blackBurqa from '../../../../src/assets/DropDown/Top.png'
import BlackSuit from '../../../../src/assets/DropDown/Top.png';
import CasualBlackShirt from '../../../../src/assets/DropDown/Top.png';
import GreenTshirt from '../../../../src/assets/DropDown/Top.png';

const Burqa = () => {
  const allBurqa = Array(21).fill(null).map((_, index) => ({
    id: index + 1,
    image: index % 4 === 0 ? blackBurqa : index % 4 === 1 ? BlackSuit : index % 4 === 2 ? CasualBlackShirt : GreenTshirt,
    name: `Burqa ${index + 1}`,
    price: Math.floor(Math.random() * 10000) + 3000,
    originalPrice: Math.floor(Math.random() * 10000) + 8000,
    discount: `${Math.floor(Math.random() * 50) + 10}% OFF`,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    reviews: Math.floor(Math.random() * 50) + 20,
    material: ['Leather', 'Wool', 'Denim', 'Polyester'][index % 4],
    availableSizes: ['S', 'M', 'L', 'XL'],
    stock: Math.floor(Math.random() * 11) + 1,
    color: ['Black', 'Gray', 'Blue', 'Green'][index % 4],
  }));

  const [Burqa, setBurqa] = useState(allBurqa);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setLoading(false);
    }, 1500);
  };

  const handleSort = (e) => {
    const value = e.target.value;
    const sortedBurqa = [...Burqa];
    if (value === 'high-to-low') {
      sortedBurqa.sort((a, b) => b.price - a.price);
    } else if (value === 'low-to-high') {
      sortedBurqa.sort((a, b) => a.price - b.price);
    } else if (value === 'a-to-z') {
      sortedBurqa.sort((a, b) => a.name.localeCompare(b.name));
    } else if (value === 'z-to-a') {
      sortedBurqa.sort((a, b) => b.name.localeCompare(a.name));
    }
    setBurqa(sortedBurqa);
  };

  return (
    <div className="mx-auto max-w-[1200px] py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Menswear - Burqa</h1>
        <select
          onChange={handleSort}
          className="border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-red-500"
        >
          <option value="">Sort By</option>
          <option value="high-to-low">Price: High to Low</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="a-to-z">Name: A to Z</option>
          <option value="z-to-a">Name: Z to A</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Burqa.slice(0, visibleCount).map((Burqa) => (
          <div key={Burqa.id} className="border p-4 rounded-md shadow hover:shadow-lg transition">
            <img src={Burqa.image} alt={Burqa.name} className="w-full h-56 object-cover rounded-md mb-4" />
            <h2 className="text-lg font-bold">{Burqa.name}</h2>
            <p className="text-gray-700 mb-2">{Burqa.material}</p>
            <p className="text-red-500 font-bold">
              {`Price: ${Burqa.price} PKR `}
              <span className="line-through text-gray-400">{Burqa.originalPrice} PKR</span>
            </p>
            <p className="text-green-600 text-sm">{Burqa.discount}</p>
            <button className="mt-4 border border-blue-900 text-black px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      {visibleCount < Burqa.length && (
        <div className="text-center mt-6">
          {loading ? (
            <p className="text-gray-500">Loading More...</p>
          ) : (
            <button
              onClick={handleLoadMore}
              className="border border-black text-black px-6 py-2 rounded hover:bg-red-500 hover:text-white transition"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Burqa;
