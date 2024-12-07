import { Toast } from "primereact/toast"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"
import { Link } from "react-router-dom"

const AdminTestResult = () => {

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        { label: 'User' },
        {
            label: 'Test Result',
            template: () => <Link to="/admin/user-result" style={{ textDecoration: 'none' }} className="text-primary font-semibold">Test result</Link>
        }
    ]

    return (
        <AdminLayout tabName="Test Result">
            {/* <Toast ref={toast} /> */}
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
            </div>
        </AdminLayout>
    )
}

export default AdminTestResult