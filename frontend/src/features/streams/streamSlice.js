import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import streamService from './streamService'

const initialState = {
    streams: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const createStream = createAsyncThunk('streams/create', async (streamData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await streamService.createStream(streamData, token)
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getStreams = createAsyncThunk('streams/getAll', async (thunkAPI) => {
    try {
        return await streamService.getStreams()
    } catch (error) {
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const streamSlice = createSlice({
    name: 'stream',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createStream.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createStream.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.streams.push(action.payload)
            })
            .addCase(createStream.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getStreams.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getStreams.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.streams = action.payload
            })
            .addCase(getStreams.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset} = streamSlice.actions
export default streamSlice.reducer