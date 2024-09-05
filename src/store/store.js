import { configureStore } from '@reduxjs/toolkit';
// Giả sử bạn có một rootReducer, có thể tạo file rootReducer.js để kết hợp các reducers (nếu có)
import rootReducer from './rootReducer';  // Import rootReducer từ file khác

const store = configureStore({
  reducer: rootReducer,  // Bạn sẽ cấu hình các reducers tại đây
});

export default store;
