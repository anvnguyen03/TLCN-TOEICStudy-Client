import { Card } from "primereact/card"
import { PartDTO, QuestionDTO, QuestionGroupDTO, UserAnswerSheet } from "../types/type"
import { QuestionCard } from "../components/QuestionCard"
import QuestionGroupCard from "../components/QuestionGroupCard"
import { LISTENING_TEST_DIRECTIONS, PART_1_DIRECTIONS, PART_2_DIRECTIONS, PART_3_DIRECTIONS, PART_4_DIRECTIONS, PART_5_DIRECTIONS, PART_6_DIRECTIONS, PART_7_DIRECTIONS } from "../constant/StaticPartDirections"

// Hàm render từng loại item
export const renderPart = (part: PartDTO): JSX.Element => {
    const getDirections = (partNum: number): string => {
        switch(partNum) {
            case 1:
                return PART_1_DIRECTIONS
            case 2:
                return PART_2_DIRECTIONS
            case 3:
                return PART_3_DIRECTIONS
            case 4:
                return PART_4_DIRECTIONS
            case 5:
                return PART_5_DIRECTIONS
            case 6:
                return PART_6_DIRECTIONS
            case 7:
                return PART_7_DIRECTIONS
            default:
                return ''
        }
    }

    return (
        <Card
            title={`Part ` + part.partNum}
            subTitle='Directions'
            pt={{
                title: { className: 'text-center' },
                subTitle: { className: 'text-center' }
            }}>
            <p className="m-0">
                {getDirections(part.partNum)}
            </p>
        </Card>
    )
}

export const renderListeningTestDirections = (): JSX.Element => (
    <Card
        title='LISTENING TEST'
        pt={{
            title: { className: 'text-center' }
        }}>
        <p className="m-0">
            {LISTENING_TEST_DIRECTIONS}
        </p>
    </Card>
)

export const renderQuestion = (
    question: QuestionDTO,
    handleAnswerSelect: (orderNumber: number, questionId: number, answer: string) => void,
    handleMarkQuestion: (orderNumber: number) => void,
    userAnswerSheet: UserAnswerSheet
): JSX.Element => (
    <QuestionCard
        key={question.orderNumber}
        question={question}
        onSelectAnswer={(answer) => handleAnswerSelect(question.orderNumber, question.id, answer)}
        onMarkQuestion={() => handleMarkQuestion(question.orderNumber)}
        isMarkedQuestion={userAnswerSheet.get(question.orderNumber)?.isMarked || false}
        selectedAnswer={userAnswerSheet.get(question.orderNumber)?.answer || ''}
    />
)

export const renderQuestionGroup = (
    group: QuestionGroupDTO,
    handleAnswerSelect: (orderNumber: number, questionId: number, answer: string) => void,
    handleMarkQuestion: (orderNumber: number) => void,
    userAnswerSheet: UserAnswerSheet
): JSX.Element => (
    <QuestionGroupCard
        key={group.id}
        questionGroup={group}
        onSelectAnswer={(orderNumber, questionId, answer) => handleAnswerSelect(orderNumber, questionId, answer)}
        onMarkQuestion={(orderNumber) => handleMarkQuestion(orderNumber)}
        userAnswerSheet={userAnswerSheet}
    />
)