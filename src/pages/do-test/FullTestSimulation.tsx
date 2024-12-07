import React, { Suspense, useEffect, useRef, useState } from "react"
import { UserLayout } from "../../layouts/user layouts/Userlayout.tsx"
import { DisplayTestItemDTO, ETestItemType, ETestMode, OrderNumber, SubmitAnswer, SubmitFullTestRequest, TestInfoDTO, UserAnswer, UserAnswerSheet } from "../../types/type.ts"
import { useTestItem } from "../../hooks/testHooks.tsx"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Toolbar } from "primereact/toolbar"
import { renderListeningTestDirections, renderPart, renderQuestion, renderQuestionGroup } from "../../utils/RenderTestItemForSimulationMode.tsx"
import { Sidebar } from "primereact/sidebar"
import "./FullTestSimulation.css"
import { ScrollPanel } from "primereact/scrollpanel"
import { Divider } from "primereact/divider"
import { Toast } from "primereact/toast"
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"
import LoadingOverlay from "../../components/LoadingOverlay.tsx"
import { callSubmitFullTest } from "../../services/DoTestService.tsx"
import { useAppSelector } from "../../hooks/reduxHooks.tsx"
import DurationCountdown from "../../components/DurationCountdown.tsx"
import usePreventNavigation from "../../components/usePreventNavigation.tsx"

const FullTestSimulation: React.FC = () => {

    const toast = useRef<Toast>(null)
    const navigate = useNavigate()
    const location = useLocation()
    const countdownRef = useRef<{ getTimeLeft: () => number; stopTimer: () => void } | null>(null)
    const testInfo: TestInfoDTO = location.state?.testInfo
    const audioSrc = testInfo.listeningAudio
    const [loading, setLoading] = useState<boolean>(false)
    const duration = testInfo.duration // minute
    const { id } = useParams<{ id: string }>()  // tham số kiểu string theo mặc định
    const testId = Number(id)   // ép kiểu về number
    const displayTestItems: DisplayTestItemDTO[] = useTestItem(testId)
    const [currentDisplayTestItem, setCurrentDisplayTestItem] = useState<DisplayTestItemDTO>()
    const [currentIndex, setCurrentIndex] = useState(0) // index của displayTestItems
    const [userAnswerSheet, setUserAnswerSheet] = useState<UserAnswerSheet>(new Map<OrderNumber, UserAnswer>)
    const [audio] = useState(() => {
        const audioElement = new Audio(audioSrc)
        audioElement.loop = false
        return audioElement
    })
    const [ansSheetVisible, setAnsSheetVisible] = useState<boolean>(false)    // set visible of answer list
    const userEmail = useAppSelector(state => state.auth.email)

    // Hàm hỗ trợ lấy partNum của DisplayTestItemDTO
    const getPartNum = (item: DisplayTestItemDTO): number | undefined => {
        switch (item.type) {
            case ETestItemType.PART:
                return item.part?.partNum
            case ETestItemType.QUESTION:
                return item.question?.partNum
            case ETestItemType.QUESTION_GROUP:
                return item.questionGroup?.partNum
            default:
                return undefined
        }
    }

    // Lọc các mục Listening và Reading dựa trên partNum
    const listeningItems = displayTestItems.filter(item => {
        const partNum = getPartNum(item)
        return partNum !== undefined && partNum >= 1 && partNum <= 4
    })

    // const readingItems = displayTestItems.filter(item => {
    //     const partNum = getPartNum(item)
    //     return partNum !== undefined && partNum > 4
    // })

    const isListeningSection = currentIndex < listeningItems.length

    usePreventNavigation()

    useEffect(() => {
        // Phát audio nếu nó đang tạm dừng
        const playPromise = audio.play()
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audio.play()
            }).catch(error => {
                console.log("Error: " + error)
            })
        }

        const handleTimeUpdate = () => {
            if (isListeningSection) {
                const currentListeningItem = listeningItems[currentIndex]
                if (currentListeningItem && audio.currentTime >= (currentListeningItem.startTimestamp || 0)) {
                    setCurrentDisplayTestItem(currentListeningItem)
                    setCurrentIndex(prevIndex => prevIndex + 1)
                }
            }
        }

        audio.addEventListener("timeupdate", handleTimeUpdate)

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            // Dừng audio nếu nó đang phát
            if (!audio.paused) {
                audio.pause()
            }
        }
    }, [audio, currentIndex, isListeningSection, listeningItems])

    useEffect(() => {
        // khởi tạo trước answer sheet với 200 câu hỏi và index của displayItemTest
        const initializeAnswerSheet = () => {
            const prevUserAnswerSheet = new Map(userAnswerSheet)
            displayTestItems
                .forEach((item, index) => {
                    if (item.type == ETestItemType.QUESTION) {
                        const userAnswer: UserAnswer = {
                            displayItemIndex: index,
                            questionId: item.question!.id,
                            isMarked: false
                        }
                        prevUserAnswerSheet.set(item.question!.orderNumber, userAnswer)
                    } else if (item.type == ETestItemType.QUESTION_GROUP) {
                        item.questionGroup?.subQuestions.forEach((subItem) => {
                            const userAnswer: UserAnswer = {
                                displayItemIndex: index,
                                questionId: subItem.id,
                                isMarked: false
                            }
                            prevUserAnswerSheet.set(subItem.orderNumber, userAnswer)
                        })
                    }
                })
            setUserAnswerSheet(prevUserAnswerSheet)
        }
        initializeAnswerSheet()
    }, [displayTestItems])  // chỉ khởi tạo được sau khi đã fetch displayTestItems

    // Xử lý chuyển tiếp thủ công cho Reading test
    const handleNextReadingItem = () => {
        // console.log("Submitting answer: ", Array.from(userAnswerSheet.entries()))  // chuyển Map thành mảng cho dễ nhìn
        if (!isListeningSection && currentIndex < displayTestItems.length - 1) {
            /**
             *  Gọi setSate liên tiếp trong cùng 1 hàm/ eventHandler => React không re-render ngay
             *  lập tức mà BATCH ( gộp ) các cập nhật state lại để xử lý trong 1 lần Render duy nhất
             *  => tối ưu hóa hiệu năng, tránh re-render quá nhiều lần
             */
            setCurrentIndex(currentIndex + 1)
            setCurrentDisplayTestItem(displayTestItems[currentIndex + 1])
        }
    }

    const handlePreviousReadingItem = () => {
        if (!isListeningSection && currentIndex > listeningItems.length) {
            setCurrentIndex(currentIndex - 1)
            setCurrentDisplayTestItem(displayTestItems[currentIndex - 1])
        }
    }

    const renderItem = (item: DisplayTestItemDTO | undefined) => {
        if (!item) return null

        switch (item.type) {
            case ETestItemType.PART:
                return item.part ? renderPart(item.part) : null
            case ETestItemType.QUESTION:
                return item.question ? renderQuestion(item.question, handleAnswerSelect, handleMarkQuestion, userAnswerSheet) : null
            case ETestItemType.QUESTION_GROUP:
                return item.questionGroup ? renderQuestionGroup(item.questionGroup, handleAnswerSelect, handleMarkQuestion, userAnswerSheet) : null
            default:
                return null
        }
    }

    const renderAnswerSheet = () => {
        const answerSheet = Array.from(userAnswerSheet)
        // chuyển từ Map sang Array sẽ có dạng [1, {...}] với 1 (Array[0]) là orderNumber
        const answersPart1 = answerSheet.filter(answer => answer[0] >= 1 && answer[0] <= 6)
        const answersPart2 = answerSheet.filter(answer => answer[0] >= 7 && answer[0] <= 31)
        const answersPart3 = answerSheet.filter(answer => answer[0] >= 32 && answer[0] <= 70)
        const answersPart4 = answerSheet.filter(answer => answer[0] >= 71 && answer[0] <= 100)
        const answersPart5 = answerSheet.filter(answer => answer[0] >= 101 && answer[0] <= 130)
        const answersPart6 = answerSheet.filter(answer => answer[0] >= 131 && answer[0] <= 146)
        const answersPart7 = answerSheet.filter(answer => answer[0] >= 147 && answer[0] <= 200)

        return (
            <div className="flex flex-column flex-wrap justify-content-between">
                {/* Part 1 */}
                <div className="mb-2">
                    <h4>Part 1</h4>
                    <div className="flex flex-wrap" style={{ justifyContent: 'left' }}>
                        {answersPart1.map((answer) => (
                            <div
                                key={answer[1].questionId}
                                className={`test-questions-listitem ${answer[1].answer && 'done'} ${answer[1].isMarked && 'marked'}`}
                                style={{ cursor: 'default' }}
                            >
                                {answer[0]}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Part 2 */}
                <div className="mb-2">
                    <h4>Part 2</h4>
                    <div className="flex flex-wrap" style={{ justifyContent: 'left' }}>
                        {answersPart2.map((answer) => (
                            <div
                                key={answer[1].questionId}
                                className={`test-questions-listitem ${answer[1].answer && 'done'} ${answer[1].isMarked && 'marked'}`}
                                style={{ cursor: 'default' }}
                            >
                                {answer[0]}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Part 3 */}
                <div className="mb-2">
                    <h4>Part 3</h4>
                    <div className="flex flex-wrap" style={{ justifyContent: 'left' }}>
                        {answersPart3.map((answer) => (
                            <div
                                key={answer[1].questionId}
                                className={`test-questions-listitem ${answer[1].answer && 'done'} ${answer[1].isMarked && 'marked'}`}
                                style={{ cursor: 'default' }}
                            >
                                {answer[0]}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Part 4 */}
                <div className="mb-2">
                    <h4>Part 4</h4>
                    <div className="flex flex-wrap" style={{ justifyContent: 'left' }}>
                        {answersPart4.map((answer) => (
                            <div
                                key={answer[1].questionId}
                                className={`test-questions-listitem ${answer[1].answer && 'done'} ${answer[1].isMarked && 'marked'}`}
                                style={{ cursor: 'default' }}
                            >
                                {answer[0]}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Part 5 */}
                <div className="mb-2">
                    <h4>Part 5</h4>
                    <div className="flex flex-wrap" style={{ justifyContent: 'left' }}>
                        {answersPart5.map((answer) => (
                            <div
                                key={answer[1].questionId}
                                className={`test-questions-listitem ${answer[1].answer && 'done'} ${answer[1].isMarked && 'marked'}`}
                                onClick={() => handleAnswerSheetItemClick(answer[1].displayItemIndex)}
                            >
                                {answer[0]}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Part 6 */}
                <div className="mb-2">
                    <h4>Part 6</h4>
                    <div className="flex flex-wrap" style={{ justifyContent: 'left' }}>
                        {answersPart6.map((answer) => (
                            <div
                                key={answer[1].questionId}
                                className={`test-questions-listitem ${answer[1].answer && 'done'} ${answer[1].isMarked && 'marked'}`}
                                onClick={() => handleAnswerSheetItemClick(answer[1].displayItemIndex)}
                            >
                                {answer[0]}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Part 7 */}
                <div className="mb-2">
                    <h4>Part 7</h4>
                    <div className="flex flex-wrap" style={{ justifyContent: 'left' }}>
                        {answersPart7.map((answer) => (
                            <div
                                key={answer[1].questionId}
                                className={`test-questions-listitem ${answer[1].answer && 'done'} ${answer[1].isMarked && 'marked'}`}
                                onClick={() => handleAnswerSheetItemClick(answer[1].displayItemIndex)}
                            >
                                {answer[0]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const submitDialog = () => {
        confirmDialog({
            message: (
                <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
                    <i className="pi pi-exclamation-circle text-6xl text-primary-500"></i>
                    <span>Are you sure you want to submit?</span>
                    <span>Check your <a onClick={() => setAnsSheetVisible(true)} href="#">answer sheet</a> carefully before proceed</span>
                </div>
            ),
            header: 'Confirmination',
            defaultFocus: 'accept',
            accept: handleSubmitTest
        })
    }

    const handleMarkQuestion = (orderNumber: number) => {
        setUserAnswerSheet((prevAnswers: UserAnswerSheet) => {
            const updatedAnswers = new Map(prevAnswers)
            const currentAnswer = updatedAnswers.get(orderNumber)
            if (currentAnswer) {
                const mark: boolean = !currentAnswer.isMarked
                updatedAnswers.set(orderNumber, { ...currentAnswer, isMarked: mark })
            }
            return updatedAnswers
        })
    }

    const handleAnswerSheetItemClick = (displayItemIndex: number) => {
        if (isListeningSection) {
            toast.current?.show({ severity: 'warn', summary: 'Info', detail: 'You are in Listening test. Can not move to Reading test' })
        } else {
            setCurrentIndex(displayItemIndex)
            setCurrentDisplayTestItem(displayTestItems[displayItemIndex])
            setAnsSheetVisible(false)
        }
    }

    const handleAnswerSelect = (orderNumber: number, questionId: number, answer: string) => {
        setUserAnswerSheet((prevAnswers: UserAnswerSheet) => {
            const updatedAnswers = new Map(prevAnswers)
            const currentAnswer = updatedAnswers.get(orderNumber)
            if (currentAnswer) {
                updatedAnswers.set(orderNumber, { ...currentAnswer, answer })
            }
            return updatedAnswers
        })
    }

    const handleSubmitTest = async () => {
        setLoading(true)
        const submitAnswers: SubmitAnswer[] = []
        userAnswerSheet.forEach((userAnswer) => {
            submitAnswers.push({
                questionId: userAnswer.questionId,
                answer: userAnswer.answer ?? null
            })
        })
        // console.table(submitAnswers)
        const timeLeft = countdownRef.current!.getTimeLeft()
        countdownRef.current?.stopTimer()
        const submitRequest: SubmitFullTestRequest = {
            email: userEmail || '',
            testId: testId,
            testMode: ETestMode.SIMULATION,
            completionTime: duration * 60 - timeLeft,
            userAnswers: submitAnswers
        }
        const response = await callSubmitFullTest(submitRequest)
        if (response.data) {
            navigate(`/test/${testId}/results/${response.data.id}`)
            setLoading(false)
        }
    }

    const customHeader = (
        <div className="flex align-items-center gap-2">
            <h3 className="font-bold">Answer Sheet</h3>
        </div>
    )

    return (
        <UserLayout>
            <LoadingOverlay visible={loading} />
            <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}>
                <Toast ref={toast} />
                <ConfirmDialog />
                <Sidebar
                    header={customHeader}
                    visible={ansSheetVisible}
                    onHide={() => setAnsSheetVisible(false)}
                    className="w-full md:w-20rem lg:w-30rem">
                    <ScrollPanel>
                        <Divider />
                        <h4>Note</h4>
                        <div className="flex">
                            <div className="test-questions-listitem no-hover" style={{ cursor: "default", pointerEvents: "none" }}>1</div>
                            : Not answerd
                        </div>
                        <div className="flex">
                            <div className="test-questions-listitem done" style={{ cursor: "default" }}>1</div>
                            : Done
                        </div>
                        <div className="flex">
                            <div className="test-questions-listitem marked" style={{ cursor: "default" }}>1</div>
                            : Marked
                        </div>
                        <Divider />
                        {renderAnswerSheet()}
                    </ScrollPanel>
                </Sidebar>
                <Toolbar
                    className="m-2"
                    start={<Button raised label="Answer sheet" onClick={() => setAnsSheetVisible(true)} />}
                    center={
                        <div className="flex">
                            <DurationCountdown
                                ref={countdownRef}  // Truyền ref vào component con
                                duration={duration}
                                onTimeUp={() => handleSubmitTest()} />
                        </div>
                    }
                    end={<Button raised onClick={submitDialog} outlined className="ml-3" label="Nộp bài"></Button>}
                />
                {currentIndex == 0 && renderListeningTestDirections()}
                {renderItem(currentDisplayTestItem)}

                {!isListeningSection && (
                    <div className="card flex flex-wrap justify-content-between gap-3 mt-3">
                        <Button raised icon='pi pi-angle-left' onClick={handlePreviousReadingItem} visible={currentIndex > listeningItems.length} />
                        <Button raised icon='pi pi-angle-right' onClick={handleNextReadingItem} visible={currentIndex < displayTestItems.length - 1} />
                    </div>
                )}
            </Suspense>
        </UserLayout>
    )
}

export default FullTestSimulation
