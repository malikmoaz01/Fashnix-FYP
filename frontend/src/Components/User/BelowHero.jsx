import React from 'react';
import { useNavigate } from 'react-router-dom';
import menTshirtImg from '../../assets/Tshirt.jpeg';
import womenDressImg from '../../assets/Tshirt.jpeg';
import kidsWearImg from '../../assets/Tshirt.jpeg';
import menShoesImg from '../../assets/Tshirt.jpeg';
import womenShoesImg from '../../assets/Tshirt.jpeg';
import accessoriesImg from '../../assets/Tshirt.jpeg';

const BelowHero = () => {
  const navigate = useNavigate();

  const categories = [
    { image: menTshirtImg, label: "Men's T-Shirts", path: '/menswear/tshirts' },
    { image: womenDressImg, label: "Women's Dresses", path: '/womenswear/dresses' },
    { image: kidsWearImg, label: "Kids Wear", path: '/kidswear/dresses' },
    { image: menShoesImg, label: "Men's Shoes", path: '/menswear/shoes' },
    { image: womenShoesImg, label: "Women's Shoes", path: '/womenswear/shoes' },
    { image: accessoriesImg, label: "Accessories", path: '/accessories' },
  ];

  return (
    
    <section className="mx-auto grid max-w-[1200px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mt-5">
        
      {categories.map((category, index) => (
        <div
          key={index}
          className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
          onClick={() => navigate(category.path)}
          style={{ aspectRatio: '3 / 2' }} // Rectangle shape
        >
          {/* Background Image */}
          <img
            className="h-full w-full object-cover brightness-50 transition-all duration-500 group-hover:brightness-100 group-hover:scale-105"
            src={category.image}
            alt={`${category.label} category`}
          />

          {/* Category Label */}
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-white text-lg font-semibold uppercase tracking-wide bg-black bg-opacity-70 px-3 py-1 rounded transition-opacity duration-300 group-hover:bg-opacity-100">
            {category.label}
          </p>
        </div>
      ))}
    </section>
  );
};

export default BelowHero;
