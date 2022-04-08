import { DATA_TASKS, CLEAR_TASKS } from 'redux/types';
import { fetchItems } from './fetch';

export function dataFiltersTasks(id) {
  return fetchItems(`tasks/facility/${id}`, 'GET', DATA_TASKS);
}

export const clearFilterTasks = () => ({
  type: CLEAR_TASKS,
});
