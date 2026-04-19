import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import UserNavbar from "../components/UserNavbar";
import IssueCard from "../components/IssueCard";

const AssignedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [responseText, setResponseText] = useState("");
  const [responseImage, setResponseImage] = useState(null);

  const BASE_URL = "http://localhost:5000";

  // 🔥 GET LOGGED USER
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/reports/assigned/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setIssues(data.reports || []))
      .catch(err => console.log(err));
  }, []);

  // 🔥 SUBMIT RESPONSE
  const handleResponseSubmit = async () => {
    if (!responseText || !responseImage) {
      alert("Response text and image are required");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("text", responseText);
    formData.append("image", responseImage);

    try {
      const res = await fetch(
        `http://localhost:5000/api/reports/${selectedIssue._id}/respond`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.json();
        alert(error.message);
        return;
        }

        const data = await res.json();

            // ✅ update popup
            setSelectedIssue(data.report);

            // ✅ update cards also
            setIssues((prev) =>
            prev.map((item) =>
                item._id === data.report._id ? data.report : item
            )
            );

      setIssues(prev =>
        prev.map(i =>
          i._id === data.report._id ? data.report : i
        )
      );

      setResponseText("");
      setResponseImage(null);

      console.log("API RESPONSE:", data);

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 CHECK AUTHORITY MATCH
  const isAssignedAuthority =
    user?.authorityId ===
    selectedIssue?.assignedAuthority?._id?.toString();

  return (
    <div className="bg-[#F8F9F4] min-h-screen">
      <UserNavbar />

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Assigned Issues
        </h2>

        {issues.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No assigned issues yet 🚀
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {issues.map(issue => (
              <IssueCard
                key={issue._id}
                issue={{
                  ...issue,
                  image: `${BASE_URL}${issue.media?.[0]?.url?.replace(
                    "https://civicearth.onrender.com",
                    ""
                  )}`,
                }}
                setIssues={setIssues}
                setSelectedIssue={setSelectedIssue}
                isAuthority={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* 🔥 POPUP */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white w-[900px] h-[520px] rounded-xl flex overflow-hidden relative">

            <button
              onClick={() => setSelectedIssue(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              <X size={20} />
            </button>

            {/* IMAGE */}
            <div className="w-1/2 bg-black">
              <img
                src={selectedIssue.image}
                alt="report"
                className="w-full h-full object-cover"
              />
            </div>

            {/* RIGHT */}
            <div className="w-1/2 flex flex-col overflow-y-auto">

              {/* USER */}
              <div className="flex items-center gap-2 p-4 border-b">
                <div className="w-8 h-8 bg-[#537D5D] text-white rounded-full flex items-center justify-center text-sm">
                  {selectedIssue.displayName?.charAt(0)}
                </div>
                <p className="font-semibold">
                  {selectedIssue.displayName}
                </p>
              </div>

              {/* DETAILS */}
              <div className="p-4 border-b text-sm">
                <p className="font-semibold">
                  {selectedIssue.title}
                </p>

                <p className="text-gray-600 mt-1">
                  {selectedIssue.description}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  📍 {selectedIssue.city} •{" "}
                  {new Date(selectedIssue.createdAt).toLocaleDateString()}
                </p>

                {selectedIssue.escalated && selectedIssue.assignedAuthority && (
                  <p className="text-purple-700 mt-2">
                    Escalated To:{" "}
                    <span className="font-semibold">
                      {selectedIssue.assignedAuthority.name}
                    </span>
                  </p>
                )}
              </div>

              {/* STATUS */}
              <div className="p-4 text-sm border-b">
                <p>
                  Status: <b>{selectedIssue.status}</b>
                </p>
              </div>

              {/* ✅ SHOW RESPONSE */}
              {selectedIssue.response && selectedIssue.response.images?.length > 0 ? (
                <div className="p-4 border-b">
                  <p className="font-semibold">Authority Response</p>
                  <p className="text-sm mt-1">
                    {selectedIssue.response.text}
                  </p>
                  {selectedIssue.response?.images?.[0] && (
                    <img
                        src={selectedIssue.response.images[0]}
                        className="w-full h-40 object-cover mt-2 rounded"
                    />
                    )}
                </div>
              ) : (
                /* ✅ SHOW ONLY FOR CORRECT AUTHORITY */
                isAssignedAuthority && (
                  <div className="p-4">
                    <p className="font-semibold mb-2">Add Response</p>

                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Describe action taken..."
                      className="w-full border rounded p-2 text-sm mb-2"
                    />

                    <input
                      type="file"
                      onChange={(e) => setResponseImage(e.target.files[0])}
                      className="mb-2"
                    />

                    <button
                      onClick={handleResponseSubmit}
                      className="bg-[#537D5D] text-white px-4 py-2 rounded"
                    >
                      Submit Response
                    </button>
                  </div>
                )
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;