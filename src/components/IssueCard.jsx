import React from "react";
import { Heart } from "lucide-react";

const IssueCard = ({ issue, setSelectedIssue, setIssues }) => {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?.id || user?._id;

  const isLiked = userId
    ? issue.likes?.some((id) => id.toString() === userId.toString()) || false
    : false;

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

  return (
    <div className="bg-white rounded-xl shadow p-4">

      {/* USER */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-[#537D5D] text-white rounded-full flex items-center justify-center text-sm">
          {issue.displayName?.charAt(0) || "U"}
        </div>
        <p className="text-sm font-semibold">{issue.displayName}</p>
      </div>

      {/* IMAGE */}
      <img
        src={issue.image || "/placeholder.jpg"}
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

      {/* ACTIONS */}
      <div className="flex gap-4 mt-3 text-sm">

        {/* ❤️ LIKE */}
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

          <span className="text-gray-700">
            {issue.likes?.length || 0}
          </span>
        </button>

        {/* 💬 COMMENT */}
        <button
          onClick={() => setSelectedIssue(issue)}
          className="text-gray-500"
        >
          Comment
        </button>

        {/* 📢 RESPOND */}
        <button className="text-gray-500">
          Respond
        </button>

      </div>

      
      
    </div>
  );
};

export default IssueCard;