import { Toast } from "primereact/toast"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { BreadCrumb } from "primereact/breadcrumb"
import type { MenuItem } from "primereact/menuitem"
import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Dialog } from "primereact/dialog"
import { TabView, TabPanel } from "primereact/tabview"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"

// Import CSS
import "../../../components/admin/course/course-styles.css"

// Import components
import type { Course } from "../../../components/admin/course/types"
import { CourseStatistics } from "../../../components/admin/course/CourseStatistics"
import { CourseTable } from "../../../components/admin/course/CourseTable"
import { CourseBasicInfo } from "../../../components/admin/course/CourseBasicInfo"
import { CourseContent } from "../../../components/admin/course/CourseContent"
import {
  callGetAllCourseDetail,
  callCreateCourse,
  callUpdateCourse,
  callDeleteCourse,
} from "../../../services/admin services/ManageCourserService"
import type { ApiResponse } from "../../../types/type"

const AdminCourse = () => {
  const toast = useRef<Toast>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showCourseDialog, setShowCourseDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  // Course form state
  const [courseForm, setCourseForm] = useState<Course>({
    title: "",
    description: "",
    objective: "",
    price: 0,
    status: "DRAFT",
    level: "BEGINNER",
    sections: [],
  })

  const home: MenuItem = { icon: "pi pi-home", url: "/admin/dashboard" }
  const itemsBreadCrumb: MenuItem[] = [
    { label: "Course" },
    {
      label: "Course",
      template: () => (
        <Link to="/admin/course" style={{ textDecoration: "none" }} className="text-primary font-semibold">
          Course
        </Link>
      ),
    },
  ]

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await callGetAllCourseDetail()
      if (response.status === "OK" && response.data) {
        console.log("Fetched courses:", response.data)
        setCourses(response.data)
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Failed to fetch courses",
        })
      }
    } catch (error: any) {
      console.error("Error fetching courses:", error)
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error while fetching courses",
      })
    } finally {
      setLoading(false)
    }
  }

  const openNewCourseDialog = () => {
    setCourseForm({
      title: "",
      description: "",
      objective: "",
      price: 0,
      status: "DRAFT",
      level: "BEGINNER",
      sections: [],
    })
    setEditMode(false)
    setActiveTabIndex(0)
    setShowCourseDialog(true)
  }

  const openEditCourseDialog = (course: Course) => {
    console.log("Opening edit dialog for course:", course)

    // Deep clone the course to avoid reference issues
    const clonedCourse = JSON.parse(JSON.stringify(course))

    // Ensure all nested structures exist
    if (!clonedCourse.sections) {
      clonedCourse.sections = []
    }

    clonedCourse.sections.forEach((section: any) => {
      if (!section.lessons) {
        section.lessons = []
      }
      section.lessons.forEach((lesson: any) => {
        // Ensure lesson type is set
        if (!lesson.type) {
          lesson.type = "VIDEO" // Default type
        }
        // Ensure quiz questions array exists
        if (!lesson.quizQuestions) {
          lesson.quizQuestions = []
        }
      })
    })

    console.log("Processed course for editing:", clonedCourse)
    setCourseForm(clonedCourse)
    setEditMode(true)
    setActiveTabIndex(0)
    setShowCourseDialog(true)
  }

  const saveCourse = async () => {
    try {
      setLoading(true)
      let response: ApiResponse<Course>

      console.log("Saving course:", courseForm)

      if (editMode && courseForm.id) {
        response = await callUpdateCourse(courseForm.id, courseForm)
      } else {
        response = await callCreateCourse(courseForm)
      }

      if (response.status === "OK") {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: editMode ? "Course updated successfully" : "Course created successfully",
        })
        setShowCourseDialog(false)
        fetchCourses()
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Error saving course",
        })
      }
    } catch (error: any) {
      console.error("Error saving course:", error)
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error saving course",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteCourse = (course: Course) => {
    confirmDialog({
      message: `Are you sure you want to delete "${course.title}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          if (!course.id) {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Course ID is missing",
            })
            return
          }

          setLoading(true)
          const response = await callDeleteCourse(course.id)

          if (response.status === "OK") {
            toast.current?.show({
              severity: "success",
              summary: "Success",
              detail: "Course deleted successfully",
            })
            fetchCourses()
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: response.message || "Error deleting course",
            })
          }
        } catch (error: any) {
          console.error("Error deleting course:", error)
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error.message || "Error deleting course",
          })
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <AdminLayout tabName="Course">
      <Toast ref={toast} />
      <ConfirmDialog />
      <BreadCrumb model={itemsBreadCrumb} home={home} />

      <div className="layout-content">
        {/* Dashboard Header */}
        <div className="grid mb-4">
          <div className="col-12">
            <Card>
              <div className="flex justify-content-between align-items-center">
                <div>
                  <h2 className="text-2xl font-bold text-900 mb-2">Course Management</h2>
                  <p className="text-600 m-0">Manage your TOEIC courses, sections, and lessons</p>
                </div>
                <Button
                  label="Add New Course"
                  icon="pi pi-plus"
                  onClick={openNewCourseDialog}
                  className="p-button-lg"
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Statistics Cards */}
        <CourseStatistics courses={courses} />

        {/* Courses Table */}
        <CourseTable
          courses={courses}
          selectedCourse={selectedCourse}
          loading={loading}
          onSelectionChange={setSelectedCourse}
          onEdit={openEditCourseDialog}
          onDelete={deleteCourse}
        />

        {/* Course Creation/Edit Dialog */}
        <Dialog
          header={editMode ? "Edit Course" : "Create New Course"}
          visible={showCourseDialog}
          style={{ width: "90vw", maxWidth: "1200px" }}
          maximizable
          modal
          onHide={() => setShowCourseDialog(false)}
          footer={
            <div className="flex justify-content-end gap-2">
              <Button label="Cancel" icon="pi pi-times" outlined onClick={() => setShowCourseDialog(false)} />
              <Button label={editMode ? "Update" : "Create"} icon="pi pi-check" onClick={saveCourse} />
            </div>
          }
        >
          <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
            <TabPanel header="Basic Information" leftIcon="pi pi-info-circle mr-2">
              <CourseBasicInfo courseForm={courseForm} setCourseForm={setCourseForm} />
            </TabPanel>
            <TabPanel header="Course Content" leftIcon="pi pi-list mr-2">
              <CourseContent courseForm={courseForm} setCourseForm={setCourseForm} />
            </TabPanel>
          </TabView>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

export default AdminCourse
