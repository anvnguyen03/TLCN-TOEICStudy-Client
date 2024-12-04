import { Card } from "primereact/card"
import { PartDTO, QuestionDTO, QuestionGroupDTO, UserAnswerSheet } from "../types/type"
import { QuestionCard } from "../components/QuestionCard"
import QuestionGroupCard from "../components/QuestionGroupCard"
import { LISTENING_TEST_DIRECTIONS } from "../constant/StaticPartDirections"

// Hàm render từng loại item
export const renderPart = (part: PartDTO): JSX.Element => (
    <Card
        title={`Part ` + part.partNum}
        subTitle='Directions'
        pt={{
            title: { className: 'text-center' },
            subTitle: { className: 'text-center' }
        }}>
        <p className="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt soluta quas eum? Nobis, assumenda, officia recusandae quis ipsum iusto earum repudiandae animi laudantium tempore quod quam, repellat a eum in?
        </p>
    </Card>
)

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