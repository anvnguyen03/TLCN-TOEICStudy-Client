import { BreadCrumb } from "primereact/breadcrumb"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { MenuItem } from "primereact/menuitem"
import { Link } from "react-router-dom"

const AdminAddTest = () => {

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        { label: 'Online Test' },
        {
            label: 'Test',
            template: () => <Link to="/admin/test" style={{ textDecoration: 'none' }} className="font-semibold">Test</Link>
        },
        {
            template: () => <div className="text-primary font-semibold">Add new</div>
        }
    ]

    return (
        <AdminLayout tabName="Test">
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
                Add new test
            </div>
        </AdminLayout>
    )
}

export default AdminAddTest