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
    id: number
}

// ------------------ type for DTO got from API response ------------------

export interface QuizQuestion {
    id: number;
    type: 'MULTIPLE_CHOICE' | 'CARD_MATCHING';
    orderIndex: number;
    question: string;
    option?: {
      id: number;
      orderIndex: number;
      optionText1: string;
      optionText2: string;
      optionText3: string;
    };
    pairs?: {
      prompts: { id: number; content: string }[];
      answers: { content: string }[];
    };
  }
  
  export interface Lesson {
    id: number;
    title: string;
    description: string | null;
    type: 'VIDEO' | 'TEXT' | 'QUIZ';
    duration: number;
    orderIndex: number;
    isFree: boolean;
    content: string | null;
    videoUrl: string | null;
    quizQuestions: QuizQuestion[];
  }

export interface CourseInfoDTO {
    id: number;
    title: string;
    rating: number;
    totalReviews: number;
    students: number;
    objective: string;
    description: string;
    previewVideoUrl: string;
    thumbnailUrl: string;
    price: number;
    duration: number;
    totalSections: number;
    totalLessons: number;
    sections: {
        id: number;
        title: string;
        orderIndex: number;
        totalLessons: number;
        duration: number;
        lessons: {
            id: number;
            title: string;
            orderIndex: number;
            duration: number;
            type: string | null;
            free: boolean;
        }[];
    }[];
}

export interface CourseReviewDTO {
    id: number;
    username: string;
    comment: string;
    rating: number;
    createdAt: string;
}

export type CourseCardDTO = {
    id: number
    title: string
    lessons: number
    students: number
    level: string
    rating: number
    price: number
    image: string
}

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

export type UserDTO = {
    id: number
    fullname: string
    email: string
    role: string
    activated: boolean
}

export type ResultHistoryByTest = {
    testTitle: string
    userResults: UserResultDTO[]
}

export type CommentDTO = {
    id: number
    content: string
    createdAt: string
    updatedAt: string
    userId: number
    username: string
    testId: number
    parentId?: number
    children: CommentDTO[]
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

export type CommentRequest = {
    content: string
    userId: number
    testId: number
    parentId?: number
}

// Quiz Trial Types
export interface TrialMultipleChoiceAnswerRequest {
  quizQuestionId: number;
  selectedOption: string;
}

export interface TrialCardMatchingAnswerRequest {
  quizQuestionId: number;
  pairs: {
    promptId: number;
    answerContent: string;
  }[];
}

export interface TrialMultipleChoiceResult {
  totalQuestions: number;
  correctAnswers: number;
  results: {
    quizQuestionId: number;
    correctOption: string;
    selectedOption: string;
    correct: boolean;
  }[];
}

export interface TrialCardMatchingResult {
  totalPairs: number;
  correctPairs: number;
  results: {
    promptId: number;
    selectedAnswer: string;
    correctAnswer: string;
    correct: boolean;
  }[];
}
