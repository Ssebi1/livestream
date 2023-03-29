import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import streamService from './streamService'

const initialState = {
    streams: [],
    stream: {
        user: {
        },
        category: {
        }
    },
    isErrorStreams: false,
    isSuccessStreams: false,
    isLoadingStreams: false,
    messageStreams: ''
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

export const getStream = createAsyncThunk('streams/get', async (id, thunkAPI) => {
    try {
        return await streamService.getStream(id)
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
                state.isLoadingStreams = false
                state.isSuccessStreams = true
                state.streams.push(action.payload)
            })
            .addCase(createStream.rejected, (state, action) => {
                state.isLoadingStreams = false
                state.isErrorStreams = true
                state.messageStreams = action.payload
            })
            .addCase(getStreams.pending, (state) => {
                state.isLoadingStreams = true
            })
            .addCase(getStreams.fulfilled, (state, action) => {
                state.isLoadingStreams = false
                state.isSuccessStreams = true
                state.streams = action.payload
            })
            .addCase(getStreams.rejected, (state, action) => {
                state.isLoadingStreams = false
                state.isErrorStreams = true
                state.messageStreams = action.payload
            })
            .addCase(getStream.pending, (state) => {
                state.isLoadingStreams = true
            })
            .addCase(getStream.fulfilled, (state, action) => {
                state.isLoadingStreams = false
                state.isSuccessStreams = true
                state.stream = action.payload
            })
            .addCase(getStream.rejected, (state, action) => {
                state.isLoadingStreams = false
                state.isErrorStreams = true
                state.messageStreams = action.payload
            })
    }
})

export const {reset} = streamSlice.actions
export default streamSlice.reducer