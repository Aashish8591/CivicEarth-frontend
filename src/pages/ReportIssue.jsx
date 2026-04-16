import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";


const ReportIssue = () => {
  // 🟢 States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [file, setFile] = useState(null);
   const [time, setTime] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [location, setLocation] = useState({
    latitude: "",
    longitude: ""
  });

  // 📍 Get current location
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

  // 🚀 Submit function
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
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      console.log(data);

      navigate("/dashboard", { state: { success: true } });

      // reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setCity("");
      setArea("");
      setFile(null);

    } catch (error) {
      console.log(error);
      alert("Error submitting issue");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5E6] text-[#537D5D] p-6 pt-24">
      <UserNavbar />
      <h1 className="text-2xl font-bold mb-6 text-center">
        Report New Issue
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md flex flex-col gap-4"
      >

        {/* Title */}
        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
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
        className="border p-2 rounded"
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
        className="border p-2 rounded"
        required
      />
    )}

        {/* Area */}
        <input
          type="text"
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* File Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
          required
        />

        {/* Submit */}
        <button className="bg-[#537D5D] text-white py-2 rounded hover:bg-[#73946B]">
          Submit Issue
        </button>

      </form>
    </div>
  );
};

export default ReportIssue;