import React, { useState, useEffect } from 'react';
import Login from './Login'
import Home from './Home'
import { SPOTIFY_REDIRECT_URI, getTokenFromResponse } from './Auth';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken, selectToken } from './slices/token';

function App() {
  const accessToken = useSelector(selectToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      const access_token = await getTokenFromResponse();
      await dispatch(setAccessToken(String(access_token) || ""))
    }
    
    if (window.location.href.split("?")[0] === SPOTIFY_REDIRECT_URI && !accessToken) {
      getToken();
    }
  }, []);

  return (
    <>
      {(accessToken == '') ? <Login /> : <Home />}
      {/* {<Home />} */}
      <p className='copyright'>
        Made with Spotify API.
        Made by <a href='https://github.com/rayzhou4' target='_blank'>Ray Zhou</a>, 2023.
      </p>
    </>
  );
}

export default App;