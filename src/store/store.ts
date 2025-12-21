/**
 * Redux Store Configuration
 * 
 * This is the main store configuration file.
 * All slices are combined here.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// Create the store
export const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add more reducers here as needed
        // repos: reposReducer,
        // dashboard: dashboardReducer,
    },
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
