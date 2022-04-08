import React from 'react';
import classNames from 'classnames';

export default React.memo(function ModalPrompt({ modalActive, text, error }) {
  return (
    <div
      className={classNames('modal', {
        active: modalActive,
        error: error,
      })}
    >
      <div className='modalContent'>{text}</div>
    </div>
  );
});
