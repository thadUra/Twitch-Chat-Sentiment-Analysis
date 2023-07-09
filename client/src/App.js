import './App.css';
import io from 'socket.io-client'
import { useEffect } from 'react';

const socket = io.connect("http://localhost:3001"); 

function App() {

  const getSentiment = () => {
    socket.emit("send_message", {message: "hello!"});
  };

  useEffect(() => {
    socket.on("receive_sentiment", (data) => {
      alert(`Received ${data.message}`);
    });
  }, [socket] );

  return (
    <div className="App">
      <input placeholder="Streamer" />
      <button onClick={getSentiment}>Get Sentiment</button>
    </div>
  );
}

export default App;

// import React, { useState, useEffect } from "react";
// import "./App.css";

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:8000/message")
//       .then((res) => res.json())
//       .then((data) => setMessage(data.message));
//   }, []);

//   return (
//     <div className="App">
//       <h1>{message}</h1>
//     </div>
//   );
// }

// export default App