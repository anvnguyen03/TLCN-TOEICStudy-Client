import { ApiResponse, EnrolledCardMatchingAnswerRequest, EnrolledCardMatchingResult, EnrolledMultipleChoiceAnswerRequest, EnrolledMultipleChoiceResult } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/do-course/enrolled'

export const callCheckEnrolledMultipleChoiceAnswers = async (
  answers: EnrolledMultipleChoiceAnswerRequest[],
  userId: number,
  lessonId: number
): Promise<ApiResponse<EnrolledMultipleChoiceResult>> => {
  const response = await apiClient.post<ApiResponse<EnrolledMultipleChoiceResult>>(
    `${baseURL}/multiple-choice/check-answers?userId=${userId}&lessonId=${lessonId}`,
    answers
  )
  return response.data
}

export const callCheckEnrolledCardMatchingAnswers = async (
  answer: EnrolledCardMatchingAnswerRequest,
  userId: number,
  lessonId: number
): Promise<ApiResponse<EnrolledCardMatchingResult>> => {
  const response = await apiClient.post<ApiResponse<EnrolledCardMatchingResult>>(
    `${baseURL}/card-matching/check-answers?userId=${userId}&lessonId=${lessonId}`,
    answer
  )
  return response.data
} 