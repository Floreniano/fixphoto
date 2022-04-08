import React from 'react';

export default function loginItem({img, social}) {
  return (
    <button className='btn-login'>
      <img className='btn-icon' src={img} alt={social} />
      <span className='btn-text'>Войти с помощью {social}</span>
    </button>
  );
}
