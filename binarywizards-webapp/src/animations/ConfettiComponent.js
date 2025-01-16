import React from 'react';
import Confetti from 'react-confetti';

const ConfettiComponent = ({ width, height }) => {
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={400}
      gravity={0.35}
      recycle={false}
      run={true}
    />
  );
};

export default ConfettiComponent;