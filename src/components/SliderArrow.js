import React from 'react';

export default function SliderArrow({ className, to, onClickHandler, icon }) {
  return (
    <button
      type='button'
      onClick={onClickHandler}
      className={`slick-btn ${className}`}
      aria-label={to}
    >
      <img src={icon} alt='arrow'></img>
    </button>
  );
}
