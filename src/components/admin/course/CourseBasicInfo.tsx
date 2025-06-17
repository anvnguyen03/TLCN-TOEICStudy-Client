import { useState, useEffect } from "react"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { FileUpload } from "primereact/fileupload"
import { Editor } from "primereact/editor"
import { Image } from "primereact/image"
import TurndownService from "turndown"
import { marked } from "marked"
import type { Course } from "./types"

interface CourseBasicInfoProps {
  courseForm: Course
  setCourseForm: (course: Course) => void
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

export const CourseBasicInfo = ({ courseForm, setCourseForm }: CourseBasicInfoProps) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(courseForm.thumbnailUrl || null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [descriptionHtml, setDescriptionHtml] = useState<string>("")
  const [objectiveHtml, setObjectiveHtml] = useState<string>("")

  const statusOptions = [
    { label: "Draft", value: "DRAFT" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Archived", value: "ARCHIVED" },
  ]

  const levelOptions = [
    { label: "Beginner", value: "BEGINNER" },
    { label: "Advanced", value: "ADVANCED" },
  ]

  // Convert markdown to HTML when courseForm changes (loading data)
  useEffect(() => {
    const convertMarkdownToHtml = async () => {
      if (courseForm.description) {
        const html = await marked(courseForm.description)
        setDescriptionHtml(html)
      }
      if (courseForm.objective) {
        const html = await marked(courseForm.objective)
        setObjectiveHtml(html)
      }
    }

    convertMarkdownToHtml()
  }, [courseForm.description, courseForm.objective])

  const handleThumbnailUpload = (event: any) => {
    const file = event.files[0]
    if (file) {
      setThumbnailFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setThumbnailPreview(base64)
        // Store the file object or base64 for form submission
        setCourseForm({ ...courseForm, thumbnailUrl: base64, thumbnailFile: file })
      }
      reader.readAsDataURL(file)
    }
    // Clear the FileUpload component
    if (event.options && event.options.clear) {
      event.options.clear()
    }
  }

  const handleDescriptionChange = (htmlValue: string) => {
    setDescriptionHtml(htmlValue)
    // Convert HTML back to markdown for storage
    const markdownValue = turndownService.turndown(htmlValue)
    setCourseForm({ ...courseForm, description: markdownValue })
  }

  const handleObjectiveChange = (htmlValue: string) => {
    setObjectiveHtml(htmlValue)
    // Convert HTML back to markdown for storage
    const markdownValue = turndownService.turndown(htmlValue)
    setCourseForm({ ...courseForm, objective: markdownValue })
  }

  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <label htmlFor="title" className="block text-900 font-medium mb-2">
          Course Title *
        </label>
        <InputText
          id="title"
          value={courseForm.title}
          onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
          className="w-full"
          placeholder="Enter course title"
        />
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="price" className="block text-900 font-medium mb-2">
          Price (VND) *
        </label>
        <InputNumber
          id="price"
          value={courseForm.price}
          onValueChange={(e) => setCourseForm({ ...courseForm, price: e.value || 0 })}
          mode="currency"
          currency="VND"
          locale="vi-VN"
          className="w-full"
        />
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="level" className="block text-900 font-medium mb-2">
          Level *
        </label>
        <Dropdown
          id="level"
          value={courseForm.level}
          options={levelOptions}
          onChange={(e) => setCourseForm({ ...courseForm, level: e.value })}
          className="w-full"
          placeholder="Select level"
        />
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="status" className="block text-900 font-medium mb-2">
          Status *
        </label>
        <Dropdown
          id="status"
          value={courseForm.status}
          options={statusOptions}
          onChange={(e) => setCourseForm({ ...courseForm, status: e.value })}
          className="w-full"
          placeholder="Select status"
        />
      </div>
      <div className="col-12">
        <label htmlFor="description" className="block text-900 font-medium mb-2">
          Description * (Markdown Supported)
        </label>
        <div className="mb-2 text-sm text-500">
          <strong>Markdown Tips:</strong> Use **bold**, *italic*, # Header, ## Subheader, * List items, [link](url),
          `code`
        </div>
        <Editor
          id="description"
          value={descriptionHtml}
          onTextChange={(e) => handleDescriptionChange(e.htmlValue || "")}
          style={{ height: "200px" }}
          placeholder="Enter course description"
        />
      </div>
      <div className="col-12">
        <label htmlFor="objective" className="block text-900 font-medium mb-2">
          Learning Objectives (Markdown Supported)
        </label>
        <div className="mb-2 text-sm text-500">
          <strong>Markdown Tips:</strong> Use **bold**, *italic*, # Header, ## Subheader, * List items, [link](url),
          `code`
        </div>
        <Editor
          id="objective"
          value={objectiveHtml}
          onTextChange={(e) => handleObjectiveChange(e.htmlValue || "")}
          style={{ height: "150px" }}
          placeholder="What will students learn?"
        />
      </div>
      <div className="col-12 md:col-6">
        <label className="block text-900 font-medium mb-2">Course Thumbnail</label>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          chooseLabel="Choose Thumbnail"
          className="w-full mb-3"
          onSelect={handleThumbnailUpload}
          auto
        />
        {thumbnailPreview && (
          <div className="mt-3 border-1 border-300 border-round p-2">
            <label className="block text-600 font-medium mb-2">Thumbnail Preview</label>
            <div className="flex justify-content-center">
              <Image
                src={thumbnailPreview || "/placeholder.svg"}
                alt="Course Thumbnail"
                width="200"
                preview
                className="border-round"
                imageClassName="border-round"
              />
            </div>
            {thumbnailFile && (
              <div className="mt-2 text-center">
                <small className="text-600">
                  File: {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(1)} KB)
                </small>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="preview_video" className="block text-900 font-medium mb-2">
          Preview Video URL
        </label>
        <InputText
          id="preview_video"
          value={courseForm.previewVideoUrl || ""}
          onChange={(e) => setCourseForm({ ...courseForm, previewVideoUrl: e.target.value })}
          className="w-full"
          placeholder="YouTube video URL"
        />
        {courseForm.previewVideoUrl && (
          <div className="mt-3 border-1 border-300 border-round p-2">
            <label className="block text-600 font-medium mb-2">Video Preview</label>
            <div className="flex justify-content-center">
              <iframe
                width="100%"
                height="150"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(courseForm.previewVideoUrl)}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string {
  if (!url) return ""

  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  return match && match[2].length === 11 ? match[2] : ""
}
