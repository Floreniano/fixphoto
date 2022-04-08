import { DATA_TASKS, CLEAR_TASKS } from 'redux/types';

const initialState = {
  projectTasks: [],
};

const projectFilterTasks = (state = initialState, action) => {
  switch (action.type) {
    case DATA_TASKS:
      const completedTasks = action.payload.filter((task) => task.status === 'COMPLETED');
      return {
        ...state,
        projectTasks: completedTasks,
      };
    case CLEAR_TASKS:
      return {
        projectTasks: [],
      };
    default:
      return state;
  }
};

export default projectFilterTasks;
