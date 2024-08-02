import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    _id: "",
    name: "",
    email: "",
    phone: "",
    profile_pic: "",
    accessToken: "",
    onlineUser: [],
    socketConnection: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state._id = action?.payload?._id
            state.name = action?.payload?.name
            state.phone = action?.payload?.phone
            state.email = action?.payload?.email
            state.profile_pic = action?.payload?.profile_pic
        },
        setAll: (state, action) => {
            state._id = action?.payload?._id
            state.name = action?.payload.name
            state.phone = action?.payload
            state.email = action?.payload.email
            state.profile_pic = action?.payload.profile_pic
            state.accessToken = action?.payload.accessToken
            state.socketConnection = action?.payload.socketConnection
        },
        setToken: (state, action) => {
            state.accessToken = action.payload
        },
        logout: (state, action) => {
            state._id = ""
            state.name = ""
            state.email = ""
            state.phone = ""
            state.profile_pic = ""
            state.accessToken = ""
            state.socketConnection = null
        },
        setOnlineUser: (state, action) => {
            state.onlineUser = action.payload
        },
        setSocketConnection: (state, action) => {
            state.socketConnection = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const {setUser, setAll, setToken, logout, setOnlineUser, setSocketConnection} = userSlice.actions

export default userSlice.reducer