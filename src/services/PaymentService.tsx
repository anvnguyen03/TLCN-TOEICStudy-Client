import { ApiResponse } from '../types/type';
import apiClient from './AxiosAuthInterceptor';

const baseURL = '/payment';

export const callCreateVNPayPayment = async (userId: number, courseId: number, price: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.get<ApiResponse<string>>(`${baseURL}/vn-pay`, {
        params: {
            userId,
            courseId,
            price
        }
    });
    return response.data;
}; 