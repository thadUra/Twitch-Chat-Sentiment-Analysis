// import React, { Component, useEffect } from 'react';
// import io from 'socket.io-client'

// const socket = io.connect("http://localhost:3001"); 

// class Landing extends Component {
//     render () {
//         useEffect(() => {
//             socket.on("receive_sentiment", (data) => {
//                 console.log(`Received ${data.message}`);
//             });
//         });
//         return(
//             <div class="landing">
//                 <h1>Twitch Live Sentiment Analysis</h1>
//                 <input placeholder="Streamer" />
//                 <button>Analyze</button>
//             </div>
//         )
//     }

// }

// export default Landing;