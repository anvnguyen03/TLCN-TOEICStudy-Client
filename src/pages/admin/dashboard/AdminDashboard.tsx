import { BreadCrumb } from "primereact/breadcrumb"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { MenuItem } from "primereact/menuitem"
import { Link } from "react-router-dom"

const AdminDashboard = () => {

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        {
            label: 'Dashboard',
            template: () => <Link to="/admin/dashboard" style={{textDecoration: 'none'}} className="text-primary font-semibold">Dashboard</Link>
        }
    ]

    return (
        <AdminLayout tabName="Dashboard">
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
                Admin Dashboard
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard