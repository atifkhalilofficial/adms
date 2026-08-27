import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vehicles';

export const fetchVehicles = createAsyncThunk('vehicles/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const createVehicle = createAsyncThunk('vehicles/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, data, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default vehicleSlice.reducer;