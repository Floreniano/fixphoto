import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
// components
import Popup from 'reactjs-popup';
import ModalPrompt from 'components/ModalPrompt';

// assets
import closePicture from 'assets/img/close-popup.png';
import deleteImg from 'assets/img/delete.png';
import editImg from 'assets/img/edit.png';

import { request } from 'request';
export default function ProjectItem({ performer, onDelete, login, password, setPerformers }) {
  const [buttons, setButtons] = useState(false);
  const deleteHandlerClick = () => {
    onDelete(performer.id);
  };
  // Клик вне элемента
  const buttonsRef = useRef();
  const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    }, [ref, handler]);
  };
  useOnClickOutside(buttonsRef, () => setButtons(false));

  // Создание исполнителя
  const [description, setDescription] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [open, setOpen] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalText, setModalText] = useState('');
  const [error, setError] = useState('');

  const editHandler = (performer) => {
    setOpen(true);
    setDescription(performer.description);
    setFirstName(performer.firstName);
    setLastName(performer.lastName);
  };

  const closeModal = () => setOpen(false);
  const saveHandler = () => {
    if (description.length > 0 && firstName.length > 0 && lastName.length > 0) {
      request(`performers/${performer.id}`, 'PUT', {
        description,
        firstName,
        lastName,
        login,
        password,
      }).then(() => {
        request('performers', 'GET').then((data) => {
          setPerformers(data);
        });
      });
      setDescription('');
      setFirstName('');
      setLastName('');

      setOpen(false);
      setModalText('Объект сохранен');
      setError('');
      setModalActive(true);
      setTimeout(() => {
        setModalActive(false);
      }, 1500);
    } else {
      setModalText('Ошибка, заполнены не все поля');
      setError('error');
      setModalActive(true);
      setTimeout(() => {
        setModalActive(false);
      }, 1500);
    }
  };
  return (
    <tr className='table-item'>
      <td className='table-item-name'>{performer.firstName + ' ' + performer.lastName}</td>
      <td className='table-item-text'>{performer.login}</td>
      <td className='info'>
        <div className={buttons ? 'info_buttons' : 'info_buttons none'} ref={buttonsRef}>
          <button className='info_buttons-delete back' onClick={deleteHandlerClick}>
            <img className='info_buttons-delete-img' src={deleteImg} alt='delete'></img>
          </button>
          <button className='info_buttons-edit' onClick={() => editHandler(performer)}>
            <img className='info_buttons-edit-img' src={editImg} alt='edit'></img>
          </button>
          <Popup className='popup_object' open={open} closeOnDocumentClick onClose={closeModal}>
            <div className='popup'>
              <button className='closed' onClick={closeModal}>
                <img src={closePicture} alt='close'></img>
              </button>
              <h2 className='popup_object-title'>Текущий исполнитель</h2>
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
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                  />
                  <label className='object_create-label'>Описание</label>
                </div>
                <button
                  className={classNames('btn', {
                    disabled:
                      firstName.length <= 0 || lastName.length <= 0 || description.length <= 0,
                  })}
                  disabled={
                    firstName.length <= 0 || lastName.length <= 0 || description.length <= 0
                  }
                  onClick={saveHandler}
                >
                  Сохранить
                </button>
              </div>
            </div>
            <ModalPrompt modalActive={modalActive} text={modalText} error={error} />
          </Popup>
        </div>
        <svg
          className='info-btn'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          onClick={() => setButtons(!buttons)}
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z'
            fill='black'
          />
          <path
            d='M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z'
            fill='black'
          />
          <path
            d='M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z'
            fill='black'
          />
        </svg>
      </td>
    </tr>
  );
}
