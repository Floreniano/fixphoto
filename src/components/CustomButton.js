import React from 'react';
import classNames from 'classnames';

export default function CustomButton({ func, src, alt, disabled, eye, innerRef, reporting }) {
  return (
    <button
      className={classNames('custom-button', {
        eye: eye,
        active: reporting,
      })}
      ref={innerRef}
      onClick={func}
      disabled={disabled}
    >
      <img className='custom-button-img' src={src} alt={alt} />
    </button>
  );
}
