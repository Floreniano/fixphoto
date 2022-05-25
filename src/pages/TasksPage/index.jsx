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

  const objectClickHandler = (item) => {
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

  const selectCurrentObjectHandler = (item) => {
    setCurrentObject(item);
    request(`tasks/facility/${item.id}`).then((data) => setTasks(data));
  };

  const deleteHandler = (id) => {
    request(`tasks/${id}`, 'DELETE').then(() =>
      request(`tasks/facility/${currentObject.id}`).then((data) => setTasks(data)),
    );
  };
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
                  <h2 className='popup_object-title'>Новый объект</h2>
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
                        ref={menuObjectsRef}
                        className='object_create-input select'
                        onClick={() => setObjectsActive(!objectsActive)}
                      >
                        <span>{object}</span>
                        <ul
                          className={classNames('object_create-input-list', {
                            active: objectsActive,
                          })}
                        >
                          {objects.map((item) => (
                            <li
                              key={item.id}
                              className='object_create-input-list-item'
                              onClick={() => objectClickHandler(item)}
                            >
                              {item.name}
                            </li>
                          ))}
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
              onClick={() => setCurrentObjectActive(!currentObjectActive)}
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
                {objects.map((item) => (
                  <li
                    key={item.id}
                    className='object_create-input-list-item'
                    onClick={() => selectCurrentObjectHandler(item)}
                  >
                    {item.name}
                  </li>
                ))}
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
