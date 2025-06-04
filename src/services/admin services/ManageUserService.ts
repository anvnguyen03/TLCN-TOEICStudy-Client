import { ApiResponse, PaginatedResponse, UpdateUserRequest, UserDTO } from "../../types/type"
import apiClient from "../AxiosAuthInterceptor"

const API_URL = "/admin/user"

export interface SearchUserParams {
    keyword?: string
    role?: 'USER' | 'ADMIN'
    isActivated?: boolean | 'ALL'
}

export interface UserDetailDTO extends UserDTO {
    testHistory: {
        id: number
        testTitle: string
        score: number
        completedAt: string
    }[]
    totalTestsTaken: number
    averageScore: number
}

export const callGetAllUsers = async (): Promise<ApiResponse<PaginatedResponse<UserDTO>>> => {
    const response = await apiClient.get(`${API_URL}/all`)
    return response.data
}

export const callSearchUsers = async (params: SearchUserParams): Promise<ApiResponse<UserDTO[]>> => {
    const response = await apiClient.get(`${API_URL}/search`, { params })
    return response.data
}

export const callGetUserDetail = async (userId: number): Promise<ApiResponse<UserDetailDTO>> => {
    const response = await apiClient.get(`${API_URL}/${userId}`)
    return response.data
}

export const callUpdateUser = async (user: UpdateUserRequest): Promise<ApiResponse<UserDTO>> => {
    const response = await apiClient.put(`${API_URL}/update`, user)
    return response.data
}

export const callToggleUserStatus = async (userId: number, isActivated: boolean): Promise<ApiResponse<UserDTO>> => {
    const response = await apiClient.put(`${API_URL}/toggle-status`, null, {
        params: { userId, isActivated }
    })
    return response.data
}

export const callDeleteUser = async (userId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`${API_URL}/delete`, {
        params: { userId }
    })
    return response.data
}

export const callExportUsers = async (format: string = 'xlsx'): Promise<Blob> => {
    const response = await apiClient.get(`${API_URL}/export`, {
        params: { format },
        responseType: 'blob'
    })
    return response.data
}