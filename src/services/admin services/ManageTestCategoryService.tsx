import { ApiResponse, TestInfoDTO } from '../../types/type'
import apiClient from '../AxiosAuthInterceptor'

const baseURL = '/admin/test-category'

export const callGetAllTestInfo = async (): Promise<ApiResponse<TestInfoDTO[]>> => {
    const response = await apiClient.get<ApiResponse<TestInfoDTO[]>>(`${baseURL}/all`)
    return response.data
}