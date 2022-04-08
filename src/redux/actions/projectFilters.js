import { DATA_OBJECTS } from 'redux/types';
import { fetchItems } from './fetch';

export function dataFiltersObjects() {
  return fetchItems('facility', 'GET', DATA_OBJECTS);
}
