import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../utils/api";

const UserNavbar = () => {
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    displayName: ""
  });

  // 🔥 ROLE CHECK
  const isAuthority = user?.role === "authority";

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        city: user.city || "",
        displayName: user.displayName || ""
      });
    }
  }, [user?.name, user?.email, user?.city, user?.displayName]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));

      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="w-full px-6 py-3 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-[#537D5D] text-xl font-bold hover:bg-gray-100 px-2 py-1 rounded"
            >
              ←
            </button>

            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src="/logo.jpg"
                className="h-10 w-10 rounded-full shadow"
                alt="logo"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                navigate(isAuthority ? "/authority-dashboard" : "/dashboard")
              }
              className="text-[#537D5D] font-medium hover:underline"
            >
              Dashboard
            </button>

            {/* 🔥 CHANGED BUTTON */}
           <button
              onClick={() =>
                navigate(isAuthority ? "/assigned-issues" : "/my-issues")
              }
              className="text-[#537D5D] font-medium hover:underline"
            >
              {isAuthority ? "Assigned Issues" : "My Issues"}
            </button>

            {!isAuthority && (
              <button
                onClick={() => navigate("/report-issue")}
                className="bg-[#537D5D] text-white px-4 py-2 rounded-full shadow hover:bg-[#73946B] transition"
              >
                + Report
              </button>
            )}

            {/* PROFILE */}
            <div
              onClick={() => setOpenProfile(!openProfile)}
              className="w-10 h-10 bg-gradient-to-r from-[#537D5D] to-[#73946B] text-white rounded-full flex items-center justify-center cursor-pointer shadow"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>

      {/* DROPDOWN */}
      {openProfile && (
        <div className="absolute right-6 mt-2 w-64 bg-white shadow-lg rounded-xl p-4 z-50">
          <div className="mb-3">
            {/* 🔥 FIX OVERFLOW */}
            <h2 className="font-semibold text-[#537D5D] truncate">
              {user.displayName || user.name}
            </h2>
            <p className="text-sm text-gray-500 truncate">
              {user.email}
            </p>
          </div>

          <hr />

          <div className="flex flex-col mt-3 gap-2">
            <button
              onClick={() => {
                setShowProfileModal(true);
                setOpenProfile(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-gray-100"
            >
              View Profile
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="text-left px-3 py-2 rounded text-red-500 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">

            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Edit Profile
            </h2>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#537D5D] text-white flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>

            <div className="space-y-4">

              <p className="text-sm text-gray-500 text-center mb-2">
                {user.displayName}
              </p>

              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-[#537D5D] text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;