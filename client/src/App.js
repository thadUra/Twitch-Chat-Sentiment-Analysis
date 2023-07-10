import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001"); 

function App() {

  // States
  const [ streamer, setStreamer ] = useState("");


  // Emit Messages
  const analyze = (event) => {
    event.preventDefault();
    socket.emit("analyze", {streamer: `${streamer}`});
  }

  // useEffect(() => {
  //   socket.on("new_msg", (data) => {
  //     console.log(`Received ${data.text}`);
  //   });
  // });

  return (
    <div className="App">
      <form onSubmit={analyze}>
        <input type="text" placeholder="Streamer" value={streamer} onChange={(e) => setStreamer(e.target.value)} />
        <button type="submit">Analyze</button>
      </form>
    </div>
  );
}

export default App;