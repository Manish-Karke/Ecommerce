"use client";
import axios from "axios";

import React, { ChangeEvent, useState } from "react";

interface Category {
  _id?: string;
  name: string;
  data?: string;
  status: "active" | "inactive";
  image?: { url: string };
  isFeatured: boolean;
  price?: number;
}

interface CategoryFormProps {
  category?: Category;
  onSubmit: (message: string) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: category?.name || "",
    data: category?.data || "",
    status: category?.status || "inactive",
    isFeatured: category?.isFeatured || false,
    price: category?.price || "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false); // Control form visibility
  const [loading, setLoading] = useState(false); // Initialize loading as false

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const validate = async () => {
    const newErrors: { [key: string]: string } = {};
    if (
      !formData.name ||
      formData.name.length < 2 ||
      formData.name.length > 50
    ) {
      newErrors.name = "Name must be between 2 and 50 characters";
    }
    // Require image only if no existing image is provided (for edit mode)
    if (!image && !category?.image?.url) {
      newErrors.image = "Image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validate();
    if (!isValid) return;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("data", formData.data);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("price", String(formData.price));
    formDataToSend.append("isFeatured", String(formData.isFeatured));
    if (image) {
      formDataToSend.append("image", image);
    }

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/category`;
      const method = "POST";
      const response = await axios({
        method,
        url,
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      onSubmit(response.data.message || "Category submitted successfully!");
      // Reset form after successful submission
      setFormData({
        name: "",
        data: "",
        price: " ",
        status: "inactive",
        isFeatured: false,
      });
      setImage(null);
      setShowForm(false); // Hide form after submission
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-amber-400">
      {!showForm && (
        <button
          className="bg-amber-700 font-bold hover:bg-amber-600 cursor-pointer p-4 m-4 border-l-black rounded-2xl"
          onClick={() => setShowForm(true)} // Toggle form visibility
          aria-label="Open category form"
        >
          Add Category
        </button>
      )}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-4"
        >
          <h2 className="text-2xl font-bold mb-6">Create Brand</h2>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black"
            >
              Category Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-black"
            >
              Category Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required={!category?.image?.url} // Required only if no existing image
              aria-describedby={errors.image ? "image-error" : undefined}
            />
            {errors.image && (
              <p id="image-error" className="text-red-500 text-sm mt-1">
                {errors.image}
              </p>
            )}
            {category?.image?.url && (
              <img
                src={category?.image?.url}
                alt="Current category image"
                className="mt-2 w-24 h-24 object-cover"
              />
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="data"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Data
            </label>
            <textarea
              name="data"
              id="data"
              value={formData.data}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Is Featured
              </span>
            </label>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Cancel form"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

export default CategoryForm;
