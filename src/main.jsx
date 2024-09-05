import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Để quản lý routing
// import { Provider } from 'react-redux'; // Redux Provider để bao bọc store
import App from './App'; // File gốc của bạn
import './index.css'; // CSS chính của dự án
// import { store } from './store'; // Import store từ index.jsx

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </React.StrictMode>
);
