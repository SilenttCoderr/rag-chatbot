// pages/index.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:8000/query', { query: input });
      const aiMessage = { sender: 'ai', content: res.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>AI RAG Assistant</h1>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask your question..."
        style={{ width: '70%', padding: '0.5rem' }}
      />
      <button onClick={sendMessage} style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}>
        Send
      </button>
    </div>
  );
}
