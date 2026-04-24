import React, { useState, useEffect } from "react";
import { Search, X, Heart, MapPin, Clock, CheckCircle, XCircle, PlayCircle, MessageCircle } from "lucide-react";
import UserNavbar from "../components/UserNavbar";
import IssueCard from "../components/IssueCard";
import API_BASE from "../utils/api";

const STATUS_CONFIG = {
  submitted: { label: "Submitted", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  assigned: { label: "Assigned", bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  in_progress: { label: "In Progress", bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  resolved: { label: "Resolved", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

const PRIORITY_CONFIG = {
  high: { bg: "bg-red-100", text: "text-red-700" },
  medium: { bg: "bg-orange-100", text: "text-orange-700" },
  low: { bg: "bg-green-100", text: "text-green-700" },
};

const AuthorityDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);

  
  const user = JSON.parse(localStorage.getItem("user"));
  const isAssignedAuthority =
  selectedIssue?.assignedAuthority?._id === user?.authorityId ||
  selectedIssue?.assignedAuthority === user?.authorityId;
  const userId = user?.id || user?._id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/api/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setIssues(data.reports || []))
      .catch((err) => console.log(err));
  }, []);

  const updateStatus = async (newStatus) => {
    if (selectedIssue.response?.images?.length > 0) return;

    let authorityComment = "";
    if (newStatus === "rejected") {
      authorityComment = window.prompt("Enter a reason for rejection:");
      if (!authorityComment || !authorityComment.trim()) return;
    }

    setActionLoading(newStatus);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/reports/${selectedIssue._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, authorityComment }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...selectedIssue, status: newStatus };
        setSelectedIssue(updated);
        setIssues((prev) =>
          prev.map((i) => (i._id === selectedIssue._id ? { ...i, status: newStatus } : i))
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
    setActionLoading(null);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/reports/${selectedIssue._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      const updated = await res.json();
      setSelectedIssue({ ...updated, image: selectedIssue.image });
      setIssues((prev) =>
        prev.map((i) => (i._id === updated._id ? { ...updated, image: selectedIssue.image } : i))
      );
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
    setCommentLoading(false);
  };
  const handleResponseSubmit = async () => {
  if (!commentText.trim()) return;

  setCommentLoading(true);
  const token = localStorage.getItem("token");

  try {
    const formData = new FormData();
    formData.append("text", commentText);

    
    const res = await fetch(
     `${API_BASE}/api/reports/${selectedIssue._id}/response`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (res.ok) {
      setSelectedIssue({ ...data.report, image: selectedIssue.image });
      setIssues((prev) =>
        prev.map((i) =>
          i._id === data.report._id ? { ...data.report, image: selectedIssue.image } : i
        )
      );
      setCommentText("");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }

  setCommentLoading(false);
};

  const getDeadlineInfo = (issue) => {
    const categoryDeadlines = { water: 1, garbage: 2, road: 3, air: 2, noise: 2, other: 4 };
    const days = categoryDeadlines[issue.category] || 4;
    const deadline = issue.deadline
      ? new Date(issue.deadline)
      : new Date(new Date(issue.createdAt).getTime() + days * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    return { deadline, daysLeft };
  };

  const filteredIssues = issues.filter((item) => {
    const matchSearch = item.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? item.category === category : true;
    const matchStatus = status ? item.status === status : true;
    return matchSearch && matchCategory && matchStatus;
  });

  const isResolved = selectedIssue?.response?.images?.length > 0 || selectedIssue?.status === "resolved" || selectedIssue?.status === "rejected";

  return (
    <div className="bg-[#F8F9F4] min-h-screen text-[#537D5D]">
      <UserNavbar />

      <div className="max-w-6xl mx-auto px-6 mt-6">

        <h2 className="text-xl font-semibold mb-4">Assigned Issues</h2>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 outline-none"
          >
            <option value="">All Categories</option>
            <option value="garbage">Garbage</option>
            <option value="water">Water</option>
            <option value="road">Road</option>
            <option value="air">Air</option>
            <option value="noise">Noise</option>
            <option value="other">Other</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="flex items-center bg-gray-50 px-3 rounded-lg border border-gray-200 flex-1 min-w-[200px]">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              className="px-2 py-2 outline-none bg-transparent text-sm flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <span className="text-sm text-gray-400 ml-auto">{filteredIssues.length} issues</span>
        </div>

        {/* CARDS */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-lg font-medium">No issues found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                // issue={{
                //   ...issue,
                //   image: issue.media?.[0]
                //   ? issue.media[0].url.startsWith("http")
                //     ? issue.media[0].url
                //     : `${API_BASE}${issue.media[0].url}`
                //   : "/placeholder.jpg",
                // }}
                setSelectedIssue={setSelectedIssue}
                setIssues={setIssues}
                isAuthority={true}
              />
            ))}
          </div>
        )}

        {/* POPUP */}
        {selectedIssue && (() => {
          const statusCfg = STATUS_CONFIG[selectedIssue.status] || STATUS_CONFIG.submitted;
          const priorityCfg = PRIORITY_CONFIG[selectedIssue.priority] || PRIORITY_CONFIG.low;
          const { deadline, daysLeft } = getDeadlineInfo(selectedIssue);
          const deadlineColor = daysLeft < 0 ? "text-red-500" : daysLeft <= 1 ? "text-orange-500" : "text-green-600";
          const deadlineLabel = daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)}d` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`;

          return (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={(e) => { if (e.target === e.currentTarget) { setSelectedIssue(null); setCommentText(""); } }}
            >
              <div className="bg-white w-full max-w-[960px] max-h-[90vh] rounded-2xl flex overflow-hidden shadow-2xl relative">

                {/* CLOSE */}
                <button
                  onClick={() => { setSelectedIssue(null); setCommentText(""); }}
                  className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition"
                >
                  <X size={18} className="text-gray-600" />
                </button>

                {/* LEFT — IMAGE + OVERLAY INFO */}
                <div className="w-[45%] relative flex-shrink-0">
                 <img
                    src={
                      selectedIssue.image?.includes("localhost")
                        ? selectedIssue.image.replace("http://localhost:5000", API_BASE)
                        : selectedIssue.image
                    }
                    className="w-full h-full object-cover"
                    alt="issue"
                  />
                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* bottom overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusCfg.bg} ${statusCfg.text} flex items-center gap-1`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityCfg.bg} ${priorityCfg.text}`}>
                        {selectedIssue.priority} priority
                      </span>
                      {selectedIssue.escalated && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                          🔺 Escalated
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-lg leading-tight drop-shadow">{selectedIssue.title}</p>
                    <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
                      <MapPin size={11} /> {selectedIssue.city} • {selectedIssue.area}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex-1 flex flex-col overflow-hidden">

                  {/* REPORTER */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b bg-gray-50">
                    <div className="w-9 h-9 bg-[#537D5D] text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {selectedIssue.displayName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800">{selectedIssue.displayName}</p>
                      <p className="text-xs text-gray-400">{new Date(selectedIssue.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    {selectedIssue.assignedAuthority && (
                      <span className="text-xs bg-[#537D5D]/10 text-[#537D5D] px-2 py-1 rounded-full font-medium truncate max-w-[140px]">
                        🏛️ {selectedIssue.assignedAuthority.name}
                      </span>
                    )}
                  </div>


                  {/* DESCRIPTION + DEADLINE */}
                  <div className="px-5 py-3 border-b">
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedIssue.description}</p>
                    <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${deadlineColor}`}>
                      <Clock size={12} />
                      Deadline: {deadline.toLocaleDateString()} — {deadlineLabel}
                    </div>
                  </div>

                  {/* RESPONSE */}
            {selectedIssue.response?.text && (
              <div className="px-5 py-3 border-b bg-green-50">
                <p className="text-xs font-semibold text-green-700 mb-1">
                  Authority Response
                </p>
                <p className="text-sm text-gray-700">
                  {selectedIssue.response.text}
                </p>
              </div>
            )}

            {/* PROOF */}
            {selectedIssue.response?.images?.length > 0 && (
              <div className="px-5 py-3 border-b">
                <p className="text-xs font-semibold mb-2">Proof</p>
                <div className="flex gap-2">
                  {selectedIssue.response.images.map((img, i) => (
                    <img key={i} src={img} className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
              </div>
            )}

                  {/* ACTION BUTTONS */}
                  {isAssignedAuthority && (
                    (selectedIssue?.status === "resolved" || selectedIssue?.status === "rejected") ? (
                      <div className="px-5 py-3 border-b bg-green-50 flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <p className="text-sm text-green-700 font-medium">
                          {selectedIssue.status === "rejected" ? "This issue has been rejected." : "This issue has been resolved."}
                        </p>
                      </div>
                    ) : (
                      <div className="px-5 py-3 border-b bg-gray-50">
                        <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Update Status</p>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            disabled={actionLoading !== null || selectedIssue.status === "in_progress"}
                            onClick={() => updateStatus("in_progress")}
                            className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <PlayCircle size={14} />
                            {actionLoading === "in_progress" ? "Starting..." : "Start"}
                          </button>
                          <button
                            disabled={actionLoading !== null || selectedIssue.status === "rejected"}
                            onClick={() => updateStatus("rejected")}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <XCircle size={14} />
                            {actionLoading === "rejected" ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      </div>
                    )
                  )}
                

                  {/* COMMENTS */}
                  <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1">
                      <MessageCircle size={12} /> Comments ({selectedIssue.comments?.length || 0})
                    </p>
                    {selectedIssue.comments?.length > 0 ? (
                      selectedIssue.comments.map((c) => (
                        <div key={c._id} className="flex gap-2 items-start">
                          <div className="w-7 h-7 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {c.displayName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                            <p className="text-xs font-semibold text-gray-700">{c.displayName}</p>
                            <p className="text-sm text-gray-600 mt-0.5">{c.text}</p>
                          </div>
                          <div className="flex items-center gap-0.5 pt-2">
                            <Heart size={12} className={c.likes?.some((id) => id.toString() === userId) ? "text-red-500 fill-red-500" : "text-gray-300"} />
                            <span className="text-xs text-gray-400">{c.likes?.length || 0}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-4">No comments yet</p>
                    )}
                  </div>

                  {/* COMMENT INPUT */}
                  {selectedIssue?.status === "in_progress" &&
                  isAssignedAuthority && (

                    <div className="border-t px-5 py-3 bg-white">
                      <div className="flex gap-2 items-center">
                        <div className="w-7 h-7 bg-[#537D5D] text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {user?.displayName?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleComment()}
                          placeholder="Add resolution details..."
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#537D5D] transition"
                        />

                        <button
                          onClick={handleResponseSubmit}
                          disabled={commentLoading || !commentText.trim()}
                          className="px-4 py-2 bg-[#537D5D] hover:bg-[#3f6147] text-white rounded-full text-sm font-semibold transition disabled:opacity-40"
                        >
                          {commentLoading ? "..." : "Post"}
                        </button>
                      </div>
                    </div>

                  )}

                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default AuthorityDashboard;
