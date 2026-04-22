import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data); // 🔥 DEBUG

      // ❌ If login failed
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ❌ CRITICAL FIX: ensure token exists
      if (!data.token) {
        throw new Error("Token not received from server");
      }

      // ✅ Store properly
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect
      if (data.user?.role === "authority") {
        navigate("/authority-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      // ❌ Remove bad token if any
      localStorage.removeItem("token");

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5E6]">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 min-h-[500px]">

        <h2 className="text-3xl font-bold text-[#537D5D] text-center mb-6">
          Login
        </h2>

        {location.state?.success && (
          <p className="text-green-600 text-center mb-4 font-medium">
            Signup successful! Please login.
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#73946B]"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#73946B]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#537D5D] text-[#F5F5E6] px-4 py-2 rounded-md font-semibold hover:bg-[#73946B] transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#73946B] hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;