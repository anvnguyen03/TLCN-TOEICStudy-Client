import { ApiResponse, AdminDashboardStats } from '../../types/type'
import apiClient from '../AxiosAuthInterceptor'

const baseURL = '/admin/analytic'

export const callGetDashboardStats = async (): Promise<ApiResponse<AdminDashboardStats>> => {
    const response = await apiClient.get<ApiResponse<AdminDashboardStats>>(`${baseURL}/dashboard`)
    return response.data
} 