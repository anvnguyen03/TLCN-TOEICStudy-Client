import { BreadCrumb } from "primereact/breadcrumb"
import { AdminLayout } from "../../../../layouts/admin layouts/AdminLayout"
import { MenuItem } from "primereact/menuitem"
import { Link, useNavigate } from "react-router-dom"
import { FileUpload, FileUploadFile, FileUploadRemoveEvent, FileUploadSelectEvent } from "primereact/fileupload"
import { Fieldset } from "primereact/fieldset"
import { useEffect, useRef, useState } from "react"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import LoadingOverlay from "../../../../components/LoadingOverlay"
import * as ManageTestService from "../../../../services/admin services/ManageTestService"
import { Toast } from "primereact/toast"
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"

const AddFullTest = () => {
    const imageUploadRef = useRef<FileUpload>(null)
    const audioUploadRef = useRef<FileUpload>(null)
    const excelUploadRef = useRef<FileUpload>(null)

    const [excel, setExcel] = useState<FileUploadFile[]>([])
    const [images, setImages] = useState<FileUploadFile[]>([])
    const [audios, setAudios] = useState<FileUploadFile[]>([])
    const [submitable, setSubmitable] = useState<boolean>(false)

    const navigate = useNavigate()
    const toast = useRef<Toast>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const onExcelSelect = (e: FileUploadSelectEvent) => {
        // allow upload only 1 excel file
        setExcel(e.files)
        excelUploadRef.current?.clear()
        excelUploadRef.current?.setFiles(e.files)
    }

    const onExcelRemove = () => {
        setExcel([])
        excelUploadRef.current?.clear()
    }

    const onImagesSelect = (e: FileUploadSelectEvent) => {
        const prevFiles = [...images]
        e.files.map((file) => {
            if (!prevFiles.includes(file)) {
                prevFiles.push(file)
            }
        })
        setImages(prevFiles)
        imageUploadRef.current?.clear()
        imageUploadRef.current?.setFiles(prevFiles)
    }

    const onImageRemove = (e: FileUploadRemoveEvent) => {
        const updateFiles = images.filter((img) => img !== e.file)
        setImages(updateFiles)
        imageUploadRef.current?.clear()
        imageUploadRef.current?.setFiles(updateFiles)
    }

    const onAudiosSelect = (e: FileUploadSelectEvent) => {
        const prevFiles = [...audios]
        e.files.map((file) => {
            if (!prevFiles.includes(file)) {
                prevFiles.push(file)
            }
        })
        setAudios(prevFiles)
        audioUploadRef.current?.clear()
        audioUploadRef.current?.setFiles(prevFiles)
    }

    const onAudioRemove = (e: FileUploadRemoveEvent) => {
        const updateFiles = audios.filter((audio) => audio !== e.file)
        setAudios(updateFiles)
        audioUploadRef.current?.clear()
        audioUploadRef.current?.setFiles(updateFiles)
    }

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        { label: 'Online Test' },
        {
            label: 'Test',
            template: () => <Link to="/admin/test" style={{ textDecoration: 'none' }} className="font-semibold">Test</Link>
        },
        {
            template: () => <Link to="/admin/test/add" style={{ textDecoration: 'none' }} className="font-semibold">Add</Link>
        },
        {
            template: () => <div className="text-primary font-semibold">Full Test</div>
        }
    ]

    const confirmPopup = () => {
        confirmDialog({
            message: 'Do you want to upload these files?',
            header: 'Upload Confirmation',
            icon: 'pi pi-info-circle',
            position: "bottom",
            accept: handleSubmit
        })
    }

    const handleSubmit = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('file', excel[0])

        images.forEach(image => {
            formData.append('images', image)
        })

        audios.forEach(audio => {
            formData.append('audios', audio)
        })

        try {
            const response = await ManageTestService.callUploadFullTest(formData)
            cleanResources()
            toast.current?.show({
                severity: "success",
                summary: "Upload success",
                detail: `${response.data}`,
                sticky: true,
                content: (props) => (
                    <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
                        <div className="flex align-items-center gap-2">
                            <span className="font-bold text-900">{props.message.summary}</span>
                        </div>
                        <div className="font-medium text-lg my-3 text-900">New Test ID: {props.message.detail}</div>
                        <Button className="p-button-sm flex" label="View" severity="success" onClick={() => window.location.href = `tests/${response.data}/practice-set-toeic-test-6`}></Button>
                    </div>
                )
            })
        } catch (error) {
            console.log('error while upload: ', error)
            toast.current?.show({ severity: "error", summary: "Error", detail: `${error}` })
        } finally {
            setLoading(false)
        }
    }

    const cleanResources = () => {
        setExcel([])
        setImages([])
        setAudios([])
        excelUploadRef.current?.clear()
        imageUploadRef.current?.clear()
        audioUploadRef.current?.clear()
    }

    useEffect(() => {
        if (excel.length > 0 && images.length > 0 && audios.length > 0) {
            setSubmitable(true)
        } else {
            setSubmitable(false)
        }
    }, [audios, excel, images])

    return (
        <AdminLayout tabName="Test">
            <LoadingOverlay visible={loading} />
            <Toast ref={toast} />
            <ConfirmDialog />
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
                <Fieldset legend="Excel" >
                    <div className="font-bold mb-2">Total: {excel.length}</div>
                    <FileUpload ref={excelUploadRef} name="excel"
                        accept=".xlsx, .xls, .csv" maxFileSize={10000000}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        uploadOptions={{ style: { display: 'none' } }}
                        cancelOptions={{ style: { display: 'none' } }}
                        onSelect={onExcelSelect}
                        onRemove={onExcelRemove}
                    />
                </Fieldset>
                <br />
                <Fieldset legend="Images" >
                    <div className="font-bold mb-2">Total: {images.length}</div>
                    <FileUpload ref={imageUploadRef} name="images[]" url={'/api/upload'}
                        multiple accept="image/*" maxFileSize={10000000}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}

                        uploadOptions={{ style: { display: 'none' } }}
                        onSelect={onImagesSelect}
                        onRemove={onImageRemove}
                    />
                </Fieldset>
                <br />
                <Fieldset legend="Audios" >
                    <div className="font-bold mb-2">Total: {audios.length}</div>
                    <FileUpload ref={audioUploadRef} name="audios[]" url={'/api/upload'}
                        multiple accept="audio/*" maxFileSize={100000000}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        cancelOptions={{ style: { display: 'none' } }}
                        uploadOptions={{ style: { display: 'none' } }}
                        onSelect={onAudiosSelect}
                        onRemove={onAudioRemove}
                    />
                </Fieldset>
                <br />
                <Divider />
                <div className="flex justify-content-center">
                    <Button label="Submit" raised severity="help" onClick={confirmPopup} disabled={!submitable}/>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddFullTest