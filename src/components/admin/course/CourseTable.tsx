"use client"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Tag } from "primereact/tag"
import { Badge } from "primereact/badge"
import { Card } from "primereact/card"
import type { Course } from "./types"

interface CourseTableProps {
  courses: Course[]
  selectedCourse: Course | null
  loading: boolean
  onSelectionChange: (course: Course) => void
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export const CourseTable = ({
  courses,
  selectedCourse,
  loading,
  onSelectionChange,
  onEdit,
  onDelete,
}: CourseTableProps) => {

  const statusBodyTemplate = (rowData: Course) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case "PUBLISHED":
          return "success"
        case "DRAFT":
          return "warning"
        case "ARCHIVED":
          return "danger"
        default:
          return "info"
      }
    }
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
  }

  const levelBodyTemplate = (rowData: Course) => {
    const getColor = (level: string) => {
      switch (level) {
        case "BEGINNER":
          return "green"
        case "INTERMEDIATE":
          return "blue"
        case "ADVANCED":
          return "orange"
        default:
          return "gray"
      }
    }
    return <Badge value={rowData.level} style={{ backgroundColor: getColor(rowData.level) }} />
  }

  const priceBodyTemplate = (rowData: Course) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(rowData.price)
  }

  const sectionsBodyTemplate = (rowData: Course) => {
    return <Badge value={rowData.sections?.length || 0} />
  }

  const actionBodyTemplate = (rowData: Course) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          size="small"
          outlined
          tooltip="View Course"
          onClick={() => {
            onSelectionChange(rowData)
            window.open(`/courses/${rowData.id}`, '_blank')
          }}
        />
        <Button
          icon="pi pi-pencil"
          size="small"
          severity="info"
          outlined
          tooltip="Edit Course"
          onClick={() => onEdit(rowData)}
        />
        {/* <Button
          icon="pi pi-trash"
          size="small"
          severity="danger"
          outlined
          tooltip="Delete Course"
          onClick={() => onDelete(rowData)}
        /> */}
      </div>
    )
  }

  return (
    <Card>
      <h3 className="text-xl font-bold mb-3">All Courses</h3>
      <DataTable
        value={courses}
        paginator
        rows={10}
        selectionMode="single"
        selection={selectedCourse}
        onSelectionChange={(e) => onSelectionChange(e.value)}
        dataKey="id"
        loading={loading}
        emptyMessage="No courses found"
        className="p-datatable-sm"
      >
        <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
        <Column field="id" header="ID" sortable style={{ width: "5rem" }} />
        <Column field="title" header="Title" sortable />
        <Column field="level" header="Level" body={levelBodyTemplate} sortable />
        <Column field="status" header="Status" body={statusBodyTemplate} sortable />
        <Column field="price" header="Price" body={priceBodyTemplate} sortable />
        <Column header="Sections" body={sectionsBodyTemplate} />
        <Column field="createdAt" header="Created" sortable />
        <Column header="Actions" body={actionBodyTemplate} style={{ width: "12rem" }} />
      </DataTable>
    </Card>
  )
}
