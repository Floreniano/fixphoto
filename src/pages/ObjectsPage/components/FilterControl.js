import React from 'react';

export default function FilterControl({ item, index, onSetFilterHandler }) {
  return (
    <li className='types__list-item'>
      <input
        className='types__list-input input-check'
        type='checkbox'
        name={`types__list-checkbox-${index}`}
        id={`types__list-checkbox-${index}`}
        onClick={(e) => e.stopPropagation()}
      ></input>
      <label
        className='types__list-label label-check'
        onClick={(e) => onSetFilterHandler(e)}
        htmlFor={`types__list-checkbox-${index}`}
      >
        {item.name}
      </label>
    </li>
  );
}
