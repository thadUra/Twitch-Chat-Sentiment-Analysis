import './styles/App.css'
import { useState } from 'react'
import io from 'socket.io-client'
import Landing from './components/Landing.js'
import Connection from './components/Connection.js'
import Analysis from './components/Analysis.js'

function App() {

  const [ activePage, setActivePage ] = useState(0);
  const [ streamer, setStreamer ] = useState('');
  const [ direction, setDirection ] = useState('landing');
  const [ socket, setSocket ] = useState(
    io(`${process.env.REACT_APP_BACKEND}`, {
      autoConnect:false,
      reconnection:false
    })
  );

  return (
    <div className="App">
      <Landing
        isActive = { activePage === 0 } 
        performAnalysis = { (data) => {
            setStreamer(data);
            setDirection('analyze');
            setActivePage(1);
          } 
        }
      ></Landing>
      <Connection
        isActive = { activePage === 1 }
        direction= { direction }
        goBack = { () => {
            setSocket(
              io('http://localhost:3001', {
                autoConnect:false,
                reconnection:false
              })
            );
            setDirection('landing');
            setActivePage(0);
          }
        }
        performAnalysis = { (data) => {
            setSocket(data);
            setActivePage(2); 
          }
        }
        socket = { socket }
      ></Connection>
      <Analysis
        isActive = { activePage === 2}
        streamer = { streamer }
        socket = { socket }
        goBack = { () => {
            setActivePage(1);
            setDirection('landing');
          }
        }
      ></Analysis>
    </div>
  );
}

export default App;