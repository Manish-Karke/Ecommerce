"use client";

import React from "react";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    role: "user",
    password: "",
    confirm_password: "",
    location: "",
    gender: "",
    dob: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  //handling the input changes
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
    if (!formData.username) errors.username = "Username is required.";
    if (!formData.email) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email format.";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required.";
    else if (!/^[0-9]{10,15}$/.test(formData.phoneNumber))
      errors.phoneNumber = "Phone number must be 10-15 digits.";
    if (!formData.password) errors.password = "Password is required.";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirm_password)
      errors.confirm_password = "Passwords do not match.";
    if (!formData.location) errors.location = "Location is required.";
    if (!formData.gender) errors.gender = "Gender is required.";
    if (!formData.dob) errors.dob = "dob is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors(null);
    setSuccess(false);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/register/",
        formData
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);

        setFormData({
          username: "",
          email: "",
          phoneNumber: "",
          role: "user",
          password: "",
          confirm_password: "",
          location: "",
          gender: "",
          dob: "",
        });
        console.log("Registration successful:", response.data);
      }
    } catch (err) {
      const backend =
        err.response?.data?.message ||
        "an unexpected error occured on your Input";
      console.error("Registration error:", backend);

      if (err.response && err.response.data && err.response.data.message) {
        setErrors(err.response.data.message); //
      } else {
        setErrors("An unexpected error occurred during registration.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Register for shophub</h1>

      {/* {success && (
        <p style={styles.successMessage}>
          Registration successful! Please check your email for activation.
        </p>
      )} */}
      {errors && (
        <p style={styles.errorMessage}>
          {typeof errors === "string"
            ? errors
            : typeof errors === "object" && errors !== null
            ? JSON.stringify(errors)
            : ""}
        </p>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Username */}
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          {formErrors.username && (
            <p style={styles.fieldError}>{formErrors.username}</p>
          )}
        </div>

        {/* Email */}
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            placeholder="enter the correct email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          {formErrors.email && (
            <p style={styles.fieldError}>{formErrors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div style={styles.formGroup}>
          <label htmlFor="phoneNumber" style={styles.label}>
            Phone Number:
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          {formErrors.phoneNumber && (
            <p style={styles.fieldError}>{formErrors.phoneNumber}</p>
          )}
        </div>

        {/* Role (Dropdown) */}
        <div style={styles.formGroup}>
          <label htmlFor="role" style={styles.label}>
            Role:
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
          {formErrors.role && (
            <p style={styles.fieldError}>{formErrors.role}</p>
          )}
        </div>

        {/* Password */}
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="must contain 1 uppercase, lowercase,special and number"
            value={formData.password}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          {formErrors.password && (
            <p style={styles.fieldError}>{formErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div style={styles.formGroup}>
          <label htmlFor="confirm_password" style={styles.label}>
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          {formErrors.confirm_password && (
            <p style={styles.fieldError}>{formErrors.confirm_password}</p>
          )}
        </div>

        {/* Location */}
        <div style={styles.formGroup}>
          <label htmlFor="location" style={styles.label}>
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          {formErrors.location && (
            <p style={styles.fieldError}>{formErrors.location}</p>
          )}
        </div>

        {/* Gender (Dropdown) */}
        <div style={styles.formGroup}>
          <label htmlFor="gender" style={styles.label}>
            Gender:
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer not to say">Prefer not to say</option>
          </select>
          {formErrors.gender && (
            <p style={styles.fieldError}>{formErrors.gender}</p>
          )}
        </div>

        {/* DOB */}
        <div style={styles.formGroup}>
          <label htmlFor="dob" style={styles.label}>
            Date of Birth:
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          {formErrors.dob && <p style={styles.fieldError}>{formErrors.dob}</p>}
        </div>

        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <p style={styles.loginLink}>
        Already have an account?{" "}
        <Link href="/login" style={styles.link}>
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

// Basic inline styles for demonstration
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
    boxSizing: "border-box", // Include padding in width
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0070f3",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
  buttonDisabled: {
    backgroundColor: "#a0c7f8",
    cursor: "not-allowed",
  },
  errorMessage: {
    color: "#e74c3c",
    backgroundColor: "#fde3e3",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    textAlign: "center",
  },
  successMessage: {
    color: "#27ae60",
    backgroundColor: "#e6ffe6",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
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
