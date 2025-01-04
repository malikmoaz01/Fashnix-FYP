import { useState } from 'react';

const CategoriesDropdown = () => {
    const [activeCategory, setActiveCategory] = useState(null);

    const categories = {
        Menswear: ['Shirts', 'T-Shirts', 'Jeans', 'Jackets'],
        Womenswear: ['Dresses', 'Tops', 'Skirts', 'Sarees'],
        Kidswear: ['T-Shirts', 'Shorts', 'Dresses', 'Nightwear'],
        Accessories: ['Bags', 'Shoes', 'Watches', 'Jewelry'],
    };

    return (
        <section className="absolute left-0 right-0 z-10 w-full border-b border-r border-l bg-white">
            <div className="mx-auto flex max-w-[1200px] py-10">
                {/* Categories List */}
                <div className="w-[300px] border-r">
                    <ul className="px-5">
                        {Object.keys(categories).map((category) => (
                            <li
                                key={category}
                                onMouseEnter={() => setActiveCategory(category)}
                                onClick={() => setActiveCategory(category)}
                                className="cursor-pointer flex items-center gap-2 py-2 px-3 hover:bg-neutral-100"
                            >
                                {category}
                                <span className="ml-auto">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sub-categories Display */}
                <div className="flex w-full justify-between">
                    {activeCategory && (
                        <div className="flex gap-6">
                            <div className="mx-5">
                                <p className="font-medium text-blue-900">{activeCategory.toUpperCase()}</p>
                                <ul className="text-sm leading-8">
                                    {categories[activeCategory].map((subcategory) => (
                                        <li key={subcategory}>
                                            <a href={`#${subcategory.toLowerCase()}`}>{subcategory}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CategoriesDropdown;
