import { ApiResponse, IFetchAccount, UserDTO } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/account'

export const callFetchAccount = async (): Promise<ApiResponse<IFetchAccount>> => {
    const response = await apiClient.get<ApiResponse<IFetchAccount>>(`${baseURL}/fetch-account`)
    return response.data
}

export const callChangePassword = async (password: string, newPassword: string): Promise<ApiResponse<UserDTO>> => {
    const response = await apiClient.post<ApiResponse<UserDTO>>(`${baseURL}/change-password`, null, {
        params: {
            password: password,
            newPassword: newPassword
        }
    })
    return response.data
}