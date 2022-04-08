import React from 'react';
import classNames from 'classnames';

export default function Preloader({ stateLoader }) {
  return (
    <div
      className={classNames('preloader', {
        hidden: !stateLoader,
        active: stateLoader,
      })}
    >
      <div className='preloader-icon'></div>
    </div>
  );
}
