import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import streamerService from './streamerService'

const initialState = {
    streamers: [],
    isErrorStreamers: false,
    isSuccessStreamers: false,
    isLoadingStreamers: false,
    messageStreamers: ''
}

export const getStreamers = createAsyncThunk('streamers/getAll', async (thunkAPI) => {
    try {
        return await streamerService.getStreamers()
    } catch (error) {
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const streamerSlice = createSlice({
    name: 'streamer',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStreamers.pending, (state) => {
                state.isLoadingStreamers = true
            })
            .addCase(getStreamers.fulfilled, (state, action) => {
                state.isLoadingStreamers = false
                state.isSuccessStreamers = true
                state.streamers = action.payload
            })
            .addCase(getStreamers.rejected, (state, action) => {
                state.isLoadingStreamers = false
                state.isErrorStreamers = true
                state.messageStreamers = action.payload
            })
    }
})

export const {reset} = streamerSlice.actions
export default streamerSlice.reducer