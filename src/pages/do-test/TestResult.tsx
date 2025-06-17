import { Tag } from "primereact/tag"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import "./TestResult.css"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { Message } from "primereact/message"
import { useNavigate, useParams } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { ETestMode, UserAnswerDTO, UserResultDTO } from "../../types/type"
import { callGetUserResult } from "../../services/TestService"
import LoadingOverlay from "../../components/LoadingOverlay"
import { Dialog } from "primereact/dialog"
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace"
import ReactMarkdown from 'react-markdown'
import { RadioButton } from "primereact/radiobutton"
import { formatForUrl } from "../../utils/FormatForUrl"
import { Chip } from "primereact/chip"

const TestResult: React.FC = () => {

    const audioSrc = "/Practice_Set_TOEIC_Test 1.mp3"
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const { resultIdParam } = useParams<{ testIdParam: string, resultIdParam: string }>()
    const [userResult, setUserResult] = useState<UserResultDTO>()
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [currentAnswer, setCurrentAnswer] = useState<UserAnswerDTO>()

    const getSeverity = (status: string) => {
        switch (status) {
            case ETestMode.SIMULATION:
                return 'warning'
            case ETestMode.PRACTICE:
                return 'success'
            default:
                return 'success'
        }
    }

    const renderTimeToFinish = () => {
        const minutes = Math.floor(userResult!.completionTime / 60)
        const seconds = userResult!.completionTime % 60

        return (
            <span className="font-bold">0:{minutes}:{seconds}</span>
        )
    }

    const renderUserAnswerByPartNum = (partNum: number) => {
        const answers = userResult?.userAnswers
            .filter(userAnswer => userAnswer.question.partNum === partNum)

        return (
            <div className="mb-5">
                <h3>Part {partNum}</h3>
                <div style={{ columnCount: 2 }}>
                    {answers?.map((answer, index) => (
                        <div className="mb-3" key={index}>
                            <strong
                                className={`question-number ${!answer.selectedAnswer ? '' : (answer.correct ? 'correct' : 'incorrect')
                                    }`}>
                                {answer.question.orderNumber}
                            </strong>
                            <a onClick={(e) => handleSeeDetailClick(e, answer)} className="ml-2" href="#" style={{ fontSize: '0.85rem', textDecoration: 'none' }}>[Chi tiết] <i className="pi pi-minus ml-1 text-gray-500"></i></a>
                            <span className="ml-2">{answer.selectedAnswer || 'chưa trả lời'}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const handleSeeDetailClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, answer: UserAnswerDTO) => {
        e.preventDefault()
        setCurrentAnswer(answer)
        setModalVisible(true)
    }

    const renderDetailAnswerDialog = () => {
        // const markdown = `**M**: Hello N    \n**N**: Hello M`
        /**
         * Markdown nhận 2 ký tự khoảng trắng và \n làm dấu xuống dòng.
         * File excel khi xuống dòng và lưu db bằng kí tự \n 
         * =>
         * Cần hay thế ký tự '\n' thành '<br />' hoặc thêm 2 dấu cách trước '\n'
         */
        const formatedScript = currentAnswer?.question.transcript.replace(/\n/g, '  \n')

        const renderGroupContent = () => {
            const formatedGroupContent = currentAnswer?.question.groupContent!.replace(/\n/g, '  \n')

            return (
                <p className="mb-4">
                    <ReactMarkdown>{formatedGroupContent}</ReactMarkdown>
                    <Divider />
                </p>
            )
        }

        const getSeverity = (status: boolean) => {
            switch (status) {
                case true:
                    return 'success'
                case false:
                    return 'error'
                default:
                    return 'info'
            }
        }

        const getTextMessage = (status: boolean) => {
            switch (status) {
                case true:
                    return 'Trả lời đúng'
                case false:
                    return 'Trả lời sai'
                default:
                    return null
            }
        }

        return (
            <Dialog
                header={(
                    <>
                        <h4>Đáp án chi tiết #{currentAnswer?.question.orderNumber}</h4>
                        <h5 className="text-gray-500">{userResult?.testTitle}</h5>
                    </>
                )}
                visible={modalVisible}
                onHide={() => { if (!modalVisible) return; setModalVisible(false); }}
                style={{ width: '70vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            >
                <audio controls className="w-full mb-4">
                    <source src={audioSrc} />
                </audio>
                {currentAnswer?.question.images &&
                    (<div className="mb-4">
                        {currentAnswer?.question.images.map((image, index) => (
                            <img
                                key={`image-id-${index}`}
                                src={image}
                                alt={`Image of question ${currentAnswer.question.orderNumber}`}
                                className="max-w-full h-auto"
                            />
                        ))}
                    </div>)
                }
                {currentAnswer?.question.groupContent && renderGroupContent()}
                <Inplace closable>
                    <InplaceDisplay>Show transcript</InplaceDisplay>
                    <InplaceContent>
                        <p className="mb-3">
                            <ReactMarkdown>{formatedScript}</ReactMarkdown>
                        </p>
                    </InplaceContent>
                </Inplace>
                <Divider />
                <div className="p-2 border-1 border-round-md">
                    <div className="flex align-items-center mb-2">
                        <strong
                            className="question-number mr-2"
                        >
                            {currentAnswer?.question.orderNumber}
                        </strong>
                        <p className="mb-2 font-semibold">{currentAnswer?.question.content}</p>
                    </div>
                    <div className="flex flex-column gap-2 mb-3">
                        {[currentAnswer?.question.answer1, currentAnswer?.question.answer2, currentAnswer?.question.answer3, currentAnswer?.question.answer4]
                            .filter(Boolean)
                            .map((answer, index) => (
                                <div
                                    key={index}
                                    className={`ml-1 flex align-items-center ${answer === currentAnswer?.question.correctAnswer ? 'text-green-500' : 'text-red-500'}`}>
                                    <RadioButton
                                        disabled
                                        inputId={`${currentAnswer?.question.id}-${index}`}
                                        name={`question-${currentAnswer?.question.id}`}
                                        value={answer}
                                        checked={currentAnswer?.selectedAnswer === answer}
                                    />
                                    <label htmlFor={`${currentAnswer?.question.id}-${index}`} className="ml-2 text-left">{answer}</label>
                                </div>
                            ))}
                    </div>
                    {!currentAnswer?.selectedAnswer ? (
                        <Message severity="info" text='Chưa trả lời' />
                    ) : (
                        <Message severity={getSeverity(currentAnswer.correct)} text={getTextMessage(currentAnswer.correct)} />
                    )}
                </div>
            </Dialog>
        )
    }

    useEffect(() => {
        const fetchTestResult = async () => {
            setLoading(true)
            const resultId = Number(resultIdParam)
            try {
                const response = await callGetUserResult(resultId)
                if (response.data) {
                    setUserResult(response.data)
                    setLoading(false)
                }
            } catch (error) {
                console.log('Error: ' + error)
                navigate('/unauthorized')
            }

        }
        fetchTestResult()
    }, [navigate, resultIdParam])

    return (
        <UserLayout>
            <LoadingOverlay visible={loading} />
            {userResult &&
                <React.Fragment>
                    {currentAnswer && renderDetailAnswerDialog()}
                    <div className="card pt-2">
                        <div className="p-card p-component">
                            <div className="p-card-body">
                                <Message
                                    className="w-full justify-content-start"
                                    text="Chú ý: Bạn có thể tạo flashcards từ highlights (bao gồm các highlights các bạn đã tạo trước đây) trong trang chi tiết kết quả bài thi." />
                                <br />
                                <Chip label="#TOEIC RC+LC" style={{ fontSize: 'small' }} className="mt-4" />
                                <h2 className="mb-3 text-black-alpha-90">
                                    Kết quả: {userResult?.testTitle}
                                    <Tag severity={getSeverity(userResult?.testMode)} value={userResult?.testMode} className="ml-2" rounded></Tag>
                                </h2>

                                <div className="mb-3">
                                    <Button size="small" label="Quay về trang đề thi" onClick={() => navigate(`/tests/${userResult.testId}/${formatForUrl(userResult.testTitle)}`)}/>
                                </div>

                                <div className="result-score-details">
                                    <div className="flex flex-row flex-wrap">
                                        <div className="col-12 md:col-3">
                                            <div className="result-stats-box">
                                                <div className="flex justify-content-between">
                                                    <span className="pi pi-check font-semibold"></span>
                                                    <span className="flex-grow-1 ml-2 mr-2">Kết quả làm bài</span>
                                                    <span className="font-bold">{userResult?.correctAnswers}/200</span>
                                                </div>
                                                <br />
                                                <div className="flex justify-content-between">
                                                    <span className="pi pi-bullseye font-semibold"></span>
                                                    <span className="flex-grow-1 ml-2 mr-2">Độ chính xác </span>
                                                    <span className="font-bold">{userResult?.accuracy}%</span>
                                                </div>
                                                <br />
                                                <div className="flex justify-content-between">
                                                    <span className="pi pi-clock font-semibold"></span>
                                                    <span className="flex-grow-1 ml-2 mr-2">Thời gian làm bài</span>
                                                    {renderTimeToFinish()}
                                                </div>
                                                <br />
                                                <div className="flex justify-content-between">
                                                    <span className="pi pi-calendar font-semibold"></span>
                                                    <span className="flex-grow-1 ml-2 mr-2">Ngày nộp bài </span>
                                                    <span className="font-bold text-right">{userResult?.completedAt}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 md:col-9">
                                            <div className="flex flex-wrap">
                                                <div className="col-12 md:col-3">
                                                    <div className="p-card p-component">
                                                        <div className="p-card-body flex flex-column align-items-center justify-content-center gap-2">
                                                            <span className="pi pi-check-circle text-green-500 bg-green font-semibol text-3xl"></span>
                                                            <div className="text-green-500 font-semibold">Câu trả lời đúng</div>
                                                            <div className="font-bold text-2xl">{userResult?.correctAnswers}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-3">
                                                    <div className="p-card p-component">
                                                        <div className="p-card-body flex flex-column align-items-center justify-content-center gap-2">
                                                            <span className="pi pi-times-circle text-red-500 font-semibol text-3xl"></span>
                                                            <div className="text-red-500 font-semibold">Câu trả lời sai</div>
                                                            <div className="font-bold text-2xl">{userResult?.incorrectAnswers}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-3">
                                                    <div className="p-card p-component">
                                                        <div className="p-card-body flex flex-column align-items-center justify-content-center gap-2">
                                                            <span className="pi pi-minus-circle text-gray-700 font-semibol text-3xl"></span>
                                                            <div className="text-gray-400 font-semibold">Bỏ qua</div>
                                                            <div className="font-bold text-2xl">{userResult?.skippedAnswers}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-3">
                                                    <div className="p-card p-component">
                                                        <div className="p-card-body flex flex-column align-items-center justify-content-center gap-2">
                                                            <span className="pi pi-flag-fill text-cyan-600 font-semibol text-3xl"></span>
                                                            <div className="text-cyan-500 font-semibold">Điểm</div>
                                                            <div className="font-bold text-2xl text-cyan-500">{userResult?.totalScore}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br />
                                            <div className="flex flex-wrap">
                                                <div className="col-12 md:col-6">
                                                    <div className="p-card p-component">
                                                        <div className="p-card-body flex flex-column align-items-center justify-content-center gap-2">
                                                            <div className="font-bold text-blue-500">Listening</div>
                                                            <div className="font-bold text-3xl">{userResult?.listeningScore}/495</div>
                                                            <div className="font-normal">Trả lời đúng: {userResult?.listeningCorrects}/100</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-6">
                                                    <div className="p-card p-component">
                                                        <div className="p-card-body flex flex-column align-items-center justify-content-center gap-2">
                                                            <div className="font-bold text-blue-500">Reading</div>
                                                            <div className="font-bold text-3xl">{userResult?.readingScore}/495</div>
                                                            <div className="font-normal">Trả lời đúng: {userResult?.readingCorrects}/100</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                                <h3>Phân tích chi tiết</h3>
                                <Divider />
                                <h3>Đáp án</h3>
                                <Message
                                    className="w-full justify-content-start"
                                    text="Tips: Khi xem chi tiết đáp án, có thể tạo và lưu highlight từ 
                                            vựng, keywords và tạo note đề học và tra cứu khi có nhu cầu ôn lại 
                                            đề thi này trong tương lai." />
                                <br />

                                {renderUserAnswerByPartNum(1)}
                                {renderUserAnswerByPartNum(2)}
                                {renderUserAnswerByPartNum(3)}
                                {renderUserAnswerByPartNum(4)}
                                {renderUserAnswerByPartNum(5)}
                                {renderUserAnswerByPartNum(6)}
                                {renderUserAnswerByPartNum(7)}

                            </div>
                        </div>
                    </div>

                    {/* <div className="card pt-2">
                        <div className="p-card p-component">
                            <div className="p-card-body">
                                <h1 className="text-black-alpha-90">Comment</h1>
                            </div>
                        </div>
                    </div> */}
                </React.Fragment>
            }
        </UserLayout>
    )
}

export default TestResult