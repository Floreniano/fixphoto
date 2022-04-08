import { request } from 'request';

export function fetchItems(url, method, actionType) {
  return async (dispatch) => {
    try {
      const response = await request(url, method, null);
      const json = response;
      dispatch({
        type: actionType,
        payload: json,
      });
    } catch (err) {
      console.warn('Error fetch: ', err);
    }
  };
}
