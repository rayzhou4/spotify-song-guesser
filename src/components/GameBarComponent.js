import React from 'react';

function GameBarComponent(props) {
    const score = props.gameInfo.score;
    const guessCounter = props.gameInfo.guessCounter;
    
    return (
        <h4 className="top-center">Score: {score}/10 | Guesses: {guessCounter}/4</h4>
    )
}

export default GameBarComponent;