import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../types/backend';

const baseURL = 'http://localhost:8080'

export const register = async (
    formData: { fullname: string; email: string; password: string; }
): Promise<ApiResponse<any>> => {
    try {
        const response = await axios.post<ApiResponse<any>>(`${baseURL}/api/v1/auth/register`, formData)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const verify = async ( formData: { email: string, otp: null | undefined | string | number } ): Promise<ApiResponse<any>> => {
    try {
        const response = await axios.post<ApiResponse<any>>(`${baseURL}/api/v1/auth/register/verify`, formData)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}