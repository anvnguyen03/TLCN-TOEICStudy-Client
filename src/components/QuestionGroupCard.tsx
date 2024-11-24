import React from "react"
import { Card } from "primereact/card"
import { ScrollPanel } from "primereact/scrollpanel"
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton"
import { QuestionGroupDTO, UserAnswerSheet } from "../types/type"
import './QuestionGroupCard.css'

interface QuestionGroupCardProps {
    questionGroup: QuestionGroupDTO
    onSelectAnswer: (orderNumber: number, questionId: number, answer: string) => void
    onMarkQuestion: (orderNumber: number) => void,
    userAnswerSheet: UserAnswerSheet
}

const QuestionGroupCard: React.FC<QuestionGroupCardProps> = ({ questionGroup, onSelectAnswer, onMarkQuestion, userAnswerSheet }) => {
    return (
        <Card
            title={questionGroup.name}
            pt={{
                title: { className: "text-center" },
                content: { className: "flex flex-column md:flex-row items-center justify-center text-center gap-4 scrollpanel" }
            }}
        >
            {/* Hiển thị các hình ảnh */}
            {/* <div className="flex flex-wrap gap-3 mb-4">
                {questionGroup.images && questionGroup.images.map((img) => (
                    <div key={img.id} className="w-full sm:w-6rem md:w-4rem lg:w-3rem flex align-items-center justify-content-center overflow-hidden bg-gray-200">
                        <img className="max-w-full max-h-full" src={img.image} alt={`Image for ${questionGroup.name}`} />
                    </div>
                ))}
            </div> */}
            <ScrollPanel style={{ width: '100%', height: '500px' }} className="custombar1">
                {questionGroup.images && questionGroup.images.map((img) => (
                    <div key={img.id} className="">
                        <img className="max-w-full max-h-full" src={img.image} alt={`Image for ${questionGroup.name}`} />
                    </div>
                ))}
            </ScrollPanel>

            {/* Hiển thị các câu hỏi con với 2 cột có thể cuộn */}
            <ScrollPanel style={{ width: '100%', height: '500px' }} className="custombar2">
                <div className="flex gap-4">
                    <div className="flex-1 flex flex-column gap-3">
                        {questionGroup.subQuestions.map((question) => (
                            <div key={question.id} className="p-2 border-1 border-round-md">
                                <div className="flex align-items-center mb-2">
                                    <strong
                                        className={`question-number ${userAnswerSheet.get(question.orderNumber)?.isMarked ? 'marked' : ''} mr-2`}
                                        onClick={() => onMarkQuestion(question.orderNumber)}
                                    >
                                        {question.orderNumber}
                                    </strong>
                                    <p className="mb-2 font-semibold">{question.content}</p>
                                </div>
                                <div className="flex flex-column gap-2">
                                    {[question.answer1, question.answer2, question.answer3, question.answer4]
                                        .filter(Boolean)
                                        .map((answer, index) => (
                                            <div key={index} className="ml-1 flex align-items-center">
                                                <RadioButton
                                                    inputId={`${question.id}-${index}`}
                                                    name={`question-${question.id}`}
                                                    value={answer}
                                                    onChange={(e: RadioButtonChangeEvent) => onSelectAnswer(question.orderNumber, question.id, e.value)}
                                                    checked={userAnswerSheet.get(question.orderNumber)?.answer == answer}
                                                />
                                                <label htmlFor={`${question.id}-${index}`} className="ml-2 text-left">{answer}</label>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollPanel>
        </Card>
    )
}

export default QuestionGroupCard
