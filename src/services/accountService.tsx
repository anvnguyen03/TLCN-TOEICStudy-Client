import { ApiResponse, IFetchAccount } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/account'

export const callFetchAccount = async (): Promise<ApiResponse<IFetchAccount>> => {
    const response = await apiClient.get<ApiResponse<IFetchAccount>>(`${baseURL}/fetch-account`)
    return response.data
}