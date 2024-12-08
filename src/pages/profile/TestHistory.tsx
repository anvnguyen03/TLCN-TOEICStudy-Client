import React, { useEffect, useRef, useState } from "react"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import "./TestHistory.css"
import { useAppSelector } from "../../hooks/reduxHooks"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { ETestMode, ResultHistoryByTest, UserResultDTO } from "../../types/type"
import { Tag } from "primereact/tag"
import { callGetTestHistory } from "../../services/UserService"
import { Toast } from "primereact/toast"
import { Skeleton } from "primereact/skeleton"

const TestHistory: React.FC = () => {
    const fullname = useAppSelector(state => state.auth.fullname)
    const toast = useRef<Toast>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [testHistory, setTestHistory] = useState<ResultHistoryByTest[]>()

    const getSeverity = (status: string) => {
        switch (status) {
            case ETestMode.PRACTICE:
                return 'success'
            case ETestMode.SIMULATION:
                return 'warning'
            default:
                return 'success'
        }
    }

    const testModeBodyTemplate = (rowData: UserResultDTO) => {
        return (
            <React.Fragment>
                <Tag severity={getSeverity(rowData.testMode)} value={rowData.testMode} rounded></Tag>
            </React.Fragment>
        )
    }

    const scoreBodyTemplate = (rowData: UserResultDTO) => {
        return (
            <React.Fragment>
                {rowData.correctAnswers}/200 (Điểm: {rowData.totalScore})
            </React.Fragment>
        )
    }

    const completionTimeBodyTemplate = (rowData: UserResultDTO) => {
        const minutes = Math.floor(rowData.completionTime / 60)
        const seconds = rowData.completionTime % 60

        return (
            <React.Fragment>
                0:{minutes}:{seconds}
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData: UserResultDTO) => {
        return (
            <React.Fragment>
                <a href={`/test/${rowData.testId}/results/${rowData.id}`} style={{ textDecoration: 'none' }}>Xem chi tiết</a>
            </React.Fragment>
        )
    }

    useEffect(() => {
        const fetchTestHistory = async () => {
            setLoading(true)
            try {
                const response = await callGetTestHistory();
                if (response.data) {
                    setTestHistory(response.data)
                }
            } catch (error) {
                console.log(error)
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error while fetching data', life: 2000 })
            } finally {
                setLoading(false)
            }
        }
        fetchTestHistory()
    }, [])

    return (
        <UserLayout>
            <Toast ref={toast} />
            <div className="w-full py-5 px-3" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div className="profile-cover">
                    <div className="profile-cover-img-wrapper">
                        <img className="profile-cover-img" src="/user_banner.webp" alt="user-cover" />
                    </div>
                </div>

                <div className="md:mx-auto mb-3 text-center">
                    <div className="profile-cover-avatar">

                        <img className="avatar-img" src="/user_icon.webp" alt="an2572003" />

                        <a className="avatar-button text-dark">
                            <i className="avatar-icon pi pi-pencil"></i>
                        </a>
                    </div>

                    <h2 className="profile-header-title text-primary" id="an2572003-trang-công-khai">Kết quả luyện thi - {fullname}</h2>

                    <div className="profile-header-content">
                        <p></p>
                    </div>
                </div>

                <br />
                {loading && (
                    Array(3).fill(0).map((_, index) => (
                        <div className="flex mb-3" key={index}>
                            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    ))
                )}

                {testHistory?.map((test, index) => (
                    <div className="mb-5" key={index}>
                        <h3>{test.testTitle}</h3>
                        <div className="mt-3 max-w-full">
                            <DataTable value={test.userResults} stripedRows tableStyle={{ minWidth: '50rem' }}>
                                <Column field="testMode" header="Mode" body={testModeBodyTemplate}></Column>
                                <Column field="completedAt" header="Ngày làm"></Column>
                                <Column header="Kết quả" body={scoreBodyTemplate}></Column>
                                <Column field="completionTime" header="Thời gian làm bài" body={completionTimeBodyTemplate}></Column>
                                <Column body={actionBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </div>
                ))}

            </div>
        </UserLayout>
    )
}

export default TestHistory