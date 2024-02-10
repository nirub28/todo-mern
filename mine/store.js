// store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Import your reducers
import userReducer from './reducer'; 

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers as needed
});

// Configuration object for Redux Persist
const persistConfig = {
  key: 'root', // key used to access the persisted state in the storage
  storage, // storage engine to be used (localStorage in this case)
};

// Create a persisted reducer using the persistReducer function
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
