import { ApiResponse, GetTestInfoPaginRequest, TestInfoDTO, TestInfoPagingDTO, UserResultDTO } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/test'

export const callGetTestInfoPaging = async (request: GetTestInfoPaginRequest): Promise<ApiResponse<TestInfoPagingDTO>> => {
    const { keyword, page, size, testCategoryId } = request
    const response = await apiClient.get<ApiResponse<TestInfoPagingDTO>>(`${baseURL}/all-published`, {
        params: {
            keyword,    // tự động bỏ qua nếu là undefined
            testCategoryId,
            page,
            size
        }
    })
    return response.data
}

export const callGetTestInfo = async (testId: number): Promise<ApiResponse<TestInfoDTO>> => {
    const response = await apiClient.get<ApiResponse<TestInfoDTO>>(`${baseURL}/${testId}/info`)
    return response.data
}

export const callGetUserResultsForUser = async (testId: number): Promise<ApiResponse<UserResultDTO[]>> => {
    const response = await apiClient.get<ApiResponse<UserResultDTO[]>>(`${baseURL}/${testId}/results`)
    return response.data
}

export const callGetUserResult = async (resultId: number): Promise<ApiResponse<UserResultDTO>> => {
    const response = await apiClient.get<ApiResponse<UserResultDTO>>(`${baseURL}/results/${resultId}`)
    return response.data
}