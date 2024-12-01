import { ApiResponse, TestCategoryDTO } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/test-category'

export const callGetAllTestCategories = async (): Promise<ApiResponse<TestCategoryDTO[]>> => {
    const response = await apiClient.get<ApiResponse<TestCategoryDTO[]>>(`${baseURL}/all`)
    return response.data
}