import type { ApiResponse, AITestAnalysisDTO, TestAnalyticsDTO } from "../types/type"
import apiClient from "./AxiosAuthInterceptor"

const baseURL = "/ai-analysis"

export const callGetLatestAIAnalysis = async (): Promise<ApiResponse<AITestAnalysisDTO>> => {
  try {
    const response = await apiClient.get<ApiResponse<AITestAnalysisDTO>>(`${baseURL}/latest`)
    return response.data
  } catch (error) {
    console.error("Error fetching latest AI analysis:", error)
    throw error
  }
}

export const callRequestAIAnalysis = async (analytics: TestAnalyticsDTO): Promise<ApiResponse<AITestAnalysisDTO>> => {
  try {
    const response = await apiClient.post<ApiResponse<AITestAnalysisDTO>>(`${baseURL}/test`, analytics)
    return response.data
  } catch (error) {
    console.error("Error requesting AI analysis:", error)
    throw error
  }
}
