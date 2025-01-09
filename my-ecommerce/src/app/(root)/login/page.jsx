"use client";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setStep(2); // Move to password step
      setError("");
    } else {
      setError("Please enter a valid email.");
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (password.length >= 6) {
      setError("");
      console.log("Logging in with:", { email, password });
      setIsLoggedIn(true); // Show pop-up on successful login
      setTimeout(() => setIsLoggedIn(false), 3000); // Hide pop-up after 3 seconds
    } else {
      setError("Password must be at least 6 characters.");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
        gap: "1rem",
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
          Login
        </h1>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <label
              htmlFor="email"
              className="block mb-2 font-medium gap-3"
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: "bold",

                gap: "0.5rem",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4  ,"
              placeholder="Enter your email"
              required
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="flex w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              style={{
                position: "fixed",
                top: "65%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#475569",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                width: "100px",
              }}
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleLogin}>
            <label
              htmlFor="password"
              className="block mb-2 font-medium gap-3"
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: "bold",

                gap: "0.5rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Enter your password"
              required
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              style={{
                position: "fixed",
                top: "55%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#475569",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                width: "100px",
              }}
            >
              <Link href={"../../components"}>Login</Link>
            </button>
            <h2
              style={{
                marginTop: "100px",
              }}
            >
              create an new account? <Link href={"./register"}>Login here</Link>
            </h2>
          </form>
        )}
      </div>
      {/* Pop-Up Box */}
      {isLoggedIn && (
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
          You are logged in!
        </div>
      )}
    </div>
  );
}
