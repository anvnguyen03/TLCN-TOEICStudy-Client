import { Toast } from "primereact/toast"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"
import { Link } from "react-router-dom"

const AdminAccount = () => {

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        { label: 'User' },
        {
            label: 'Account',
            template: () => <Link to="/admin/account" style={{ textDecoration: 'none' }} className="text-primary font-semibold">Account</Link>
        }
    ]

    return (
        <AdminLayout tabName="Account">
            {/* <Toast ref={toast} /> */}
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
            </div>
        </AdminLayout>
    )
}

export default AdminAccount