import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowOutwardSharpIcon from '@mui/icons-material/ArrowOutwardSharp';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js'
import Box from '@mui/material/Box';
import checkLive from './checkLive.js'


function Landing ( {
    isActive,
    performAnalysis
  } ) {
  
    const [ streamer, setStreamer ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ validate, setValidate ] = useState(true);
    const [ errorStr, setErrorStr ] = useState("");
  
    const analyze = () => {
      setLoading(true);

      // Empty input
      if( streamer === "" ) {
        setValidate(false);
        setErrorStr("Streamer cannot be empty");
        setLoading(false);
        return;
      }
      
      // Check if streamer is live
      (async () => {
        let isLive = await checkLive(streamer);
        console.log(`isLive: ${isLive}`)
        if( isLive !== 1 ) {
          if( isLive === 0 ) setErrorStr(`${streamer} is not live`);
          else if( isLive === 2) setErrorStr(`Please try again`);
          else setErrorStr(`User does not exist`);
          setValidate(false);
          setLoading(false);
        }
        else {
          setValidate(true);
          setErrorStr("");
          performAnalysis(streamer);
          setStreamer("");
          setLoading(false);
        }
      })()
    };
  
    return (
      <div>
        {isActive ? (
          <ThemeProvider theme={theme}>
            <Box 
              minHeight="98vh"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h2">
                <Box sx={{ letterSpacing: 4, pb: 5}}>Streamer Sentiment</Box>
              </Typography>
              <Typography variant="h7">
                <Box sx={{ letterSpacing: 3, pb: 5, pr: 3, pl: 3}} maxWidth="50vh">Perform sentiment analysis on your favorite Twitch streamer</Box>
              </Typography>
              <Box
                display="flex"
                flexDirection={{xs: "column", sm: "row"}}
                alignItems="center"
                justifyContent="center"
              >
                <Box sx={{ pr: 3, pb: 3 }}>
                  <TextField
                    sx={{width: { xs: 200, md: 350 }}}
                    error={!validate}
                    label={errorStr}
                    variant="outlined" 
                    onKeyDown={ (e) => { if( e.key === 'Enter' ) analyze(); }} 
                    type="text" 
                    placeholder="Streamer" 
                    value={streamer} 
                    onChange={ (e) => setStreamer(e.target.value)} 
                  />
                </Box>
                <Box sx={{ pr: 3, pb: 3 }}>
                  <LoadingButton
                    color="primary"
                    onClick={analyze}
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<ArrowOutwardSharpIcon />}
                    variant="contained"
                    size="large"
                  > <span>Analyze</span>
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </ThemeProvider>
        ) : (
          <></>
        )}
      </div>
    );
}

export default Landing;