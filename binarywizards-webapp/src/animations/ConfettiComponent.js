import React from 'react';
import Confetti from 'react-confetti';

const ConfettiComponent = ({ width, height }) => {
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={200}
      gravity={0.5}
      recycle={false}
      run={true}
    />
  );
};

export default ConfettiComponent;