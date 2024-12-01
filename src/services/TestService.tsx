import { ApiResponse, GetTestInfoPaginRequest, TestInfoPagingDTO, UserResultDTO } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/test'

export const callGetTestInfoPaging = async (request: GetTestInfoPaginRequest): Promise<ApiResponse<TestInfoPagingDTO>> => {
    const { keyword, page, size } = request
    const response = await apiClient.get<ApiResponse<TestInfoPagingDTO>>(`${baseURL}/all-published`, {
        params: {
            keyword,    // tự động bỏ qua nếu là undefined
            page,
            size
        }
    })
    return response.data
}

export const callGetUserResult = async (resultId: number): Promise<ApiResponse<UserResultDTO>> => {
    const response = await apiClient.get<ApiResponse<UserResultDTO>>(`${baseURL}/results/${resultId}`)
    return response.data
}