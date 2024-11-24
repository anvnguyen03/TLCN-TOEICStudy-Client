import { Card } from "primereact/card"
import { AnswerOption, QuestionDTO } from "../types/type"
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton"

export const QuestionCard: React.FC<{
    question: QuestionDTO,
    onSelectAnswer: (answer: string) => void,
    onMarkQuestion: () => void,
    isMarkedQuestion: boolean,
    selectedAnswer: string
}> = ({ question, onSelectAnswer, onMarkQuestion, isMarkedQuestion, selectedAnswer }) => {

    const answerOptions: AnswerOption[] = [
        { name: question.answer1, key: 'A' },
        { name: question.answer2, key: 'B' },
        { name: question.answer3, key: 'C' },
        ...(question.answer4 ? [{ name: question.answer4, key: "D" }] : [])
    ]

    return (
        <Card
            title={
                <strong
                    className={`question-number ${isMarkedQuestion ? 'marked' : ''} mr-2`}
                    onClick={() => onMarkQuestion()}
                >
                    {question.orderNumber}
                </strong>
            }
            pt={{
                title: { className: 'text-center' },
                content: { className: 'flex items-center justify-center text-center gap-4' }
            }}
        >
            {question.image && (
                <div className="w-6 h-12rem flex align-items-center justify-content-center overflow-hidden bg-gray-200">
                    <img
                        className="max-w-full max-h-full"
                        src={question.image}
                        alt={`Question ${question.orderNumber}'s image`} />
                </div>
            )}
            <div className={`flex flex-column gap-4 ${question.image ? 'w-6' : 'w-full'}`}>
                {question.content && <p className="text-center">{question.content}</p>}
                <div className="flex flex-column gap-3 mt-4">
                    {answerOptions.map((option) => (
                        <div key={option.key} className="flex align-items-center">
                            <RadioButton
                                inputId={option.key}
                                name={`question-${question.orderNumber}`}
                                value={option.name}
                                onChange={(e: RadioButtonChangeEvent) => onSelectAnswer(e.value)}
                                checked={selectedAnswer === option.name}
                            />
                            <label htmlFor={option.key} className="ml-2">{option.name}</label>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}