import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import UserNavbar from "../components/UserNavbar";

const MyIssues = () => {
  const [issues, setIssues] = useState([]);

  // 🔥 Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [time, setTime] = useState("");

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/reports/my-reports", {
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

  // 🔥 FILTER LOGIC (same as dashboard)
  const filteredIssues = (issues || []).filter((item) => {
    const matchSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = category ? item.category === category : true;
    const matchStatus = status ? item.status === status : true;
    const matchCity = city
      ? item.city.toLowerCase() === city.toLowerCase()
      : true;

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
    <div className="bg-[#F5F5E6] min-h-screen">
    <UserNavbar />

  <div className="max-w-7xl mx-auto px-6 py-6">

      {/* 🔥 Filters */}
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

      {/* Empty state */}
      {filteredIssues.length === 0 && (
        <p className="text-gray-500">No matching issues found.</p>
      )}

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <div key={issue._id} className="bg-white rounded-xl shadow-md overflow-hidden">

            {/* Media */}
            <img
              src={`${BASE_URL}${issue.media?.[0]?.url.replace("http://localhost:5000", "")}`}
              className="h-40 w-full object-cover"
            />

            {/* Content */}
            <div className="p-4">
              <p className="text-sm font-semibold">
                {issue.status.replace("_", " ").toUpperCase()}
              </p>

              <h2 className="text-lg font-bold mt-1">
                {issue.title}
              </h2>

              <p className="text-gray-600 text-sm">
                {issue.description}
              </p>

              <div className="flex justify-between text-xs text-gray-500 mt-3">
                <span>📍 {issue.city}</span>
                <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default MyIssues;