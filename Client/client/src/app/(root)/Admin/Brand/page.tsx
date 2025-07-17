"use client";
import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types (remove if not using TypeScript)
interface Brand {
  _id?: string;
  name: string;
  // slug: string;
  data?: string;
  status: "active" | "inactive";
  isfeatured: boolean;
  logo?: { url: string };
}

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (message: string) => void;
  isEdit?: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({
  brand,
  onSubmit,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    name: brand?.name || "",
    // slug: brand?.slug || "",
    data: brand?.data || "",
    status: brand?.status || "inactive",
    isfeatured: brand?.isfeatured || false,
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const router = useRouter();
  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file input for logo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
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

    if (!logo && !isEdit) {
      newErrors.logo = "Logo is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(await validate())) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);

      formDataToSend.append("data", formData.data);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("isfeatured", String(formData.isfeatured));
      if (logo) {
        formDataToSend.append("logo", logo);
      }

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/brand/${brand?._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/brand`;
      const method = isEdit ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        isEdit ? "Brand updated successfully" : "Brand created successfully"
      );
      onSubmit(response.data.message || "Success");
      setShowForm(false);
      setFormData({
        name: "",
        data: "",
        status: "inactive",
        isfeatured: false,
      });
      setLogo(null);
    } catch (error) {
      setErrors(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brand`);
        setBrands(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        setErrors("failed to fetech data");
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const handleCardClick = (id) => {
    router.push(`/Admin/Brand/${id}`);
    setSelectedBrandId(id);
    console.log(`Clicked brand with ID: ${id}`);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-5">Brands</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="p-4 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label={showForm ? "Close form" : "Add new brand"}
      >
        {showForm ? "Close Form" : "Add Brand"}
      </button>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-4"
          aria-labelledby="form-title"
        >
          <h2 id="form-title" className="text-2xl font-bold mb-6">
            {isEdit ? "Edit Brand" : "Create Brand"}
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Brand Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Logo */}
          <div className="mb-4">
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-700"
            >
              Logo
            </label>
            <input
              type="file"
              name="logo"
              id="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border rounded-md"
              aria-invalid={!!errors.logo}
              aria-describedby={errors.logo ? "logo-error" : undefined}
            />
            {errors.logo && (
              <p id="logo-error" className="text-red-500 text-sm mt-1">
                {errors.logo}
              </p>
            )}
            {brand?.logo?.url && (
              <img
                src={brand.logo.url}
                alt="Current logo"
                className="mt-2 w-24 h-24 object-cover"
              />
            )}
          </div>

          {/* Data */}
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

          {/* Status */}
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
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>

          {/* Is Featured */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isfeatured"
                checked={formData.isfeatured}
                onChange={handleChange}
                className="mr-2"
                aria-checked={formData.isfeatured}
              />
              <span className="text-sm font-medium text-gray-700">
                Is Featured
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading
                ? "Submitting..."
                : isEdit
                ? "Update Brand"
                : "Create Brand"}
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
          {errors.submit && (
            <p className="text-red-500 text-sm mt-2">{errors.submit}</p>
          )}
        </form>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {brands.map((brand) => (
          <button
            onClick={() => handleCardClick(brand._id)}
            className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 cursor-pointer"
          >
            <img
              src={brand.logo?.url}
              alt={brand.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {brand.name}
              </h2>

              <ul className="text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1 mt-2">
                {Array.isArray(brand.data) ? (
                  brand.data.map((item, index) => <li key={index}>{item}</li>)
                ) : (
                  <li>{brand.data}</li>
                )}
              </ul>

              <p className="text-sm text-gray-500 mt-2">
                Status:{" "}
                <span
                  className={
                    brand.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {brand.status}
                </span>
              </p>
            </div>
          </button>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
};

export default BrandForm;
