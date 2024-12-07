import { Toast } from "primereact/toast"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"
import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { TestCategoryDTO } from "../../../types/type"
import { callGetAllTestCategories } from "../../../services/TestCategoryService"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Skeleton } from "primereact/skeleton"

const AdminCategory = () => {

    const toast = useRef<Toast>(null)
    const [categories, setCategories] = useState<TestCategoryDTO[]>()
    const [selectedCategory, setSelectedCategory] = useState<TestCategoryDTO | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        { label: 'Online Test' },
        {
            label: 'Category',
            template: () => <Link to="/admin/test-category" style={{ textDecoration: 'none' }} className="text-primary font-semibold">Category</Link>
        }
    ]

    useEffect(() => {
        const fetchAllTestCategories = async () => {
            try {
                setLoading(true)
                const response = await callGetAllTestCategories()
                if (response.data) {
                    setCategories(response.data)
                }
            } catch (error) {
                console.log(error)
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error while fetching test categories' })
            } finally {
                setLoading(false)
            }
        }
        fetchAllTestCategories()
    }, [])

    return (
        <AdminLayout tabName="Category">
            <Toast ref={toast} />
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
            <DataTable value={categories} paginator rows={5} selectionMode={'radiobutton'} selection={selectedCategory!}
                    onSelectionChange={(e) => setSelectedCategory(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }} ></Column>
                    <Column field="id" header="ID" body={loading && <Skeleton />} ></Column>
                    <Column field="name" header="Name" body={loading && <Skeleton />} ></Column>
                </DataTable>
            </div>
        </AdminLayout>
    )
}

export default AdminCategory