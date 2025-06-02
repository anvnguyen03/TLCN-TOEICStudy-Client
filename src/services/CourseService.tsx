import { ApiResponse, CourseCardDTO, CourseInfoDTO, CourseReviewDTO } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/course'

export const callGetAllPublishedCourses = async (): Promise<ApiResponse<CourseCardDTO[]>> => {
    const response = await apiClient.get<ApiResponse<CourseCardDTO[]>>(`${baseURL}/all-published`)
    return response.data
}

export const callGetCourseById = async (courseId: number): Promise<ApiResponse<CourseInfoDTO>> => {
    const response = await apiClient.get<ApiResponse<CourseInfoDTO>>(`${baseURL}/${courseId}`)
    return response.data
}

export const callGetCourseRecentReviews = async (courseId: number): Promise<ApiResponse<CourseReviewDTO[]>> => {
    const response = await apiClient.get<ApiResponse<CourseReviewDTO[]>>(`${baseURL}/${courseId}/recent-reviews`)
    return response.data
}