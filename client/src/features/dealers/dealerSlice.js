import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dealers';

export const fetchDealers = createAsyncThunk('dealers/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const createDealer = createAsyncThunk('dealers/create', async (dealerData, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, dealerData, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});


export const updateDealer = createAsyncThunk('dealers/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const deleteDealer = createAsyncThunk('dealers/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const dealerSlice = createSlice({
  name: 'dealers',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDealers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    .addCase(createDealer.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateDealer.fulfilled, (state, action) => {
        const index = state.list.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteDealer.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d._id !== action.payload);
      });
  },
});

export default dealerSlice.reducer;