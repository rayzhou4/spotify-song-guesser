import React, { useEffect } from 'react';
import './App.css';
import { LOGIN_URL } from './Auth';

function Login() {  
    return (
        <div className="App">
            <header className="App-header">
                <a className="btn-spotify" href={LOGIN_URL}>
                    Login with Spotify
                </a>
            </header>
        </div>
    );
}

export default Login;
