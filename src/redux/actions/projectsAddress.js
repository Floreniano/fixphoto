import { CLEAR_ADDRESSES, DATA_ADDRESSES, DELETE_ADDRESS } from 'redux/types';
import { fetchItems } from './fetch';

export function dataAddresses(id) {
  return fetchItems(`tasks/completed/${id}`, 'GET', DATA_ADDRESSES);
}

export const clearAddresses = () => ({
  type: CLEAR_ADDRESSES,
});

export const deleteAddress = (id) => ({
  type: DELETE_ADDRESS,
  payload: id,
});
