import { Chip } from "primereact/chip"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import "./TestDetailsPage.css"
import { Button } from "primereact/button"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ETestMode, TestInfoDTO, UserResultDTO } from "../../types/type"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Tag } from "primereact/tag"
import { Toast } from "primereact/toast"
import { callGetTestInfo, callGetUserResultsForUser } from "../../services/TestService"
import { TabPanel, TabView } from "primereact/tabview"
import { Message } from "primereact/message"
import { formatForUrl } from "../../utils/FormatForUrl"

const TestDetailsPage: React.FC = () => {

    const navigate = useNavigate()
    const toast = useRef<Toast>(null)
    const { testIdParam } = useParams<{ testIdParam: string }>()
    const [activeTab, setActiveTab] = useState<string>('info')
    const [test, setTest] = useState<TestInfoDTO>()
    const [results, setResults] = useState<UserResultDTO[]>()

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
                <a href={`/test/${test?.id}/results/${rowData.id}`} style={{ textDecoration: 'none' }}>Xem chi tiết</a>
            </React.Fragment>
        )
    }

    const handleStartSimulationTest = () => {
        navigate(`/test/${testIdParam}/${formatForUrl(test!.title)}/simulation/start`)
    }

    const handleStartPracticeTest = () => {
        navigate(`/test/${testIdParam}/${formatForUrl(test!.title)}/practice/start`)
    }

    const fetchUserResults = async (testId: number) => {
        const response = await callGetUserResultsForUser(testId)
        if (response.data) {
            setResults(response.data)
        }
    }

    useEffect(() => {
        const fetchTestInfo = async () => {
            try {
                const testId = Number(testIdParam)
                const response = await callGetTestInfo(testId)
                if (response.data) {
                    setTest(response.data)
                    if (response.data.isUserAttemped) {
                        fetchUserResults(testId)
                    }
                }
            } catch (error) {
                console.log(error)
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error while fetching data', life: 2000 })
            }
        }
        fetchTestInfo()
    }, [])

    return (
        <UserLayout>
            <Toast ref={toast} />
            <div className="contentblock mb-4" style={{ marginTop: '6rem' }}>
                <Chip label={`#${test?.testCategory}`} style={{ fontSize: 'small' }} />
                <h1>
                    {test?.title}
                    {test?.isUserAttemped && (<span className="pi pi-verified text-green-400 ml-2" style={{ fontSize: 'xx-large' }}></span>)}
                </h1>
                <div className="mt-3 flex flex-wrap">
                    <Button className="mr-2 font-normal" size="small" label="Thông tin đề thi" rounded severity="contrast"
                        outlined={activeTab !== 'info'} onClick={() => setActiveTab('info')} />
                    {test?.isUserAttemped && (<Button className="mr-2 font-normal" size="small" label="Đáp án/Transcript" rounded severity="contrast"
                        outlined={activeTab !== 'answer'} onClick={() => setActiveTab('answer')} />)}
                </div>
                <div className="mt-5">
                    {activeTab === 'info' && (
                        <>
                            <div className="mb-1">
                                <span className="pi pi-cog mr-2 font-bold"></span>
                                Bố cục: {test?.totalParts} phần thi | {test?.totalQuestions} câu hỏi
                            </div>
                            <div className="mb-1">
                                <span className="pi pi-clock mr-2 font-bold"></span>
                                Thời gian làm bài: {test?.duration} phút
                            </div>
                            <div className="mb-1">
                                <span className="pi pi-user-edit mr-2 font-bold"></span>
                                {test?.totalAttemps} lượt luyện tập đề thi
                            </div>
                            <div className="mb-3">
                                <span className="pi pi-comments mr-2 font-bold"></span>
                                {test?.totalComments} bình luận
                            </div>
                            <div className="mb-4">
                                <i className="text-red-500">Chú ý: để xem toàn bộ đáp án và transcript của đề thi,
                                    bạn phải hoàn thành ít nhất 1 lần luyện tập đề thi này
                                </i>
                            </div>
                            <br />
                            {test?.isUserAttemped && (
                                <div className="results-table mb-5">
                                    <b>Kết quả làm bài của bạn:</b>
                                    <div className="mt-3 max-w-full">
                                        <DataTable value={results} showGridlines stripedRows tableStyle={{ minWidth: '50rem' }}>
                                            <Column field="testMode" header="Mode" body={testModeBodyTemplate}></Column>
                                            <Column field="completedAt" header="Ngày làm"></Column>
                                            <Column header="Kết quả" body={scoreBodyTemplate}></Column>
                                            <Column field="completionTime" header="Thời gian làm bài" body={completionTimeBodyTemplate}></Column>
                                            <Column body={actionBodyTemplate}></Column>
                                        </DataTable>
                                    </div>
                                </div>
                            )}
                            <TabView>
                                <TabPanel header='Simulation'>
                                    <Message severity="warn" text="Mô phỏng quy trình thi thật trên máy, bạn không thể tua audio Listening cũng như các câu hỏi một cách tự do. 
                                    Hãy đảm bảo bạn dành 120 phút để hoàn thành bài thi một cách hiệu quả nhất." icon="pi pi-info-circle" />
                                    <div className="mt-3">
                                        <Button label="Bắt đầu thi" raised onClick={() => handleStartSimulationTest()} severity="warning"/>
                                    </div>
                                </TabPanel>
                                <TabPanel header='Practice'>
                                    <Message severity="success" text="Hình thức luyện tập, có thể tua audio của Listening test, đồng thời xem trước toàn bộ đề như kì thi trên giấy" icon="pi pi-lightbulb" />
                                    <div className="mt-3">
                                        <Button label="Bắt đầu thi" raised onClick={() => handleStartPracticeTest()} severity="success"/>
                                    </div>
                                </TabPanel>
                            </TabView>
                        </>
                    )}
                    {activeTab === 'answer' && (
                        <div className="">Đáp án/Transcript</div>
                    )}
                </div>
            </div>

            <div className="contentblock">
                <h1>Bình luận</h1>
            </div>
        </UserLayout>
    )
}

export default TestDetailsPage