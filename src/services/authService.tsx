/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { ApiResponse } from '../types/backend';

const baseURL = 'http://localhost:8080/api/v1/auth'

export const callRegister = async (
    formData: { fullname: string; email: string; password: string; }
): Promise<ApiResponse<any>> => {
    const response = await axios.post<ApiResponse<any>>(`${baseURL}/register`, formData)
    return response.data
}

export const callVerify = async ( formData: { email: string, otp: null | undefined | string | number } ): Promise<ApiResponse<any>> => {
    const response = await axios.post<ApiResponse<any>>(`${baseURL}/register/verify`, formData)
    return response.data
}

export const callLogin = async ( formData: { email: string, password: string }): Promise<ApiResponse<any>> => {
    const response = await axios.post<ApiResponse<any>>(`${baseURL}/login`, formData)
    return response.data
}