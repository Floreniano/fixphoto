import React, { useState } from 'react';

// components
import LoginFooter from 'components/FooterLogin';
import LoginHeader from 'components/HeaderLogin';
import { request } from 'request';

function AuthorizationPage() {
  const [login, setLogin] = useState('user1');
  const [password, setPassword] = useState('user1p@ssw0rd');

  const authorizationHandler = () => {
    request('auth', 'POST', { login, password }).then((result) => {
      if (result.token !== undefined) {
        window.location.assign('/projects');
        localStorage.setItem('token', result.token);
      }
    });
  };
  return (
    <section className='authorization'>
      <div className='container container-login'>
        <LoginHeader />
        <div className='authorization-content'>
          <div className='form' method='POST'>
            <h1 className='sign-text'>Войдите в свой аккаунт</h1>
            <input
              className='input form-input'
              id='email'
              name='email'
              type='text'
              placeholder='Логин'
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              className='input form-input'
              id='password'
              name='password'
              type='password'
              placeholder='Пароль'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className='btn btn-authorization'
              onClick={authorizationHandler}
              disabled={login.length <= 0 || password.length <= 0}
            >
              Продолжить
            </button>
          </div>
        </div>
        <LoginFooter />
      </div>
    </section>
  );
}

export default AuthorizationPage;
