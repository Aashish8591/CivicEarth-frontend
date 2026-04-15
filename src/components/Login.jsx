import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user"); // temporary (remove later when backend ready)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 Replace this with your backend API
      // const res = await fetch("http://localhost:5000/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await res.json();

      // ✅ TEMPORARY MOCK LOGIN (for now)
      const data = {
        user: {
          email,
          role: role, // will come from backend later
        },
        token: "dummy-token",
      };

      // ✅ Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 Redirect based on role
      if (data.user.role === "user") {
        navigate("/dashboard");
      } else if (data.user.role === "authority") {
        navigate("/authority-dashboard");
      }

    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5E6]">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 min-h-[500px]">

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#537D5D] text-center mb-6">
          Login
        </h2>

        {/* Role Selection (temporary) */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-full font-semibold transition ${
              role === "user"
                ? "bg-[#73946B] text-white"
                : "bg-[#D2D0A0] text-[#537D5D]"
            }`}
            onClick={() => setRole("user")}
          >
            User
          </button>

          <button
            type="button"
            className={`px-4 py-2 rounded-full font-semibold transition ${
              role === "authority"
                ? "bg-[#73946B] text-white"
                : "bg-[#D2D0A0] text-[#537D5D]"
            }`}
            onClick={() => setRole("authority")}
          >
            Authority
          </button>
        </div>

        {/* Form */}
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

        {/* Signup */}
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