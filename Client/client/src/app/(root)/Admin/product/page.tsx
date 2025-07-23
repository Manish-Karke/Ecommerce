"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Styled card container for the form
const FormCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: "2rem auto",
  padding: theme.spacing(2),
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
}));

// Styled submit button
const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  fontWeight: 600,
  textTransform: "none",
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
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
    seller: "manish", // Replace with dynamic auth if needed
    images: null,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brand`),
        ]);

        setCategories(categoriesRes.data.data || []);
        setBrands(brandsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching categories or brands:", err);
        setError("Failed to load categories or brands.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue = value;

    if (["price", "stock", "order"].includes(name)) {
      newValue = value === "" ? 0 : Math.max(0, parseFloat(value));
    } else if (name === "discount") {
      newValue =
        value === "" ? 0 : Math.min(90, Math.max(0, parseFloat(value)));
    }

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, images: files[0] });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Client-side validation
    if (!formData.name) {
      setFormError("Product name is required.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.categoryId) {
      setFormError("Please select a category.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.brandId) {
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
      if (key === "categoryId" || key === "brandId") {
        if (formData[key]) {
          productFormData.append(key, formData[key]); // Send as string, not array
        }
      } else if (key === "images" && formData.images) {
        productFormData.append("images", formData.images);
      } else if (typeof formData[key] === "boolean") {
        productFormData.append(key, formData[key].toString());
      } else if (formData[key] !== null) {
        productFormData.append(key, formData[key]);
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
      // Reset form after successful submission
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
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create product.";
      setFormError(errorMessage);
      console.error("Error creating product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
        <Typography variant="h6" ml={2}>
          Loading brands and categories...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <FormCard>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Create New Product
        </Typography>
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter product name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter product description"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  label="Category"
                  required
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Brand</InputLabel>
                <Select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  label="Brand"
                  required
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter price"
                InputProps={{
                  startAdornment: <AttachMoneyIcon color="action" />,
                  inputProps: { min: 0, step: 0.01 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Discount"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter discount (0-90%)"
                InputProps={{
                  endAdornment: <Typography>%</Typography>,
                  inputProps: { min: 0, max: 90, step: 0.01 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                variant="outlined"
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
                variant="outlined"
                placeholder="Enter stock quantity"
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" gap={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Featured Product"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isMenu"
                      checked={formData.isMenu}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Show in Menu"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Upload Product Image
                <input
                  type="file"
                  name="images"
                  onChange={handleChange}
                  hidden
                  accept="image/*"
                />
              </Button>
              {formData.images && (
                <FormHelperText>
                  Selected: {formData.images.name}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <SubmitButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Create Product"
                )}
              </SubmitButton>
            </Grid>
          </Grid>
          <input type="hidden" name="seller" value={formData.seller} />
        </form>
      </CardContent>
    </FormCard>
  );
};

export default ProductForm;
