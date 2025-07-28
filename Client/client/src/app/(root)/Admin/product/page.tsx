"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Avatar,
  SelectChangeEvent, // Import SelectChangeEvent for Select component
} from "@mui/material";

import { styled, useTheme } from "@mui/material/styles";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface FormData {
  name: string;
  description: string;
  isFeatured: boolean;
  isMenu: boolean;
  status: "active" | "inactive";
  price: number;
  discount: number;
  order: number;
  stock: number;
  categoryId: string;
  brandId: string;
  seller: string;
  images: File | null;
}

const FormCard = styled(Card)(({ theme }) => ({
  maxWidth: 850,
  margin: "3rem auto",
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
  backgroundColor: theme.palette.background.default,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
  },
  transition: "all 0.3s ease-in-out",
}));

const ProductForm: React.FC = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    isFeatured: false,
    isMenu: false,
    status: "active",
    price: 0,
    discount: 0,
    order: 0,
    stock: 0,
    categoryId: "",
    brandId: "",
    seller: "manish",
    images: null,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get<{ data: Category[] }>(
            `${process.env.NEXT_PUBLIC_API_URL}/category`
          ),
          axios.get<{ data: Brand[] }>(
            `${process.env.NEXT_PUBLIC_API_URL}/brand`
          ),
        ]);

        setCategories(categoriesRes.data.data || []);
        setBrands(brandsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching categories or brands:", err);

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Failed to load categories or brands."
          );
        } else {
          setError("An unexpected error occurred while loading initial data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string | "active" | "inactive">
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    let newValue: string | number | boolean | File | null = value;

    if (name === "categoryId" || name === "brandId" || name === "status") {
      newValue = value as string;
    } else if (["price", "stock", "order", "discount"].includes(name)) {
      newValue = value === "" ? "" : parseFloat(value);
    } else {
      newValue = value;
    }

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const file = files ? files[0] : null;
      setFormData({ ...formData, images: file });
      if (file) {
        setImagePreviewUrl(URL.createObjectURL(file));
      } else {
        setImagePreviewUrl(null);
      }
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleRemoveImage = (): void => {
    setFormData({ ...formData, images: null });
    setImagePreviewUrl(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      setFormError("Product name is required.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.categoryId.trim()) {
      setFormError("Please select a category.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.brandId.trim()) {
      setFormError("Please select a brand.");
      setIsSubmitting(false);
      return;
    }
    if (formData.price <= 0) {
      setFormError("Price must be greater than 0.");
      setIsSubmitting(false);
      return;
    }

    const productFormData = new FormData();
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        const value = formData[key as keyof FormData];

        if (key === "categoryId" || key === "brandId") {
          if (typeof value === "string" && value) {
            productFormData.append(key, value);
          }
        } else if (key === "images" && value instanceof File) {
          productFormData.append("images", value);
        } else if (typeof value === "boolean") {
          productFormData.append(key, value.toString());
        } else if (value !== null && value !== undefined) {
          productFormData.append(key, String(value)); //
        }
      }
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        productFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product created successfully:", response.data);
      alert("Product created!");
      setShowForm;
      setFormData({
        name: "",
        description: "",
        isFeatured: false,
        isMenu: false,
        status: "active",
        price: 0,
        discount: 0,
        order: 0,
        stock: 0,
        categoryId: "",
        brandId: "",
        seller: "manish",
        images: null,
      });
      setImagePreviewUrl(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Failed to create product.";
        setFormError(errorMessage);
      } else {
        setFormError("An unexpected error occurred during product creation.");
      }
      console.error("Error creating product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress
          size={60}
          sx={{ color: theme.palette.primary.main }}
        />
        <Typography variant="h6" mt={2} color="text.secondary">
          Loading categories and brands...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={4}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-5">Products</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="p-4 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        {showForm ? "Close Form" : "Add Product"}
      </button>
      {showForm && (
        <FormCard>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 800,
              color: theme.palette.primary.dark,
              mb: 2,
            }}
          >
            Create New Product
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 3 }} variant="outlined">
              {formError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Product Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="filled"
                  placeholder="Enter product name"
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="filled"
                  placeholder="Enter product description"
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} width={100}>
                <FormControl fullWidth variant="filled" required>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={
                      handleChange as (
                        event: SelectChangeEvent<string>,
                        child: React.ReactNode
                      ) => void
                    }
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Brand */}
              <Grid item xs={12} width={100}>
                <FormControl fullWidth variant="filled" required>
                  <InputLabel id="brand-label">Brand</InputLabel>
                  <Select
                    labelId="brand-label"
                    name="brandId"
                    value={formData.brandId}
                    onChange={
                      handleChange as (
                        event: SelectChangeEvent<string>,
                        child: React.ReactNode
                      ) => void
                    } // Explicitly cast for Select
                    label="Brand"
                  >
                    <MenuItem value="">
                      <em>Select Brand</em>
                    </MenuItem>
                    {brands.map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Price */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  variant="filled"
                  placeholder="Enter price"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon color="action" />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, step: 0.01 },
                  }}
                />
              </Grid>

              {/* Discount */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleChange}
                  variant="filled"
                  placeholder="Enter discount (0-90%)"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography color="text.secondary">%</Typography>
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, max: 90, step: 0.01 },
                  }}
                />
              </Grid>

              {/* Order */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleChange}
                  variant="filled"
                  placeholder="Enter order"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  variant="filled"
                  placeholder="Enter stock quantity"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth variant="filled">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={
                      handleChange as (
                        event: SelectChangeEvent<string>,
                        child: React.ReactNode
                      ) => void
                    }
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Checkboxes */}
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      color="primary"
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    />
                  }
                  label={
                    <Typography variant="body1" color="text.primary">
                      Featured Product
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isMenu"
                      checked={formData.isMenu}
                      onChange={handleChange}
                      color="primary"
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    />
                  }
                  label={
                    <Typography variant="body1" color="text.primary">
                      Show in Menu
                    </Typography>
                  }
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    minHeight: imagePreviewUrl ? "auto" : 120,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      borderColor: theme.palette.primary.light,
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{ textTransform: "none", mb: 1 }}
                  >
                    {formData.images ? "Change Image" : "Upload Product Image"}
                    <input
                      type="file"
                      name="images"
                      onChange={handleChange}
                      hidden
                      accept="image/*"
                    />
                  </Button>
                  {imagePreviewUrl ? (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        src={imagePreviewUrl}
                        alt="Product Preview"
                        sx={{
                          width: 100,
                          height: 100,
                          mb: 1,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                        variant="rounded"
                      />
                      <FormHelperText
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        Selected: {formData.images?.name || "No file selected"}
                        <IconButton
                          size="small"
                          onClick={handleRemoveImage}
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </FormHelperText>
                    </Box>
                  ) : (
                    <FormHelperText>
                      No image selected. Max file size: 5MB.
                    </FormHelperText>
                  )}
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <SubmitButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                >
                  {isSubmitting ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: theme.palette.primary.contrastText }}
                    />
                  ) : (
                    "Create Product"
                  )}
                </SubmitButton>
              </Grid>
            </Grid>
            <input type="hidden" name="seller" value={formData.seller} />
          </form>
        </FormCard>
      )}
    </main>
  );
};

export default ProductForm;
