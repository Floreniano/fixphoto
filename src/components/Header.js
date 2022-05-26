import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// assets
// import notifications from 'assets/img/notifications.svg';
// import notificationsActive from 'assets/img/notifications-active.svg';

export default function Header() {
  const [menuActive, setMenuActive] = useState(false);
  return (
    <header className='header'>
      <div className='header__inner'>
        <div className='adaptive'>
          <div
            className={`burger-menu ${menuActive ? 'active' : ''}`}
            onClick={() => setMenuActive(!menuActive)}
          >
            <span></span>
          </div>
          <Link className='header-logo' to='/projects'>
            <svg
              className='header-logo-icon'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M5.1942 4.86163L5.56503 3.00663C5.64058 2.62866 5.84479 2.28857 6.14291 2.04424C6.44102 1.79992 6.81459 1.66647 7.20003 1.66663H12.8C13.1855 1.66647 13.5591 1.79992 13.8572 2.04424C14.1553 2.28857 14.3595 2.62866 14.435 3.00663L14.8059 4.86163C14.8641 5.15229 15.0036 5.42045 15.2082 5.63495C15.4128 5.84944 15.6741 6.00145 15.9617 6.07329C16.6392 6.24278 17.2406 6.63386 17.6703 7.18437C18.1001 7.73489 18.3334 8.41325 18.3334 9.11163V15C18.3334 15.884 17.9822 16.7319 17.3571 17.357C16.7319 17.9821 15.8841 18.3333 15 18.3333H5.00004C4.11598 18.3333 3.26813 17.9821 2.64301 17.357C2.01789 16.7319 1.6667 15.884 1.6667 15V9.11163C1.66664 8.41325 1.90002 7.73489 2.32974 7.18437C2.75946 6.63386 3.36087 6.24278 4.03837 6.07329C4.32596 6.00145 4.58725 5.84944 4.79186 5.63495C4.99647 5.42045 5.13599 5.15229 5.1942 4.86163V4.86163Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M10 14.9999C11.841 14.9999 13.3334 13.5075 13.3334 11.6666C13.3334 9.82564 11.841 8.33325 10 8.33325C8.15909 8.33325 6.6667 9.82564 6.6667 11.6666C6.6667 13.5075 8.15909 14.9999 10 14.9999Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9.1667 5H10.8334'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='header-logo-text'>FixPhoto</span>
          </Link>
        </div>

        <div className={`header__inner-left ${menuActive ? 'active' : ''}`}>
          <Link className='header-logo' to='/projects'>
            <svg
              className='header-logo-icon'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M5.1942 4.86163L5.56503 3.00663C5.64058 2.62866 5.84479 2.28857 6.14291 2.04424C6.44102 1.79992 6.81459 1.66647 7.20003 1.66663H12.8C13.1855 1.66647 13.5591 1.79992 13.8572 2.04424C14.1553 2.28857 14.3595 2.62866 14.435 3.00663L14.8059 4.86163C14.8641 5.15229 15.0036 5.42045 15.2082 5.63495C15.4128 5.84944 15.6741 6.00145 15.9617 6.07329C16.6392 6.24278 17.2406 6.63386 17.6703 7.18437C18.1001 7.73489 18.3334 8.41325 18.3334 9.11163V15C18.3334 15.884 17.9822 16.7319 17.3571 17.357C16.7319 17.9821 15.8841 18.3333 15 18.3333H5.00004C4.11598 18.3333 3.26813 17.9821 2.64301 17.357C2.01789 16.7319 1.6667 15.884 1.6667 15V9.11163C1.66664 8.41325 1.90002 7.73489 2.32974 7.18437C2.75946 6.63386 3.36087 6.24278 4.03837 6.07329C4.32596 6.00145 4.58725 5.84944 4.79186 5.63495C4.99647 5.42045 5.13599 5.15229 5.1942 4.86163V4.86163Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M10 14.9999C11.841 14.9999 13.3334 13.5075 13.3334 11.6666C13.3334 9.82564 11.841 8.33325 10 8.33325C8.15909 8.33325 6.6667 9.82564 6.6667 11.6666C6.6667 13.5075 8.15909 14.9999 10 14.9999Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9.1667 5H10.8334'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='header-logo-text'>FixPhoto</span>
          </Link>
          <ul className='header__list'>
            <li className='header__list-item'>
              <Link to='/objects'>Объекты</Link>
            </li>
            <li className='header__list-item'>
              <Link to='/tasks'>Задачи</Link>
            </li>
            <li className='header__list-item'>
              <Link to='/view'>Фотографии</Link>
            </li>
          </ul>
          {/* <button className='btn header-btn'>Новая задача</button> */}
        </div>
        {/* <div className='header__inner-right'>
          <button className='header-notifications'>
            <img className='header-notifications-icon' src={notifications} alt='Уведомления'></img>
            <img
              className='header-notifications-active'
              src={notificationsActive}
              alt='Уведомления'
            ></img>
          </button>
          <Link className='header-profile' to='/cabinet'>
            АА
          </Link>
        </div> */}
      </div>
      <div
        onClick={() => setMenuActive(false)}
        className={`blur ${menuActive ? 'active' : ''}`}
      ></div>
    </header>
  );
}
