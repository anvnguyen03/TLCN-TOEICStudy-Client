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

// ------------------ type for DTO got from API response ------------------
export type TestInfoDTO = {
    id: number
    title: string
    totalQuestions: number
    duration: number
    listeningAudio: string
}

export enum ETestItemType {
    PART = 'PART',
    QUESTION = 'QUESTION',
    QUESTION_GROUP = 'QUESTION_GROUP'
}

export type DisplayTestItemDTO = {
    type: ETestItemType
    startTimestamp?: number
    part?: PartDTO
    question?: QuestionDTO
    questionGroup?: QuestionGroupDTO
}

export type PartDTO = {
    id: number
    partNum: number
    content?: string
    startTimestamp?: number
}

export type QuestionGroupDTO = {
    id: number
    partNum: number
    name: string
    content?: string
    audio?: string
    images?: QuestionGroupImageDTO[]
    subQuestions: QuestionDTO[]
    startTimestamp?: number
}

export type QuestionGroupImageDTO = {
    id: number
    image: string
}

export type QuestionDTO = {
    id: number
    partNum: number
    orderNumber: number
    content?: string
    answer1: string
    answer2: string
    answer3: string
    answer4?: string
    image?: string
    audio?: string
    startTimestamp?: number
}
// ---------------------------------------------------------------

export type UserAnswerSheet = Map<OrderNumber, UserAnswer>

export type OrderNumber = number

export type UserAnswer = {
    displayItemIndex: number
    questionId: number
    answer?: string
    isMarked: boolean
}

// type for RadioButton
export type AnswerOption = {
    name: string
    key: string
}