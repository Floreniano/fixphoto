import React, { useState, useEffect, useRef } from 'react';

// libs
import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import dateFormat from 'dateformat';

// components
import Popup from 'reactjs-popup';
import ModalPrompt from 'components/ModalPrompt';

// assets
import closePicture from 'assets/img/close-popup.png';

// redux
import { useSelector } from 'react-redux';

import { request } from 'request';
export default function TaskItem({
  task,
  onDelete,
  currentPerformer,
  performers,
  objects,
  currentObject,
  setTasks,
}) {
  const { projectFiltersObject } = useSelector(({ projectFiltersObject }) => {
    return {
      projectFiltersObject: projectFiltersObject.projectObject,
    };
  });
  const [buttons, setButtons] = useState(false);
  const deleteHandlerClick = () => {
    onDelete(task.id);
  };

  //Ссылки
  const buttonsRef = useRef();
  const menuObjectsRef = useRef();
  const menuExecutorsRef = useRef();

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
  useOnClickOutside(buttonsRef, () => setButtons(false));

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

  const [open, setOpen] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalText, setModalText] = useState('');
  const [error, setError] = useState('');

  const editHandler = (task) => {
    setOpen(true);

    const currentObjectTemp = projectFiltersObject.find((item) => item.id === task.facilityId);
    const currentPerformer = performers.find((item) => item.id === task.performerId);
    const date = new Date(task.executionTime);
    const dateFormats = dateFormat(date, 'yyyy.mm.dd, HH:MM:ss');

    setDescription(task.description);
    setExecutionDate(new Date(task.executionTime));
    setExecutionHours(task.executionHours);
    setExecutionTime(new Date(dateFormats));
    setFacilityId(task.facilityId);
    setPerformerId(task.performerId);
    setPhotoCount(task.photoCount);
    setObject(currentObjectTemp.name);
    setPerformer(currentPerformer.firstName + ' ' + currentPerformer.lastName);
  };
  const closeModal = () => setOpen(false);
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
      request(`tasks/${task.id}`, 'PUT', {
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
  const status = () => {
    if (task.status === 'EXPIRED') return <span className='red'>Просрочена</span>;
    if (task.status === 'WAITING') return <span className='orange'>Ожидание</span>;
  };
  const objectClickHandler = (item) => {
    setObject(item.name);
    setFacilityId(item.id);
  };
  const executorClickHandler = (item) => {
    setPerformer(item.firstName + ' ' + item.lastName);
    setPerformerId(item.id);
  };
  return (
    <tr className='table-item'>
      <td className='table-item-name'>
        {currentPerformer.firstName + ' ' + currentPerformer.lastName}
      </td>
      <td className='table-item-text description'>{task.description}</td>
      <td className='table-item-text executionTime'>
        {console.log(task.executionTime)}
        {dateFormat(task.executionTime, 'yyyy-mm-dd hh:mm:ss')}
      </td>
      <td className='table-item-text completedExecutionTime'>
        {dateFormat(task.completedExecutionTime, 'yyyy-mm-dd hh:mm:ss')}
      </td>
      <td className='table-item-text status'>{status()}</td>
      <td className='info'>
        <div className={buttons ? 'info_buttons' : 'info_buttons none'} ref={buttonsRef}>
          <button className='info_buttons-delete' onClick={deleteHandlerClick}></button>
          <button className='info_buttons-edit' onClick={() => editHandler(task)}></button>
          <Popup className='popup_object' open={open} modal nested onClose={closeModal}>
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
        <ModalPrompt modalActive={modalActive} text={modalText} error={error} />
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
