import apiClient from './AxiosAuthInterceptor'

const baseURL = '/video-serve'

export const fetchVideoBlob = async (
    courseId: number,
    lessonId: number,
    filename: string
  ): Promise<string> => {
    const response = await apiClient.get(
      `${baseURL}/stream/${courseId}/${lessonId}/${filename}`,
      {
        responseType: 'blob', // Very important for video streaming
      }
    )
  
    // Tạo URL blob từ dữ liệu nhị phân
    const blobUrl = URL.createObjectURL(response.data)
    return blobUrl
  }
