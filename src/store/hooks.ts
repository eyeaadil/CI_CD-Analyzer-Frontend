/**
 * Custom Hooks for Redux
 * 
 * Use these hooks instead of plain `useDispatch` and `useSelector`
 * They are typed correctly for our store.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use these hooks in your components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
