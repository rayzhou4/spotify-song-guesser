import React, { useState } from 'react';

function InputComponent(props) {
    const onSubmit = () => { props.onSubmit() };
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
        gameInfo.userInput = userInput;
        onSubmit();
        setUserInput("");
    };

    return (
        <div className='container-input'>
            <input
                style={{ borderRadius: '4px' }}
                type="text" value={userInput} placeholder='Enter Song Name'
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSubmit} className="btn-spotify-small" >Enter</button>
        </div>
    );
}

export default InputComponent;