export interface ApiResponse<T> {
    status: string
    message: string
    data: T
    error: string | null
}

export interface IFetchAccount {
    email: string
    fullname: string
    role: string
}