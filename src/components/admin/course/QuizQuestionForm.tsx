"use client"

import { InputTextarea } from "primereact/inputtextarea"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import type { QuizQuestion, CardMatchingPair } from "./types"

interface QuizQuestionFormProps {
  question: QuizQuestion
  questionIndex: number
  onUpdate: (question: QuizQuestion) => void
}

export const QuizQuestionForm = ({ question, questionIndex, onUpdate }: QuizQuestionFormProps) => {
  const quizTypeOptions = [
    { label: "Multiple Choice", value: "MULTIPLE_CHOICE" },
    { label: "Card Matching", value: "CARD_MATCHING" },
  ]

  const addCardMatchingPair = () => {
    const newPair: CardMatchingPair = {
      prompt: "",
      answer: "",
      orderIndex: (question.pairs?.length || 0) + 1,
    }
    onUpdate({
      ...question,
      pairs: [...(question.pairs || []), newPair],
    })
  }

  const updateCardMatchingPair = (pairIndex: number, pair: CardMatchingPair) => {
    const updatedPairs = [...(question.pairs || [])]
    updatedPairs[pairIndex] = pair
    onUpdate({
      ...question,
      pairs: updatedPairs,
    })
  }

  const deleteCardMatchingPair = (pairIndex: number) => {
    const updatedPairs = question.pairs?.filter((_, i) => i !== pairIndex) || []
    onUpdate({
      ...question,
      pairs: updatedPairs,
    })
  }

  const handleQuestionTypeChange = (newType: "MULTIPLE_CHOICE" | "CARD_MATCHING") => {
    const updatedQuestion = { ...question, type: newType }

    if (newType === "MULTIPLE_CHOICE") {
      updatedQuestion.option = {
        optionText1: "",
        optionText2: "",
        optionText3: "",
        correctOption: "",
      }
      updatedQuestion.pairs = []
    } else if (newType === "CARD_MATCHING") {
      updatedQuestion.pairs = []
      updatedQuestion.option = undefined
    }

    onUpdate(updatedQuestion)
  }

  return (
    <Card className="mb-2">
      <div className="grid">
        <div className="col-12 md:col-8">
          <label className="block text-900 font-medium mb-2">Question</label>
          <InputTextarea
            value={question.question}
            onChange={(e) => onUpdate({ ...question, question: e.target.value })}
            rows={2}
            className="w-full"
            placeholder="Enter your question"
          />
        </div>
        <div className="col-12 md:col-4">
          <label className="block text-900 font-medium mb-2">Type</label>
          <Dropdown
            value={question.type}
            options={quizTypeOptions}
            onChange={(e) => handleQuestionTypeChange(e.value)}
            className="w-full"
          />
        </div>

        {/* Multiple Choice Options */}
        {question.type === "MULTIPLE_CHOICE" && question.option && (
          <>
            <div className="col-12 md:col-3">
              <label className="block text-900 font-medium mb-2">Option A</label>
              <InputText
                value={question.option.optionText1}
                onChange={(e) =>
                  onUpdate({
                    ...question,
                    option: { ...question.option!, optionText1: e.target.value },
                  })
                }
                className="w-full"
                placeholder="Option A"
              />
            </div>
            <div className="col-12 md:col-3">
              <label className="block text-900 font-medium mb-2">Option B</label>
              <InputText
                value={question.option.optionText2}
                onChange={(e) =>
                  onUpdate({
                    ...question,
                    option: { ...question.option!, optionText2: e.target.value },
                  })
                }
                className="w-full"
                placeholder="Option B"
              />
            </div>
            <div className="col-12 md:col-3">
              <label className="block text-900 font-medium mb-2">Option C</label>
              <InputText
                value={question.option.optionText3}
                onChange={(e) =>
                  onUpdate({
                    ...question,
                    option: { ...question.option!, optionText3: e.target.value },
                  })
                }
                className="w-full"
                placeholder="Option C"
              />
            </div>
            <div className="col-12 md:col-3">
              <label className="block text-900 font-medium mb-2">Correct Answer</label>
              <Dropdown
                value={question.option.correctOption}
                options={[
                  { label: "Option A", value: question.option.optionText1 },
                  { label: "Option B", value: question.option.optionText2 },
                  { label: "Option C", value: question.option.optionText3 },
                ]}
                onChange={(e) =>
                  onUpdate({
                    ...question,
                    option: { ...question.option!, correctOption: e.value },
                  })
                }
                className="w-full"
                placeholder="Select correct answer"
              />
            </div>
          </>
        )}

        {/* Card Matching Pairs */}
        {question.type === "CARD_MATCHING" && (
          <div className="col-12">
            <div className="flex justify-content-between align-items-center mb-3">
              <label className="block text-900 font-medium">Matching Pairs</label>
              <Button label="Add Pair" icon="pi pi-plus" size="small" outlined onClick={addCardMatchingPair} />
            </div>

            {question.pairs && question.pairs.length > 0 ? (
              question.pairs.map((pair, pairIndex) => (
                <Card key={pairIndex} className="mb-2 bg-gray-50">
                  <div className="grid">
                    <div className="col-12 md:col-5">
                      <label className="block text-900 font-medium mb-2">Prompt</label>
                      <InputText
                        value={pair.prompt}
                        onChange={(e) =>
                          updateCardMatchingPair(pairIndex, {
                            ...pair,
                            prompt: e.target.value,
                          })
                        }
                        className="w-full"
                        placeholder="Enter prompt"
                      />
                    </div>
                    <div className="col-12 md:col-5">
                      <label className="block text-900 font-medium mb-2">Answer</label>
                      <InputText
                        value={pair.answer}
                        onChange={(e) =>
                          updateCardMatchingPair(pairIndex, {
                            ...pair,
                            answer: e.target.value,
                          })
                        }
                        className="w-full"
                        placeholder="Enter answer"
                      />
                    </div>
                    <div className="col-12 md:col-2 flex align-items-end">
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        outlined
                        size="small"
                        onClick={() => deleteCardMatchingPair(pairIndex)}
                        tooltip="Delete pair"
                        className="w-full"
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 border-2 border-dashed border-300 border-round">
                <i className="pi pi-link text-3xl text-400 mb-2"></i>
                <p className="text-600 m-0">No matching pairs added yet. Click "Add Pair" to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
