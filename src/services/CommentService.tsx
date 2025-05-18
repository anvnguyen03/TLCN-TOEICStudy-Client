import { ApiResponse, CommentDTO, CommentRequest } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/comment'

export const callGetCommentByTest= async (testId: number): Promise<ApiResponse<CommentDTO[]>> => {
    const response = await apiClient.get<ApiResponse<CommentDTO[]>>(`${baseURL}/test/${testId}`)
    return response.data
}

export const callAddComment= async (commentRequest: CommentRequest): Promise<ApiResponse<CommentDTO>> => {
    const response = await apiClient.post<ApiResponse<CommentDTO>>(`${baseURL}/add`, commentRequest)
    return response.data
}

export const callDeleteComment= async (commentId: number): Promise<ApiResponse<CommentDTO>> => {
    const response = await apiClient.delete<ApiResponse<CommentDTO>>(`${baseURL}/delete/${commentId}`)
    return response.data
}