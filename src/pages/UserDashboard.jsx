import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const issuesData = [
  {
    id: 1,
    title: "Streetlight not working",
    description: "Streetlight not working since last 2 days",
    status: "In Progress",
    location: "Delhi",
    date: "Jan 20",
    image: "https://source.unsplash.com/400x200/?streetlight",
  },
  {
    id: 2,
    title: "Pothole on main road",
    description: "Big pothole near traffic signal, risky",
    status: "Reported",
    location: "Delhi",
    date: "Jan 18",
    image: "https://source.unsplash.com/400x200/?road",
  },
  {
    id: 3,
    title: "Garbage not collected",
    description: "Garbage near corner not collected",
    status: "Pending",
    location: "Delhi",
    date: "Jan 15",
    image: "https://source.unsplash.com/400x200/?garbage",
  },
];

const getStatusColor = (status) => {
  if (status === "In Progress") return "text-yellow-600";
  if (status === "Pending") return "text-orange-500";
  if (status === "Reported") return "text-red-500";
};

const UserDashboard = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredIssues = issuesData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F5E6] text-[#537D5D] p-6">
      
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CivicTrack</h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/my-issues")}
            className="text-[#537D5D] font-semibold hover:underline"
          >
            My Issues
          </button>

          <button
            onClick={() => navigate("/report-issue")}
            className="bg-[#73946B] text-white px-4 py-2 rounded-full hover:bg-[#537D5D] transition"
          >
            Report new issue
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select className="bg-white border border-gray-300 p-2 rounded">
          <option>Category</option>
        </select>
        <select className="bg-white border border-gray-300 p-2 rounded">
          <option>Status</option>
        </select>
        <select className="bg-white border border-gray-300 p-2 rounded">
          <option>Distance</option>
        </select>

        <div className="flex items-center bg-white px-3 rounded border border-gray-300">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search issues..."
            className="bg-transparent outline-none px-2 py-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="border border-[#73946B] text-[#73946B] px-4 py-1 rounded hover:bg-[#73946B] hover:text-white transition">
          Search
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <img
              src={issue.image}
              alt=""
              className="h-40 w-full object-cover"
            />

            <div className="p-4">
              <p className={`text-sm font-semibold ${getStatusColor(issue.status)}`}>
                {issue.status}
              </p>

              <h2 className="text-lg font-bold mt-1 text-[#537D5D]">
                {issue.title}
              </h2>

              <p className="text-gray-600 text-sm">
                {issue.description}
              </p>

              <div className="flex justify-between text-xs text-gray-500 mt-3">
                <span>📍 {issue.location}</span>
                <span>📅 {issue.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;