import React, { useState, useEffect, useRef } from 'react';
// components
import Header from 'components/Header';
import ReportItem from './components/ReportItem';

import { request } from 'request';

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [valueSearch, setValueSearch] = useState('');

  useEffect(() => {
    request('reports', 'GET').then((data) => setReports(data));
  }, []);

  const deleteHandler = (id) => {
    request(`reports/${id}`, 'DELETE').then(() =>
      request('reports', 'GET').then((data) => setReports(data)),
    );
  };

  const downloadHandler = (id) => {
    request(`reports/${id}`, 'GET').then((data) => {});
  };

  // Клик вне элмента
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

  const menuSearchRef = useRef();
  useOnClickOutside(menuSearchRef, () => setOpenAutocomplete(false));

  // Поиск
  const searchClickHandler = (e) => {
    setValueSearch(e.target.textContent);
    setOpenAutocomplete(!openAutocomplete);
  };
  const autocompleteClickHandler = () => {
    setOpenAutocomplete(true);
  };
  const searchReports = reports.filter((project) =>
    project.name.toLowerCase().includes(valueSearch.toLowerCase()),
  );

  return (
    <section className='objects'>
      <Header />
      <div className='projects__content'>
        <div className='projects__top'>
          <h1 className='title'>Отчеты</h1>
        </div>

        <div className='filters'>
          <div className='search' ref={menuSearchRef}>
            <input
              className='input search-input'
              onChange={(e) => setValueSearch(e.target.value)}
              onClick={autocompleteClickHandler}
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
            <ul className='search__autocomplete'>
              {valueSearch && openAutocomplete
                ? searchReports.map((objectItem, index) => (
                    <li
                      key={index}
                      className='search__autocomplete-item'
                      onClick={searchClickHandler}
                    >
                      {objectItem.name}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        {searchReports.length !== 0 ? (
          <div className='table-scroll'>
            <table className='table reports'>
              <thead>
                <tr>
                  <th className='table-title table-name'>Название отчета</th>
                  <th className='table-title table-date'>Дата создания</th>
                  <th className='table-title table-info'></th>
                </tr>
              </thead>
              <tbody>
                {searchReports.map((reportItem, index) => (
                  <ReportItem
                    key={index}
                    report={reportItem}
                    onDelete={deleteHandler}
                    onDownload={downloadHandler}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='not-found'>Нет результатов</div>
        )}
      </div>
    </section>
  );
}

export default ReportsPage;
