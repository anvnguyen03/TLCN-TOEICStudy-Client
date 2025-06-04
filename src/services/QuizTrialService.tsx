import { ApiResponse, TrialCardMatchingAnswerRequest, TrialCardMatchingResult, TrialMultipleChoiceAnswerRequest, TrialMultipleChoiceResult } from '../types/type'
import apiClient from './AxiosAuthInterceptor'

const baseURL = '/do-course/trial'

export const callCheckMultipleChoiceAnswers = async (answers: TrialMultipleChoiceAnswerRequest[]): Promise<ApiResponse<TrialMultipleChoiceResult>> => {
    const response = await apiClient.post<ApiResponse<TrialMultipleChoiceResult>>(`${baseURL}/multiple-choice/check-answers`, answers)
    return response.data
}

export const callCheckCardMatchingAnswers = async (answer: TrialCardMatchingAnswerRequest): Promise<ApiResponse<TrialCardMatchingResult>> => {
    const response = await apiClient.post<ApiResponse<TrialCardMatchingResult>>(`${baseURL}/card-matching/check-answers`, answer)
    return response.data
} 