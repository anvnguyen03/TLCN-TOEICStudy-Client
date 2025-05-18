/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { ApiResponse } from '../types/type';

const baseURL = 'http://localhost:8080/api/v1/auth'

export const callRegister = async (
    formData: { fullname: string; email: string; password: string; }
): Promise<ApiResponse<any>> => {
    const response = await axios.post<ApiResponse<any>>(`${baseURL}/register`, formData)
    return response.data
}

export const callVerify = async (formData: { email: string, otp: null | undefined | string | number }): Promise<ApiResponse<any>> => {
    const response = await axios.post<ApiResponse<any>>(`${baseURL}/register/verify`, formData)
    return response.data
}

export const callLogin = async (formData: { email: string, password: string }): Promise<ApiResponse<any>> => {
    const response = await axios.post<ApiResponse<any>>(`${baseURL}/login`, formData)
    return response.data
}

export const callForgotPass = async (email: string): Promise<ApiResponse<string>> => {
    const response = await axios.post<ApiResponse<string>>(`${baseURL}/forgot-password?email=${email}`)
    return response.data
}

export const callResetPass = async (resetPassRequest: { email: string, otp: null | undefined | string | number, newPassword: string }): Promise<ApiResponse<string>> => {
    const response = await axios.post<ApiResponse<string>>(`${baseURL}/forgot-password/reset-password`, resetPassRequest)
    return response.data
}