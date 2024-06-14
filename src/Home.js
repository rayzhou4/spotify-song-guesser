import React, { useEffect, useState } from 'react';
import Typewriter from './components/Typewriter';
import Game from './Game';
import { useSelector } from 'react-redux';
import { selectToken } from './slices/token';
import './App.css';



function Home() {
    const [active, setActive] = useState(false);
    const accessToken = useSelector(selectToken);  

    useEffect(() => {
        console.log(accessToken);
    });

    async function getTracks(id) {
        // Get request using search to get Album Tracks
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }

        var returnedTracks = await fetch(`https://api.spotify.com/v1/playlists/${id}`, searchParameters)
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
                <div className='App-header'>
                    <div className='vertical-container' style={{ paddingBottom: '50px' }}>
                        <h2 className='game-title'>
                            <Typewriter text="SPOTIFYGUESSER.IO" delay={100} />
                        </h2>
                    </div>
                    <div className='vertical-container'>
                        <h4 style={{ marginBottom: 0 }}>How to Play</h4>
                        <h4 style={{ width: '60%', textAlign: 'center', paddingBottom: '50px' }}>
                            You will be given TEN songs in the genre of your choice and for each song you 
                            will be given four tries to guess the name of the song. Your total score will counted up
                            in the end.
                        </h4>
                    </div>
                    <div className='vertical-container'>
                        <h4 style={{ marginBottom: '10px' }}>CHOOSE YOUR GENRE</h4>
                        <div className='container' style={{ paddingBottom: '50px' }}>
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
            <><Game /></>
        )
    }
}

export default Home;