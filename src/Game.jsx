import React, { useState, useEffect } from 'react';
import InputComponent from './components/InputComponent';
import GameBarComponent from './components/GameBarComponent';

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

const gameInfo = {
    score: 0,
    guessCounter: 0
}

function WebPlayback(props) {

    const access_token = props.token;
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [btn_pressed, setBtn] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [show_image, setImage] = useState(false);
    const [device_id, setId] = useState("");

    // Web Playback SDK object is created
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'SPOTIFY GAME',
                getOAuthToken: cb => { cb(access_token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setId(device_id);
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

    function getPlaylistUri() {
        const playlistString = sessionStorage.getItem('tracks');
        const playlistObject = JSON.parse(playlistString);
        const uri = playlistObject.uri;
        console.log(uri)
        return uri;
    }

    async function startGame() {
        const uri = getPlaylistUri();
        const requestBody = {
            context_uri: uri,
            position_ms: 0
        };

        var options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },
            body: JSON.stringify(requestBody)
        }

        var playedSongs = await fetch("https://api.spotify.com/v1/me/player/play", options)
            .then(() => { console.log("Playback started successfully.") })

        var options = {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }

        var toggleShuffle = await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=true`, options)
            .then(() => { console.log("Toggle Shuffle Playback to true.") })
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
                        setBtn(!btn_pressed);
                        startGame();
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
                    {console.log("BITCH")}
                    <h4 className="top-center">Score: {gameInfo.score}/10 | Guesses: {gameInfo.guessCounter}/4</h4>
                    <button className="btn-spotify-small top-right" onClick={() => { player.nextTrack() }}>Skip</button>
                    <div className="main-wrapper">
                        {
                            (!show_image) ? <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" /> : <img />
                        }
                    </div>
                    <InputComponent gameInfo={gameInfo} player={player} name={current_track.name} />
                </div>
            </>
        )
    }
}

export default WebPlayback