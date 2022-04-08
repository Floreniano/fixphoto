import React, { useState, useEffect, useRef } from 'react';

export default function ProjectItem({ object, onDelete }) {
  const [buttons, setButtons] = useState(false);
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
  return (
    <tr className='table-item'>
      <td className='table-item-name'>{object.name}</td>
      <td className='table-item-text key'>{object.code}</td>
      <td className='table-item-text type'>{object.address}</td>
      <td className='info'>
        <div className={buttons ? 'info_buttons' : 'info_buttons none'} ref={buttonsRef}>
          <button className='info_buttons-delete' onClick={deleteHandlerClick}></button>
          <button className='info_buttons-edit'></button>
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
