import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode";
import { callFetchAccount } from "../services/AccountService";

export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await callFetchAccount()
        return response
    }
)

interface DecodedToken {
    sub: string;
    role: string;
    fullname: string;
    userId: string;
  }

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    refreshToken: string | null
    role: string | null
    fullname: string | null
    email: string | null
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    role: null,
    fullname: null,
    email: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
            
            const { token, refreshToken } = action.payload
            const decodedToken: DecodedToken = jwtDecode(token)

            localStorage.setItem('token', token)
            state.isAuthenticated = true
            state.token = token
            state.refreshToken = refreshToken
            state.role = decodedToken.role
            state.fullname = decodedToken.fullname
            state.email = decodedToken.sub
        },
        logout: (state) => {
            localStorage.removeItem('token')
            state.isAuthenticated = false
            state.token = null
            state.refreshToken = null
            state.role = null
            state.fullname = null
            state.email = null
        }
    },
    extraReducers: (builder) => {

        builder.addCase(fetchAccount.pending, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false
            }
        })

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true
                state.email = action.payload.data.email
                state.fullname = action.payload.data.fullname
                state.role = action.payload.data.role
            }
        })

        builder.addCase(fetchAccount.rejected, (state, action) => {
            localStorage.removeItem('token')
            if (action.payload) {
                state.isAuthenticated = false
            }
        })
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer