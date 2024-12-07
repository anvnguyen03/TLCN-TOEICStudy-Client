import { ApiResponse, TestInfoDTO } from '../../types/type'
import apiClient from '../AxiosAuthInterceptor'

const baseURL = '/admin/test'

export const callGetAllTestInfo = async (): Promise<ApiResponse<TestInfoDTO[]>> => {
    const response = await apiClient.get<ApiResponse<TestInfoDTO[]>>(`${baseURL}/all`)
    return response.data
}

// Không cần phải tự set 'Content-Type', Axios sẽ tự động làm việc này khi sử dụng FormData
export const callUploadFullTest = async (formData: FormData): Promise<ApiResponse<number>> => {
    const response = await apiClient.post<ApiResponse<number>>(`${baseURL}/upload/full-test`, formData)
    return response.data
}

export const callDeleteTest = async (testId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete<ApiResponse<string>>(`${baseURL}/delete`, {
        params: {
            testId
        }
    })
    return response.data
}