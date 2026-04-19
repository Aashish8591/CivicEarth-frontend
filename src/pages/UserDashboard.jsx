import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import IssueCard from "../components/IssueCard";

const UserDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [time, setTime] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);

  const navigate = useNavigate();
  const BASE_URL = "https://civicearth.onrender.com/";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://civicearth.onrender.com/api/reports", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIssues(data.reports || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredIssues = issues.filter((item) => {
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
    <div className="bg-[#F8F9F4] min-h-screen text-[#537D5D]">
      <UserNavbar />

      <div className="max-w-6xl mx-auto px-6 mt-6">

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap gap-3">

          <select onChange={(e) => setCategory(e.target.value)} className="border px-3 py-2 rounded-md">
            <option value="">Category</option>
            <option value="garbage">Garbage</option>
            <option value="water">Water</option>
            <option value="road">Road</option>
            <option value="air">Air</option>
            <option value="noise">Noise</option>
            <option value="other">Other</option>
          </select>

          <select onChange={(e) => setStatus(e.target.value)} className="border px-3 py-2 rounded-md">
            <option value="">Status</option>
            <option value="submitted">Submitted</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="flex items-center bg-gray-50 px-3 rounded-md border">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search issues..."
              className="px-2 py-1 outline-none bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={{
                ...issue,
                image: issue.media?.[0]
                  ? `${BASE_URL}${issue.media[0].url.replace("https://civicearth.onrender.com/", "")}`
                  : "/placeholder.jpg",
              }}
              setSelectedIssue={setSelectedIssue}
              setIssues={setIssues}
            />
          ))}
        </div>

        {/* POPUP */}
        {/* 🔥 REPLACE ONLY POPUP PART WITH THIS */}

{selectedIssue && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white w-[500px] h-[600px] rounded-xl flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">
          {selectedIssue.title}
        </h2>
      </div>

      {/* IMAGE */}
      <img
        src={selectedIssue.image}
        className="w-full h-52 object-cover"
      />

      {/* COMMENTS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {(selectedIssue.comments || []).map((comment, index) => (
          <div key={index} className="flex justify-between">

            <div>
              <p className="text-sm font-semibold text-[#537D5D]">
                {comment.displayName}
              </p>

              <p className="text-sm text-gray-700">
                {comment.text}
              </p>
            </div>

            <span className="text-xs text-gray-400">
              {comment.likes?.length || 0}
            </span>

          </div>
        ))}

      </div>

      {/* INPUT */}
      <div className="border-t p-3 flex gap-2">

        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border rounded-md px-3 py-2 text-sm outline-none"
        />

        <button className="text-[#537D5D] font-semibold">
          Post
        </button>

      </div>

    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default UserDashboard;