import { DATA_OBJECTS } from 'redux/types';

const initialState = {
  projectObject: [],
};

const projectFiltersObject = (state = initialState, action) => {
  switch (action.type) {
    case DATA_OBJECTS:
      return {
        ...state,
        projectObject: action.payload,
      };
    default:
      return state;
  }
};

export default projectFiltersObject;
