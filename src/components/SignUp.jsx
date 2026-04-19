import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json(); // simple parsing

    console.log("Signup Response:", data);

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    // ✅ Success
    alert("Signup successful 🎉");
    navigate("/login");

  } catch (error) {
    console.error("Signup Error:", error);
    alert("Server error");
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5E6]">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">

        <h2 className="text-3xl font-bold text-[#537D5D] mb-6 text-center">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#73946B]"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#73946B]"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#73946B]"
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#73946B]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#73946B] text-[#F5F5E6] px-4 py-3 rounded-md font-semibold hover:bg-[#9EBC8A] disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-[#537D5D]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#9EBC8A] hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignUp;