import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/purchases';

export const fetchPurchases = createAsyncThunk('purchases/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const createPurchase = createAsyncThunk('purchases/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, data, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const purchaseSlice = createSlice({
  name: 'purchases',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default purchaseSlice.reducer;