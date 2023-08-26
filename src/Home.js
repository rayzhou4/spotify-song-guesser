import React, { useEffect, useState } from 'react';
import Typewriter from './components/Typewriter';
import Game from './Game';
import './App.css';


function Home() {
    const [access_token, setToken] = useState("");
    const [active, setActive] = useState(false);

    // var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
    // var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

    useEffect(() => {

        async function getToken() {
            const response = await fetch('/auth/token');
            const json = await response.json();
            setToken(json.access_token);
        }

        getToken();
    });

    async function getTracks(id) {
        // Get request using search to get Album Tracks
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }

        var returnedTracks = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, searchParameters)
            .then(response => response.json())
            .then(data => {
                const jsonString = JSON.stringify(data);
                sessionStorage.setItem('tracks', jsonString);
                console.log('JSON data stored in session storage.');
            })
    }

    if (!active) {
        return (
            <>
                <div className='Home'>
                    <div className='main-container'>
                        <div className='container'>
                            <h2 style={{ width: 350, textAlign: 'center' }}>
                                <Typewriter text="WELCOME TO SPOTIFY GUESSER GAME" delay={100} />
                            </h2>
                        </div>
                        <div className='container'>
                            <h4 style={{ textAlign: 'center' }}>
                                You will be given TEN songs in the genre of your choice and for each song you will be given four tries to guess each song. Your total score will counted up in the end.
                            </h4>
                        </div>
                        <div className='container'>
                            <p>CHOOSE YOUR GENRE</p>
                        </div>
                        <div className='container'>
                            <button
                                className="btn-spotify"
                                onClick={() => {
                                    getTracks('37i9dQZF1DX7FY5ma9162x')
                                    setActive(true)
                                }}
                            >
                                r&b
                            </button>
                            <button
                                className="btn-spotify"
                                onClick={() => {
                                    getTracks('37i9dQZF1DWU2jh5S7FvXl')
                                    setActive(true)
                                }}
                            >
                                edm
                            </button>
                            <button
                                className="btn-spotify"
                                onClick={() => {
                                    getTracks('37i9dQZF1DXcOFePJj4Rgb')
                                    setActive(true)
                                }}
                            >
                                pop
                            </button>
                            <button
                                className="btn-spotify"
                                onClick={() => {
                                    getTracks('37i9dQZF1DX48TTZL62Yht')
                                    setActive(true)
                                }}
                            >
                                rap
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <><Game token={access_token} /></>
        )
    }
}

export default Home;