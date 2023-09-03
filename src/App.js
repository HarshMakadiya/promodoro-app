import { useState } from 'react';
import './App.css';
import Navbar from './components/NavBar/Navbar.jsx';
import PomodoroTimer from './components/PromodoroTimer/PomodoroTimer';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
        <Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>
        <PomodoroTimer isLoggedIn={isLoggedIn}/>
    </div>
  );
}

export default App;
