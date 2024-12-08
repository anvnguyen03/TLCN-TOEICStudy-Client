import { ApiResponse, UserDTO } from '../../types/type'
import apiClient from '../AxiosAuthInterceptor'

const baseURL = '/admin/user'

export const callGetAllUsers = async (): Promise<ApiResponse<UserDTO[]>> => {
    const response = await apiClient.get<ApiResponse<UserDTO[]>>(`${baseURL}/all`)
    return response.data
}