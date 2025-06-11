import type { Course } from "../../components/admin/course/types"
import type { ApiResponse } from "../../types/type"
import apiClient from "../AxiosAuthInterceptor"

const baseURL = "/admin/course"

export const callGetAllCourseDetail = async (): Promise<ApiResponse<Course[]>> => {
  const response = await apiClient.get<ApiResponse<Course[]>>(`${baseURL}/all`)
  return response.data
}

export const callCreateCourse = async (course: Course): Promise<ApiResponse<Course>> => {
  // Create FormData for multipart/form-data request
  const formData = new FormData()

  // Add basic course information
  formData.append("title", course.title)
  formData.append("description", course.description)
  formData.append("objective", course.objective)
  formData.append("price", course.price.toString())
  formData.append("status", course.status)
  formData.append("level", course.level)

  // Add preview video URL if exists
  if (course.previewVideoUrl) {
    formData.append("previewVideoUrl", course.previewVideoUrl)
  }

  // Add thumbnail file if exists
  if (course.thumbnailFile) {
    formData.append("thumbnail", course.thumbnailFile)
  }

  // Add sections as individual form fields (Spring Boot can handle this format)
  if (course.sections && course.sections.length > 0) {
    course.sections.forEach((section, sectionIndex) => {
      formData.append(`sections[${sectionIndex}].title`, section.title)
      formData.append(`sections[${sectionIndex}].orderIndex`, (section.orderIndex || sectionIndex + 1).toString())

      // Add lessons for each section
      if (section.lessons && section.lessons.length > 0) {
        section.lessons.forEach((lesson, lessonIndex) => {
          const lessonPrefix = `sections[${sectionIndex}].lessons[${lessonIndex}]`

          formData.append(`${lessonPrefix}.title`, lesson.title)
          formData.append(`${lessonPrefix}.description`, lesson.description)
          formData.append(`${lessonPrefix}.type`, lesson.type)
          formData.append(`${lessonPrefix}.orderIndex`, (lesson.orderIndex || lessonIndex + 1).toString())
          formData.append(`${lessonPrefix}.isFree`, lesson.isFree.toString())

          if (lesson.duration) {
            formData.append(`${lessonPrefix}.duration`, lesson.duration.toString())
          }

          if (lesson.content) {
            formData.append(`${lessonPrefix}.content`, lesson.content)
          }

          // Add video file if exists
          if (lesson.videoFile && lesson.type === "VIDEO") {
            formData.append(`${lessonPrefix}.video`, lesson.videoFile)
          }

          // Add quiz questions
          if (lesson.quizQuestions && lesson.quizQuestions.length > 0) {
            lesson.quizQuestions.forEach((question, questionIndex) => {
              const questionPrefix = `${lessonPrefix}.quizQuestions[${questionIndex}]`

              formData.append(`${questionPrefix}.question`, question.question)
              formData.append(`${questionPrefix}.type`, question.type)
              formData.append(`${questionPrefix}.orderIndex`, (question.orderIndex || questionIndex + 1).toString())

              // Add multiple choice options
              if (question.option && question.type === "MULTIPLE_CHOICE") {
                formData.append(`${questionPrefix}.option.optionText1`, question.option.optionText1)
                formData.append(`${questionPrefix}.option.optionText2`, question.option.optionText2)
                formData.append(`${questionPrefix}.option.optionText3`, question.option.optionText3)
                formData.append(`${questionPrefix}.option.correctOption`, question.option.correctOption)
              }

              // Add card matching pairs
              if (question.pairs && question.type === "CARD_MATCHING") {
                question.pairs.forEach((pair, pairIndex) => {
                  const pairPrefix = `${questionPrefix}.pairs[${pairIndex}]`
                  formData.append(`${pairPrefix}.prompt`, pair.prompt)
                  formData.append(`${pairPrefix}.answer`, pair.answer)
                  formData.append(`${pairPrefix}.orderIndex`, (pair.orderIndex || pairIndex + 1).toString())
                })
              }
            })
          }
        })
      }
    })
  }

  console.log("FormData entries:")
  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }

  const response = await apiClient.post<ApiResponse<Course>>(`${baseURL}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export const callUpdateCourse = async (courseId: number, course: Course): Promise<ApiResponse<Course>> => {
  // Create FormData for multipart/form-data request
  const formData = new FormData()

  // Add basic course information
  formData.append("title", course.title)
  formData.append("description", course.description)
  formData.append("objective", course.objective)
  formData.append("price", course.price.toString())
  formData.append("status", course.status)
  formData.append("level", course.level)

  // Add preview video URL if exists
  if (course.previewVideoUrl) {
    formData.append("previewVideoUrl", course.previewVideoUrl)
  }

  // Add thumbnail file if exists
  if (course.thumbnailFile) {
    formData.append("thumbnail", course.thumbnailFile)
  }

  // Add sections as individual form fields
  if (course.sections && course.sections.length > 0) {
    course.sections.forEach((section, sectionIndex) => {
      if (section.id) {
        formData.append(`sections[${sectionIndex}].id`, section.id.toString())
      }
      formData.append(`sections[${sectionIndex}].title`, section.title)
      formData.append(`sections[${sectionIndex}].orderIndex`, (section.orderIndex || sectionIndex + 1).toString())

      // Add lessons for each section
      if (section.lessons && section.lessons.length > 0) {
        section.lessons.forEach((lesson, lessonIndex) => {
          const lessonPrefix = `sections[${sectionIndex}].lessons[${lessonIndex}]`

          if (lesson.id) {
            formData.append(`${lessonPrefix}.id`, lesson.id.toString())
          }
          formData.append(`${lessonPrefix}.title`, lesson.title)
          formData.append(`${lessonPrefix}.description`, lesson.description)
          formData.append(`${lessonPrefix}.type`, lesson.type)
          formData.append(`${lessonPrefix}.orderIndex`, (lesson.orderIndex || lessonIndex + 1).toString())
          formData.append(`${lessonPrefix}.isFree`, lesson.isFree.toString())

          if (lesson.duration) {
            formData.append(`${lessonPrefix}.duration`, lesson.duration.toString())
          }

          if (lesson.content) {
            formData.append(`${lessonPrefix}.content`, lesson.content)
          }

          // Add video file if exists
          if (lesson.videoFile && lesson.type === "VIDEO") {
            formData.append(`${lessonPrefix}.video`, lesson.videoFile)
          }

          // Add quiz questions
          if (lesson.quizQuestions && lesson.quizQuestions.length > 0) {
            lesson.quizQuestions.forEach((question, questionIndex) => {
              const questionPrefix = `${lessonPrefix}.quizQuestions[${questionIndex}]`

              if (question.id) {
                formData.append(`${questionPrefix}.id`, question.id.toString())
              }
              formData.append(`${questionPrefix}.question`, question.question)
              formData.append(`${questionPrefix}.type`, question.type)
              formData.append(`${questionPrefix}.orderIndex`, (question.orderIndex || questionIndex + 1).toString())

              // Add multiple choice options
              if (question.option && question.type === "MULTIPLE_CHOICE") {
                if (question.option.id) {
                  formData.append(`${questionPrefix}.option.id`, question.option.id.toString())
                }
                formData.append(`${questionPrefix}.option.optionText1`, question.option.optionText1)
                formData.append(`${questionPrefix}.option.optionText2`, question.option.optionText2)
                formData.append(`${questionPrefix}.option.optionText3`, question.option.optionText3)
                formData.append(`${questionPrefix}.option.correctOption`, question.option.correctOption)
              }

              // Add card matching pairs
              if (question.pairs && question.type === "CARD_MATCHING") {
                question.pairs.forEach((pair, pairIndex) => {
                  const pairPrefix = `${questionPrefix}.pairs[${pairIndex}]`
                  if (pair.id) {
                    formData.append(`${pairPrefix}.id`, pair.id.toString())
                  }
                  formData.append(`${pairPrefix}.prompt`, pair.prompt)
                  formData.append(`${pairPrefix}.answer`, pair.answer)
                  formData.append(`${pairPrefix}.orderIndex`, (pair.orderIndex || pairIndex + 1).toString())
                })
              }
            })
          }
        })
      }
    })
  }

  const response = await apiClient.put<ApiResponse<Course>>(`${baseURL}/update/${courseId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}
