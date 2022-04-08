import React from 'react';
import Popup from 'reactjs-popup';

// assets
import closePicture from 'assets/img/close-popup.png';
import classNames from 'classnames';

export default function CustomPopup({
  trigger,
  children,
  test,
  openHandle,
  closeHandle,
  className,
}) {
  return (
    <Popup trigger={trigger} ref={test} onOpen={openHandle} onClose={closeHandle} modal nested>
      {(close) => (
        <div className={classNames('popup', className)}>
          <button
            className='closed'
            onClick={() => {
              close();
            }}
          >
            <img src={closePicture} alt='close'></img>
          </button>
          {children}
        </div>
      )}
    </Popup>
  );
}
