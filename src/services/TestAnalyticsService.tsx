import { ApiResponse, TestAnalyticsDTO } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/analytic'

export const callGetTestAnalytics = async (): Promise<ApiResponse<TestAnalyticsDTO>> => {
    const response = await apiClient.get<ApiResponse<TestAnalyticsDTO>>(`${baseURL}/test`)
    return response.data
}