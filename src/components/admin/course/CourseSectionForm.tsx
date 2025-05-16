"use client"

import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Panel } from "primereact/panel"
import { Divider } from "primereact/divider"
import { Badge } from "primereact/badge"
import type { CourseSection, Lesson, QuizQuestion } from "./types"
import { LessonForm } from "./LessonForm"

interface CourseSectionFormProps {
  section: CourseSection
  sectionIndex: number
  onUpdate: (section: CourseSection) => void
  onDelete: () => void
  onAddLesson: () => void
}

export const CourseSectionForm = ({
  section,
  sectionIndex,
  onUpdate,
  onDelete,
  onAddLesson,
}: CourseSectionFormProps) => {
  const updateLesson = (lessonIndex: number, lesson: Lesson) => {
    const updatedLessons = [...(section.lessons || [])]
    updatedLessons[lessonIndex] = lesson
    onUpdate({ ...section, lessons: updatedLessons })
  }

  const deleteLesson = (lessonIndex: number) => {
    const updatedLessons = section.lessons?.filter((_, i) => i !== lessonIndex) || []
    onUpdate({ ...section, lessons: updatedLessons })
  }

  const addQuizQuestion = (lessonIndex: number) => {
    const newQuestion: QuizQuestion = {
      question: "",
      type: "MULTIPLE_CHOICE",
      orderIndex: (section.lessons?.[lessonIndex]?.quizQuestions?.length || 0) + 1,
      option: {
        orderIndex: 1,
        optionText1: "",
        optionText2: "",
        optionText3: "",
        correctOption: "",
      },
      pairs: [],
    }

    const updatedLessons = [...(section.lessons || [])]
    updatedLessons[lessonIndex].quizQuestions = [...(updatedLessons[lessonIndex].quizQuestions || []), newQuestion]
    onUpdate({ ...section, lessons: updatedLessons })
  }

  const getLessonsSummary = () => {
    const lessonCount = section.lessons?.length || 0
    if (lessonCount === 0) return "No lessons"
    return `${lessonCount} lesson${lessonCount > 1 ? "s" : ""}`
  }

  return (
    <Panel
      className="mb-3"
      toggleable
      collapsed={true} // Start collapsed for better UX when editing
      headerTemplate={(options) => (
        <div className="flex justify-content-between align-items-center w-full">
          <div className="flex align-items-center gap-2">
            <Button
              icon={options.collapsed ? "pi pi-chevron-right" : "pi pi-chevron-down"}
              onClick={options.onTogglerClick}
              text
              size="small"
            />
            <i className="pi pi-folder mr-2 text-blue-500"></i>
            <span className="font-bold">
              Section {sectionIndex + 1}: {section.title || "Untitled Section"}
            </span>
            <Badge value={getLessonsSummary()} className="ml-2" />
          </div>
          <div className="flex gap-2">
            <Button
              icon="pi pi-trash"
              size="small"
              severity="danger"
              text
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              tooltip="Delete Section"
            />
          </div>
        </div>
      )}
    >
      <div className="grid">
        <div className="col-12">
          <label className="block text-900 font-medium mb-2">Section Title *</label>
          <InputText
            value={section.title || ""}
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
            className="w-full"
            placeholder="Enter section title"
          />
        </div>
      </div>

      <Divider />

      <div className="flex justify-content-between align-items-center mb-3">
        <h5 className="font-bold">Lessons</h5>
        <Button label="Add Lesson" icon="pi pi-plus" size="small" outlined onClick={onAddLesson} />
      </div>

      {section.lessons && section.lessons.length > 0 ? (
        section.lessons.map((lesson, lessonIndex) => (
          <LessonForm
            key={`${section.id || sectionIndex}-lesson-${lesson.id || lessonIndex}`}
            lesson={lesson}
            lessonIndex={lessonIndex}
            sectionIndex={sectionIndex}
            onUpdate={(updatedLesson) => updateLesson(lessonIndex, updatedLesson)}
            onDelete={() => deleteLesson(lessonIndex)}
            onAddQuizQuestion={() => addQuizQuestion(lessonIndex)}
          />
        ))
      ) : (
        <div className="text-center py-4 border-2 border-dashed border-300 border-round">
          <i className="pi pi-folder-open text-4xl text-400 mb-3"></i>
          <p className="text-600 m-0">No lessons added yet. Click "Add Lesson" to get started.</p>
        </div>
      )}
    </Panel>
  )
}
