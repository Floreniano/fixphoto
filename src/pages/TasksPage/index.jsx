import React, { useState, useEffect, useRef } from 'react';

//libs
import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import dateFormat from 'dateformat';

// components
import Popup from 'reactjs-popup';
import ModalPrompt from 'components/ModalPrompt';
import Header from 'components/Header';
import TaskItem from './components/TaskItem';

// assets
import closePicture from 'assets/img/close-popup.png';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { dataFiltersObjects } from 'redux/actions/projectFilters';
import { request } from 'request';

function TasksPage() {
  const { projectFiltersObject } = useSelector(({ projectFiltersObject }) => {
    return {
      projectFiltersObject: projectFiltersObject.projectObject,
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dataFiltersObjects());
    request('performers', 'GET').then((data) => {
      setPerformers(data);
    });
    request('performers', 'GET').then((data) => {
      setAllPerformers(data);
    });
  }, [dispatch]);
  const [objects, setObjects] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [allPerformers, setAllPerformers] = useState([]);

  // Поля для запроса
  const [description, setDescription] = useState('');
  const [executionDate, setExecutionDate] = useState(null);
  const [executionHours, setExecutionHours] = useState(12);
  const [executionTime, setExecutionTime] = useState(null);
  const [facilityId, setFacilityId] = useState();
  const [performerId, setPerformerId] = useState();
  const [photoCount, setPhotoCount] = useState(1);

  // Вывод данных
  const [object, setObject] = useState('');
  const [objectsActive, setObjectsActive] = useState(false);
  const [performer, setPerformer] = useState('');
  const [performerAtive, setPerformerActive] = useState(false);

  // Popup
  const [modalActive, setModalActive] = useState(false);
  const [modalText, setModalText] = useState('');
  const [error, setError] = useState('');

  // Задачи
  const [currentObject, setCurrentObject] = useState();
  const [currentObjectActive, setCurrentObjectActive] = useState(false);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setObjects(projectFiltersObject);
  }, [projectFiltersObject]);

  const objectClickHandler = (e, item) => {
    e.stopPropagation();
    setObjectsActive(false);
    setValueSearch('');
    setObject(item.name);
    setFacilityId(item.id);
  };

  const executorClickHandler = (item) => {
    setPerformer(item.firstName + ' ' + item.lastName);
    setPerformerId(item.id);
  };
  const saveHandler = (close) => {
    const currentDate = dateFormat(executionDate, 'yyyy-mm-dd');
    const currentTime = dateFormat(executionTime, 'HH:MM');
    const editDate = currentDate + 'T' + currentTime + ':00.000Z';
    if (!/[a-zа-яё]/i.test(photoCount) && !/[a-zа-яё]/i.test(executionHours)) {
      const endTime = null;
      const gallery = true;
      const repeatUnit = null;
      const repeatable = false;
      const watermarks = ['FACILITY', 'DATE', 'TIME'];
      request('tasks', 'POST', {
        description,
        endTime,
        executionDate: currentDate,
        executionHours,
        executionTime: editDate,
        facilityId,
        gallery,
        performerId,
        photoCount,
        repeatUnit,
        repeatable,
        watermarks,
      }).then(() => {
        if (currentObject !== undefined)
          request(`tasks/facility/${currentObject.id}`).then((data) => setTasks(data));
      });
      setDescription('');
      setExecutionDate(null);
      setExecutionHours(12);
      setExecutionTime(null);
      setFacilityId();
      setPerformerId();
      setPhotoCount(1);
      setObject('');
      setPerformer('');

      setModalText('Объект сохранен');
      setError('');
      setModalActive(true);
      setTimeout(() => {
        setModalActive(false);
      }, 1500);
      close();
    } else {
      setModalText('Ошибка, введены не корректные значения');
      setError('error');
      setModalActive(true);
      setTimeout(() => {
        setModalActive(false);
      }, 1500);
    }
  };
  //Ссылки
  const menuObjectsRef = useRef();
  const menuExecutorsRef = useRef();
  const menuCurrentObjectRef = useRef();
  const menuSearchCurrentObjectRef = useRef();

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

  useOnClickOutside(menuObjectsRef, () => setObjectsActive(false));
  useOnClickOutside(menuExecutorsRef, () => setPerformerActive(false));
  useOnClickOutside(menuCurrentObjectRef, () => setCurrentObjectActive(false));

  const selectCurrentObjectHandler = (e, item) => {
    e.stopPropagation();
    setCurrentObjectActive(false);
    setValueCurrentObject('');
    setCurrentObject(item);
    request(`tasks/facility/${item.id}`).then((data) => setTasks(data));
  };

  const deleteHandler = (id) => {
    request(`tasks/${id}`, 'DELETE').then(() =>
      request(`tasks/facility/${currentObject.id}`).then((data) => setTasks(data)),
    );
  };

  // Поиск
  const [valueSearch, setValueSearch] = useState('');
  const [valueCurrentObject, setValueCurrentObject] = useState('');
  const searchObjects = objects.filter((project) =>
    project.name.toLowerCase().includes(valueSearch.toLowerCase()),
  );
  const searchCurrentObjects = objects.filter((project) =>
    project.name.toLowerCase().includes(valueCurrentObject.toLowerCase()),
  );
  return (
    <section className='tasks'>
      <Header></Header>
      <div className='tasks_content'>
        <div className='tasks__top'>
          <h1 className='title'>Задачи</h1>
          <div className='tasks__top-right'>
            <Popup
              trigger={<button className='btn create-post'>Создать задачу</button>}
              modal
              nested
            >
              {(close) => (
                <div className='popup'>
                  <button
                    className='closed'
                    onClick={() => {
                      close();
                    }}
                  >
                    <img src={closePicture} alt='close'></img>
                  </button>
                  <h2 className='popup_object-title'>Новая задача</h2>
                  <div className='object_create'>
                    <div className='object_create-item'>
                      <textarea
                        className='object_create-input textarea'
                        type='text'
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        required
                      />
                      <label className='object_create-label'>Описание</label>
                    </div>

                    <div className='object_create-item'>
                      <input
                        className='object_create-input'
                        type='text'
                        onChange={(e) => setPhotoCount(e.target.value)}
                        value={photoCount}
                        required
                      />
                      <label className='object_create-label'>Количество фотографий</label>
                    </div>

                    <div className='object_create-item'>
                      <input
                        className='object_create-input'
                        type='text'
                        onChange={(e) => setExecutionHours(e.target.value)}
                        value={executionHours}
                        required
                      />
                      <label className='object_create-label'>Время на исполнение</label>
                    </div>

                    <div className='object_create-item select'>
                      <div className='object_create-text'>Объект</div>
                      <div
                        className='object_create-input select'
                        onClick={() => setObjectsActive(true)}
                        ref={menuObjectsRef}
                      >
                        <span>{object}</span>
                        <ul
                          className={classNames('object_create-input-list', {
                            active: objectsActive,
                          })}
                        >
                          <div className='filters list'>
                            <div className='search'>
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
                          {searchObjects.length !== 0 ? (
                            searchObjects.map((item) => (
                              <li
                                key={item.id}
                                className='object_create-input-list-item'
                                onClick={(e) => objectClickHandler(e, item)}
                              >
                                {item.name}
                              </li>
                            ))
                          ) : (
                            <div className='not-found list'>Нет результатов</div>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className='object_create-item select'>
                      <div className='object_create-text'>Исполнитель</div>
                      <div
                        ref={menuExecutorsRef}
                        className='object_create-input select'
                        onClick={() => setPerformerActive(!performerAtive)}
                      >
                        <span>{performer}</span>
                        <ul
                          className={classNames('object_create-input-list', {
                            active: performerAtive,
                          })}
                        >
                          {performers.map((item) => (
                            <li
                              key={item.id}
                              className='object_create-input-list-item'
                              onClick={() => executorClickHandler(item)}
                            >
                              {item.firstName} {item.lastName}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className='object_create-item select'>
                      <div className='object_create-text'>Дата</div>
                      <DatePicker
                        minDate={new Date()}
                        selected={executionDate}
                        locale={ru}
                        onChange={(executionDate) => setExecutionDate(executionDate)}
                        dateFormat='dd.MM.yyyy'
                        className='date-picker'
                        strictParsing
                      />
                    </div>

                    <div className='object_create-item select'>
                      <div className='object_create-text time'>Время</div>
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ru}>
                        <TimePicker
                          ampm={false}
                          openTo='hours'
                          views={['hours', 'minutes']}
                          format='HH:mm'
                          value={executionTime}
                          onChange={(executionTime) => setExecutionTime(executionTime)}
                          cancelLabel='Закрыть'
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <button
                      onClick={() => {
                        saveHandler(close);
                      }}
                      className={classNames('btn', {
                        disabled:
                          description.length === 0 ||
                          Number(photoCount) <= 0 ||
                          Number(executionHours) <= 0 ||
                          object === '' ||
                          performer === '' ||
                          executionDate === null ||
                          executionTime === null,
                      })}
                      disabled={
                        description.length === 0 ||
                        Number(photoCount) <= 0 ||
                        Number(executionHours) <= 0 ||
                        object === '' ||
                        performer === '' ||
                        executionDate === null ||
                        executionTime === null
                      }
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
        </div>
        <div className='tasks_content_inner'>
          <div className='object_create-item select'>
            <div className='object_create-text'>Объект</div>
            <div
              ref={menuCurrentObjectRef}
              className='object_create-input select'
              onClick={() => setCurrentObjectActive(true)}
            >
              {currentObject !== undefined ? (
                <span className='select-content'>{currentObject.name}</span>
              ) : (
                <span className='select-content'></span>
              )}
              <ul
                className={classNames('object_create-input-list', {
                  active: currentObjectActive,
                })}
              >
                <div className='filters list'>
                  <div className='search' ref={menuSearchCurrentObjectRef}>
                    <input
                      className='input search-input'
                      onChange={(e) => setValueCurrentObject(e.target.value)}
                      value={valueCurrentObject}
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
                {searchCurrentObjects.length !== 0 ? (
                  searchCurrentObjects.map((item) => (
                    <li
                      key={item.id}
                      className='object_create-input-list-item'
                      onClick={(e) => selectCurrentObjectHandler(e, item)}
                    >
                      {item.name}
                    </li>
                  ))
                ) : (
                  <div className='not-found list'>Нет результатов</div>
                )}
              </ul>
            </div>
          </div>
          <div className='table-scroll'>
            <table className='table table-tasks'>
              <thead>
                <tr>
                  <th className='table-title table-name'>Исполнитель</th>
                  <th className='table-title table-description'>Описание</th>
                  <th className='table-title table-date_start'>Дата выполнения</th>
                  <th className='table-title table-date_end'>Дата завершения</th>
                  <th className='table-title table-status'>Статус</th>
                  <th className='table-title table-info'></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <TaskItem
                    key={index}
                    setTasks={setTasks}
                    currentObject={currentObject}
                    task={task}
                    performers={performers}
                    onDelete={deleteHandler}
                    objects={objects}
                    currentPerformer={allPerformers.find((item) => item.id === task.performerId)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalPrompt modalActive={modalActive} text={modalText} error={error} />
    </section>
  );
}

export default TasksPage;
