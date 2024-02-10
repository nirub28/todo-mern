import { combineReducers } from 'redux';

// Initial state for user
const initialUserState = {
  currentUser: null,
  isLoggedIn: false,
};

//Initial state for tasks
const initialTaskState = {
  tasks: [],
};

// Reducer for user actions
const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        currentUser: action.payload,
        isLoggedIn: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

// Reducer for task actions
const taskReducer = (state = initialTaskState, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return {
        ...state,
        tasks: action.payload,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload.id),
      };
      case 'UPDATE_TODO':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload.id ? { ...task, completed: !task.completed } : task
        ),
      };
      case 'SET_TODOS_ORDER':
      return {
        ...state,
        tasks: action.payload,
      };

    default:
      return state;
  }
};



// Combining reducers
const rootReducer = combineReducers({
  user: userReducer,
  task: taskReducer,
});

export default rootReducer;
