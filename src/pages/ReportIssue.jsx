import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

const ReportIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [location, setLocation] = useState({
    latitude: "",
    longitude: ""
  });

  // 📍 Get location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      (err) => console.log(err)
    );
  }, []);

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("city", city);
    formData.append("area", area);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    formData.append("media", file);

    try {
      await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Error submitting issue");
    }
  };

  return (
    <div className="bg-[#F8F9F4] min-h-screen text-[#537D5D]">

      {/* Navbar */}
      <UserNavbar />

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-8">
          Report New Issue
        </h1>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-4"
        >

          {/* Title */}
          <input
            type="text"
            placeholder="Issue Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-4 py-3 rounded-md focus:ring-2 focus:ring-[#537D5D] outline-none"
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-4 py-3 rounded-md focus:ring-2 focus:ring-[#537D5D] outline-none"
            required
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-4 py-3 rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="garbage">Garbage</option>
            <option value="water">Water</option>
            <option value="road">Road</option>
            <option value="air">Air</option>
            <option value="noise">Noise</option>
            <option value="other">Other</option>
          </select>

          {/* City */}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border px-4 py-3 rounded-md"
            required
          >
            <option value="">Select City</option>
            <option value="thane">Thane</option>
            <option value="dombivli">Dombivli</option>
            <option value="kalyan">Kalyan</option>
            <option value="ambernath">Ambernath</option>
            <option value="badlapur">Badlapur</option>
            <option value="neral">Neral</option>
            <option value="shelu">Shelu</option>
            <option value="other">Other</option>
          </select>

          {city === "other" && (
            <input
              type="text"
              placeholder="Enter City"
              onChange={(e) => setCity(e.target.value)}
              className="border px-4 py-3 rounded-md"
              required
            />
          )}

          {/* Area */}
          <input
            type="text"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border px-4 py-3 rounded-md"
            required
          />

          {/* File */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border px-4 py-3 rounded-md"
            required
          />

          {/* Submit */}
          <button className="bg-[#537D5D] text-white py-3 rounded-md hover:bg-[#73946B] transition font-semibold">
            Submit Issue
          </button>

        </form>

      </div>
    </div>
  );
};

export default ReportIssue;