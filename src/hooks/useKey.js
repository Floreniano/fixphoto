import { useRef, useEffect } from 'react';

export const useKey = (key, test, callback) => {
  const callBackRef = useRef(callback);
  useEffect(() => {
    const handle = (e) => {
      if (e.code === key && test === false) {
        callBackRef.current(e);
      }
    };
    document.addEventListener('keypress', handle);
    return () => document.removeEventListener('keypress', handle);
  }, [key, test]);
};
