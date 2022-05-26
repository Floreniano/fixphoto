import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

// components
import Popup from 'reactjs-popup';
import ModalPrompt from 'components/ModalPrompt';

// assets
import closePicture from 'assets/img/close-popup.png';
import deleteImg from 'assets/img/delete.png';
import editImg from 'assets/img/edit.png';

//redux
import { dataFiltersObjects } from 'redux/actions/projectFilters';
import { useDispatch } from 'react-redux';

import { request } from 'request';
export default function ProjectItem({ object, onDelete }) {
  const [buttons, setButtons] = useState(false);
  const dispatch = useDispatch();
  const deleteHandlerClick = () => {
    onDelete(object.id);
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

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [contract, setContract] = useState('');
  const [count, setCount] = useState(1);

  const [open, setOpen] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalText, setModalText] = useState('');
  const [error, setError] = useState('');

  const editHandler = (object) => {
    setOpen(true);
    setName(object.name);
    setAddress(object.address);
    setCode(object.code);
    setContract(object.contract);
    setCount(object.count);
  };

  const closeModal = () => setOpen(false);
  const saveHandler = (id) => {
    if (
      name.length > 0 &&
      address.length > 0 &&
      code.length > 0 &&
      contract.length > 0 &&
      count > 0
    ) {
      const attributes = {};
      request(`facility/${id}`, 'PUT', { address, attributes, code, contract, count, name }).then(
        () => dispatch(dataFiltersObjects()),
      );
      setName('');
      setAddress('');
      setCode('');
      setContract('');
      setCount(1);
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
      <td className='table-item-name'>{object.name}</td>
      <td className='table-item-text key'>{object.code}</td>
      <td className='table-item-text type'>{object.address}</td>
      <td className='info'>
        <div className={buttons ? 'info_buttons' : 'info_buttons none'} ref={buttonsRef}>
          <button className='info_buttons-delete back' onClick={deleteHandlerClick}>
            <img className='info_buttons-delete-img' src={deleteImg} alt='delete'></img>
          </button>
          <button className='info_buttons-edit' onClick={() => editHandler(object)}>
            <img className='info_buttons-edit-img' src={editImg} alt='edit'></img>
          </button>
          <Popup className='popup_object' open={open} closeOnDocumentClick onClose={closeModal}>
            <div className='popup'>
              <button className='closed' onClick={closeModal}>
                <img src={closePicture} alt='close'></img>
              </button>
              <h2 className='popup_object-title'>Текущий объект</h2>
              <div className='object_create'>
                <div className='object_create-item'>
                  <input
                    className='object_create-input'
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                  <label className='object_create-label'>Имя</label>
                </div>
                <div className='object_create-item'>
                  <input
                    className='object_create-input'
                    type='text'
                    onChange={(e) => setContract(e.target.value)}
                    value={contract}
                    required
                  />
                  <label className='object_create-label'>Адрес</label>
                </div>
                <div className='object_create-item'>
                  <input
                    className='object_create-input'
                    type='text'
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    required
                  />
                  <label className='object_create-label'>Код объекта</label>
                </div>
                <div className='object_create-item'>
                  <input
                    className='object_create-input'
                    type='text'
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                    required
                  />
                  <label className='object_create-label'>Договор</label>
                </div>
                <div className='object_create-item'>
                  <input
                    className='object_create-input'
                    type='text'
                    onChange={(e) => setCount(e.target.value)}
                    value={count}
                    required
                  />
                  <label className='object_create-label'>Количество</label>
                </div>
                <button
                  className={classNames('btn', {
                    disabled:
                      Number(count) < 0 ||
                      name.length <= 0 ||
                      address.length <= 0 ||
                      code.length <= 0 ||
                      contract.length <= 0,
                  })}
                  disabled={
                    Number(count) < 0 ||
                    name.length <= 0 ||
                    address.length <= 0 ||
                    code.length <= 0 ||
                    contract.length <= 0
                  }
                  onClick={() => saveHandler(object.id)}
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
