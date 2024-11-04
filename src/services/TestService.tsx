import { ApiResponse, DisplayTestItemDTO } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/do-test'

export const callGetDisplayTestItems = async (testId: number): Promise<ApiResponse<DisplayTestItemDTO[]>> => {
    const response = await apiClient.get<ApiResponse<DisplayTestItemDTO[]>>(`${baseURL}/${testId}/get-test-items`)
    return response.data
}