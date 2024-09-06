// src/store/sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    expanded: true,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.expanded = !state.expanded;
    },
    setSidebar: (state, action) => {
      state.expanded = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
