import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import API_BASE from "../utils/api";



const IssueCard = ({ issue, setSelectedIssue, setIssues, isAuthority }) => {

  const [showPopup, setShowPopup] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localIssue, setLocalIssue] = useState(issue);

  useEffect(() => {
  setLocalIssue(issue);
}, [issue]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?.id || user?._id;

  const isLiked = userId
    ? localIssue.likes?.some((id) => id.toString() === userId.toString()) || false
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

      await fetch(`${API_BASE}/api/reports/${issue._id}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

    } catch (err) {
      console.error(err);
    }
  };

  // ================= STATUS UPDATE =================
  const updateStatus = async (newStatus) => {
    if (localIssue.response?.images?.length > 0) {
      alert("This issue is already resolved and cannot be modified");
      return;
    }

    try {
      await fetch(
        `${API_BASE}/api/reports/${issue._id}/status`,
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

const handleComment = async () => {
  if (!commentText.trim()) return;

  try {
    const res = await fetch(
      `${API_BASE}/api/reports/${issue._id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      }
    );

    const updatedReport = await res.json();

    // 🔥 UPDATE LOCAL POPUP STATE
    setLocalIssue(updatedReport);

    // 🔥 UPDATE LIST
    setIssues((prev) =>
      prev.map((item) =>
        item._id === updatedReport._id ? updatedReport : item
      )
    );

    setCommentText("");
  } catch (err) {
    console.error(err);
  }
};
const [likeLoading, setLikeLoading] = useState(false);
const handleCommentLike = async (commentId) => {
  if (likeLoading) return;
  setLikeLoading(true);

  // 🔥 HARD BLOCK DOUBLE CALL
  // document.body.style.pointerEvents = "none";

  try {
    const res = await fetch(
      `${API_BASE}/api/reports/${localIssue._id}/comment/${commentId}/like`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const updated = await res.json();

    setLocalIssue(updated);

    setIssues((prev) =>
      prev.map((item) =>
        item._id === updated._id ? updated : item
      )
    );

  } catch (err) {
    console.log(err);
  }

  document.body.style.pointerEvents = "auto";
  setLikeLoading(false);
};
  return (
    <div
        className="bg-white rounded-xl shadow p-4 cursor-pointer"
        onClick={() => {
          if (isAuthority && setSelectedIssue) {
            setSelectedIssue(issue);   // ✅ authority popup
          } else {
            setShowPopup(true);        // ✅ user popup
          }
        }}
      >

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
          issue.image
            ? issue.image.startsWith("http")
              ? issue.image
              : `${import.meta.env.VITE_API_URL}${issue.image}`
            : "https://via.placeholder.com/400"
        }
      />

      {/* TITLE */}
      <h3 className="font-semibold text-lg">{issue.title}</h3>

      {/* CATEGORY BADGE */}
      <span className={`inline-block mt-1 px-2 py-1 rounded text-white text-xs font-semibold
        ${
          issue.category === "garbage" ? "bg-red-500" :
          issue.category === "water" ? "bg-blue-500" :
          issue.category === "road" ? "bg-yellow-500" :
          issue.category === "air" ? "bg-gray-600" :
          issue.category === "noise" ? "bg-purple-500" :
          "bg-black"
        }`}>
        {issue.category || "other"}
      </span>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-600">
        {issue.description?.slice(0, 60)}...
        <span
         onClick={(e) => {
            e.stopPropagation();

            if (isAuthority && setSelectedIssue) {
              setSelectedIssue(issue);
            } else {
              setShowPopup(true);
            }
          }}
          
          className="text-[#537D5D] cursor-pointer ml-1"
        >
          more
        </span>
      </p>


      {/* RESPONSE PREVIEW */}
      {localIssue.response && localIssue.response.images?.length > 0 && (
        <div className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded">
          ✔ Authority Responded
          <p className="text-gray-600 mt-1 truncate">
            {localIssue.response.text}
          </p>
        </div>
      )}

      {localIssue.response?.images?.length > 0 && (
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
          {localIssue.status}
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

      {/* ACTIONS */}
      <div className="flex gap-4 mt-3 text-sm items-center flex-wrap">

        {!isAuthority && (
          <>
            <button onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }} className="flex items-center gap-1">
              <Heart
                size={18}
                className={`transition ${
                  isLiked
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400"
                }`}
              />
              <span>{localIssue.likes?.length || 0}</span>
            </button>

            <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPopup(true);
                  }}
                >
                  Comment
                </button>

            

          </>
        )}

        {isAuthority && !(localIssue.response?.images?.length > 0) && (
          <div className="flex gap-2 mt-2 flex-wrap">
            <button
              onClick={() => updateStatus("in_progress")}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
            >
              Start
            </button>

            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                updateStatus("resolved");
              }}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
            >
              Resolve
            </button> */}

            <button
              onClick={() => updateStatus("rejected")}
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs"
            >
              Reject
            </button>
          </div>
        )}
      </div>
      {showPopup && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white w-[900px] h-[520px] rounded-xl flex overflow-hidden relative">

      {/* CLOSE */}
      <button
        onClick={(e) => {
          e.stopPropagation();   // 🔥 IMPORTANT
          setShowPopup(false);
        }}
        className="absolute top-3 right-5 z-50 bg-white rounded-full p-1 shadow"
      >
        ✕
      </button>

      {/* IMAGE */}
      <div className="w-1/2 bg-black">
        <img
          src={issue.media?.[0]?.url}
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT */}
      <div className="w-1/2 flex flex-col overflow-y-auto">

        {/* USER */}
        <div className="flex items-center gap-2 p-4 border-b">
          <div className="w-8 h-8 bg-[#537D5D] text-white rounded-full flex items-center justify-center text-sm">
            {issue.displayName?.charAt(0)}
          </div>
          <p className="font-semibold">{issue.displayName}</p>
        </div>

        {/* DETAILS */}
        <div className="p-4 border-b text-sm">
          <p className="font-semibold">{issue.title}</p>
          <p className="text-gray-600 mt-1">{issue.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            📍 {issue.city}
          </p>
        </div>

        {/* STATUS */}
        <div className="p-4 text-sm border-b">
          Status: <b>{localIssue.status}</b>
        </div>

        {/* RESPONSE */}
        <div className="p-4 border-b">
          <p className="font-semibold">Authority Response</p>

          {localIssue.response?.text ? (
            <>
              <p className="text-sm mt-1">
                {localIssue.response.text}
              </p>

              {localIssue.response.images?.[0] && (
                <img
                  src={localIssue.response.images[0]}
                  className="w-full h-40 object-cover mt-2 rounded"
                />
              )}
            </>
          ) : (
            <p className="text-gray-400 text-sm mt-1">
              No response yet
            </p>
          )}
        </div>

        {/* COMMENTS */}
        <div className="p-4 border-b space-y-3">
          <p className="text-xs text-gray-400 font-medium uppercase">
            Comments ({localIssue.comments?.length || 0})
          </p>

          {localIssue.comments?.length > 0 ? (
            localIssue.comments.map((c) => {
              const isLiked = c.likes?.some(
                (id) => id.toString() === userId
              );

              return (
                <div key={c._id} className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-semibold mr-2">
                      {c.displayName}
                    </span>
                    {c.text}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCommentLike(c._id);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Heart
                      size={16}
                      className={
                        isLiked
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }
                    />
                    <span className="text-xs text-gray-600">
                      {c.likes?.length || 0}
                    </span>
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm">No comments yet</p>
          )}
        </div>

        {/* COMMENT INPUT */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border rounded-md px-3 py-2 text-sm"
            />
            <button
              onClick={handleComment}
              className="text-[#537D5D] font-semibold"
            >
              Post
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default IssueCard;