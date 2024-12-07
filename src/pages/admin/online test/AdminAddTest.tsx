import { BreadCrumb } from "primereact/breadcrumb"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { MenuItem } from "primereact/menuitem"
import { Link, useNavigate } from "react-router-dom"
import { PanelMenu } from "primereact/panelmenu"

const AdminAddTest = () => {
    const navigate = useNavigate()

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        { label: 'Online Test' },
        {
            label: 'Test',
            template: () => <Link to="/admin/test" style={{ textDecoration: 'none' }} className="font-semibold">Test</Link>
        },
        {
            template: () => <div className="text-primary font-semibold">Add</div>
        }
    ]

    const items: MenuItem[] = [
        {
            label: 'Full Test',
            icon: 'pi pi-arrow-right',
            command: () => navigate('/admin/test/add/full-test')
        },
        {
            label: 'Part',
            icon: 'pi pi-arrow-right',
            command: () => navigate('/admin/test/add/full-test')
        }
    ]

    return (
        <AdminLayout tabName="Test">
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
                <div className="flex flex-column align-items-center gap-3">
                    <h2 className="font-semibold text-primary">Select Test Category</h2>
                    <PanelMenu model={items} className="w-20rem" />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminAddTest