import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";

const socket = io("https://chat-app-back-tau.vercel.app/"); // Connect to backend

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(""); // Store user ID

  useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id); // Store unique socket ID
      console.log("Connected with ID:", socket.id);
    });

    socket.on("receiveMessage", (msg) => {
      console.log("Received message:", msg); // Debugging
      setMessages((prev) => [...prev, msg]); 
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const myMessage = { text: message, sender: myId };
      socket.emit("sendMessage", myMessage); // Send message to server
      setMessages((prev) => [...prev, myMessage]); // Show instantly
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Chat App</h2>
      <div className="chat-box">
        {messages.length === 0 ? (
          <p>No messages yet</p> // Show this if empty
        ) : (
          messages.map((msg, index) => (
            <p
              key={index}
              className={`chat-message ${msg.sender === myId ? "sent" : "received"}`}
            >
              {msg.text}
            </p>
          ))
        )}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;
