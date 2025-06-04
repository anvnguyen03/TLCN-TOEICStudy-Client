import { ApiResponse, PaginatedResponse, UpdateUserRequest, UserDTO } from "../../types/type"
import axios from "axios"

const API_URL = "http://localhost:8080/api/v1/admin/user"

// Get JWT token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
}

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

export async function callGetAllUsers(): Promise<ApiResponse<PaginatedResponse<UserDTO>>> {
    const response = await axios.get(`${API_URL}/all`, getAuthHeader())
    return response.data
}

export async function callSearchUsers(params: SearchUserParams): Promise<ApiResponse<UserDTO[]>> {
    const response = await axios.get(`${API_URL}/search`, {
        ...getAuthHeader(),
        params
    })
    return response.data
}

export async function callGetUserDetail(userId: number): Promise<ApiResponse<UserDetailDTO>> {
    const response = await axios.get(`${API_URL}/${userId}`, getAuthHeader())
    return response.data
}

export async function callUpdateUser(user: UpdateUserRequest): Promise<ApiResponse<UserDTO>> {
    const response = await axios.put(`${API_URL}/update`, user, getAuthHeader())
    return response.data
}

export async function callToggleUserStatus(userId: number, isActivated: boolean): Promise<ApiResponse<UserDTO>> {
    const response = await axios.put(`${API_URL}/toggle-status`, null, {
        ...getAuthHeader(),
        params: { userId, isActivated }
    })
    return response.data
}

export async function callDeleteUser(userId: number): Promise<ApiResponse<string>> {
    const response = await axios.delete(`${API_URL}/delete`, {
        ...getAuthHeader(),
        params: { userId }
    })
    return response.data
}

export async function callExportUsers(format: string = 'xlsx'): Promise<Blob> {
    const response = await axios.get(`${API_URL}/export`, {
        ...getAuthHeader(),
        params: { format },
        responseType: 'blob'
    })
    return response.data
} 