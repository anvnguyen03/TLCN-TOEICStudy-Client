import { Card } from "primereact/card"
import type { Course } from "./types"

interface CourseStatisticsProps {
  courses: Course[]
}

export const CourseStatistics = ({ courses }: CourseStatisticsProps) => {
  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length
  const draftCount = courses.filter((c) => c.status === "DRAFT").length

  return (
    <div className="grid mb-4">
      <div className="col-12 md:col-3">
        <Card>
          <div className="flex align-items-center">
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "3rem", height: "3rem" }}
            >
              <i className="pi pi-book text-blue-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <div className="text-500 font-medium mb-1">Total Courses</div>
              <div className="text-900 font-bold text-xl">{courses.length}</div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-12 md:col-3">
        <Card>
          <div className="flex align-items-center">
            <div
              className="flex align-items-center justify-content-center bg-green-100 border-round"
              style={{ width: "3rem", height: "3rem" }}
            >
              <i className="pi pi-check-circle text-green-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <div className="text-500 font-medium mb-1">Published</div>
              <div className="text-900 font-bold text-xl">{publishedCount}</div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-12 md:col-3">
        <Card>
          <div className="flex align-items-center">
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: "3rem", height: "3rem" }}
            >
              <i className="pi pi-clock text-orange-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <div className="text-500 font-medium mb-1">Draft</div>
              <div className="text-900 font-bold text-xl">{draftCount}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
