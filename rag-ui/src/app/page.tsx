"use client";

import { useState, useEffect } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ type: string; message: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); // optional if backend lists uploaded files

  // Handle chat
  const sendMessage = async () => {
    const userMsg = input.trim();
    if (!userMsg) return;

    setChat([...chat, { type: "user", message: userMsg }]);
    setInput("");

    const res = await fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userMsg }),
    });

    const data = await res.json();
    setChat((prev) => [...prev, { type: "ai", message: data.response }]);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadStatus("");
    } else {
      setUploadStatus("Please select a valid PDF.");
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
        setUploadedFiles((prev) => [...prev, selectedFile.name]);
        setSelectedFile(null);
      } else {
        setUploadStatus("Upload failed.");
      }
    } catch (err) {
      setUploadStatus("Error uploading file.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">RAG Assistant</h2>

      {/* Chat UI */}
      <div className="space-y-2 mb-2 max-h-[60vh] overflow-y-auto border p-4 rounded bg-gray-100">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.type === "user" ? "bg-blue-400" : "bg-green-400"
            }`}
          >
            <strong>{msg.type === "user" ? "You" : "AI"}:</strong>{" "}
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border px-4 py-2 rounded"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>

      <hr className="my-6" />

      {/* Upload UI */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Upload a PDF</h3>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-green-600 text-white rounded"
          disabled={!selectedFile}
        >
          Upload
        </button>
        <p className="text-sm text-gray-700">{uploadStatus}</p>
      </div>

      {/* Optional: Show uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Uploaded Files:</h4>
          <ul className="list-disc list-inside">
            {uploadedFiles.map((file, i) => (
              <li key={i}>{file}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
