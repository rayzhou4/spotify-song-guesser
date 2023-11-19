import React, { useState, useEffect } from 'react';
import Login from './Login'
import Home from './Home'
import './App.css';

function App() {

  const [token, setToken] = useState("");

  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <>
      {/* {(token === '') ? <Login /> : <Home />} */}
      {<Home />}
      <p className='copyright'>
        Made with Spotify API.
        Made by <a href='https://github.com/rayzhou4' target='_blank'>Ray Zhou</a>, 2023.
      </p>
    </>
  );
}

export default App;