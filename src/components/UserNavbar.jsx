import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Demo User",
    email: "demo@gmail.com",
    city: "Not set",
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
              onClick={() => navigate("/dashboard")}
              className="text-[#537D5D] font-medium hover:underline"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/my-issues")}
              className="text-[#537D5D] font-medium hover:underline"
            >
              My Issues
            </button>

            <button
              onClick={() => navigate("/report-issue")}
              className="bg-[#537D5D] text-white px-4 py-2 rounded-full shadow hover:bg-[#73946B] transition"
            >
              + Report
            </button>

            {/* PROFILE */}
            <div
              onClick={() => setOpenProfile(!openProfile)}
              className="w-10 h-10 bg-gradient-to-r from-[#537D5D] to-[#73946B] text-white rounded-full flex items-center justify-center cursor-pointer shadow"
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* DROPDOWN */}
      {openProfile && (
        <div className="absolute right-6 mt-2 w-64 bg-white shadow-lg rounded-xl p-4 z-50">
          <div className="mb-3">
            <h2 className="font-semibold text-[#537D5D]">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <hr />

          <div className="flex flex-col mt-3 gap-2">

            {/* 🔥 VIEW PROFILE → OPEN MODAL */}
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
                navigate("/login");
              }}
              className="text-left px-3 py-2 rounded text-red-500 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* 🔥 PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-lg w-[350px] p-6 text-center">

            {/* Avatar */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[#537D5D] to-[#73946B] text-white flex items-center justify-center rounded-full text-2xl font-bold mb-4">
              {user.name?.charAt(0)}
            </div>

            {/* Info */}
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm mt-2">📍 {user.city || "Not set"}</p>

            {/* Close */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-6 w-full border py-2 rounded-md hover:bg-gray-100"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;