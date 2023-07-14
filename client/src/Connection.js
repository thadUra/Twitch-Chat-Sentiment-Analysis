import { useState, useRef } from 'react'
import 'socket.io-client'

/* MAX ATTEMPTS TO TRY CONNECTING TO WEB SOCKET */
const MAX_RECONNECT = 10;
let reconnectAttempt = 0;

function Connection ( {
    isActive,
    direction,
    goBack,
    performAnalysis,
    socket
  }) {
    
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
          }
          else {
            console.log(`Failed to connect from retry...`);
            if( reconnectAttempt < MAX_RECONNECT ) retry();
            else setConection(0);
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
      reconnectAttempt = 0;
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
          <div>
            <p>connection status</p>
            {connection === 1 ? (
              <div>
                <p>FULLY CONNECTED!</p>
                <button onClick={goForwardAnalysis}>Perform Analysis</button>
              </div>
            ) : (
              <div>
              {connection === 2 ? (
                <p>SOME LOADING THING HERE</p>
              ) : (
                <button onClick={restartConnect}>Retry Connection</button>
              )}
              </div>
            )}
            <div></div>
            <button onClick={goBackLanding}>Go Back!</button>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
}

export default Connection;