import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const createProduct = createAsyncThunk('products/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, data, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const uploadProductImage = createAsyncThunk(
  'products/uploadImage',
  async ({ id, file }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post(`${API_URL}/${id}/image`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      })
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default productSlice.reducer;