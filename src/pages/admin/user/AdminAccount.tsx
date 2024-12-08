import { Toast } from "primereact/toast"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"
import { Link } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react"
import { UserDTO } from "../../../types/type"
import * as ManageUserService from "../../../services/admin services/ManageUserService"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Skeleton } from "primereact/skeleton"
import { Tag } from "primereact/tag"
import { Button } from "primereact/button"

const AdminAccount = () => {
    const toast = useRef<Toast>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [users, setUsers] = useState<UserDTO[]>([])
    const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null)

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        { label: 'User' },
        {
            label: 'Account',
            template: () => <Link to="/admin/account" style={{ textDecoration: 'none' }} className="text-primary font-semibold">Account</Link>
        }
    ]

    const getSeverity = (activated: boolean) => {
        switch (activated) {
            case true:
                return 'success'
            case false:
                return 'danger'
            default:
                return null
        }
    }

    const activatedBodyTemplate = (user: UserDTO) => {
        return <Tag value={`${user.activated}`} severity={getSeverity(user.activated)}></Tag>
    }

    const actionBodyTemplate = (user: UserDTO) => {

        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" />
                <Button icon="pi pi-trash" rounded outlined severity="danger" />
            </React.Fragment>
        )
    }

    const fetchAllUsers = async () => {
        setLoading(true)
        try {
            const response = await ManageUserService.callGetAllUsers()
            if (response.data) {
                setUsers(response.data)
            }
        } catch (error) {
            console.log(error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error while fetching users' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllUsers()
    }, [])

    return (
        <AdminLayout tabName="Account">
            <Toast ref={toast} />
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
                <DataTable value={users} paginator rows={8} selectionMode={'radiobutton'} selection={selectedUser!}
                    onSelectionChange={(e) => setSelectedUser(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="id" header="ID" body={loading && <Skeleton />}></Column>
                    <Column field="fullname" header="Full Name" sortable body={loading && <Skeleton />}></Column>
                    <Column field="email" header="Email" sortable body={loading && <Skeleton />}></Column>
                    <Column field="role" header="Role" sortable body={loading && <Skeleton />}></Column>
                    <Column field="activated" header="Activated" body={loading ? <Skeleton /> : activatedBodyTemplate}></Column>
                    <Column body={loading ? <Skeleton /> : actionBodyTemplate}></Column>
                </DataTable>
            </div>
        </AdminLayout>
    )
}

export default AdminAccount