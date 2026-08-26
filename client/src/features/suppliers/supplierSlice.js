import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/suppliers';

export const fetchSuppliers = createAsyncThunk('suppliers/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const createSupplier = createAsyncThunk('suppliers/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, data, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default supplierSlice.reducer;