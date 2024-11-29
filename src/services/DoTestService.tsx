import { ApiResponse, DisplayTestItemDTO, SubmitFullTestRequest, UserResultDTO,  } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/do-test'

export const callGetDisplayTestItems = async (testId: number): Promise<ApiResponse<DisplayTestItemDTO[]>> => {
    const response = await apiClient.get<ApiResponse<DisplayTestItemDTO[]>>(`${baseURL}/${testId}/get-test-items`)
    return response.data
}

export const callSubmitFullTest = async (submitFullTestRequest: SubmitFullTestRequest): Promise<ApiResponse<UserResultDTO>> => {
    const response = await apiClient.post<ApiResponse<UserResultDTO>>(`${baseURL}/submit`, submitFullTestRequest)
    return response.data
}