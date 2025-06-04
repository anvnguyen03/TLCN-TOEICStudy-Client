import { Toast } from "primereact/toast"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"
import { Link } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react"
import { UserDTO, UpdateUserRequest } from "../../../types/type"
import * as ManageUserService from "../../../services/admin services/ManageUserService"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Skeleton } from "primereact/skeleton"
import { Tag } from "primereact/tag"
import { Button } from "primereact/button"
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { InputSwitch } from 'primereact/inputswitch'
import { saveAs } from 'file-saver'

const AdminAccount = () => {
    const toast = useRef<Toast>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [users, setUsers] = useState<UserDTO[]>([])
    const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null)
    const [editDialogVisible, setEditDialogVisible] = useState(false)
    const [detailDialogVisible, setDetailDialogVisible] = useState(false)
    const [editForm, setEditForm] = useState<UpdateUserRequest>({
        userId: 0,
        fullname: '',
        email: '',
        role: '',
        activated: false,
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: undefined,
        avatar: '',
        education: '',
        occupation: '',
        englishLevel: '',
        targetScore: undefined
    })
    const [showCustomEducation, setShowCustomEducation] = useState(false)
    const [showCustomOccupation, setShowCustomOccupation] = useState(false)
    const [globalFilter, setGlobalFilter] = useState('')
    const [filters, setFilters] = useState({
        role: 'ALL' as 'ALL' | 'USER' | 'ADMIN',
        isActivated: 'ALL' as boolean | 'ALL'
    })
    const [totalRecords, setTotalRecords] = useState(0)
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: 'id',
        sortOrder: 1
    })

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        { label: 'User' },
        {
            label: 'Account',
            template: () => <Link to="/admin/account" style={{ textDecoration: 'none' }} className="text-primary font-semibold">Account</Link>
        }
    ]

    const activatedBodyTemplate = (rowData: UserDTO) => {
        return (
            <div className="flex flex-column align-items-center gap-1">
                <Tag
                    value={rowData.activated ? 'Activated' : 'Deactivated'}
                    severity={rowData.activated ? 'success' : 'danger'}
                    className="text-xs py-1 px-2"
                />
                <InputSwitch
                    checked={rowData.activated}
                    onChange={(e) => handleToggleStatus(rowData.id, e.value)}
                    className="scale-75"
                />
            </div>
        )
    }

    const handleToggleStatus = async (userId: number, isActivated: boolean) => {
        try {
            const response = await ManageUserService.callToggleUserStatus(userId, isActivated)
            if (response.status === 'OK') {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'User status updated successfully' })
                loadUsers()
            }
        } catch (error) {
            console.error(error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update user status' })
        }
    }

    const confirmDelete = (user: UserDTO) => {
        confirmDialog({
            message: `Are you sure you want to delete user ${user.fullname}?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => handleDelete(user.id)
        })
    }

    const handleDelete = async (userId: number) => {
        try {
            const response = await ManageUserService.callDeleteUser(userId)
            if (response.status === 'OK') {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' })
                loadUsers()
            }
        } catch (error) {
            console.error(error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete user' })
        }
    }

    const handleEdit = (user: UserDTO) => {
        setSelectedUser(user)
        setEditForm({
            userId: user.id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            activated: user.activated,
            phone: user.phone || '',
            address: user.address || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender,
            avatar: user.avatar || '',
            education: user.education || '',
            occupation: user.occupation || '',
            englishLevel: user.englishLevel || '',
            targetScore: user.targetScore
        })
        setEditDialogVisible(true)
    }

    const handleViewDetail = (user: UserDTO) => {
        setSelectedUser(user)
        setDetailDialogVisible(true)
    }

    const handleUpdate = async () => {
        try {
            const response = await ManageUserService.callUpdateUser(editForm)
            if (response.status === 'OK') {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'User updated successfully' })
                setEditDialogVisible(false)
                loadUsers()
            }
        } catch (error) {
            console.error(error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update user' })
        }
    }

    const loadUsers = async () => {
        setLoading(true)
        try {
            if (globalFilter || filters.role !== 'ALL' || filters.isActivated !== 'ALL') {
                const response = await ManageUserService.callSearchUsers({
                    keyword: globalFilter || '',
                    role: filters.role === 'ALL' ? undefined : filters.role,
                    isActivated: filters.isActivated === 'ALL' ? undefined : filters.isActivated
                })
                if (response.data) {
                    setUsers(response.data)
                    setTotalRecords(response.data.length)
                }
            } else {
                const response = await ManageUserService.callGetAllUsers()
                if (response.data) {
                    setUsers(response.data.content)
                    setTotalRecords(response.data.totalElements)
                }
            }
        } catch (error) {
            console.log(error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error while fetching users' })
        } finally {
            setLoading(false)
        }
    }

    const handleExport = async () => {
        try {
            const blob = await ManageUserService.callExportUsers()
            saveAs(blob, 'users.xlsx')
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Users exported successfully' })
        } catch (error) {
            console.error(error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to export users' })
        }
    }

    useEffect(() => {
        loadUsers()
    }, [lazyState, globalFilter, filters])

    const editDialogFooter = (
        <div className="flex justify-content-end gap-2">
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                outlined 
                onClick={() => setEditDialogVisible(false)} 
                className="p-button-rounded"
            />
            <Button 
                label="Save" 
                icon="pi pi-check" 
                onClick={handleUpdate} 
                severity="success"
                className="p-button-rounded"
            />
        </div>
    )

    const detailDialogFooter = (
        <div>
            <Button label="Close" icon="pi pi-times" outlined onClick={() => setDetailDialogVisible(false)} />
        </div>
    )

    const header = (
        <div className="flex flex-column gap-3">
            <div className="flex justify-content-between align-items-center">
                <h2 className="text-xl font-bold m-0">User Management</h2>
                <Button
                    icon="pi pi-download"
                    label="Export"
                    onClick={handleExport}
                    className="p-button-success"
                />
            </div>
            <div className="flex flex-wrap gap-3">
                <span className="p-input-icon-left" style={{ width: '20rem' }}>
                    <i className="pi pi-search" style={{ left: '1.5rem' }} />
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search by name or email"
                        className="w-full pl-6"
                    />
                </span>
                <Dropdown
                    value={filters.role}
                    options={[
                        { label: 'All Roles', value: 'ALL' },
                        { label: 'User', value: 'USER' },
                        { label: 'Admin', value: 'ADMIN' }
                    ]}
                    onChange={(e) => setFilters({ ...filters, role: e.value as 'ALL' | 'USER' | 'ADMIN' })}
                    placeholder="Filter by Role"
                    className="w-12rem"
                />
                <Dropdown
                    value={filters.isActivated}
                    options={[
                        { label: 'All Status', value: 'ALL' },
                        { label: 'Activated', value: true },
                        { label: 'Deactivated', value: false }
                    ]}
                    onChange={(e) => setFilters({ ...filters, isActivated: e.value as boolean | 'ALL' })}
                    placeholder="Filter by Status"
                    className="w-12rem"
                />
            </div>
        </div>
    )

    return (
        <AdminLayout tabName="Account">
            <Toast ref={toast} />
            <ConfirmDialog />
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
                <DataTable
                    value={users}
                    paginator
                    rows={lazyState.rows}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: '50rem' }}
                    loading={loading}
                    globalFilter={globalFilter}
                    emptyMessage="No users found."
                    header={header}
                    selection={selectedUser}
                    onSelectionChange={(e) => setSelectedUser(e.value as UserDTO)}
                    dataKey="id"
                    lazy
                    totalRecords={totalRecords}
                    first={lazyState.first}
                    onPage={(e) => setLazyState({ ...lazyState, first: e.first || 0, rows: e.rows || 10, page: e.page || 0 })}
                    onSort={(e) => setLazyState({ ...lazyState, sortField: e.sortField || 'id', sortOrder: e.sortOrder || 1 })}
                >
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="id" header="ID" sortable body={loading && <Skeleton />}></Column>
                    <Column field="fullname" header="Full Name" sortable body={loading && <Skeleton />}></Column>
                    <Column field="email" header="Email" sortable body={loading && <Skeleton />}></Column>
                    <Column field="role" header="Role" sortable body={loading && <Skeleton />}></Column>
                    <Column field="activated" header="Status" body={loading ? <Skeleton /> : activatedBodyTemplate}></Column>
                    <Column
                        header="Actions"
                        body={(rowData) => (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-eye"
                                    rounded
                                    text
                                    severity="info"
                                    onClick={() => handleViewDetail(rowData as UserDTO)}
                                    className="action-button"
                                    style={{ 
                                        color: '#8B4513',
                                        border: '1px solid #8B4513'
                                    }}
                                />
                                <Button
                                    icon="pi pi-pencil"
                                    rounded
                                    text
                                    severity="info"
                                    onClick={() => handleEdit(rowData as UserDTO)}
                                    className="action-button"
                                    style={{ 
                                        color: '#0d6efd',
                                        border: '1px solid #0d6efd'
                                    }}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    rounded
                                    text
                                    severity="danger"
                                    onClick={() => confirmDelete(rowData as UserDTO)}
                                    className="action-button danger"
                                    style={{ 
                                        color: '#dc3545',
                                        border: '1px solid #dc3545'
                                    }}
                                />
                            </div>
                        )}
                    />
                </DataTable>

                <Dialog visible={editDialogVisible} style={{ width: '700px' }} header="Edit User" modal className="edit-dialog" footer={editDialogFooter} onHide={() => setEditDialogVisible(false)}>
                    <div className="edit-form">
                        <div className="form-section">
                            <h3 className="section-title">Basic Information</h3>
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input 
                                            type="text"
                                            value={editForm.fullname} 
                                            onChange={(e) => setEditForm({...editForm, fullname: e.target.value})} 
                                            required 
                                            autoFocus 
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input 
                                            type="email"
                                            value={editForm.email} 
                                            readOnly 
                                            className="readonly"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Role *</label>
                                        <select 
                                            value={editForm.role} 
                                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                            required
                                        >
                                            <option value="">Select Role</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="USER">User</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Status</label>
                                        <div className="flex align-items-center gap-2">
                                            <InputSwitch
                                                checked={editForm.activated}
                                                onChange={(e) => setEditForm({...editForm, activated: e.value})}
                                            />
                                            <span>{editForm.activated ? 'Activated' : 'Deactivated'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Personal Information</h3>
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input 
                                            type="tel"
                                            value={editForm.phone} 
                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})} 
                                            placeholder="Enter phone number (10 digits)"
                                            pattern="[0-9]{10}"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input 
                                            type="text"
                                            value={editForm.dateOfBirth} 
                                            onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})} 
                                            placeholder="dd/MM/yyyy" 
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select 
                                            value={editForm.gender || ''} 
                                            onChange={(e) => setEditForm({...editForm, gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER' | undefined})}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input 
                                            type="text"
                                            value={editForm.address} 
                                            onChange={(e) => setEditForm({...editForm, address: e.target.value})} 
                                            placeholder="Enter address"
                                        />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Avatar URL</label>
                                        <input 
                                            type="text"
                                            value={editForm.avatar} 
                                            onChange={(e) => setEditForm({...editForm, avatar: e.target.value})} 
                                            placeholder="Enter avatar URL"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Education Information</h3>
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Education</label>
                                        {!showCustomEducation ? (
                                            <select 
                                                value={editForm.education} 
                                                onChange={(e) => {
                                                    if (e.target.value === 'OTHER') {
                                                        setShowCustomEducation(true)
                                                        setEditForm({...editForm, education: ''})
                                                    } else {
                                                        setEditForm({...editForm, education: e.target.value})
                                                    }
                                                }}
                                            >
                                                <option value="">Select Education Level</option>
                                                <option value="High School">High School</option>
                                                <option value="Associate Degree">Associate Degree</option>
                                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                                <option value="Master's Degree">Master's Degree</option>
                                                <option value="Doctorate">Doctorate</option>
                                                <option value="Vocational">Vocational</option>
                                                <option value="OTHER">Other (Please specify)</option>
                                            </select>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text"
                                                    value={editForm.education} 
                                                    onChange={(e) => setEditForm({...editForm, education: e.target.value})} 
                                                    placeholder="Enter your education level"
                                                />
                                                <Button 
                                                    icon="pi pi-times" 
                                                    className="p-button-text p-button-rounded" 
                                                    onClick={() => {
                                                        setShowCustomEducation(false)
                                                        setEditForm({...editForm, education: ''})
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Occupation</label>
                                        {!showCustomOccupation ? (
                                            <select 
                                                value={editForm.occupation} 
                                                onChange={(e) => {
                                                    if (e.target.value === 'OTHER') {
                                                        setShowCustomOccupation(true)
                                                        setEditForm({...editForm, occupation: ''})
                                                    } else {
                                                        setEditForm({...editForm, occupation: e.target.value})
                                                    }
                                                }}
                                            >
                                                <option value="">Select Occupation</option>
                                                <option value="Student">Student</option>
                                                <option value="Teacher">Teacher</option>
                                                <option value="Engineer">Engineer</option>
                                                <option value="Doctor">Doctor</option>
                                                <option value="Business Owner">Business Owner</option>
                                                <option value="Office Worker">Office Worker</option>
                                                <option value="Freelancer">Freelancer</option>
                                                <option value="Government Employee">Government Employee</option>
                                                <option value="Retired">Retired</option>
                                                <option value="Unemployed">Unemployed</option>
                                                <option value="OTHER">Other (Please specify)</option>
                                            </select>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text"
                                                    value={editForm.occupation} 
                                                    onChange={(e) => setEditForm({...editForm, occupation: e.target.value})} 
                                                    placeholder="Enter your occupation"
                                                />
                                                <Button 
                                                    icon="pi pi-times" 
                                                    className="p-button-text p-button-rounded" 
                                                    onClick={() => {
                                                        setShowCustomOccupation(false)
                                                        setEditForm({...editForm, occupation: ''})
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>English Level</label>
                                        <select 
                                            value={editForm.englishLevel || ''} 
                                            onChange={(e) => setEditForm({...editForm, englishLevel: e.target.value})}
                                        >
                                            <option value="">Select English Level</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Elementary">Elementary</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Upper Intermediate">Upper Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="form-group">
                                        <label>Target TOEIC Score</label>
                                        <input 
                                            type="number"
                                            value={editForm.targetScore || ''} 
                                            onChange={(e) => setEditForm({...editForm, targetScore: e.target.value ? parseInt(e.target.value) : undefined})} 
                                            placeholder="Enter target TOEIC score"
                                            min="0"
                                            max="990"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={detailDialogVisible} style={{ width: '800px' }} header="User Details" modal className="p-fluid detail-dialog" footer={detailDialogFooter} onHide={() => setDetailDialogVisible(false)}>
                    {selectedUser && (
                        <div className="grid">
                            <div className="col-12 text-center mb-4">
                                <div className="field">
                                    <div className="p-3">
                                        {selectedUser.avatar ? (
                                            <div className="avatar-container">
                                                <img 
                                                    src={selectedUser.avatar} 
                                                    alt="User avatar" 
                                                    className="avatar-image"
                                                />
                                            </div>
                                        ) : (
                                            <div className="avatar-container">
                                                <div className="avatar-placeholder">
                                                    <i className="pi pi-user text-4xl text-gray-400"></i>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <h3 className="text-xl font-bold mb-4 text-primary">Basic Information</h3>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">Full Name</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">{selectedUser.fullname}</div>
                                </div>
                                <div className="field mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">Email</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">{selectedUser.email}</div>
                                </div>
                                <div className="field mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">Role</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <Tag value={selectedUser.role} severity="info" />
                                    </div>
                                </div>
                                <div className="field mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">Status</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <Tag
                                            value={selectedUser.activated ? 'Activated' : 'Deactivated'}
                                            severity={selectedUser.activated ? 'success' : 'danger'}
                                        />
                                    </div>
                                </div>
                                <div className="field mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">Address</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">{selectedUser.address || 'Not specified'}</div>
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">Phone</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">{selectedUser.phone || 'Not specified'}</div>
                                </div>
                                <div className="field mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">Date of Birth</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">{selectedUser.dateOfBirth || 'Not specified'}</div>
                                </div>
                                <div className="field mb-4">
                                    <label className="block mb-2 font-bold text-gray-700">Gender</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">{selectedUser.gender || 'Not specified'}</div>
                                </div>
                            </div>

                            <div className="col-12">
                                <h3 className="text-xl font-bold mb-4 mt-4 text-primary">Additional Information</h3>
                            </div>
                            <div className="col-12">
                                <div className="grid">
                                    <div className="col-12 md:col-6">
                                        <div className="field mb-4">
                                            <label className="block mb-2 font-bold text-gray-700">Education</label>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">{selectedUser.education || 'Not specified'}</div>
                                        </div>
                                        <div className="field mb-4">
                                            <label className="block mb-2 font-bold text-gray-700">Occupation</label>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">{selectedUser.occupation || 'Not specified'}</div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <div className="field mb-4">
                                            <label className="block mb-2 font-bold text-gray-700">English Level</label>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                {selectedUser.englishLevel ? (
                                                    <Tag value={selectedUser.englishLevel} severity="info" />
                                                ) : (
                                                    'Not specified'
                                                )}
                                            </div>
                                        </div>
                                        <div className="field mb-4">
                                            <label className="block mb-2 font-bold text-gray-700">Target TOEIC Score</label>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                {selectedUser.targetScore ? (
                                                    <Tag value={selectedUser.targetScore.toString()} severity="warning" />
                                                ) : (
                                                    'Not specified'
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog>

                <style>{`
                    .action-button {
                        width: 2.5rem !important;
                        height: 2.5rem !important;
                        border-radius: 50% !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        transition: all 0.2s !important;
                        margin: 0 0.25rem !important;
                    }
                    .action-button:hover {
                        background-color: rgba(0, 0, 0, 0.1) !important;
                    }
                    .action-button.danger:hover {
                        background-color: rgba(220, 53, 69, 0.1) !important;
                    }
                    .p-button.action-button {
                        padding: 0 !important;
                    }
                    .p-dialog .p-dialog-header {
                        background-color: #ffffff;
                        color: #2c3e50;
                        border-bottom: 1px solid #e9ecef;
                        padding: 1.25rem;
                        border-top-left-radius: 12px;
                        border-top-right-radius: 12px;
                    }
                    .p-dialog .p-dialog-content {
                        padding: 1.5rem;
                    }
                    .p-dialog .p-dialog-footer {
                        background: #ffffff;
                        border-top: 1px solid #e9ecef;
                        padding: 1.25rem;
                        border-bottom-left-radius: 12px;
                        border-bottom-right-radius: 12px;
                    }
                    .p-inputtext-sm {
                        padding: 0.5rem 0.75rem;
                        font-size: 0.875rem;
                    }
                    .p-dropdown.p-inputtext-sm {
                        padding: 0.375rem 0.75rem;
                    }
                    .text-primary {
                        color: var(--primary-color);
                    }
                    .border-primary {
                        border-color: var(--primary-color);
                    }
                    .avatar-container {
                        width: 150px;
                        height: 150px;
                        margin: 0 auto;
                        border-radius: 50%;
                        overflow: hidden;
                        border: 4px solid var(--primary-color);
                        background-color: #f8f9fa;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .avatar-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        object-position: center;
                    }
                    .avatar-placeholder {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: #f8f9fa;
                    }
                    .p-inputgroup .p-button {
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                    }
                    .p-inputgroup .p-inputtext {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }
                    .p-button.p-button-plain {
                        background: transparent;
                        color: #6c757d;
                    }
                    .p-button.p-button-plain:hover {
                        background: rgba(0, 0, 0, 0.04);
                        color: #495057;
                    }
                    .detail-dialog .p-dialog-footer button,
                    .edit-dialog .p-dialog-footer button {
                        min-width: 100px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        margin: 0 0.5rem;
                        border-radius: 8px;
                        transition: all 0.2s ease;
                    }
                    .detail-dialog .p-dialog-footer button:hover,
                    .edit-dialog .p-dialog-footer button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .detail-dialog .p-dialog-footer button i,
                    .edit-dialog .p-dialog-footer button i {
                        font-size: 1rem;
                    }
                    .detail-dialog .p-dialog-footer .p-button-danger,
                    .edit-dialog .p-dialog-footer .p-button-danger {
                        background-color: #dc3545;
                        border-color: #dc3545;
                    }
                    .detail-dialog .p-dialog-footer .p-button-danger:hover,
                    .edit-dialog .p-dialog-footer .p-button-danger:hover {
                        background-color: #c82333;
                        border-color: #bd2130;
                    }
                    .detail-dialog .p-dialog-footer .p-button-secondary,
                    .edit-dialog .p-dialog-footer .p-button-secondary {
                        background-color: #6c757d;
                        border-color: #6c757d;
                    }
                    .detail-dialog .p-dialog-footer .p-button-secondary:hover,
                    .edit-dialog .p-dialog-footer .p-button-secondary:hover {
                        background-color: #5a6268;
                        border-color: #545b62;
                    }
                    .edit-form {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                    }
                    .form-section {
                        background-color: #ffffff;
                        border-radius: 12px;
                        padding: 1.5rem;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        border: 1px solid #e9ecef;
                    }
                    .section-title {
                        color: var(--primary-color);
                        font-size: 1.1rem;
                        font-weight: 600;
                        margin-bottom: 1.5rem;
                        padding-bottom: 0.75rem;
                        border-bottom: 2px solid #e9ecef;
                    }
                    .edit-form .form-group {
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    .edit-form label {
                        color: #2c3e50;
                        font-weight: 500;
                        font-size: 0.875rem;
                        margin-bottom: 0.25rem;
                    }
                    .edit-form input,
                    .edit-form select {
                        border: 1px solid #e9ecef;
                        border-radius: 8px;
                        padding: 0.75rem;
                        font-size: 0.875rem;
                        width: 100%;
                        background-color: #fff;
                        transition: all 0.2s ease;
                    }
                    .edit-form input:hover,
                    .edit-form select:hover {
                        border-color: #ced4da;
                    }
                    .edit-form input:focus,
                    .edit-form select:focus {
                        border-color: #80bdff;
                        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.15);
                        outline: 0;
                    }
                    .edit-form input.readonly {
                        background-color: #f8f9fa;
                        color: #6c757d;
                        cursor: not-allowed;
                    }
                    .edit-form select {
                        cursor: pointer;
                        appearance: none;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        background: #fff url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 0.75rem center/1rem;
                        padding-right: 2.5rem;
                        color: #495057 !important;
                    }
                    .edit-form select option {
                        color: #495057 !important;
                        background-color: #fff;
                        padding: 0.75rem;
                    }
                    .edit-form select option:hover {
                        background-color: #f8f9fa;
                    }
                    .edit-form select option:checked {
                        background-color: #e9ecef;
                        color: #495057 !important;
                    }
                    .edit-form .p-button {
                        padding: 0.75rem 1.25rem;
                        font-size: 0.875rem;
                        border-radius: 8px;
                        transition: all 0.2s ease;
                    }
                    .edit-form .p-button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                `}</style>
            </div>
        </AdminLayout>
    )
}

export default AdminAccount