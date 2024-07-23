import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
    _id: string;
    title: string;
    subtitle: string;
    image: string;
    description: string;
    rate: number;
    price: number;
    color: string;
    size: string;
}

interface ProductState {
    isLoading: boolean;
    isError: boolean;
    value: Product[];
}

const initialState: ProductState = {
    isLoading: false,
    isError: false,
    value: []
};

export const fetchProduct = createAsyncThunk<Product[]>(
    'product/fetch',
    async () => {
        try {
            const response = await axios.get("https://ecommerce-backend-fawn-eight.vercel.app/api/products");
            return response.data;
        } catch (error) {
            throw new Error("Failed to fetch products");
        }
    }
);

export const editProduct = createAsyncThunk<Product, { _id: string; data: Partial<Product> }>(
    'product/edit',
    async ({ _id, data }) => {
        try {
            const response = await axios.put(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${_id}`, data);
            return response.data;
        } catch (error) {
            throw new Error("Failed to edit product");
        }
    }
);

const ProductSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProduct.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.value = action.payload;
            })
            .addCase(fetchProduct.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                const updatedProduct = action.payload;
                const index = state.value.findIndex(product => product._id === updatedProduct._id);
                if (index !== -1) {
                    state.value[index] = updatedProduct;
                }
            })
            .addCase(editProduct.rejected, (state) => {
                state.isError = true;
            });
    }
});

export default ProductSlice.reducer;
