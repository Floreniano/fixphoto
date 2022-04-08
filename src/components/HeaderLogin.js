import React from 'react';

export default function LoginHeader() {
  return (
    <header className='header__login'>
      <div className='logo'>
        <span className='logo-text'>FixPhoto</span>
      </div>
      <span className='description description-header'>
        Система фотофиксации, контроля и исполнения
      </span>
    </header>
  );
}
