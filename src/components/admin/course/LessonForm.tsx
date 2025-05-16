"use client"

import { useState, useEffect } from "react"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { Checkbox } from "primereact/checkbox"
import { Editor } from "primereact/editor"
import { Button } from "primereact/button"
import { Panel } from "primereact/panel"
import { Tag } from "primereact/tag"
import TurndownService from "turndown"
import { marked } from "marked"
import type { Lesson, QuizQuestion } from "./types"
import { QuizQuestionForm } from "./QuizQuestionForm"
import { FileUpload } from "primereact/fileupload"

interface LessonFormProps {
  lesson: Lesson
  lessonIndex: number
  sectionIndex: number
  onUpdate: (lesson: Lesson) => void
  onDelete: () => void
  onAddQuizQuestion: () => void
}

// Initialize conversion services
const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "*",
  codeBlockStyle: "fenced",
})

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
})

export const LessonForm = ({
  lesson,
  lessonIndex,
  sectionIndex,
  onUpdate,
  onDelete,
  onAddQuizQuestion,
}: LessonFormProps) => {
  const [contentHtml, setContentHtml] = useState<string>("")
  const [videoFile, setVideoFile] = useState<File | null>(null)

  const lessonTypeOptions = [
    { label: "Video", value: "VIDEO" },
    { label: "Text", value: "TEXT" },
    { label: "Quiz", value: "QUIZ" },
  ]

  // Debug logging
  useEffect(() => {
    console.log("Lesson data:", lesson)
    console.log("Lesson type:", lesson.type)
    console.log("Lesson content:", lesson.content)
    console.log("Lesson videoUrl:", lesson.videoUrl)
    console.log("Lesson quizQuestions:", lesson.quizQuestions)
  }, [lesson])

  // Convert markdown to HTML when lesson content changes
  useEffect(() => {
    const convertMarkdownToHtml = async () => {
      if (lesson.content && lesson.type === "TEXT") {
        try {
          const html = await marked(lesson.content)
          setContentHtml(html)
          console.log("Converted markdown to HTML:", html)
        } catch (error) {
          console.error("Error converting markdown to HTML:", error)
          setContentHtml(lesson.content)
        }
      } else if (lesson.type === "TEXT") {
        setContentHtml("")
      }
    }

    convertMarkdownToHtml()
  }, [lesson.content, lesson.type])

  const updateQuizQuestion = (questionIndex: number, question: QuizQuestion) => {
    const updatedQuestions = [...(lesson.quizQuestions || [])]
    updatedQuestions[questionIndex] = question
    onUpdate({ ...lesson, quizQuestions: updatedQuestions })
  }

  const handleLessonTypeChange = (newType: "VIDEO" | "TEXT" | "QUIZ") => {
    console.log("Changing lesson type from", lesson.type, "to", newType)
    const updatedLesson = { ...lesson, type: newType }

    // Clear data fields based on the new type
    if (newType === "VIDEO") {
      updatedLesson.content = ""
      updatedLesson.quizQuestions = []
    } else if (newType === "TEXT") {
      updatedLesson.videoUrl = ""
      updatedLesson.videoFile = undefined
      updatedLesson.quizQuestions = []
    } else if (newType === "QUIZ") {
      updatedLesson.videoUrl = ""
      updatedLesson.videoFile = undefined
      updatedLesson.content = ""
      if (!updatedLesson.quizQuestions) {
        updatedLesson.quizQuestions = []
      }
    }

    onUpdate(updatedLesson)
  }

  const handleContentChange = (htmlValue: string) => {
    setContentHtml(htmlValue)
    try {
      const markdownValue = turndownService.turndown(htmlValue)
      onUpdate({ ...lesson, content: markdownValue })
    } catch (error) {
      console.error("Error converting HTML to markdown:", error)
      onUpdate({ ...lesson, content: htmlValue })
    }
  }

  const handleVideoUpload = (event: any) => {
    const file = event.files[0]
    if (file) {
      setVideoFile(file)
      onUpdate({
        ...lesson,
        videoUrl: file.name, // Store filename for display
        videoFile: file, // Store file object for upload
      })
    }
  }

  const getLessonTypeTag = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Tag value="Video" severity="info" icon="pi pi-video" />
      case "TEXT":
        return <Tag value="Text" severity="success" icon="pi pi-file-edit" />
      case "QUIZ":
        return <Tag value="Quiz" severity="warning" icon="pi pi-question-circle" />
      default:
        return <Tag value="Unknown" severity="secondary" />
    }
  }

  const getDurationDisplay = () => {
    if (!lesson.duration) return ""
    return `${lesson.duration} min`
  }

  const getFreeTag = () => {
    if (lesson.isFree) {
      return <Tag value="Free" severity="success" className="ml-2" />
    }
    return null
  }

  const getQuizQuestionsCount = () => {
    if (lesson.type === "QUIZ" && lesson.quizQuestions) {
      return ` (${lesson.quizQuestions.length} questions)`
    }
    return ""
  }

  const headerTemplate = (options: any) => {
    return (
      <div className="flex justify-content-between align-items-center w-full">
        <div className="flex align-items-center gap-2">
          <Button
            icon={options.collapsed ? "pi pi-chevron-right" : "pi pi-chevron-down"}
            onClick={options.onTogglerClick}
            text
            size="small"
          />
          <span className="font-bold">
            Lesson {lessonIndex + 1}: {lesson.title || "Untitled Lesson"}
          </span>
          {getLessonTypeTag(lesson.type)}
          {getFreeTag()}
          {lesson.duration && <span className="text-500 ml-2">({getDurationDisplay()})</span>}
          {getQuizQuestionsCount() && <span className="text-500 ml-2">{getQuizQuestionsCount()}</span>}
        </div>
        <Button
          icon="pi pi-trash"
          size="small"
          severity="danger"
          text
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          tooltip="Delete Lesson"
        />
      </div>
    )
  }

  return (
    <Panel headerTemplate={headerTemplate} toggleable collapsed={false} className="mb-3 lesson-panel">
      <div className="grid">
        <div className="col-12 md:col-6">
          <label className="block text-900 font-medium mb-2">Lesson Title *</label>
          <InputText
            value={lesson.title || ""}
            onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
            className="w-full"
            placeholder="Enter lesson title"
          />
        </div>
        <div className="col-12 md:col-3">
          <label className="block text-900 font-medium mb-2">Type *</label>
          <Dropdown
            value={lesson.type || "VIDEO"}
            options={lessonTypeOptions}
            onChange={(e) => handleLessonTypeChange(e.value)}
            className="w-full"
            placeholder="Select lesson type"
          />
        </div>
        <div className="col-12 md:col-3">
          <label className="block text-900 font-medium mb-2">Duration (min)</label>
          <InputNumber
            value={lesson.duration || null}
            onValueChange={(e) => onUpdate({ ...lesson, duration: e.value || undefined })}
            className="w-full"
            placeholder="Enter duration"
          />
        </div>
        <div className="col-12">
          <label className="block text-900 font-medium mb-2">Description</label>
          <InputTextarea
            value={lesson.description || ""}
            onChange={(e) => onUpdate({ ...lesson, description: e.target.value })}
            rows={2}
            className="w-full"
            placeholder="Enter lesson description"
          />
        </div>
        <div className="col-12">
          <div className="field-checkbox">
            <Checkbox
              inputId={`free-${sectionIndex}-${lessonIndex}`}
              checked={lesson.isFree || false}
              onChange={(e) => onUpdate({ ...lesson, isFree: e.checked || false })}
            />
            <label htmlFor={`free-${sectionIndex}-${lessonIndex}`} className="ml-2">
              Free Lesson
            </label>
          </div>
        </div>

        {/* Lesson Content Based on Type */}
        {(lesson.type === "VIDEO" || !lesson.type) && (
          <div className="col-12">
            <div className="mb-2">
              <Tag value="VIDEO CONTENT SECTION" severity="info" />
            </div>
            <label className="block text-900 font-medium mb-2">Upload Video File</label>
            <FileUpload
              mode="basic"
              accept="video/*"
              maxFileSize={500000000} // 500MB
              chooseLabel="Choose Video File"
              className="w-full mb-2"
              onSelect={handleVideoUpload}
              auto
            />
            {(lesson.videoUrl || videoFile) && (
              <div className="mt-2 p-2 bg-blue-50 border-round">
                <small className="text-600">Selected file: </small>
                <span className="font-medium">{lesson.videoUrl || videoFile?.name}</span>
                {videoFile && (
                  <div className="mt-1">
                    <small className="text-500">Size: {(videoFile.size / (1024 * 1024)).toFixed(1)} MB</small>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {lesson.type === "TEXT" && (
          <div className="col-12">
            <div className="mb-2">
              <Tag value="TEXT CONTENT SECTION" severity="success" />
            </div>
            <label className="block text-900 font-medium mb-2">Content (Markdown Supported)</label>
            <div className="mb-2 text-sm text-500">
              <strong>Markdown Tips:</strong> Use **bold**, *italic*, # Header, ## Subheader, * List items, [link](url),
              `code`
            </div>
            <Editor
              value={contentHtml}
              onTextChange={(e) => handleContentChange(e.htmlValue || "")}
              style={{ height: "200px" }}
              placeholder="Enter lesson content"
            />
            {lesson.content && (
              <div className="mt-2 p-2 bg-green-50 border-round">
                <small className="text-600">Stored markdown: </small>
                <code className="text-sm">{lesson.content.substring(0, 100)}...</code>
              </div>
            )}
          </div>
        )}

        {lesson.type === "QUIZ" && (
          <div className="col-12">
            <div className="mb-2">
              <Tag value="QUIZ CONTENT SECTION" severity="warning" />
            </div>
            <div className="flex justify-content-between align-items-center mb-3">
              <label className="block text-900 font-medium">Quiz Questions</label>
              <Button label="Add Question" icon="pi pi-plus" size="small" outlined onClick={onAddQuizQuestion} />
            </div>

            {lesson.quizQuestions && lesson.quizQuestions.length > 0 ? (
              lesson.quizQuestions.map((question, questionIndex) => (
                <QuizQuestionForm
                  key={`${lesson.id || lessonIndex}-question-${questionIndex}`}
                  question={question}
                  questionIndex={questionIndex}
                  onUpdate={(updatedQuestion) => updateQuizQuestion(questionIndex, updatedQuestion)}
                />
              ))
            ) : (
              <div className="text-center py-4 border-2 border-dashed border-300 border-round">
                <i className="pi pi-question-circle text-3xl text-400 mb-2"></i>
                <p className="text-600 m-0">No quiz questions added yet. Click "Add Question" to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Panel>
  )
}
