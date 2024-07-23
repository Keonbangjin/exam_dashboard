import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Category {
  _id: string;
  image: string;
  name: string;
}

interface CategoryState {
  isLoading: boolean;
  isError: boolean;
  value: Category[];
}

const initialState: CategoryState = {
  isLoading: false,
  isError: false,
  value: []
}

export const fetchCategory = createAsyncThunk<Category[]>(
  'category/fetchCategory',
  async () => {
    const response = await axios.get("https://ecommerce-backend-fawn-eight.vercel.app/api/categories");
    return response.data;
  }
)

const CategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.value = action.payload;
      })
      .addCase(fetchCategory.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
  }
})

export default CategorySlice.reducer;
