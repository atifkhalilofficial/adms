import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/deliveries';

export const fetchDeliveries = createAsyncThunk('deliveries/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const createDelivery = createAsyncThunk('deliveries/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, data, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateDeliveryStatus = createAsyncThunk(
  'deliveries/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/status`,
        { status },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const deliverySlice = createSlice({
  name: 'deliveries',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDelivery.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createDelivery.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default deliverySlice.reducer;