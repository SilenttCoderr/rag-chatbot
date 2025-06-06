// pages/upload.js
import { useState } from 'react';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('Uploading...');
      await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Upload successful!');
    } catch (err) {
      console.error(err);
      setStatus('Upload failed.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload PDF to Embed</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile} style={{ marginLeft: '1rem' }}>Upload</button>
      <p>{status}</p>
    </div>
  );
}
