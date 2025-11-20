"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Example() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + "/category"
        );
        setCategories(response.data.data); // ✅ use data not docs
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch categories. Please try again later.");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return <div className="text-center py-16">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">Collections</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {Array.isArray(categories) &&
              categories.map((category) => (
                <div key={category._id} className="group relative">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-[2/1] lg:aspect-square group-hover:opacity-75">
                    <img
                      alt={category.name}
                      src={
                        category.image?.[0]?.url || // ✅ FIXED
                        "https://qualitycomputer.com.np/web/image/product.template/51331/image_1024?unique=d293e2c"
                      }
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-6 text-sm text-gray-500">
                    <a href={`/category/${category._id}`}>
                      <span className="absolute inset-0" />
                      {category.name}
                    </a>
                  </h3>
                  <p className="text-base font-semibold text-gray-900">
                    {category.description || "No description available"}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
