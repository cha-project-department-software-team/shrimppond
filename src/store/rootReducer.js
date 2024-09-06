// src/store/rootReducer.js
import { combineReducers } from 'redux';
import sidebarReducer from './sidebarSlice';  // Import sidebarSlice

const rootReducer = combineReducers({
  sidebar: sidebarReducer,  // Thêm reducer sidebar vào rootReducer
  // Các reducer khác
});

export default rootReducer;
