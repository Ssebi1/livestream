import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import categoryService from './categoryService'

const initialState = {
    categories: [],
    isErrorCategories: false,
    isSuccessCategories: false,
    isLoadingCategories: false,
    messageCategories: ''
}

export const getCategories = createAsyncThunk('categories/getAll', async (thunkAPI) => {
    try {
        return await categoryService.getCategories()
    } catch (error) {
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getCategory = createAsyncThunk('categories/get', async (id, thunkAPI) => {
    try {
        return await categoryService.getCategory(id)
    } catch (error) {
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.isLoadingCategories = true
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.isLoadingCategories = false
                state.isSuccessCategories = true
                state.categories = action.payload
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.isLoadingCategories = false
                state.isErrorCategories = true
                state.messageCategories = action.payload
            })
            .addCase(getCategory.pending, (state) => {
                state.isLoadingCategories = true
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.isLoadingCategories = false
                state.isSuccessCategories = true
                state.stream = action.payload
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.isLoadingCategories = false
                state.isErrorCategories = true
                state.messageCategories = action.payload
            })
    }
})

export const {reset} = categorySlice.actions
export default categorySlice.reducer