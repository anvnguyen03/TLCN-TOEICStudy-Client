import { ApiResponse, UserLearningDTO } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/course-enrollment'

export const callGetUserLearningInfo= async (): Promise<ApiResponse<UserLearningDTO[]>> => {
    const response = await apiClient.get<ApiResponse<UserLearningDTO[]>>(`${baseURL}/user-learning`)
    return response.data
}