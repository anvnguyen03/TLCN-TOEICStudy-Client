import { ApiResponse, CourseDetailResponse } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/do-course'

export const callGetCompleteCourseDetail = async (courseId: number, userId: number): Promise<ApiResponse<CourseDetailResponse>> => {
    const response = await apiClient.get<ApiResponse<CourseDetailResponse>>(`${baseURL}/${courseId}/complete-course-detail`, {
        params: { userId }
    });
    return response.data;
};

export const callMarkLessonCompleted = async (courseId: number, lessonId: number, userId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`${baseURL}/${courseId}/lessons/${lessonId}/complete`, null, {
        params: { userId }
    });
    return response.data;
};

