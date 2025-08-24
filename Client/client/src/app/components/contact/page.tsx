"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can connect this with an API, email service, or database
    console.log("Form submitted:", formData);
    alert("Thanks for reaching out! We’ll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-700 mb-4">
        Have questions or need help? Fill out the form below or reach us
        directly.
      </p>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows="5"
          className="w-full p-3 border rounded-lg"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Send Message
        </button>
      </form>

      {/* Direct Contact Info */}
      <div className="mt-8">
        <p className="mb-2">📧 Email: support@shophub.com</p>
        <p className="mb-2">📞 Phone: +977-9800000000</p>
        <p className="mb-2">🏠 Address: Kathmandu, Nepal</p>

        <div className="flex space-x-4 mt-4">
          <a href="#" className="text-blue-600 hover:underline">
            Facebook
          </a>
          <a href="#" className="text-pink-600 hover:underline">
            Instagram
          </a>
          <a href="#" className="text-blue-400 hover:underline">
            Twitter
          </a>
        </div>
      </div>
    </div>
  );
}
