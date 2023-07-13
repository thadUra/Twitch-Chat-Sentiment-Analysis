import { useState } from 'react';

function Landing ( {
    isActive,
    performAnalysis
  } ) {
  
    const [ streamer, setStreamer ] = useState("");
  
    const analyze = () => {
      if(streamer !== "") {
        performAnalysis(streamer);
        setStreamer("");
      }
      // Fetch if live
    };
  
    return (
      <div>
        {isActive ? (
          <div>
            <h1>Streamer Sentiment</h1>
            <input onKeyDown={ (e) => { if( e.key === 'Enter' ) analyze(); }} type="text" placeholder="Streamer" value={streamer} onChange={ (e) => setStreamer(e.target.value)} />
            <button onClick={analyze}> Analyze </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
}

export default Landing;