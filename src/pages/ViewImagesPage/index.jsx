import React, { useState, useEffect, useRef } from 'react';
import { request } from 'request';

// libs
import classNames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import DateFnsUtils from '@date-io/date-fns';
import ru from 'date-fns/locale/ru';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import dateFormat from 'dateformat';
import Popup from 'reactjs-popup';
import LazyLoad from 'react-lazyload';

// assets
import rotateLeft from 'assets/img/rotateLeft.png';
import rotateRight from 'assets/img/rotateRight.png';
import savePicture from 'assets/img/savePicture.png';
import edit from 'assets/img/edit.png';
import closePicture from 'assets/img/close-popup.png';

// components
import ModalPrompt from 'components/ModalPrompt';
import Preloader from 'components/Preloader';
import CustomButton from 'components/CustomButton';
import CustomPopup from 'components/CustomPopup';
import Header from 'components/Header';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { dataFiltersObjects } from 'redux/actions/projectFilters';
import { clearAddresses, dataAddresses, deleteAddress } from 'redux/actions/projectsAddress';
import { dataFiltersTasks, clearFilterTasks } from 'redux/actions/projectFiltersTasks';

function ViewImagePage() {
  // Объекты и задачи
  const [itemObject, setItemObject] = useState([{ text: '', id: null }]);
  const [itemsTask, setItemsTask] = useState([]);
  const [menuObjectsFilters, setMenuObjectsFilters] = useState(false);
  const [menuTasksFilters, setMenuTasksFilters] = useState(false);
  const [valueSearchObjects, setValueSearchObjects] = useState('');
  const [valueSearchTasks, setValueSearchTasks] = useState('');
  // Картинки
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [loader, setLoader] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [dataPhoto, setDataPhoto] = useState({});
  const [modalText, setModalText] = useState('');

  //Ссылки
  const menuObjectsRef = useRef();
  const menuTasksRef = useRef();

  const searchInputObjects = useRef();
  const searchInputTasks = useRef();

  const tasksRef = useRef();

  const dateTime = useRef();

  const { projectFiltersObject, projectFiltersTasks, projectAddressesData } = useSelector(
    ({ projectFiltersObject, projectFiltersTasks, projectAddresses }) => {
      return {
        projectFiltersObject: projectFiltersObject.projectObject,
        projectFiltersTasks: projectFiltersTasks.projectTasks,
        projectAddressesData: projectAddresses.projectAddresses,
      };
    },
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dataFiltersObjects());
  }, [dispatch]);

  // useEffect(() => {
  //   localStorage.setItem(
  //     'token',
  //     'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMSIsInVzZXJJZCI6MiwidHlwZSI6IlVTRVIiLCJleHAiOjE2NDE4OTc0MTJ9.Lun7fttQo-PK3ummO5XbeLsaI5WWw9uJGiF7U6lEv6DysGGWJ_eeYxHlvSZXsvJmlPix39CLOPjxi3or7rptOw',
  //   );
  // }, []);

  // Фильтры
  const clickObjectsFilterHandler = () => {
    setMenuObjectsFilters(!menuObjectsFilters);
    setTimeout(() => searchInputObjects.current.focus(), 0);
  };

  const clickTasksFilterHandler = () => {
    setMenuTasksFilters(!menuTasksFilters);
    setTimeout(() => searchInputTasks.current.focus(), 0);
  };

  const setObjectHandler = (e, id) => {
    const text = e.target.innerText;
    dispatch(dataFiltersTasks(id));
    setItemObject([{ text, id }]);
    setValueSearchObjects('');
  };

  const deleteFilterHandler = (e) => {
    e.stopPropagation();
    setItemObject([{ text: '', id: null }]);
    setItemsTask([]);
    dispatch(clearFilterTasks());
    setCurrentPhotos([]);
    dispatch(clearAddresses());
    searchInputObjects.current.focus();
  };

  const [heightTasks, setHeightTasks] = useState(35);

  const setTaskHandler = (e, completedTaskId) => {
    const text = e.target.innerText;
    const dublicateTask = itemsTask.find((item) => item.completedTaskId === completedTaskId);
    if (dublicateTask === undefined) {
      setItemsTask((itemsTask) => [...itemsTask, { text, completedTaskId }]);
      dispatch(dataAddresses(completedTaskId));
    }
    setTimeout(() => {
      setHeightTasks(tasksRef.current.offsetHeight + 3);
    }, 1);
    setValueSearchTasks('');
    searchInputObjects.current.focus();
  };

  const deleteTaskHandler = (e, index, completedTaskId) => {
    e.stopPropagation();
    setItemsTask((itemsTask) => itemsTask.filter((value, i) => i !== index));
    setTimeout(() => {
      setHeightTasks(tasksRef.current.offsetHeight + 3);
    }, 1);
    dispatch(deleteAddress(completedTaskId));
    searchInputObjects.current.focus();
    setCurrentPhotos((prevPhotos) =>
      prevPhotos.filter((element) => element.id !== completedTaskId),
    );
  };

  const renderTasks = () => {
    if (searchListTasks.length > 0) {
      return (
        <ul className='types__list info active'>
          {searchListTasks.map((item, index) => (
            <li
              key={index}
              className='types__list-item info'
              onClick={(e) => setTaskHandler(e, item.completedTask[0])}
            >
              {item.description}
            </li>
          ))}
        </ul>
      );
    }
    if (itemObject[0].text === '') return <div className='empty'>Выберите объект</div>;
    return <div className='empty'>Не найдено задач</div>;
  };

  const showImagesHandler = () => {
    setCurrentPhotos(projectAddressesData);
    setLoader(true);
    setTimeout(() => setLoader(false), 1000);
  };

  // Клик вне элемента
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

  useOnClickOutside(menuObjectsRef, () => setMenuObjectsFilters(false));
  useOnClickOutside(menuTasksRef, () => setMenuTasksFilters(false));

  // Работа с фотографиями
  const popupImage = useRef();

  const rotateImage = (rotate) => {
    const currentStyles = popupImage.current.style;
    if (currentStyles.transform === '') {
      currentStyles.transform = 'rotate(' + rotate + 'deg)';
    } else {
      const nextRotate = Number(currentStyles.transform.replace(/[a-zа-яё()]/g, '')) + rotate;
      currentStyles.transform = 'rotate(' + nextRotate + 'deg)';
    }
  };

  const rotateLeftHandler = (rotateValue) => {
    rotateImage(rotateValue);
  };

  const rotateRightHandler = (rotateValue) => {
    rotateImage(rotateValue);
  };

  const sendRotate = () => {
    const currentImage = popupImage.current;
    const currentStyles = currentImage.style;
    const currentAngle = Number(currentStyles.transform.replace(/[a-zа-яё()]/g, ''));
    const tempSrc = currentImage.src;
    const currentAddress = currentImage.src.substr(currentImage.src.lastIndexOf('/') + 1);
    const allImages = Array.from(document.querySelectorAll('.images__list-img'));
    const allImagesItem = allImages.find((item) => item.src === tempSrc);
    currentImage.src = '';
    allImagesItem.src = '';
    request(`photos/${currentAddress}/rotate/${currentAngle}`, 'POST', null).then(() => {
      currentImage.src = tempSrc;
      allImagesItem.src = tempSrc;
      currentStyles.transform = '';
    });
    setModalText('Фотография сохранена');
    setModalActive(true);
    setTimeout(() => setModalActive(false), 1500);
  };

  const openPopupHandler = async () => {
    const currentImage = popupImage.current;
    const currentAddress = currentImage.src.substr(currentImage.src.lastIndexOf('/') + 1);
    const result = await request(`photos/${currentAddress}/info`, 'GET');
    setDataPhoto(result);
    const date = new Date(result.createdAt);
    const dateFormats = dateFormat(date, 'dd.mm.yyyy, HH:MM:ss');
    dateTime.current.innerText = dateFormats;
  };

  const editDateTimeHandler = async () => {
    const currentImage = popupImage.current;
    const currentAddress = currentImage.src.substr(currentImage.src.lastIndexOf('/') + 1);
    const currentDate = dateFormat(date, 'yyyy-mm-dd');
    const currentTime = dateFormat(time, 'HH:MM:ss');
    const editDate = currentDate + 'T' + currentTime;
    await request(`photos/${currentAddress}/info/created`, 'POST', {
      createdAt: editDate,
    });
    const newDate = new Date(editDate);
    const dateFormats = dateFormat(newDate, 'dd.mm.yyyy, HH:MM:ss');
    dateTime.current.innerText = dateFormats;
    setDataPhoto({ ...dataPhoto, createdAt: editDate });
    setModalText('Дата и время сохранены');
    setModalActive(true);
    setTimeout(() => {
      setModalActive(false);
    }, 1500);
  };

  const openDateModal = () => {
    const date = new Date(dataPhoto.createdAt);
    const dateFormats = dateFormat(date, 'yyyy.mm.dd, HH:MM:ss');
    const calendar = dateFormat(date, 'yyyy.mm.dd');
    setTime(new Date(dateFormats));
    setDate(new Date(calendar));
  };

  // Поиск объектов
  let searchListObjects = [];
  if (Array.isArray(projectFiltersObject)) {
    searchListObjects = projectFiltersObject.filter((item) =>
      item.name.toLowerCase().includes(valueSearchObjects.toLowerCase()),
    );
  }

  // Поиск задач
  let searchListTasks = [];
  if (Array.isArray(projectFiltersTasks)) {
    searchListTasks = projectFiltersTasks.filter((item) =>
      item.description.toLowerCase().includes(valueSearchTasks.toLowerCase()),
    );
  }

  return (
    <section className='projects__info'>
      <Header />
      <div className='projects__content info'>
        <h1 className='title'>FixPhoto Viewer</h1>
        {/* <div className='configuration'>
          <a className='configuration-back' href='http://fixphoto.zodiak-elektro.ru/'>
            Форма конфигурации
          </a>
        </div> */}
        <div className='projects__info-top'>
          <div className='types_content'>
            <div
              className={classNames('types info', {
                active: menuObjectsFilters,
              })}
              ref={menuObjectsRef}
            >
              <div onClick={clickObjectsFilterHandler} className='types-btn'>
                <div className='types-content'>
                  {itemObject[0].text === '' ? (
                    <span>Объект</span>
                  ) : (
                    <div className='types-selected'>
                      <div className='types-active'>
                        <div className='types-category'>{itemObject[0].text}</div>
                        <div className='types-delete' onClick={(e) => deleteFilterHandler(e)}>
                          <span>
                            <svg width='16' height='16' viewBox='0 0 24 24' role='presentation'>
                              <path
                                d='M16.155 14.493a1.174 1.174 0 11-1.662 1.663L12 13.662l-2.494 2.494a1.172 1.172 0 01-1.662 0 1.176 1.176 0 010-1.663L10.337 12 7.844 9.507a1.176 1.176 0 011.662-1.662L12 10.338l2.493-2.493a1.174 1.174 0 111.662 1.662L13.662 12l2.493 2.493z'
                                fill='inherit'
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={classNames('filters-info', {
                  active: menuObjectsFilters,
                })}
              >
                <input
                  className='input search-input'
                  onChange={(e) => setValueSearchObjects(e.target.value)}
                  value={valueSearchObjects}
                  type='text'
                  placeholder='Поиск'
                  autoFocus={true}
                  ref={searchInputObjects}
                />
                <ul className='types__list info active'>
                  {searchListObjects.map((item, index) => (
                    <li
                      key={index}
                      className='types__list-item info'
                      onClick={(e) => setObjectHandler(e, item.id)}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className={classNames('types info tasks', {
                active: menuTasksFilters,
                empty: itemObject[0].text === '',
              })}
              ref={menuTasksRef}
            >
              <div onClick={clickTasksFilterHandler} className='types-btn' ref={tasksRef}>
                <div className='types-content'>
                  {itemsTask.length === 0 ? (
                    <span>Задачи</span>
                  ) : (
                    itemsTask.map((item, index) => (
                      <div className='types-selected task' key={index}>
                        <div className='types-active'>
                          <div className='types-category'>{item.text}</div>
                          <div
                            className='types-delete'
                            onClick={(e) => deleteTaskHandler(e, index, item.completedTaskId)}
                          >
                            <span>
                              <svg width='16' height='16' viewBox='0 0 24 24' role='presentation'>
                                <path
                                  d='M16.155 14.493a1.174 1.174 0 11-1.662 1.663L12 13.662l-2.494 2.494a1.172 1.172 0 01-1.662 0 1.176 1.176 0 010-1.663L10.337 12 7.844 9.507a1.176 1.176 0 011.662-1.662L12 10.338l2.493-2.493a1.174 1.174 0 111.662 1.662L13.662 12l2.493 2.493z'
                                  fill='inherit'
                                ></path>
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div
                className={classNames('filters-info', {
                  active: menuTasksFilters,
                })}
                style={{ top: heightTasks + 'px' }}
              >
                <input
                  className='input search-input'
                  onChange={(e) => setValueSearchTasks(e.target.value)}
                  value={valueSearchTasks}
                  type='text'
                  placeholder='Поиск'
                  autoFocus={true}
                  ref={searchInputTasks}
                />
                {renderTasks()}
              </div>
            </div>
          </div>
          <button
            className={classNames('show', {
              disabled: itemsTask.length === 0,
            })}
            disabled={itemsTask.length === 0}
            onClick={showImagesHandler}
          >
            Показать
          </button>
        </div>
        <div className='images__list'>
          <Preloader stateLoader={loader} />
          {currentPhotos.map((item) =>
            item.photos.map((src, index) => (
              <div className='images__list-item' key={index}>
                <CustomPopup
                  trigger={
                    <div>
                      <LazyLoad height={200}>
                        <img
                          className='images__list-img'
                          src={`http://fixphoto.zodiak-elektro.ru/api/photos/${src}`}
                          alt='task'
                        ></img>
                      </LazyLoad>
                    </div>
                  }
                  openHandle={openPopupHandler}
                >
                  <div className='popup_outer'>
                    <img
                      className='popup_image'
                      src={`http://fixphoto.zodiak-elektro.ru/api/photos/${src}`}
                      alt=''
                      ref={popupImage}
                    ></img>
                  </div>
                  <div className='popup_bottom'>
                    <div className='popup_bottom-date'>
                      <div className='date-time' ref={dateTime}></div>
                      <Popup
                        trigger={
                          <button className='popup_bottom-btn'>
                            <img src={edit} alt='editDate' />
                          </button>
                        }
                        onOpen={openDateModal}
                        modal
                        nested
                      >
                        {(close) => (
                          <div className={classNames('popup editDate')}>
                            <button
                              className='closed'
                              onClick={() => {
                                close();
                              }}
                            >
                              <img src={closePicture} alt='close'></img>
                            </button>
                            <div className='popup_edit-date-content'>
                              <div className='popup_edit-date-item'>
                                <span className='popup_edit-date-item-text'>Дата:</span>
                                <DatePicker
                                  selected={date}
                                  locale={ru}
                                  onChange={(date) => setDate(date)}
                                  dateFormat='dd.MM.yyyy'
                                  className='date-picker'
                                  strictParsing
                                />
                              </div>
                              <div className='popup_edit-date-item time'>
                                <span className='popup_edit-date-item-text'>Время:</span>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ru}>
                                  <TimePicker
                                    ampm={false}
                                    openTo='hours'
                                    views={['hours', 'minutes', 'seconds']}
                                    format='HH:mm:ss'
                                    value={time}
                                    onChange={(time) => setTime(time)}
                                    cancelLabel='Закрыть'
                                  />
                                </MuiPickersUtilsProvider>
                              </div>
                              <button
                                className='button-edit'
                                onClick={() => {
                                  editDateTimeHandler();
                                  close();
                                }}
                              >
                                Сохранить
                              </button>
                            </div>
                          </div>
                        )}
                      </Popup>
                    </div>
                    <div className='popup__buttons'>
                      <div className='popup__buttons-buttons-left'>
                        <CustomButton
                          func={() => rotateRightHandler(-90)}
                          src={rotateRight}
                          alt={'rotateRight'}
                        />
                      </div>
                      <div className='popup__buttons-buttons-center'>
                        <CustomButton
                          func={() => sendRotate()}
                          src={savePicture}
                          alt={'savePicture'}
                        />
                      </div>
                      <div className='popup__buttons-buttons-right'>
                        <CustomButton
                          func={() => rotateLeftHandler(90)}
                          src={rotateLeft}
                          alt={'rotateLeft'}
                        />
                      </div>
                    </div>
                  </div>
                </CustomPopup>
                <span className='images__list-item-text'>
                  <span className='images__list-item-task'>Задача:</span> {item.description}
                </span>
              </div>
            )),
          )}
        </div>
      </div>
      <ModalPrompt modalActive={modalActive} text={modalText} />
    </section>
  );
}

export default ViewImagePage;
