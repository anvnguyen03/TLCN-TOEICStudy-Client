import { ApiResponse, ResultHistoryByTest } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/user'

export const callGetTestHistory = async (): Promise<ApiResponse<ResultHistoryByTest[]>> => {
    const response = await apiClient.get<ApiResponse<ResultHistoryByTest[]>>(`${baseURL}/test-history`)
    return response.data
}