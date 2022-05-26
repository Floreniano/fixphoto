import React from 'react';

// assets
import deleteImg from 'assets/img/delete.png';
import downloadImg from 'assets/img/download.png';

// libs
import dateFormat from 'dateformat';

export default function ReportItem({ report, onDelete, onDownload }) {
  const deleteHandlerClick = () => {
    onDelete(report.id);
  };

  const downloadHandler = () => {
    onDownload(report.id);
  };

  return (
    <tr className='table-item'>
      <td className='table-item-name'>{report.name}</td>
      <td className='table-item-text type'>
        {dateFormat(report.createdAt, 'yyyy.mm.dd, HH:MM:ss')}
      </td>
      <td className='info reports'>
        <button className='info_buttons-download' onClick={downloadHandler}>
          <img className='info_buttons-download-img' src={downloadImg} alt='download'></img>
        </button>
        <button className='info_buttons-delete' onClick={deleteHandlerClick}>
          <img className='info_buttons-delete-img' src={deleteImg} alt='delete'></img>
        </button>
      </td>
    </tr>
  );
}
