import React from 'react';

// assets
import logo from 'assets/img/arlabs.png';

export default function LoginFooter() {
  return (
    <footer className='footer__login'>
      <div className='logo'>
        <img className='logo-icon footer' src={logo} alt='logo' />
      </div>
      <p className='description description-footer'>Реализация программных решений для бизнеса</p>
    </footer>
  );
}
