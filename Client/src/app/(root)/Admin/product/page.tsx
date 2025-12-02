"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
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
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import api from "@/lib/api"; // ← THIS IS YOUR FIXED AXIOS INSTANCE WITH TOKEN

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
  maxWidth: 900,
  margin: "3rem auto",
  padding: theme.spacing(4),
  boxShadow: theme.shadows[12],
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2, 4),
  fontWeight: 700,
  backgroundColor: "#f59e0b",
  "&:hover": { backgroundColor: "#d97706" },
}));

export default function ProductForm() {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    seller: "manish", // or get from logged in user
    images: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get("/category"),
          api.get("/brand"),
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = files?.[0] || null;
      setFormData((prev) => ({ ...prev, images: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else if (["price", "discount", "stock", "order"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Validation
    if (!formData.name) return setFormError("Product name is required");
    if (!formData.categoryId) return setFormError("Select a category");
    if (!formData.brandId) return setFormError("Select a brand");
    if (formData.price <= 0) return setFormError("Price must be > 0");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "images" && value instanceof File) {
          data.append("images", value);
        } else if (typeof value === "boolean") {
          data.append(key, value ? "true" : "false");
        } else {
          data.append(key, String(value));
        }
      }
    });

    try {
      const res = await api.post("/product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product Added Successfully!");
      setFormData({ ...formData, name: "", images: null, price: 0, stock: 0 });
      setImagePreview(null);
      setShowForm(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box textAlign="center" my={4}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowForm(!showForm)}
          sx={{ bgcolor: "#f59e0b", "&:hover": { bgcolor: "#d97706" } }}
        >
          {showForm ? "Close Form" : "Add New Product"}
        </Button>
      </Box>

      {showForm && (
        <FormCard>
          <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
            Add New Product
          </Typography>

          {formError && <Alert severity="error">{formError}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                    <MenuItem value="">Select</MenuItem>
                    {categories.map((c) => (
                      <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Brand</InputLabel>
                  <Select name="brandId" value={formData.brandId} onChange={handleChange} required>
                    <MenuItem value="">Select</MenuItem>
                    {brands.map((b) => (
                      <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Discount (%)" name="discount" type="number" value={formData.discount} onChange={handleChange} InputProps={{ inputProps: { min: 0, max: 90 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Order" name="order" type="number" value={formData.order} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select name="status" value={formData.status} onChange={handleChange}>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" gap={3}>
                  <FormControlLabel control={<Checkbox name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />} label="Featured" />
                  <FormControlLabel control={<Checkbox name="isMenu" checked={formData.isMenu} onChange={handleChange} />} label="Show in Menu" />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                  Upload Image
                  <input type="file" hidden accept="image/*" name="images" onChange={handleChange} />
                </Button>
                {imagePreview && (
                  <Box mt={2} textAlign="center">
                    <Avatar src={imagePreview} variant="rounded" sx={{ width: 120, height: 120, mx: "auto" }} />
                    <IconButton onClick={() => { setFormData(prev => ({ ...prev, images: null })); setImagePreview(null); }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <SubmitButton type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : "ADD PRODUCT"}
                </SubmitButton>
              </Grid>
            </Grid>
          </form>
        </FormCard>
      )}
    </Box>
  );
}