export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const ADD_TASK = "ADD_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const SET_TODOS="SET_TODOS";
export const UPDATE_TODO="UPDATE_TODO";
export const SET_TODOS_ORDER = "SET_TODOS_ORDER";


// Define action creators
const login = (userData) => ({
  type: LOGIN,
  payload: userData,
});

const logout = () => ({
  type: LOGOUT,
});

const addTask = (task) => ({
  type: ADD_TASK,
  payload: task,
});

const deleteTask = (taskId) => ({
  type: DELETE_TASK,
  payload: { id: taskId },
});

const setTodos = (data) =>({
  type:SET_TODOS,
  payload:data,
})

const updateTask = (taskId) =>({
  type:UPDATE_TODO,
  payload:{ id: taskId }
})

const setTodosOrder = (todos) => ({
  type: SET_TODOS_ORDER,
  payload: todos,
});

export { login, logout, addTask, deleteTask, setTodos,updateTask, setTodosOrder };
