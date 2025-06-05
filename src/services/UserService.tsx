import { ApiResponse, ResultHistoryByTest } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/user'

export const callGetTestHistory = async (): Promise<ApiResponse<ResultHistoryByTest[]>> => {
    const response = await apiClient.get<ApiResponse<ResultHistoryByTest[]>>(`${baseURL}/test-history`)
    return response.data
}

export const callUpdateInfo = async (fullname: string): Promise<ApiResponse<string>> => {
    const response = await apiClient.post<ApiResponse<string>>(`${baseURL}/update?fullname=${fullname}`)
    return response.data
}

export const callCheckCourseEnrollment = async (courseId: number): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get<ApiResponse<boolean>>(`${baseURL}/check-enrollment/${courseId}`)
    return response.data
}