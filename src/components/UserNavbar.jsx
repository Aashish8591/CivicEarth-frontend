import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-[#537D5D] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>←</button>

            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src="/logo.jpg" className="h-10 w-10 rounded-full" />
              <span className="font-bold text-white text-lg">CivicEarth</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 text-white">

            <button onClick={() => navigate("/my-issues")}>
              My Issues
            </button>

            <button
              onClick={() => navigate("/report-issue")}
              className="bg-[#73946B] px-4 py-1 rounded-full"
            >
              Report Issue
            </button>

            <div
              onClick={() => setOpenProfile(true)}
              className="w-10 h-10 bg-[#73946B] rounded-full flex items-center justify-center cursor-pointer"
            >
              👤
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {openProfile && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[350px]">
            <h2 className="font-bold text-lg mb-4">Profile</h2>

            <button
              onClick={() => setOpenProfile(false)}
              className="mt-4 border px-4 py-2 rounded"
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