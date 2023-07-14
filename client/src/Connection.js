import { useState, useRef } from 'react'
import 'socket.io-client'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import Button from '@mui/material/Button';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';

/* MAX ATTEMPTS TO TRY CONNECTING TO WEB SOCKET */
const MAX_RECONNECT = 5;
let reconnectAttempt = 0;

function Connection ( {
    isActive,
    direction,
    goBack,
    performAnalysis,
    socket
  }) {
    
    const [ status, setStatus ] = useState("connecting to web socket");
    /**
     *  0 -> Disconnected
     *  1 -> Connected
     *  2 -> Attempting Connection
     */
    const [ connection, setConection ] = useState(2);
    const activeRef = useRef(isActive);
    activeRef.current = isActive;
    
    /* Socket Connection Handlers */
    const connect = () => {
      socket.connect();
      if( socket.connected ) {
        console.log(`Socket ${socket.id} connected...`);
        setConection(1);
        goForwardAnalysis();
      }
      else {
        console.log(`Failed to connect...`);
        retry();
      }
    }
    const retry = () => {
      reconnectAttempt += 1;
      setTimeout(() => { 
        if( activeRef.current ) {
          socket.connect();
          if( socket.connected ) {
            console.log(`Socket ${socket.id} connected from retry...`);
            setConection(1);
            goForwardAnalysis();
          }
          else {
            console.log(`Failed to connect from retry...`);
            if( reconnectAttempt < MAX_RECONNECT ) retry();
            else {
              setConection(0);
              setStatus("failed to connect")
            }
          }
        }
      }, 2500);
    }
    const disconnect = () => {
      if( socket.connected ) {
        console.log(`Socket ${socket.id} disconnected...`);
        socket.disconnect();
      }
      setConection(2);
    };
    const restartConnect = () => {
      setStatus("reattempting connection");
      reconnectAttempt = 0;
      setConection(2);
      connect();
    }

    /* Directional Render Loading Handlers */
    const goBackLanding = () => {
      disconnect();
      reconnectAttempt = 0;
      setTimeout( () => goBack(), 1000);
    };
    const goForwardAnalysis = () => performAnalysis(socket);

    if( direction === 'landing' && connection === 1 ) goBackLanding();
    if( isActive && direction === 'analyze' && connection !== 1 && reconnectAttempt < MAX_RECONNECT) connect();
  
    /* Render */
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
              <Typography variant="h7">
                <Box sx={{ letterSpacing: 3, pb: 2, pr: 3, pl: 3}} maxWidth="50vh">{status}</Box>
              </Typography>
              {connection === 1 ? (
                <></>
              ) : (
                <Box sx={{ p: 3, pb: 10 }}>
                  {connection === 2 ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <Button
                      variant="contained" 
                      onClick={restartConnect} 
                      startIcon={<ReplayIcon />}
                      >Retry
                    </Button>
                  )}
                </Box>
              )}
              <Fab 
                size="medium" 
                color="primary" 
                aria-label="add"
                onClick={goBackLanding}
                ><KeyboardReturnIcon />
              </Fab>
            </Box>
          </ThemeProvider>
        ) : (
          <></>
        )}
      </div>
    );
}

export default Connection;