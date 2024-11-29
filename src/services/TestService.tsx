import { ApiResponse, UserResultDTO } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/test'

export const callGetUserResult = async (resultId: number): Promise<ApiResponse<UserResultDTO>> => {
    const response = await apiClient.get<ApiResponse<UserResultDTO>>(`${baseURL}/results/${resultId}`)
    return response.data
}