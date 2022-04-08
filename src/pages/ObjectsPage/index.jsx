import React, { useState, useEffect, useRef } from 'react';
// components
import Header from 'components/Header';
import ObjectItem from './components/ObjectItem';
import Popup from 'reactjs-popup';

// assets
import closePicture from 'assets/img/close-popup.png';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { dataFiltersObjects } from 'redux/actions/projectFilters';

import { request } from 'request';
import ModalPrompt from 'components/ModalPrompt';

function ObjectPage() {
  const { projectFiltersObject } = useSelector(({ projectFiltersObject }) => {
    return {
      projectFiltersObject: projectFiltersObject.projectObject,
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dataFiltersObjects());
  }, [dispatch]);

  const [objects, setObjects] = useState([]);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [valueSearch, setValueSearch] = useState('');

  // Создание объекта
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [contract, setContract] = useState('');
  const [count, setCount] = useState(1);

  const [open, setOpen] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalText, setModalText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setObjects(projectFiltersObject);
  }, [projectFiltersObject]);

  const closeModal = () => setOpen(false);
  const saveHandler = () => {
    if (
      name.length > 0 &&
      address.length > 0 &&
      code.length > 0 &&
      contract.length > 0 &&
      count > 0
    ) {
      const attributes = {};
      request('facility', 'POST', { address, attributes, code, contract, count, name }).then(() =>
        dispatch(dataFiltersObjects()),
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

  const deleteHandler = (id) => {
    request(`facility/${id}`, 'DELETE').then(() => dispatch(dataFiltersObjects()));
  };
  // const firstRender = useRef(true);
  // useEffect(() => {
  // if (firstRender.current) {
  //   firstRender.current = false;
  //   return;
  // }
  // let filterProjects = [];
  // let allFilters = Array.from(document.querySelectorAll('.types__list-input'));
  // let counter = 0;
  // for (let i = 0; i < allFilters.length; i++) {
  //   const currentType = allFilters[i];
  //   if (currentType.checked === true) {
  //     for (let j = 0; j < dataProjects.length; j++) {
  //       const projectsItem = dataProjects[j];
  //       if (projectsItem.type === currentType.parentElement.innerText) {
  //         filterProjects.push(projectsItem);
  //       }
  //     }
  //   }
  //   if (currentType.checked === false) {
  //     counter++;
  //   }
  // }
  // setObjects(filterProjects);
  // if (counter === projectFiltersObject.length) {
  //   setObjects(projectFiltersObject);
  // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [listFilters]);

  // Клик вне элмента
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

  const menuSearchRef = useRef();
  useOnClickOutside(menuSearchRef, () => setOpenAutocomplete(false));

  // Поиск
  const searchClickHandler = (e) => {
    setValueSearch(e.target.textContent);
    setOpenAutocomplete(!openAutocomplete);
  };
  const autocompleteClickHandler = () => {
    setOpenAutocomplete(true);
  };

  const searchObjects = objects.filter(
    (project) =>
      project.name.toLowerCase().includes(valueSearch.toLowerCase()) ||
      project.code.toLowerCase().includes(valueSearch.toLowerCase()),
  );

  return (
    <section className='objects'>
      <Header />
      <div className='projects__content'>
        <div className='projects__top'>
          <h1 className='title'>Объекты</h1>
          <div className='projects__top-right'>
            <button className='btn create-post' onClick={() => setOpen((o) => !o)}>
              Создать объект
            </button>
            <Popup className='popup_object' open={open} closeOnDocumentClick onClose={closeModal}>
              <div className='popup'>
                <button className='closed' onClick={closeModal}>
                  <img src={closePicture} alt='close'></img>
                </button>
                <h2 className='popup_object-title'>Новый объект</h2>
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
                  <button className='btn' onClick={saveHandler}>
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
              onClick={autocompleteClickHandler}
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
            <ul className='search__autocomplete'>
              {valueSearch && openAutocomplete
                ? searchObjects.map((objectItem, index) => (
                    <li
                      key={index}
                      className='search__autocomplete-item'
                      onClick={searchClickHandler}
                    >
                      {objectItem.name}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        {searchObjects.length !== 0 ? (
          <div className='table-scroll'>
            <table className='table'>
              <thead>
                <tr>
                  <th className='table-title table-name'>Имя объекта</th>
                  <th className='table-title table-key'>Код объекта</th>
                  <th className='table-title table-type'>Адрес</th>
                  <th className='table-title table-info'></th>
                </tr>
              </thead>
              <tbody>
                {searchObjects.map((objectItem, index) => (
                  <ObjectItem key={index} object={objectItem} onDelete={deleteHandler} />
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
