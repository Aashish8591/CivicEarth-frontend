import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

const getStatusColor = (status) => {
  if (status === "in_progress") return "text-yellow-600";
  if (status === "submitted") return "text-red-500";
  if (status === "assigned") return "text-blue-500";
  if (status === "resolved") return "text-green-600";
  if (status === "rejected") return "text-gray-500";
};

const UserDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [time, setTime] = useState(""); // ✅ FIXED POSITION

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000";

  // 🔥 Fetch issues
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/reports", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIssues(data.reports || []);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔥 Filters
  const filteredIssues = (issues || []).filter((item) => {
    const matchSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = category ? item.category === category : true;
    const matchStatus = status ? item.status === status : true;
    const matchCity = city ? item.city === city : true;

    // ✅ TIME FILTER FIXED
    let matchTime = true;

    if (time) {
      const reportDate = new Date(item.createdAt);
      const today = new Date();
      const diff = (today - reportDate) / (1000 * 60 * 60 * 24);
      matchTime = diff <= Number(time);
    }

    return matchSearch && matchCategory && matchStatus && matchCity && matchTime;
  });

  return (
    <div className="min-h-screen bg-[#F5F5E6] text-[#537D5D] pt-24 px-6 max-w-7xl mx-auto">

      {/* Navbar */}
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CivicEarth</h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/my-issues")}
            className="text-[#537D5D] font-semibold hover:underline"
          >
            My Issues
          </button>

          <button
            onClick={() => navigate("/report-issue")}
            className="bg-[#73946B] text-white px-4 py-2 rounded-full hover:bg-[#537D5D]"
          >
            Report new issue
          </button>
        </div>
      </div> */}

      <UserNavbar />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">

        <select onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option value="">Category</option>
          <option value="garbage">Garbage</option>
          <option value="water">Water</option>
          <option value="road">Road</option>
          <option value="air">Air</option>
          <option value="noise">Noise</option>
          <option value="other">Other</option>
        </select>

        <select onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
          <option value="">Status</option>
          <option value="submitted">Submitted</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select onChange={(e) => setCity(e.target.value)} className="border p-2 rounded">
          <option value="">City</option>
          <option value="thane">Thane</option>
          <option value="dombivli">Dombivli</option>
          <option value="kalyan">Kalyan</option>
          <option value="ambernath">Ambernath</option>
          <option value="badlapur">Badlapur</option>
          <option value="neral">Neral</option>
          <option value="shelu">Shelu</option>
        </select>

        <select onChange={(e) => setTime(e.target.value)} className="border p-2 rounded">
          <option value="">Time</option>
          <option value="1">Last 24 hrs</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>

        <div className="flex items-center bg-white px-3 rounded border">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search issues..."
            className="px-2 py-1 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="border px-4 py-2 rounded">Search</button>

      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <div key={issue._id} className="bg-white rounded-xl shadow-md overflow-hidden">

            {/* Media */}
            {issue.media?.[0]?.type === "video" ? (
              <video
                src={issue.media[0].url}
                className="h-40 w-full object-cover"
                controls
              />
            ) : (
              <img
                src={`${BASE_URL}${issue.media?.[0]?.url.replace("http://localhost:5000", "")}`}
                className="h-40 w-full object-cover"
              />
            )}

            {/* Content */}
            <div className="p-4">
              <p className={`text-sm font-semibold ${getStatusColor(issue.status)}`}>
                {issue.status.replace("_", " ").toUpperCase()}
              </p>

              <h2 className="text-lg font-bold mt-1">{issue.title}</h2>

              <p className="text-gray-600 text-sm">{issue.description}</p>

              <div className="flex justify-between text-xs text-gray-500 mt-3">
                <span>📍 {issue.city}</span>
                <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;   