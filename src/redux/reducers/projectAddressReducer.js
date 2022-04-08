import { CLEAR_ADDRESSES, DATA_ADDRESSES, DELETE_ADDRESS } from 'redux/types';

const initialState = {
  projectAddresses: [],
};

const projectAddresses = (state = initialState, action) => {
  switch (action.type) {
    case DATA_ADDRESSES:
      return {
        ...state,
        projectAddresses: [...state.projectAddresses, action.payload],
      };
    case CLEAR_ADDRESSES:
      return {
        projectAddresses: [],
      };
    case DELETE_ADDRESS:
      const id = action.payload;
      return {
        ...state,
        projectAddresses: state.projectAddresses.filter((element) => element.id !== id),
      };
    default:
      return state;
  }
};

export default projectAddresses;
