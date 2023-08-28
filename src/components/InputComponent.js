import React, { useState } from 'react';

function InputComponent(props) {
    const songName = props.name;
    const player = props.player;
    const gameInfo = props.gameInfo;

    // Declare a state variable to hold the input value
    const [userInput, setUserInput] = useState("");

    // Event handler function to update the state when input changes
    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    // Event handler function for pressed enter key
    const handleKeyDown = (event) => {
        if (event.key == 'Enter') {
            handleSubmit();
        }
    }

    // Event handler function for the submit button
    const handleSubmit = () => {
        if (userInput.toLowerCase().trim() == songName.toLowerCase().replace(/\(.*\)/g, '').trim()) {
            player.nextTrack();
            gameInfo.guessCounter = 0;
            gameInfo.score++;
        } else {
            gameInfo.guessCounter++;
        }

        if (gameInfo.guessCounter == 4) {
            player.nextTrack();
            gameInfo.guessCounter = 0;
        }

        console.log("score", gameInfo);
        console.log("counter", gameInfo.guessCounter);
    };

    return (
        <div className='container-input'>
            <input
                style={{ borderRadius:'4px' }}
                type="text" value={userInput} placeholder='Enter Song Name'
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button className="btn-spotify-small" onClick={handleSubmit}>Enter</button>
        </div>
    );
}

export default InputComponent;