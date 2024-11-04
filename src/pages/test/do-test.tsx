import React, { Suspense, useEffect, useState } from "react"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import { DisplayTestItemDTO, ETestItemType, OrderNumber, UserAnswer, UserAnswerSheet } from "../../types/type.ts"
import { useTestItem } from "../../hooks/testHooks"
import { useParams } from "react-router-dom"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Toolbar } from "primereact/toolbar"
import { renderPart, renderQuestion, renderQuestionGroup } from "../../utils/renderTestItem.tsx"

const DoTestPage: React.FC = () => {

    const audioSrc = "/Practice_Set_TOEIC_Test 1.mp3"

    const duration = 120 // minute
    const { id } = useParams<{ id: string }>()  // tham số kiểu string theo mặc định
    const testId = Number(id)   // ép kiểu về number
    const displayTestItems: DisplayTestItemDTO[] = useTestItem(testId)
    const [currentDisplayTestItem, setCurrentDisplayTestItem] = useState<DisplayTestItemDTO>()
    const [currentIndex, setCurrentIndex] = useState(60) // index của displayTestItems
    const [userAnswerSheet, setUserAnswerSheet] = useState<UserAnswerSheet>(new Map<OrderNumber, UserAnswer>)
    const [audio] = useState(() => {
        const audioElement = new Audio(audioSrc);
        audioElement.loop = false;
        return audioElement;
    })

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

        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            // Dừng audio nếu nó đang phát
            if (!audio.paused) {
                audio.pause()
            }
        }
    }, [audio, currentIndex, isListeningSection, listeningItems])

    // Xử lý chuyển tiếp thủ công cho Reading test
    const handleNextReadingItem = () => {
        console.log("Submitting answer: ", Array.from(userAnswerSheet.entries()))  // chuyển Map thành mảng cho dễ nhìn
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
                return item.question ? renderQuestion(item.question, handleAnswerSelect, userAnswerSheet) : null
            case ETestItemType.QUESTION_GROUP:
                return item.questionGroup ? renderQuestionGroup(item.questionGroup, handleAnswerSelect, userAnswerSheet) : null
            default:
                return null
        }
    }

    const handleAnswerSelect = (orderNumber: number, questionId: number, answer: string) => {
        setUserAnswerSheet((prevAnswers: UserAnswerSheet) => {
            const updatedAnswers = new Map(prevAnswers)
            updatedAnswers.set(orderNumber, { questionId, answer })
            return updatedAnswers
        })
    }

    const handleSubmitTest = () => {
        return null
    }

    return (
        <UserLayout>
            <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}>
                <Toolbar
                    className="m-2"
                    center={
                        <DurationCountdown duration={duration} onTimeUp={() => handleSubmitTest()} />
                    }
                />
                {renderItem(currentDisplayTestItem)}

                {!isListeningSection && (
                    <div className="card flex flex-wrap justify-content-center gap-3 mt-3">
                        <Button icon='pi pi-angle-left' onClick={handlePreviousReadingItem} visible={currentIndex > listeningItems.length} />
                        <Button icon='pi pi-angle-right' onClick={handleNextReadingItem} visible={currentIndex < displayTestItems.length - 1} />
                    </div>
                )}
            </Suspense>
        </UserLayout>
    )
}

export default DoTestPage

// ------------------------------------ Sub Components ------------------------------------

// React.memo chỉ re-render khi props truyền vào từ Component cha thay đổi
const DurationCountdown: React.FC<{ duration: number, onTimeUp(): void }> = React.memo(
    ({ duration, onTimeUp }) => {
        const [timeLeftInSecond, setTimeLeftInSecond] = useState<number>(duration * 60)

        useEffect(() => {
            if (timeLeftInSecond <= 0) {
                onTimeUp()
                return
            }

            const timer = setInterval(() => {
                setTimeLeftInSecond(prevTime => prevTime - 1)
            }, 1000)    // 1000 milis

            return () => clearInterval(timer)
        }, [onTimeUp, timeLeftInSecond])

        const minutes = Math.floor(timeLeftInSecond / 60)
        const seconds = timeLeftInSecond % 60

        const bgColorClass = timeLeftInSecond <= 300 ? 'bg-red-500' : 'bg-gray-300'  // 5 mins

        return (
            <div className="text-center flex-1 align-items-center justify-content-center">
                <h5 className={`px-3 inline py-3 ${bgColorClass} border-round-md`}>
                    {minutes} phút {seconds < 10 ? `0${seconds}` : seconds} giây
                </h5>
            </div>
        )
    }
)

