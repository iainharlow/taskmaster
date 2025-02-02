import React from "react";

const ConversationPane = ({ messages }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginTop: "1rem",
        height: "150px",
        overflowY: "auto",
        backgroundColor: "#f9f9f9"
      }}
    >
      <h3 style={{ marginTop: 0 }}>Conversation History</h3>
      {messages.length === 0 ? (
        <p style={{ color: "#777" }}>No messages yet.</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))
      )}
    </div>
  );
};

export default ConversationPane;