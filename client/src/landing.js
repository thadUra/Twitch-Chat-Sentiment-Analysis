import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
            <Typography variant="h2" gutterBottom>Streamer Sentiment</Typography>
            <TextField variant="outlined" onKeyDown={ (e) => { if( e.key === 'Enter' ) analyze(); }} type="text" placeholder="Streamer" value={streamer} onChange={ (e) => setStreamer(e.target.value)} />
            <Button onClick={analyze} variant="contained"> Analyze </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
}

export default Landing;