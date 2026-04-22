import React from "react";
import { Heart } from "lucide-react";

const IssueCard = ({ issue, setSelectedIssue, setIssues, isAuthority }) => {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?.id || user?._id;

  const isLiked = userId
    ? issue.likes?.some((id) => id.toString() === userId.toString()) || false
    : false;

  // ================= LIKE =================
  const handleLike = async () => {
    if (!userId) return;
    try {
      setIssues((prev) =>
        prev.map((item) =>
          item._id === issue._id
            ? {
                ...item,
                likes: isLiked
                  ? item.likes.filter((id) => id.toString() !== userId.toString())
                  : [...(item.likes || []), userId],
              }
            : item
        )
      );

      await fetch(`http://localhost:5000/api/reports/${issue._id}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

    } catch (err) {
      console.error(err);
    }
  };

  // ================= STATUS UPDATE =================
 const updateStatus = async (newStatus) => {
  // 🔒 BLOCK if already responded
  if (issue.response?.images?.length > 0) {
    alert("This issue is already resolved and cannot be modified");
    return;
  }

  try {
    await fetch(
      `http://localhost:5000/api/reports/${issue._id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    setIssues((prev) =>
      prev.map((item) =>
        item._id === issue._id
          ? { ...item, status: newStatus }
          : item
      )
    );

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="bg-white rounded-xl shadow p-4">

      {/* USER */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-[#537D5D] text-white rounded-full flex items-center justify-center text-sm">
          {issue.displayName?.charAt(0) || "U"}
        </div>
        <p className="text-sm font-semibold truncate">
          {issue.displayName}
        </p>
      </div>

      {/* IMAGE */}
      <img
        src={
          issue.image && issue.image !== "http://localhost:5000undefined"
            ? issue.image
            : "https://via.placeholder.com/400"
        }
        alt="report"
        className="w-full h-40 object-cover rounded-lg mb-2"
      />

      {/* TITLE */}
      <h3 className="font-semibold text-lg">{issue.title}</h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-600">
        {issue.description?.slice(0, 60)}...
        <span
          onClick={() => setSelectedIssue(issue)}
          className="text-[#537D5D] cursor-pointer ml-1"
        >
          more
        </span>
      </p>

      {/* 🔥 RESPONSE PREVIEW */}
      {issue.response && issue.response.images?.length > 0 && (
      <div className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded">
        ✔ Authority Responded
        <p className="text-gray-600 mt-1 truncate">
          {issue.response.text}
        </p>
      </div>
    )}

    {issue.response?.images?.length > 0 && (
      <span className="text-xs px-2 py-1 rounded bg-green-200 text-green-800 mt-1 inline-block">
        ✔ Resolved with Proof
      </span>
    )}

      {/* LOCATION */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>📍 {issue.city}</span>
        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
      </div>

      {/* DEADLINE */}
      {(() => {
        const categoryDeadlines = { water: 1, garbage: 2, road: 3, air: 2, noise: 2, other: 4 };
        const days = categoryDeadlines[issue.category] || 4;
        const deadline = issue.deadline
          ? new Date(issue.deadline)
          : new Date(new Date(issue.createdAt).getTime() + days * 24 * 60 * 60 * 1000);
        const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
        const color = daysLeft < 0 ? "text-red-500" : daysLeft <= 1 ? "text-orange-500" : "text-green-600";
        const label = daysLeft < 0 ? "Overdue" : daysLeft === 0 ? "Due today" : `${daysLeft}d left`;
        return (
          <div className={`text-xs font-medium mt-1 ${color}`}>
            ⏰ Deadline: {deadline.toLocaleDateString()} ({label})
          </div>
        );
      })()}

      {/* AUTHORITY */}
      <div className="text-xs mt-1">
        {issue.assignedAuthority ? (
          <span className="text-[#537D5D] font-medium">
            🏛️ {issue.assignedAuthority.name} ({issue.assignedAuthority.type})
          </span>
        ) : (
          <span className="text-gray-400">🏛️ No authority assigned yet</span>
        )}
      </div>

      {/* STATUS + PRIORITY */}
      <div className="flex justify-between items-center mt-2 flex-wrap gap-1">


        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {issue.status}
        </span>

        <span className={`text-xs px-2 py-1 rounded ${
          issue.priority === "high"
            ? "bg-red-100 text-red-700"
            : issue.priority === "medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}>
          {issue.priority}
        </span>

        {issue.escalated && (
          <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
            Escalated
          </span>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-4 mt-3 text-sm items-center flex-wrap">

        {/* USER ACTIONS */}
        {!isAuthority && (
          <>
            <button
              onClick={handleLike}
              className="flex items-center gap-1"
            >
              <Heart
                size={18}
                className={`transition ${
                  isLiked
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400"
                }`}
              />
              <span>{issue.likes?.length || 0}</span>
            </button>

            <button
              onClick={() => setSelectedIssue(issue)}
              className="text-gray-500"
            >
              Comment
            </button>
          </>
        )}

        {/* AUTHORITY ACTIONS */}
        {isAuthority && !(issue.response?.images?.length > 0) && (
        <div className="flex gap-2 mt-2 flex-wrap">

            <button
              onClick={() => updateStatus("in_progress")}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
            >
              Start
            </button>

            <button
              onClick={() => updateStatus("resolved")}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
            >
              Resolve
            </button>

            <button
              onClick={() => updateStatus("rejected")}
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs"
            >
              Reject
            </button>

          </div>
        )}
      </div>

    </div>
  );
};

export default IssueCard;