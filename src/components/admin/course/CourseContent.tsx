"use client"

import { Button } from "primereact/button"
import type { Course, CourseSection, Lesson } from "./types"    
import { CourseSectionForm } from "./CourseSectionForm"

interface CourseContentProps {
  courseForm: Course
  setCourseForm: (course: Course) => void
}

export const CourseContent = ({ courseForm, setCourseForm }: CourseContentProps) => {
  const addSection = () => {
    const newSection: CourseSection = {
      title: "",
      orderIndex: (courseForm.sections?.length || 0) + 1,
      lessons: [],
    }
    setCourseForm({
      ...courseForm,
      sections: [...(courseForm.sections || []), newSection],
    })
  }

  const updateSection = (index: number, section: CourseSection) => {
    const updatedSections = [...(courseForm.sections || [])]
    updatedSections[index] = section
    setCourseForm({ ...courseForm, sections: updatedSections })
  }

  const deleteSection = (index: number) => {
    const updatedSections = courseForm.sections?.filter((_, i) => i !== index) || []
    setCourseForm({ ...courseForm, sections: updatedSections })
  }

  const addLesson = (sectionIndex: number) => {
    const newLesson: Lesson = {
      title: "",
      description: "",
      type: "VIDEO",
      orderIndex: (courseForm.sections?.[sectionIndex]?.lessons?.length || 0) + 1,
      isFree: false,
      quizQuestions: [],
    }

    const updatedSections = [...(courseForm.sections || [])]
    updatedSections[sectionIndex].lessons = [...(updatedSections[sectionIndex].lessons || []), newLesson]
    setCourseForm({ ...courseForm, sections: updatedSections })
  }

  return (
    <div>
      <div className="flex justify-content-between align-items-center mb-4">
        <h4 className="text-lg font-bold">Course Sections</h4>
        <Button label="Add Section" icon="pi pi-plus" size="small" onClick={addSection} />
      </div>

      {courseForm.sections?.map((section, sectionIndex) => (
        <CourseSectionForm
          key={sectionIndex}
          section={section}
          sectionIndex={sectionIndex}
          onUpdate={(updatedSection) => updateSection(sectionIndex, updatedSection)}
          onDelete={() => deleteSection(sectionIndex)}
          onAddLesson={() => addLesson(sectionIndex)}
        />
      )) || (
        <div className="text-center py-4">
          <i className="pi pi-folder-open text-4xl text-400 mb-3"></i>
          <p className="text-600">No sections added yet. Click "Add Section" to get started.</p>
        </div>
      )}
    </div>
  )
}
