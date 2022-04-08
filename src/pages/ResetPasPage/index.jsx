import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// components
import LoginFooter from 'components/FooterLogin';
import LoginHeader from 'components/HeaderLogin';

// assets

class ResetPasPage extends Component {
  render() {
    return (
      <section className='resetPas'>
        <div className='container container-login'>
          <LoginHeader />
          <div className='registration-content'>
            <form className='form' method='POST'>
              <h1 className='sign-text registration'>Возникли сложности со входом?</h1>
              <p className='help'>Мы отправим вам ссылку для воостановления </p>
              <input
                className='input form-input'
                id='email'
                name='email'
                type='email'
                placeholder='Адрес эдрес электронной почты'
                required
              />
              <button className='btn btn-reset'>Отправить ссылку для восстановления</button>
              <ul className='form__bottom'>
                <li className='form__bottom-item'>
                  <Link className='form__bottom-link blue underline' to='/signIn'>
                    Не удается войти в <br></br> систему?
                  </Link>
                </li>
                <li className='form__bottom-item'>
                  <Link className='form__bottom-link blue underline' to='/signUp'>
                    Регистрация <br></br> аккаунта
                  </Link>
                </li>
              </ul>
            </form>
          </div>
          <LoginFooter />
        </div>
      </section>
    );
  }
}

export default ResetPasPage;
