import { Chip } from "primereact/chip"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import "./TestDetailsPage.css"
import { Button } from "primereact/button"
import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { CommentDTO, CommentRequest, ETestMode, TestInfoDTO, UserResultDTO } from "../../types/type"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Tag } from "primereact/tag"
import { Toast } from "primereact/toast"
import { callGetTestInfo, callGetUserResultsForUser } from "../../services/TestService"
import { TabPanel, TabView } from "primereact/tabview"
import { Message } from "primereact/message"
import { formatForUrl } from "../../utils/FormatForUrl"
import { useAppSelector } from "../../hooks/reduxHooks"
import CommentInput from "../../components/comment/CommentInput"
import CommentsItem from "../../components/comment/CommentItem"
import { callAddComment, callDeleteComment, callGetCommentByTest } from "../../services/CommentService"

const TestDetailsPage: React.FC = () => {
    const [comments, setComments] = useState<CommentDTO[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate()
    const toast = useRef<Toast>(null)
    const { testIdParam } = useParams<{ testIdParam: string }>()
    const [activeTab, setActiveTab] = useState<string>('info')
    const [test, setTest] = useState<TestInfoDTO>()
    const [results, setResults] = useState<UserResultDTO[]>()
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
    const userId = useAppSelector(state => state.auth.userId)

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
        navigate(`/test/${testIdParam}/${formatForUrl(test!.title)}/simulation/start`, {
            state: { testInfo: test }
        })
    }

    const handleStartPracticeTest = () => {
        navigate(`/test/${testIdParam}/${formatForUrl(test!.title)}/practice/start`, {
            state: { testInfo: test }
        })
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

    const fetchComments = async () => {
        setLoading(true)
        try {
            const testId = Number(testIdParam)
            const response = await callGetCommentByTest(testId)
            if (response.data) {
                setComments(response.data)
            }
        } catch (error) {
            console.log(error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error while fetching comments', life: 2000 })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated)
            fetchComments()
    }, [isAuthenticated])

    const handleAddComment = async (content: string, parentId?: number) => {
        setLoading(true)
        try {
            const request: CommentRequest = {
                content: content,
                testId: Number(testIdParam),
                userId: userId!,
                parentId: parentId
            }
            const response = await callAddComment(request)
            if (response.data) {
                fetchComments()
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Comment posted', life: 2000 })
            }
        } catch (error) {
            console.log(error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Can not post comment', life: 2000 })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = async (commentId: number) => {
        setLoading(true)
        try {
            await callDeleteComment(commentId)
            fetchComments()
            toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Comment Deleted', life: 2000 })
        } catch (error) {
            console.log(error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Can not delete comment', life: 2000 })
        } finally {
            setLoading(false)
        }
    }

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
                            <br />
                            <TabView>
                                <TabPanel header='Simulation'>
                                    <Message severity="warn" text="Mô phỏng quy trình thi thật trên máy, bạn không thể tua audio Listening cũng như các câu hỏi một cách tự do. 
                                    Hãy đảm bảo bạn dành 120 phút để hoàn thành bài thi một cách hiệu quả nhất." icon="pi pi-info-circle" />
                                    <div className="mt-3">
                                        {isAuthenticated ?
                                            <Button label="Bắt đầu thi" raised onClick={() => handleStartSimulationTest()} severity="warning" /> :
                                            <Message severity="error" text="Vui lòng đăng nhập để thực hiện bài thi" />
                                        }
                                    </div>
                                </TabPanel>
                                <TabPanel header='Practice'>
                                    <Message severity="success" text="Hình thức luyện tập, có thể tua audio của Listening test, đồng thời xem trước toàn bộ đề như kì thi trên giấy" icon="pi pi-lightbulb" />
                                    <div className="mt-3">
                                        {isAuthenticated ?
                                            <Button label="Bắt đầu thi" raised onClick={() => handleStartPracticeTest()} severity="success" /> :
                                            <Message severity="error" text="Vui lòng đăng nhập để thực hiện bài thi" />
                                        }
                                    </div>
                                </TabPanel>
                            </TabView>
                        </>
                    )}
                    {activeTab === 'answer' && (
                        <>
                            <div className="mb-4">
                                <i className="text-red-500">Chú ý: để xem toàn bộ đáp án và transcript của đề thi,
                                    bạn phải hoàn thành ít nhất 1 lần luyện tập đề thi này
                                </i>
                            </div>
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
                        </>
                    )}
                </div>
            </div>

            <div className="contentblock">
                <h2 className="">Bình luận</h2>
                <div className="flex flex-column gap-2 w-11">
                    {isAuthenticated ? <CommentInput loadingState={loading} handleAddComment={handleAddComment} />
                        : <p>Vui lòng
                            <Link to={'/login'}
                                state={{ from: window.location.pathname }}
                                className="text-primary font-semibold mx-1" style={{ textDecoration: 'none' }}
                            > Đăng nhập
                            </Link>
                            để xem bình luận</p>
                    }

                    {isAuthenticated && <div>
                        {comments.map((comment, index) => (
                            <CommentsItem
                                key={index}
                                loadingState={loading}
                                userId={userId}
                                comment={comment}
                                parent={null}
                                handleAddComment={handleAddComment}
                                handleDeleteComment={handleDeleteComment}
                            />
                        ))}
                    </div>}

                </div>
            </div>
        </UserLayout>
    )
}

export default TestDetailsPage