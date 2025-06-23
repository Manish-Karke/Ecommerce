"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addLogginedDetail } from "../../../redux/slices/counter/user";
const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email format.";
    if (!formData.password) errors.password = "Password is required.";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    dispatch(addLogginedDetail(formData))
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL+"/login/",
        formData
      );

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        // Optionally redirect or store token here
        // setFormData({ email: "", password: "" });
        router.push("/components/Products");
      }
    } catch (err) {
      const backendError =
        err.response?.data?.message || "Invalid email or password.";
      setApiError(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Login to ShopHub</h1>

      {apiError && <p style={styles.errorMessage}>{apiError}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Email Field */}
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            style={styles.input}
          />
          {formErrors.email && (
            <p style={styles.fieldError}>{formErrors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            style={styles.input}
          />
          {formErrors.password && (
            <p style={styles.fieldError}>{formErrors.password}</p>
          )}
        </div>

        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={styles.loginLink}>
        Don't have an account?{" "}
        <Link href="/register" style={styles.link}>
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    marginBottom: "10px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  button: {
    backgroundColor: "#0070f3",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  errorMessage: {
    color: "#e74c3c",
    backgroundColor: "#fde3e3",
    padding: "10px",
    borderRadius: "4px",
    textAlign: "center",
  },
  fieldError: {
    color: "#e74c3c",
    fontSize: "0.85em",
    marginTop: "5px",
  },
  loginLink: {
    textAlign: "center",
    marginTop: "20px",
    color: "#555",
  },
  link: {
    color: "#0070f3",
    textDecoration: "none",
  },
};
