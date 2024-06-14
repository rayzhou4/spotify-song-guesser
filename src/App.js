import React, { useState, useEffect } from 'react';
import Login from './Login'
import Home from './Home'
import { getTokenFromResponse } from './Auth';
import './App.css';

function App() {

  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const access_token = await getTokenFromResponse();
      setToken(access_token);
    }
    if (window.location.href.split("?")[0] == "http://localhost:3000/callback") getToken();
  });

  return (
    <>
      {(token === '') ? <Login /> : <Home />}
      {/* {<Home />} */}
      <p className='copyright'>
        Made with Spotify API.
        Made by <a href='https://github.com/rayzhou4' target='_blank'>Ray Zhou</a>, 2023.
      </p>
    </>
  );
}

export default App;