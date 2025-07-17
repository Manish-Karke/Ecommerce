"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const BrandDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/brand/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch brand");
        const data = await response.json();
        setBrand(data.data); // ✅ fix here
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBrand();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex justify-center items-center h-screen">
        Brand not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 max-w-2xl mx-auto">
        <img
          src={brand.logo?.url || "/placeholder-image.jpg"}
          alt={brand.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {brand.name}
          </h1>
          <div className="text-gray-600 dark:text-gray-300 mb-4">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            {brand.data ? (
              Array.isArray(brand.data) ? (
                <ul className="list-disc pl-5 space-y-2">
                  {brand?.data.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : typeof brand.data === "string" ? (
                <ul className="list-disc pl-5 space-y-2">
                  <li>{brand.data}</li>
                </ul>
              ) : (
                <p>No additional details available.</p>
              )
            ) : (
              <p>No additional details available.</p>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Status:{" "}
            <span
              className={
                brand.status === "active" ? "text-green-600" : "text-red-600"
              }
            >
              {brand.status}
            </span>
          </p>
          <p className="text-sm text-gray-500 mb-2">Slug: {brand.slug}</p>
          <p className="text-sm text-gray-500 mb-2">
            Featured: {brand.isfeatured ? "Yes" : "No"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Created By: {brand.createdBy}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Updated By: {brand.updatedBy}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Created At: {new Date(brand.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Updated At: {new Date(brand.updatedAt).toLocaleString()}
          </p>
          <button
            onClick={() => router.push("/Admin/Brand")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Brands
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandDetailPage;
