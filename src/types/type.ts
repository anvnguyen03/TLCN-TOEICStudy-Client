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
export enum ETestStatus {
    DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
	INACTIVE = 'INACTIVE'
}

export type TestInfoDTO = {
    id: number
	title: string
	duration: number
	totalAttemps: number
	totalComments: number
	totalParts: number
	totalQuestions: number
	testCategory: string
	listeningAudio: string
	status: ETestStatus
	isUserAttemped: boolean
}

export type TestInfoPagingDTO = {
    tests: TestInfoDTO[]
    totalPages: number
    totalElements: number
    currentPageIndex: number
    numberOfElements: number
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

export type ReviewQuestionDTO = {
    id: number
    partNum: number
    orderNumber: number
    content?: string
    answer1: string
    answer2: string
    answer3: string
    answer4?: string
    images?: string[]
    groupContent?: string
    audio?: string
    startTimestamp?: number

    correctAnswer: string
    transcript: string
}

export type UserResultDTO = {
    id: number
    correctAnswers: number
    incorrectAnswers: number
    skippedAnswers: number
    listeningCorrects: number
    readingCorrects: number
    listeningScore: number
    readingScore: number
    totalScore: number
    completionTime: number // in seconds
    accuracy: number
    completedAt: string
    attempStatus: string
    testMode: string
    userId: number
    testId: number
    testTitle: string
    userAnswers: UserAnswerDTO[]
}

export type UserAnswerDTO = {
    id: number
    userResultId: number
    selectedAnswer: string
    correct: boolean
    question: ReviewQuestionDTO
}

export type TestCategoryDTO = {
    id: number
    name: string
}
// -------------------- Do-Test item type --------------------

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

// ------------------ type for DTO to send API request ------------------
export type SubmitAnswer = {
    questionId: number
    answer: string | null
}

export enum ETestMode {
    SIMULATION = 'SIMULATION',
    PRACTICE = 'PRACTICE'
}

export type SubmitFullTestRequest = {
    email: string
    testId: number
    testMode: ETestMode
    completionTime: number
    userAnswers: SubmitAnswer[]
}

export type GetTestInfoPaginRequest = {
    keyword?: string
    testCategoryId?: number
    page: number
    size: number
}