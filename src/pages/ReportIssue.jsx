import React, { useState } from "react";

const ReportIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description });
    alert("Issue Reported!");
  };

  return (
    <div className="min-h-screen bg-[#F5F5E6] text-[#537D5D] p-6">
      
      <h1 className="text-2xl font-bold mb-6">Report New Issue</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#73946B]"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#73946B]"
          required
        />

        <button className="bg-[#537D5D] text-[#F5F5E6] px-4 py-2 rounded-md font-semibold hover:bg-[#73946B] transition-all">
          Submit
        </button>
      </form>

    </div>
  );
};

export default ReportIssue;