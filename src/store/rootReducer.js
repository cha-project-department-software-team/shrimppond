import { combineReducers } from '@reduxjs/toolkit';
// Giả sử bạn có một slice reducer, import nó tại đây
import someReducer from './someReducer'; // Đây chỉ là ví dụ, bạn sẽ thay bằng reducer của bạn

const rootReducer = combineReducers({
  some: someReducer, // Đây là reducer của bạn
});

export default rootReducer;
