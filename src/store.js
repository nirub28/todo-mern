import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import {thunk} from 'redux-thunk'; 
import rootReducer from './reducer';

// Configuration object for Redux Persist
const persistConfig = {
  key: 'root', // key used to access the persisted state in the storage
  storage,
};

// Persisted reducer using the persistReducer function
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = createStore(persistedReducer, applyMiddleware(thunk));

// Create the Redux persistor to persist data
const persistor = persistStore(store);

export { store, persistor };
