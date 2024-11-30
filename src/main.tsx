import React from 'react';
import { RouterProvider } from 'react-router-dom';
import './css/style.css';
import './css/satoshi.css';
import './App.css';
// import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { ConfigProvider } from 'antd';
import { antdConfig } from './constants';
import router from './routes';
import { Provider } from 'react-redux';
import store from './redux/store';
import * as ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider {...antdConfig}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
);
