import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {

    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [btn_pressed, setBtn] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [show_image, setImage] = useState(false)

    // Web Playback SDK object is created
    useEffect(() => {

        console.log('Token:', props.token)
        console.log(is_active)

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK TEST1',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                });
            }));

            player.connect().then(success => {
                if (success) {
                    console.log('Web Playback SDK connected.')
                }
            });

        };
    }, []);

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function playSong() {
        
    }

    if (!is_active) {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        Instance not active. Open your spotify app, and select "Spotify Song Game" as the device you are listening on
                        <button onClick={() => {

                            player.removeListener('ready')
                            player.disconnect()
                            console.log("removed")
                        }}>
                            removeListener</button>
                    </div>
                </div>
            </>
        );
    } else if (!btn_pressed) {
        return (
            <>
                <button onClick={() => {

                    player.removeListener('ready')
                    player.disconnect()
                    console.log("removed")
                }}>
                    removeListener</button>
                <button
                    className="btn-spotify-small"
                    onClick={() => {
                        setBtn(!btn_pressed)

                    }}
                >
                    Click Me to Start
                </button>
            </>
        )

    } else {
        return (
            <>
                <div className="main-container">
                    <button className="btn-spotify-small top-left" onClick={() => { setImage(!show_image) }}>
                        {(!show_image) ? "Hide Cover" : "Show Cover"}
                    </button>
                    <button onClick={() => {

                        player.removeListener('ready')
                        player.disconnect()
                        console.log("removed")
                    }}>
                        removeListener</button>
                    <button onClick={() => player.removeListener('ready')}>removeListener</button>
                    <div className="main-wrapper">
                        {
                            (!show_image) ? <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" /> : ""
                        }
                        {/* <div>
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                {is_paused ? "PLAY" : "PAUSE"}
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                        </div> */}

                    </div>
                    <div className="container-input">
                        <input type="text" placeholder="Guess Song Name" />
                        <button className="btn-spotify-small" id="submitButton">Enter</button>
                    </div>
                </div>
            </>
        )
    }


}

export default WebPlayback