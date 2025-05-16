export interface Course {
    id?: number
    title: string
    description: string
    objective: string
    thumbnailUrl?: string
    thumbnailFile?: File
    previewVideoUrl?: string
    price: number
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
    sections?: CourseSection[]
    createdAt?: string
    updatedAt?: string
  }
  
  export interface CourseSection {
    id?: number
    title: string
    orderIndex: number
    lessons?: Lesson[]
  }
  
  export interface Lesson {
    id?: number
    title: string
    description: string
    type: "VIDEO" | "TEXT" | "QUIZ"
    duration?: number
    orderIndex: number
    isFree: boolean
    content?: string
    videoUrl?: string
    videoFile?: File
    quizQuestions?: QuizQuestion[]
  }
  
  export interface QuizQuestion {
    id?: number
    question: string
    type: "MULTIPLE_CHOICE" | "CARD_MATCHING"
    orderIndex: number
    option?: QuizQuestionOption
    pairs?: CardMatchingPair[]
  }
  
  export interface QuizQuestionOption {
    id?: number
    orderIndex: number
    optionText1: string
    optionText2: string
    optionText3: string
    correctOption: string
  }
  
  export interface CardMatchingPair {
    id?: number
    prompt: string
    answer: string
    orderIndex: number
  }
  