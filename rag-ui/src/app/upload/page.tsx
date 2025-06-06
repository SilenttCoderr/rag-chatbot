"use client";

import React, { useState } from "react";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      setUploadStatus("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadStatus(data.message);
        setSelectedFile(null);
      } else {
        setUploadStatus("Upload failed: " + data.detail);
      }
    } catch (err) {
      console.error(err);
      setUploadStatus("Something went wrong while uploading.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Upload PDF to RAG</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={!selectedFile}
      >
        Upload
      </button>
      <p className="mt-4 text-green-600">{uploadStatus}</p>
    </div>
  );
}


