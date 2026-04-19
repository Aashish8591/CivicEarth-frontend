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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://civicearth.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        city: formData.city   
      }),
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    navigate("/login", { state: { success: true } });

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5E6]">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#537D5D] mb-6 text-center">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#73946B]"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#73946B]"
            required
          />

          {/* Password */}
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
              value={formData.city || ""}
              onChange={handleChange}
              className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#73946B]"
              required
            />

          {/* Role Selection */}
          {/* <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#73946B]"
          >
            <option value="user">User</option>
            <option value="authority">Authority</option>
          </select> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#73946B] text-[#F5F5E6] px-4 py-3 rounded-md font-semibold hover:bg-[#9EBC8A]"
          >
            Sign Up
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
