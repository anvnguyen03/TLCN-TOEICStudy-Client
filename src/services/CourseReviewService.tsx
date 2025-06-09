import { ApiResponse, CourseReviewPagingDTO, CourseReviewRequest, ReviewStatistics } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/course-review'

export const callAddCourseReview= async (courseReviewRequest: CourseReviewRequest): Promise<ApiResponse<string>> => {
    const response = await apiClient.post<ApiResponse<string>>(`${baseURL}/create`, courseReviewRequest)
    return response.data
}

export const callUpdateCourseReview= async (courseReviewRequest: CourseReviewRequest): Promise<ApiResponse<string>> => {
    const response = await apiClient.put<ApiResponse<string>>(`${baseURL}/update`, courseReviewRequest)
    return response.data
}

export const callGetReviewStatistics= async (courseId: number): Promise<ApiResponse<ReviewStatistics>> => {
    const response = await apiClient.get<ApiResponse<ReviewStatistics>>(`${baseURL}/get-statistics/${courseId}`)
    return response.data
}

export const callGetCourseReviewPagination= async (courseId: number, page: number, size: number): Promise<ApiResponse<CourseReviewPagingDTO>> => {
    const response = await apiClient.get<ApiResponse<CourseReviewPagingDTO>>(`${baseURL}/get-reviews-pagination/${courseId}?page=${page}&size=${size}`)
    return response.data
}