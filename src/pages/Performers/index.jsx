import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
// components
import Header from 'components/Header';
import Popup from 'reactjs-popup';
import PerformerItem from './components/PerformerItem';
import ModalPrompt from 'components/ModalPrompt';

// assets
import closePicture from 'assets/img/close-popup.png';

import { request } from 'request';

function ObjectPage() {
  const [performers, setPerformers] = useState([]);
  const [valueSearch, setValueSearch] = useState('');

  // Создание исполнителя
  const [description, setDescription] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [open, setOpen] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalText, setModalText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    request('performers', 'GET').then((data) => setPerformers(data));
  }, []);

  const closeModal = () => setOpen(false);
  const saveHandler = () => {
    if (
      description.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      login.length > 0 &&
      password.length > 0 &&
      repeatPassword === password
    ) {
      request('performers', 'POST', { description, firstName, lastName, login, password }).then(
        (data) => {
          if (data !== undefined) {
            setModalText('Ошибка, введены некорректные значения');
            setError('error');
            setModalActive(true);
            setTimeout(() => {
              setModalActive(false);
            }, 1500);
            return;
          } else {
            request('performers', 'GET').then((data) => {
              setPerformers(data);
            });
          }
        },
      );
      setDescription('');
      setFirstName('');
      setLastName('');
      setLogin('');
      setPassword('');
      setRepeatPassword('');

      setModalText('Исполнитель сохранен');
      setError('');
      setModalActive(true);
      setTimeout(() => {
        setModalActive(false);
      }, 1500);
    } else {
      setModalText('Ошибка, введены некорректные значения');
      setError('error');
      setModalActive(true);
      setTimeout(() => {
        setModalActive(false);
      }, 1500);
    }
  };

  const deleteHandler = (id) => {
    request(`performers/${id}`, 'DELETE').then(() =>
      request('performers', 'GET').then((data) => {
        setPerformers(data);
      }),
    );
  };

  const menuSearchRef = useRef();

  // Поиск
  let searchPerformers = [];
  if (Array.isArray(performers))
    searchPerformers = performers.filter(
      (performer) =>
        performer.firstName.toLowerCase().includes(valueSearch.toLowerCase()) ||
        performer.lastName.toLowerCase().includes(valueSearch.toLowerCase()),
    );

  return (
    <section className='performers'>
      <Header />
      <div className='projects__content'>
        <div className='projects__top'>
          <h1 className='title'>Исполнители</h1>
          <div className='projects__top-right'>
            <button className='btn create-post' onClick={() => setOpen((e) => !e)}>
              Создать исполнителя
            </button>
            <Popup className='popup_object' open={open} closeOnDocumentClick onClose={closeModal}>
              <div className='popup'>
                <button className='closed' onClick={closeModal}>
                  <img src={closePicture} alt='close'></img>
                </button>
                <h2 className='popup_object-title'>Новый исполнитель</h2>
                <div className='object_create'>
                  <div className='object_create-item'>
                    <input
                      className='object_create-input'
                      type='text'
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
                      required
                    />
                    <label className='object_create-label'>Имя</label>
                  </div>
                  <div className='object_create-item'>
                    <input
                      className='object_create-input'
                      type='text'
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName}
                      required
                    />
                    <label className='object_create-label'>Фамилия</label>
                  </div>
                  <div className='object_create-item'>
                    <input
                      className='object_create-input'
                      type='text'
                      onChange={(e) => setLogin(e.target.value)}
                      value={login}
                      required
                    />
                    <label className='object_create-label'>Логин</label>
                  </div>
                  <div className='object_create-item'>
                    <input
                      className='object_create-input'
                      type='password'
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                    <label className='object_create-label'>Пароль</label>
                  </div>
                  <div className='object_create-item'>
                    <input
                      className='object_create-input'
                      type='password'
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      value={repeatPassword}
                      required
                    />
                    <label className='object_create-label'>Повторите пароль</label>
                  </div>
                  <div className='object_create-item'>
                    <input
                      className='object_create-input'
                      type='text'
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      required
                    />
                    <label className='object_create-label'>Описание</label>
                  </div>
                  <button
                    className={classNames('btn', {
                      disabled:
                        firstName.length <= 0 ||
                        lastName.length <= 0 ||
                        login.length <= 0 ||
                        password.length <= 0 ||
                        repeatPassword.length <= 0 ||
                        description.length <= 0,
                    })}
                    disabled={
                      firstName.length <= 0 ||
                      lastName.length <= 0 ||
                      login.length <= 0 ||
                      password.length <= 0 ||
                      repeatPassword.length <= 0 ||
                      description.length <= 0
                    }
                    onClick={saveHandler}
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </Popup>
          </div>
        </div>

        <div className='filters'>
          <div className='search' ref={menuSearchRef}>
            <input
              className='input search-input'
              onChange={(e) => setValueSearch(e.target.value)}
              value={valueSearch}
              type='text'
              placeholder='Поиск'
            />
            <div className='search-icons'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M10.9573 10.0566L13.584 12.73C13.7017 12.8572 13.7652 13.0252 13.7611 13.1984C13.757 13.3716 13.6857 13.5364 13.5622 13.6579C13.4387 13.7795 13.2727 13.8481 13.0994 13.8494C12.9262 13.8506 12.7592 13.7844 12.634 13.6646L10.0087 10.994C8.99569 11.7571 7.73058 12.1067 6.46951 11.9721C5.20843 11.8375 4.04562 11.2287 3.21653 10.269C2.38744 9.30933 1.95403 8.07042 2.00405 6.80317C2.05406 5.53592 2.58378 4.33503 3.48593 3.44365C4.38808 2.55228 5.59526 2.03703 6.86302 2.00225C8.13078 1.96746 9.36439 2.41574 10.3141 3.2563C11.2637 4.09687 11.8585 5.26691 11.9779 6.52951C12.0974 7.79211 11.7325 9.05292 10.9573 10.0566ZM6.99999 10.6666C7.97245 10.6666 8.90508 10.2803 9.59271 9.5927C10.2803 8.90507 10.6667 7.97244 10.6667 6.99998C10.6667 6.02752 10.2803 5.09489 9.59271 4.40725C8.90508 3.71962 7.97245 3.33331 6.99999 3.33331C6.02753 3.33331 5.0949 3.71962 4.40726 4.40725C3.71963 5.09489 3.33332 6.02752 3.33332 6.99998C3.33332 7.97244 3.71963 8.90507 4.40726 9.5927C5.0949 10.2803 6.02753 10.6666 6.99999 10.6666Z'
                  fill='black'
                />
              </svg>
            </div>
          </div>
        </div>
        {searchPerformers.length !== 0 ? (
          <div className='table-scroll'>
            <table className='table'>
              <thead>
                <tr>
                  <th className='table-title table-name'>ФИО</th>
                  <th className='table-title table-login'>Логин</th>
                  <th className='table-title table-info'></th>
                </tr>
              </thead>
              <tbody>
                {searchPerformers.map((performerItem, index) => (
                  <PerformerItem
                    key={index}
                    performer={performerItem}
                    onDelete={deleteHandler}
                    login={performerItem.login}
                    password={performerItem.password}
                    setPerformers={setPerformers}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='not-found'>Нет результатов</div>
        )}
      </div>
      <ModalPrompt modalActive={modalActive} text={modalText} error={error} />
    </section>
  );
}

export default ObjectPage;
