/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

// TODO: Import reducers
// import authReducer from './slices/authSlice';
// import projectReducer from './slices/projectSlice';
// import assetReducer from './slices/assetSlice';
// import invoiceReducer from './slices/invoiceSlice';

const store = configureStore({
  reducer: {
    // auth: authReducer,
    // projects: projectReducer,
    // assets: assetReducer,
    // invoices: invoiceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
