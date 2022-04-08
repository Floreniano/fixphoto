import { combineReducers } from 'redux';
import projectAddressesReducer from './projectAddressReducer';
import projectFiltersObjectReducer from './projectFiltersReducer';
import projectFilterTasksReducer from './projectFiltersTasksReducer';

const rootReducer = combineReducers({
  projectFiltersObject: projectFiltersObjectReducer,
  projectFiltersTasks: projectFilterTasksReducer,
  projectAddresses: projectAddressesReducer,
});

export default rootReducer;
