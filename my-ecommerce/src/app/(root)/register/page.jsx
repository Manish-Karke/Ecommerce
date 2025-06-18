"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    try {
      const response = await axios.post("http://localhost:8000/register", {
        email,
        password,
      });
      toast.success(response.data.message || "Registration successful!");
      setIsRegistered(true);
      setTimeout(() => setIsRegistered(false), 3000);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#475569",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div className="bg-slate-900 p-8 rounded shadow-md w-96 justify-center flex-col">
        <h1
          className="text-2xl font-bold mb-4 text-center text-white"
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          Register
        </h1>

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label
            htmlFor="email"
            className="block mb-2 font-medium"
            style={{ fontWeight: "bold" }}
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter your email"
            required
          />

          <label
            htmlFor="password"
            className="block mb-2 font-medium"
            style={{ fontWeight: "bold" }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border text-black border-gray-300 p-2 rounded"
            placeholder="Create a password"
            required
          />

          <label
            htmlFor="confirmPassword"
            className="block mb-2  font-medium"
            style={{ fontWeight: "bold" }}
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border  text-black border-gray-300 p-2 rounded"
            placeholder="Confirm your password"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="flex w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            style={{
              background: "#475569",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Register
          </button>
          <h2>
            Already have an account? <Link href={"./login"}>Login here</Link>
          </h2>
        </form>
      </div>

      {/* Pop-Up Box */}
      {isRegistered && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#22c55e",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          Registration successful!
        </div>
      )}
    </div>
  );
}
