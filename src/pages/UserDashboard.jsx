import React, { useState, useEffect } from "react";
import { Search, X, Heart } from "lucide-react";
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
  const [sort, setSort] = useState("latest");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [commentText, setCommentText] = useState("");

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000";

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/reports/${selectedIssue._id}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ text: commentText }),
        }
      );
      const updated = await res.json();
      setSelectedIssue(updated);
      setIssues((prev) => prev.map((item) => item._id === updated._id ? updated : item));
      setCommentText("");
    } catch (err) { console.log(err); }
  };

  const handleCommentLike = async (commentId) => {
    const token = localStorage.getItem("token");

    // optimistic toggle
    const toggle = (issue) => ({
      ...issue,
      comments: issue.comments.map((c) => {
        if (c._id !== commentId) return c;
        const alreadyLiked = c.likes?.some((id) => id.toString() === userId?.toString());
        return {
          ...c,
          likes: alreadyLiked
            ? c.likes.filter((id) => id.toString() !== userId?.toString())
            : [...(c.likes || []), userId],
        };
      }),
    });

    setSelectedIssue((prev) => toggle(prev));
    setIssues((prev) => prev.map((item) => item._id === selectedIssue._id ? toggle(item) : item));

    try {
      await fetch(
        `http://localhost:5000/api/reports/${selectedIssue._id}/comment/${commentId}/like`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/reports", {
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

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sort === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === "24h") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "7d") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  }).filter((item) => {
    const now = new Date();
    const diff = (now - new Date(item.createdAt)) / (1000 * 60 * 60);
    if (sort === "24h") return diff <= 24;
    if (sort === "7d") return diff <= 168;
    return true;
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

          <select onChange={(e) => setCity(e.target.value)} className="border px-3 py-2 rounded-md">
            <option value="">City</option>
            {[...new Set(issues.map((i) => i.city).filter(Boolean))].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select onChange={(e) => setSort(e.target.value)} className="border px-3 py-2 rounded-md">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
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
          {sortedIssues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={{
                ...issue,
                image: issue.media?.[0]
                  ? `${BASE_URL}${issue.media[0].url.replace("http://localhost:5000", "")}`
                  : "/placeholder.jpg",
              }}
              setSelectedIssue={setSelectedIssue}
              setIssues={setIssues}
            />
          ))}
        </div>

        {selectedIssue && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-[900px] h-[520px] rounded-xl flex overflow-hidden relative">

              <button onClick={() => setSelectedIssue(null)} className="absolute top-3 right-3 text-gray-500">
                <X size={20} />
              </button>

              {/* IMAGE */}
              <div className="w-1/2 bg-black">
                <img src={selectedIssue.image} className="w-full h-full object-cover" />
              </div>

              {/* RIGHT */}
              <div className="w-1/2 flex flex-col">

                {/* USER */}
                <div className="flex items-center gap-2 p-4 border-b">
                  <div className="w-8 h-8 bg-[#537D5D] text-white rounded-full flex items-center justify-center text-sm">
                    {selectedIssue.displayName?.charAt(0)}
                  </div>
                  <p className="font-semibold">{selectedIssue.displayName}</p>
                </div>

                {/* DETAILS */}
                <div className="p-4 border-b text-sm">
                  <p className="font-semibold">{selectedIssue.title}</p>
                  <p className="text-gray-600 mt-1">{selectedIssue.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    📍 {selectedIssue.city} •{" "}
                    {new Date(selectedIssue.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* AUTHORITY */}
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-semibold text-[#537D5D]">🏛️ Assigned Authority</p>
                  {selectedIssue.assignedAuthority ? (
                    <p className="text-sm text-gray-700 mt-1">
                      {selectedIssue.assignedAuthority.name} — {selectedIssue.assignedAuthority.type} ({selectedIssue.assignedAuthority.jurisdiction})
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm mt-1">No authority assigned yet for {selectedIssue.city}</p>
                  )}
                  {selectedIssue.authorityComment && (
                    <p className="text-sm text-gray-600 mt-1 italic">"{selectedIssue.authorityComment}"</p>
                  )}
                </div>

                {/* COMMENTS */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selectedIssue.comments?.length > 0 ? (
                    selectedIssue.comments.map((c) => {
                      const isLiked = c.likes?.some((id) => id.toString() === userId);
                      return (
                        <div key={c._id} className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-semibold mr-2">{c.displayName}</span>
                            {c.text}
                          </div>
                          <button onClick={() => handleCommentLike(c._id)} className="flex items-center gap-1">
                            <Heart size={16} className={`${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
                            <span className="text-xs text-gray-600">{c.likes?.length || 0}</span>
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-sm">No comments yet</p>
                  )}
                </div>

                {/* INPUT */}
                <div className="border-t p-3">
                  <p className="text-sm font-semibold mb-2">{selectedIssue.likes?.length || 0} likes</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 border rounded-md px-3 py-2 text-sm outline-none"
                    />
                    <button onClick={handleComment} className="text-[#537D5D] font-semibold">Post</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;