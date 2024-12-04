import React, { useEffect, useRef, useState } from "react"
import "./FullTestPractice.css"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import usePreventNavigation from "../../components/usePreventNavigation"
import { Button } from "primereact/button"
import DurationCountdown from "../../components/DurationCountdown"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useTestItem } from "../../hooks/testHooks"
import { AnswerOption, DisplayTestItemDTO, ETestItemType, ETestMode, OrderNumber, QuestionDTO, QuestionGroupDTO, SubmitAnswer, SubmitFullTestRequest, TestInfoDTO, UserAnswer, UserAnswerSheet } from "../../types/type"
import { formatForUrl } from "../../utils/FormatForUrl"
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton"
import ReactMarkdown from 'react-markdown'
import { useAppSelector } from "../../hooks/reduxHooks"
import { callSubmitFullTest } from "../../services/DoTestService"
import LoadingOverlay from "../../components/LoadingOverlay"
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"

const FullTestPractice: React.FC = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState<boolean>(false)
    const [scrollingState, setScrollingState] = useState<'relative' | 'scroll' | 'fixed'>('relative')
    const testNavRef = useRef<HTMLDivElement>(null)
    const testNavInnerRef = useRef<HTMLDivElement>(null)
    const qWrapperRefs = useRef<(HTMLDivElement | null)[]>([])
    const [scrollToQNum, setScrollToQNum] = useState<number>()

    const countdownRef = useRef<{ getTimeLeft: () => number; stopTimer: () => void } | null>(null)
    const audioSrc = "/Practice_Set_TOEIC_Test 1.mp3"
    const { id } = useParams<{ id: string }>()
    const testId = Number(id)   // ép kiểu về number
    const displayTestItems: DisplayTestItemDTO[] = useTestItem(testId)
    const [testInfo, setTestInfo] = useState<TestInfoDTO>()
    const [duration, setDuration] = useState<number>(0)
    const [partsNum, setPartsNum] = useState<number[]>([])
    const [currentPartNum, setCurrentPartNum] = useState<number>(1)
    const [userAnswerSheet, setUserAnswerSheet] = useState<UserAnswerSheet>(new Map<OrderNumber, UserAnswer>)
    const userEmail = useAppSelector(state => state.auth.email)

    usePreventNavigation()

    const handlePartNumClick = (partNum: number) => {
        setCurrentPartNum(partNum)
    }

    const handleNextPart = () => {
        setCurrentPartNum(currentPartNum + 1)
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }

    const renderSingleQuestion = (question: QuestionDTO) => {
        const answerOptions: AnswerOption[] = [
            { name: question.answer1, key: 'A' },
            { name: question.answer2, key: 'B' },
            { name: question.answer3, key: 'C' },
            ...(question.answer4 ? [{ name: question.answer4, key: "D" }] : [])
        ]
        const selectedAnswer = userAnswerSheet.get(question.orderNumber)?.answer

        return (
            <div className="mb-5" key={question.id}>
                {question.image && (
                    <div className="mb-4">
                        <img src={question.image} alt={`image for question ${question.orderNumber}`} />
                    </div>
                )}

                <div className="flex" ref={(el) => (qWrapperRefs.current[question.orderNumber] = el)}>
                    <div className="mr-2" style={{ width: '35px' }}>
                        <strong
                            className={`question-number ${userAnswerSheet.get(question.orderNumber)?.isMarked ? 'marked' : ''} mr-2`}
                            onClick={() => handleMarkQuestion(question.orderNumber)}
                        >
                            {question.orderNumber}
                        </strong>
                    </div>
                    <div className="flex flex-column">
                        {question.content && <div className="text-left mb-3">{question.content}</div>}
                        <div className="flex flex-column gap-2">
                            {answerOptions.map((option) => (
                                <div key={option.key} className="flex align-items-center">
                                    <RadioButton
                                        inputId={option.key}
                                        name={`question-${question.orderNumber}`}
                                        value={option.name}
                                        onChange={(e: RadioButtonChangeEvent) => handleAnswerSelect(question.orderNumber, e.value)}
                                        checked={selectedAnswer === option.name}
                                    />
                                    <label htmlFor={option.key} className="ml-2">{option.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderGroupQuestions = (groupQuestions: QuestionGroupDTO) => {
        const renderGroupContent = () => {
            const formatedContent = groupQuestions?.content!.replace(/\n/g, '  \n')

            return (
                <ReactMarkdown className='text-left'>{formatedContent}</ReactMarkdown>
            )
        }

        return (
            <React.Fragment key={groupQuestions.id}>
                <div className="question-twocols">
                    {(groupQuestions.content || groupQuestions.images!.length > 0) && (
                        <div className="question-twocols-left">
                            <div className="mb-5">
                                {groupQuestions.images && (
                                    <div className="">
                                        {groupQuestions.images.map((image, index) => (
                                            <img src={image.image} alt={`image-${image.id}`} key={index} className="max-w-full" />
                                        ))}
                                    </div>
                                )}
                                {groupQuestions.content && renderGroupContent()}
                            </div>
                        </div>
                    )}
                    <div className="question-twocols-right">

                        {groupQuestions.subQuestions.map((question, index) => (
                            <div className="questions-wrapper" key={index}>
                                <div className="question-wrapper" ref={(el) => qWrapperRefs.current[question.orderNumber] = el}>
                                    <div className="mr-2" style={{ width: '35px' }}>
                                        <strong
                                            className={`question-number ${userAnswerSheet.get(question.orderNumber)?.isMarked ? 'marked' : ''} mr-2`}
                                            onClick={() => handleMarkQuestion(question.orderNumber)}
                                        >
                                            {question.orderNumber}
                                        </strong>
                                    </div>
                                    <div className="flex flex-column">
                                        {question.content && <div className="text-left mb-3">{question.content}</div>}
                                        <div className="flex flex-column gap-2">
                                            {[question.answer1, question.answer2, question.answer3, question.answer4]
                                                .filter(Boolean).map((answer, index) => (
                                                    <div key={index} className="flex align-items-center">
                                                        <RadioButton
                                                            inputId={`${question.id}-${index}`}
                                                            name={`question-${question.id}`}
                                                            value={answer}
                                                            onChange={(e: RadioButtonChangeEvent) => handleAnswerSelect(question.orderNumber, e.value)}
                                                            checked={userAnswerSheet.get(question.orderNumber)?.answer == answer}
                                                        />
                                                        <label htmlFor={`${question.id}-${index}`} className="ml-2">{answer}</label>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </React.Fragment>
        )
    }

    const renderContent = () => {
        const items = displayTestItems.filter(
            (item) => (item.type === ETestItemType.QUESTION || item.type === ETestItemType.QUESTION_GROUP)
                && (item.question?.partNum === currentPartNum || item.questionGroup?.partNum === currentPartNum)
        )

        return (
            <React.Fragment>
                {items.map((item) => (
                    item.type === ETestItemType.QUESTION ? renderSingleQuestion(item.question!) : (
                        item.type === ETestItemType.QUESTION_GROUP && renderGroupQuestions(item.questionGroup!)
                    )
                ))}
                {currentPartNum < 7 && (<div className="m-3 text-right right-0 bottom-0 absolute">
                    <a className="cursor-pointer" style={{ color: '#35509a', backgroundColor: 'transparent' }} onClick={() => handleNextPart()}>
                        TIẾP THEO
                        <span className="pi pi-chevron-right ml-1"></span>
                    </a>
                </div>)}
            </React.Fragment>
        )
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
                                onClick={() => handleAnswerSheetItemClick(1, answer[0])}
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
                                onClick={() => handleAnswerSheetItemClick(2, answer[0])}
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
                                onClick={() => handleAnswerSheetItemClick(3, answer[0])}
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
                                onClick={() => handleAnswerSheetItemClick(4, answer[0])}
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
                                onClick={() => handleAnswerSheetItemClick(5, answer[0])}
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
                                onClick={() => handleAnswerSheetItemClick(6, answer[0])}
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
                                onClick={() => handleAnswerSheetItemClick(7, answer[0])}
                            >
                                {answer[0]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const handleAnswerSheetItemClick = (partNum: number, qOrderNumber: number) => {
        // render tab với part num tương ứng
        setCurrentPartNum(partNum)
        setScrollToQNum(qOrderNumber)
    }

    useEffect(() => {
        /**
         * cuộn vào view question-wrapper không thực hiện ngay sau khi setCurrentPartNum(partNum)
         * chỉ thực hiện sau khi cập nhật scrollToQNum vì component chỉ render sau khi hoàn thành hàm
         */
        if (scrollToQNum) {
            const qWrapper = qWrapperRefs.current[scrollToQNum]

            if (qWrapper) {
                setTimeout(() => {
                    qWrapper.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    })

                    qWrapper.style.border = '1.5px solid #33FF00'
                    setTimeout(() => {
                        qWrapper.style.border = ''
                    }, 1000)
                }, 150)
            }
        }
    }, [scrollToQNum])

    const handleAnswerSelect = (orderNumber: number, answer: string) => {
        setUserAnswerSheet((prevAnswers: UserAnswerSheet) => {
            const updatedAnswers = new Map(prevAnswers)
            const currentAnswer = updatedAnswers.get(orderNumber)
            if (currentAnswer) {
                updatedAnswers.set(orderNumber, { ...currentAnswer, answer })
            }
            return updatedAnswers
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

    useEffect(() => {
        const testInfoState: TestInfoDTO = location.state?.testInfo
        if (testInfoState) {
            setTestInfo(testInfoState)
            setDuration(testInfoState.duration)
            // tao mang 7 part
            const newArray: number[] = new Array(testInfoState.totalParts).fill(0).map((_, index) => index + 1)
            setPartsNum(newArray)
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
        }

        window.addEventListener('scroll', handleScroll);

        // Cleanup khi component bị unmount
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const submitDialog = () => {
        confirmDialog({
            message: (
                <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
                    <i className="pi pi-exclamation-circle text-6xl text-primary-500"></i>
                    <span>Are you sure you want to submit?</span>
                </div>
            ),
            header: 'Confirmination',
            defaultFocus: 'accept',
            accept: handleSubmitTest
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
        const timeLeft = countdownRef.current!.getTimeLeft()
        countdownRef.current?.stopTimer()
        const submitRequest: SubmitFullTestRequest = {
            email: userEmail || '',
            testId: testId,
            testMode: ETestMode.PRACTICE,
            completionTime: duration * 60 - timeLeft,
            userAnswers: submitAnswers
        }
        const response = await callSubmitFullTest(submitRequest)
        if (response.data) {
            navigate(`/test/${testId}/results/${response.data.id}`)
            setLoading(false)
        }
    }

    return (
        <UserLayout>
            <LoadingOverlay visible={loading} />
            <ConfirmDialog />
            {testInfo && (<div className="w-full max-w-full pt-2">
                <h2 className="text-center text-4xl mb-4">
                    {testInfo?.title}
                    <a
                        href={`/tests/${id}/${formatForUrl(testInfo.title)}`}
                        className="p-button p-button-outlined p-button-contrast p-button-sm ml-2"
                        style={{ textDecoration: 'none' }}
                    >
                        Thoát
                    </a>
                </h2>
                <div className="flex relative">
                    <div className="test-navigation" ref={testNavRef}>
                        <div className={`test-navigation__inner ${scrollingState}`} ref={testNavInnerRef} >
                            <div className="flex flex-column timerWrapper my-2">
                                <div className="text-center mb-4">Thời gian còn lại:</div>
                                <DurationCountdown
                                    ref={countdownRef}  // Truyền ref vào component con
                                    duration={duration}
                                    onTimeUp={() => handleSubmitTest()} />
                                <Button label="Nộp bài" outlined raised size="small" className="mt-4" onClick={submitDialog}/>
                                <i className="text-orange-500 mt-3">Chú ý: bạn có thể click vào số thứ tự câu hỏi trong bài để đánh cờ review</i>
                            </div>

                            {renderAnswerSheet()}

                        </div>
                    </div>

                    <div className="test-content contentblock">
                        <div className="mb-5">
                            <audio src={audioSrc} controls className="w-full max-w-full"></audio>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {partsNum.map((value, index) => (
                                <a
                                    key={`a-part-${index}`}
                                    onClick={() => handlePartNumClick(value)}
                                    className={`p-button p-button-rounded p-button-sm ${value !== currentPartNum && 'p-button-outlined'}`}
                                >
                                    Part {value}
                                </a>
                            ))}
                        </div>
                        <div className="tab-content">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>)}
        </UserLayout>
    )
}

export default FullTestPractice