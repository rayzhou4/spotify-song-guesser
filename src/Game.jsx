import React, { useState, useEffect } from 'react';
import InputComponent from './components/InputComponent';
import Typewriter from './components/Typewriter';
import spotifyCover from './images/spotifyguesser-logo-nobg.png';

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
    guessCounter: 0,
    songCounter: 0,
    userInput: ""
}

function WebPlayback(props) {

    const access_token = props.token;
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [btn_pressed, setBtn] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [show_image, setImage] = useState(true);
    const [device_id, setId] = useState("");
    const [guessCounter, setGuessCounter] = useState(0);
    const [songCounter, setSongCounter] = useState(0);
    const [score, setScore] = useState(0);


    // Web Playback SDK object is created
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'SPOTIFYGUESSER.IO',
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

    const onSubmit = () => {
        if (gameInfo.userInput.toLowerCase().trim() == current_track.name.toLowerCase().replace(/\(.*\)/g, '').trim()) {
            player.nextTrack();
            gameInfo.songCounter++;
            gameInfo.guessCounter = 0;
            gameInfo.score++;
        } else {
            gameInfo.guessCounter++;
        }

        if (gameInfo.guessCounter == 4) {
            player.nextTrack();
            gameInfo.songCounter++;
            gameInfo.guessCounter = 0;
        }

        setSongCounter(gameInfo.songCounter);
        setGuessCounter(gameInfo.guessCounter); // set # of guesses to count using useState
        setScore(gameInfo.score);

        console.log("gameinfo", gameInfo);
    }

    if (!is_active) {
        return (
            <>
                <div className='App-header'>
                    <div className="container">
                        <div style={{ width: '60%', textAlign: 'center' }}>
                            You're almost there! Open your Spotify app, and connect to "SPOTIFYGUESSER.IO"
                            as the device you are listening on.
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (!btn_pressed) {
        player.pause(); // prevents spotify from playing before game starts
        return (
            <>
                <div className='App-header'>
                    <button
                        className="btn-spotify-small"
                        onClick={() => {
                            setBtn(!btn_pressed);
                            startGame();
                        }}
                    >
                        Click Me to Start!
                    </button>
                </div>
            </>
        )

    } else if (songCounter < 10) {
        return (
            <>
                <button className="btn-spotify-small top-left" onClick={() => { setImage(!show_image) }}>
                    {(!show_image) ? "Hide Cover" : "Show Cover"}
                </button>
                <h4 className='top-center'>Score: {score}/10 | Guesses: {guessCounter}/4</h4>
                <button
                    className="btn-spotify-small top-right"
                    onClick={() => {
                        player.nextTrack();
                        gameInfo.songCounter++;
                        setSongCounter(gameInfo.songCounter);
                    }}>
                    Skip
                </button>

                <div className='App-header'>
                    <div className="vertical-container">
                        {
                            (!show_image) ? <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" /> :
                                <img src={spotifyCover} className='now-playing__cover' alt=' ' />
                        }
                        <InputComponent onSubmit={onSubmit} gameInfo={gameInfo} />
                    </div>
                </div>
            </>
        )
    } else {
        player.pause();
        return (
            <>
                <div className='App-header'>
                    <h2 className='hover-text' style={{ width: '80%', textAlign: 'center' }}>
                        <Typewriter text={"Congratulations! Your final score is " + score + "!"} delay={100} />
                    </h2>
                </div>
            </>
        )
    }
}

export default WebPlayback