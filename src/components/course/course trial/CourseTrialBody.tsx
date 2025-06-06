import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { CourseTrialContext } from '../../../context/CourseTrialContext';
import { TabView, TabPanel } from 'primereact/tabview';
import ReactPlayer from 'react-player';
import 'primeflex/primeflex.css';
import ReactMarkdown from 'react-markdown';
import { callCheckMultipleChoiceAnswers, callCheckCardMatchingAnswers } from '../../../services/QuizTrialService';
import { TrialMultipleChoiceResult } from '../../../types/type';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  type: 'multiple-choice' | 'card-matching';
  pairs?: { 
    prompt: { id: number; content: string }; 
    answer: string 
  }[];
}

interface QuizLessonProps {
  quiz: { questions: QuizQuestion[] };
  onComplete?: (passed: boolean) => void;
  lessonId: number;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const QuizLesson = ({ quiz, onComplete, lessonId }: QuizLessonProps) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState<TrialMultipleChoiceResult | null>(null);

  // Card-matching state
  const [promptOrder, setPromptOrder] = useState<number[]>([]);
  const [answerOrder, setAnswerOrder] = useState<number[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [matches, setMatches] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean[]>([]);

  // Cleanup function to reset state
  const resetState = () => {
    setCurrent(0);
    setAnswers(Array(quiz.questions.length).fill(null));
    setScore(0);
    setShowResult(false);
    setSelectedPrompt(null);
    setMatches([]);
    setSubmitted(false);
    setResult([]);
  };

  // Reset all state when lesson changes
  React.useEffect(() => {
    resetState();
    return () => {
      // Cleanup when component unmounts
      resetState();
    };
  }, [lessonId, quiz.questions.length]);

  // Initialize card-matching state when current question changes
  React.useEffect(() => {
    const q = quiz.questions[current];
    if (q.type === 'card-matching' && q.pairs) {
      // Shuffle both prompts and answers independently
      const shuffledPrompts = shuffleArray(q.pairs.map((_, i) => i));
      const shuffledAnswers = shuffleArray(q.pairs.map((_, i) => i));
      setPromptOrder(shuffledPrompts);
      setAnswerOrder(shuffledAnswers);
      setMatches(Array(q.pairs.length).fill(null));
      setSelectedPrompt(null);
      setSubmitted(false);
      setResult([]);
    }
  }, [current, quiz.questions]);

  const handleSelect = (idx: number) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handlePromptClick = (idx: number) => {
    if (submitted) return;
    setSelectedPrompt(idx);
  };

  const handleAnswerClick = (aIdx: number) => {
    if (submitted || selectedPrompt === null) return;
    if (matches.includes(aIdx)) return;
    
    const updated = [...matches];
    updated[selectedPrompt] = aIdx;
    setMatches(updated);
    setSelectedPrompt(null);
  };

  const handleNext = () => {
    setCurrent((c) => c + 1);
    setSelectedPrompt(null);
    setMatches(Array(quiz.questions[current + 1]?.pairs?.length || 0).fill(null));
    setSubmitted(false);
    setResult([]);
  };

  const handlePrev = () => {
    setCurrent((c) => c - 1);
    setSelectedPrompt(null);
    setMatches(Array(quiz.questions[current - 1]?.pairs?.length || 0).fill(null));
    setSubmitted(false);
    setResult([]);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (quiz.questions[current].type === 'multiple-choice') {
        // Prepare multiple choice answers
        const multipleChoiceAnswers = quiz.questions.map((q, i) => ({
          quizQuestionId: q.id,
          selectedOption: q.options[answers[i] || 0]
        }));

        const response = await callCheckMultipleChoiceAnswers(multipleChoiceAnswers);
        const result = response.data;
        
        setScore(result?.correctAnswers || 0);
        setQuizResults(result || null);
        setShowResult(true);
        if (onComplete) onComplete(result?.correctAnswers === result?.totalQuestions);
      } else {
        // Prepare card matching answer with correct prompt-answer pairs
        const q = quiz.questions[current];
        if (!q.pairs) return;

        const cardMatchingAnswer = {
          quizQuestionId: q.id,
          pairs: matches.map((matchIdx, promptIdx) => {
            const originalPromptIdx = promptOrder[promptIdx];
            const originalAnswerIdx = matchIdx !== null ? answerOrder[matchIdx] : -1;
            return {
              promptId: q.pairs![originalPromptIdx].prompt.id,
              answerContent: matchIdx !== null ? q.pairs![originalAnswerIdx].answer : ''
            };
          })
        };

        const response = await callCheckCardMatchingAnswers(cardMatchingAnswer);
        const result = response.data;
        
        const results = result?.results.map(r => r.correct) || [];
        setResult(results);
        setSubmitted(true);
        if (onComplete) onComplete(result?.correctPairs === result?.totalPairs);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (quiz.questions[current].type === 'multiple-choice') {
      setAnswers(Array(quiz.questions.length).fill(null));
      setShowResult(false);
      setCurrent(0);
    } else {
      const q = quiz.questions[current];
      if (q.type === 'card-matching' && q.pairs) {
        // Re-shuffle prompts and answers
        const shuffledPrompts = shuffleArray(q.pairs.map((_, i) => i));
        const shuffledAnswers = shuffleArray(q.pairs.map((_, i) => i));
        setPromptOrder(shuffledPrompts);
        setAnswerOrder(shuffledAnswers);
        setMatches(Array(q.pairs.length).fill(null));
        setSelectedPrompt(null);
        setSubmitted(false);
        setResult([]);
      }
    }
    if (onComplete) onComplete(false);
  };

  if (showResult && quiz.questions[current].type === 'multiple-choice' && quizResults) {
    return (
      <div className="p-4" style={{ background: '#fff', borderRadius: '1rem', maxWidth: 700, margin: '0 auto' }}>
        <div className="mb-3" style={{ color: '#23243a', fontWeight: 600, fontSize: '1.2rem' }}>Quiz Results</div>
        <div className="mb-2" style={{ color: '#23243a', fontWeight: 500 }}>
          You got {score} / {quiz.questions.length} correct!
        </div>
        <ul className="list-none p-0 m-0 mb-4">
          {quiz.questions.map((q, i) => {
            const result = quizResults.results.find((r: { quizQuestionId: number }) => r.quizQuestionId === q.id);
            return (
              <li key={i} className="mb-3">
                <div style={{ color: '#23243a', fontWeight: 600 }}>{i + 1}. {q.question}</div>
                <div>
                  {q.options.map((opt, idx) => {
                    const isCorrect = result?.correctOption === opt;
                    const isSelected = result?.selectedOption === opt;
                    const isWrong = isSelected && !isCorrect;
                    return (
                      <div key={idx} style={{
                        color: isCorrect ? '#22c55e' : (isWrong ? '#ef4444' : '#23243a'),
                        fontWeight: isCorrect ? 700 : 400,
                        marginLeft: 8
                      }}>
                        {isCorrect ? '✔ ' : ''}{opt}
                        {isWrong ? ' (Your answer)' : ''}
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
        <Button label="Retry Quiz" onClick={handleRetry} className="p-button-sm mr-2" style={{ background: '#a78bfa', border: 'none', fontWeight: 700 }} />
      </div>
    );
  }

  const q = quiz.questions[current];

  if (q.type === 'multiple-choice') {
    return (
      <div className="p-4" style={{ background: '#fff', borderRadius: '1rem', maxWidth: 700, margin: '0 auto' }}>
        <div className="mb-3" style={{ color: '#23243a', fontWeight: 600, fontSize: '1.2rem' }}>Question {current + 1} of {quiz.questions.length}:</div>
        <div className="mb-4" style={{ color: '#23243a', fontSize: '1.1rem' }}>{q.question}</div>
        <div className="flex flex-column gap-3 mb-4">
          {q.options.map((opt: string, idx: number) => (
            <label key={idx} className={`flex align-items-center gap-3 p-3 border-1 border-round cursor-pointer ${answers[current] === idx ? 'border-primary' : 'border-gray-300'}`} style={{ borderColor: answers[current] === idx ? '#a78bfa' : '#d1d5db', background: answers[current] === idx ? '#f6f3ff' : '#fff' }}>
              <input
                type="radio"
                name={`quiz-option-${current}`}
                checked={answers[current] === idx}
                onChange={() => handleSelect(idx)}
                style={{ accentColor: '#a78bfa', width: 20, height: 20 }}
              />
              <span style={{ fontWeight: 600, color: '#23243a', fontSize: '1.1rem' }}>{opt}</span>
            </label>
          ))}
        </div>
        <div className="flex align-items-center gap-3 mt-2">
          <Button label="Previous" onClick={handlePrev} disabled={current === 0} className="p-button-sm" />
          <Button label={current === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
            onClick={current === quiz.questions.length - 1 ? handleSubmit : handleNext}
            disabled={answers[current] === null}
            className="p-button-sm"
            style={{ background: '#a78bfa', border: 'none', fontWeight: 700 }}
          />
        </div>
      </div>
    );
  }

  // Card Matching Question
  return (
    <div className="p-4" style={{ background: '#fff', borderRadius: '1rem', maxWidth: 900, margin: '0 auto' }}>
      <div className="mb-3" style={{ color: '#23243a', fontWeight: 600, fontSize: '1.2rem' }}>{q.question}</div>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div className="mb-2" style={{ fontWeight: 700, color: '#6d28d2' }}>Prompts</div>
          {promptOrder.map((pIdx, i) => (
            <div
              key={pIdx}
              className={`p-3 border-1 border-round mb-2 cursor-pointer ${selectedPrompt === i ? 'border-primary' : 'border-gray-300'} ${matches[i] !== null ? 'bg-gray-200' : ''}`}
              style={{ 
                borderColor: selectedPrompt === i ? '#a78bfa' : '#d1d5db', 
                background: matches[i] !== null ? '#f6f3ff' : '#fff', 
                minHeight: 60, 
                opacity: submitted && !result[i] ? 0.6 : 1 
              }}
              onClick={() => handlePromptClick(i)}
            >
              {q.pairs![pIdx].prompt.content}
              {matches[i] !== null && (
                <span className="ml-2 text-xs" style={{ color: '#a78bfa' }}>
                  → {q.pairs![answerOrder[matches[i]!]].answer}
                </span>
              )}
              {submitted && result[i] !== undefined && (
                <span className="ml-2" style={{ fontWeight: 700, color: result[i] ? '#22c55e' : '#ef4444' }}>
                  {result[i] ? '✔' : '✗'}
                </span>
              )}
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2" style={{ fontWeight: 700, color: '#6d28d2' }}>Answers</div>
          {answerOrder.map((aIdx, i) => {
            const matchedPrompt = matches.findIndex(m => m === i);
            return (
              <div
                key={aIdx}
                className={`p-3 border-1 border-round mb-2 cursor-pointer ${matchedPrompt !== -1 ? 'bg-gray-200' : ''}`}
                style={{ 
                  background: matchedPrompt !== -1 ? '#f6f3ff' : '#fff', 
                  minHeight: 60, 
                  opacity: submitted && matchedPrompt === -1 ? 0.6 : 1 
                }}
                onClick={() => handleAnswerClick(i)}
              >
                {q.pairs![aIdx].answer}
                {matchedPrompt !== -1 && (
                  <span className="ml-2 text-xs" style={{ color: '#a78bfa' }}>
                    ← {q.pairs![promptOrder[matchedPrompt]].prompt.content.slice(0, 12)}...
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex align-items-center gap-3 mt-4">
        <Button 
          label="Submit" 
          onClick={handleSubmit} 
          disabled={matches.some(m => m === null) || submitted} 
          style={{ background: '#a78bfa', border: 'none', fontWeight: 700 }} 
        />
        {submitted && !result.every(Boolean) && (
          <Button 
            label="Retry" 
            onClick={handleRetry} 
            className="p-button-sm" 
            style={{ background: '#a78bfa', border: 'none', fontWeight: 700 }} 
          />
        )}
        {submitted && result.every(Boolean) && (
          <span style={{ fontWeight: 600, color: '#22c55e' }}>All correct! Well done!</span>
        )}
        {submitted && !result.every(Boolean) && (
          <span style={{ fontWeight: 600, color: '#ef4444' }}>Some matches are incorrect. Try again!</span>
        )}
      </div>
    </div>
  );
};

const CourseBody: React.FC = () => {
  const context = useContext(CourseTrialContext);
  const [quizKey, setQuizKey] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset quiz key when lesson changes
  React.useEffect(() => {
    if (context) {
      setQuizKey(prev => prev + 1);
    }
  }, [context?.currentLesson.lessonIndex]);

  if (!context) return null;

  const { currentLesson, setCurrentLesson, lessons, courseInfo, isLoading, error } = context;
  const { lessonIndex } = currentLesson;
  const lesson = lessons[lessonIndex];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <div className="text-white">Loading lessons...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <div className="text-white">{error}</div>
      </div>
    );
  }

  // Show empty state
  if (!lesson || !courseInfo) {
    return (
      <div className="flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <div className="text-white">No lessons available</div>
      </div>
    );
  }

  // Navigation logic
  const goToPreviousLesson = () => {
    if (lessonIndex > 0) {
      // Force remount of quiz component
      setQuizKey(prev => prev + 1);
      setCurrentLesson({ lessonIndex: lessonIndex - 1 });
    }
  };

  const goToNextLesson = () => {
    if (lessonIndex < lessons.length - 1) {
      // Force remount of quiz component
      setQuizKey(prev => prev + 1);
      setCurrentLesson({ lessonIndex: lessonIndex + 1 });
    }
  };

  // For disabling navigation
  const isFirstLesson = lessonIndex === 0;
  const isLastLesson = lessonIndex === lessons.length - 1;

  const handleQuizComplete = (passed: boolean) => {
    console.log('Quiz completed:', passed);
  };

  return (
    <div className="flex flex-column gap-4 p-4" style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
      {/* Sticky navigation */}
      <div className="flex justify-content-between align-items-center sticky top-0 z-5 py-2 px-0" style={{ background: '#181922', borderBottom: '1px solid #23243a' }}>
        <Button
          label="Previous"
          icon="pi pi-chevron-left"
          onClick={goToPreviousLesson}
          disabled={isFirstLesson}
          className="p-button-text p-button-lg"
        />
        <span className="font-bold text-lg text-center flex-1" style={{ color: '#fff' }}>{lesson.title}</span>
        <Button
          label="Next"
          icon="pi pi-chevron-right"
          iconPos="right"
          onClick={goToNextLesson}
          disabled={isLastLesson}
          className="p-button-text p-button-lg"
        />
      </div>

      {/* Video, text, or quiz lesson */}
      <div className="lesson-media mb-4" style={{ borderRadius: '1rem', overflow: 'hidden', background: '#23243a', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
        {lesson.type === 'VIDEO' && lesson.videoUrl && (
          <div className="p-mb-4">
            <ReactPlayer
              url={lesson.videoUrl}
              controls
              width="100%"
            />
          </div>
        )}
        {lesson.type === 'TEXT' && <div className="p-4 text-base" style={{ color: '#000', background: '#fff' }}>
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>}
        {lesson.type === 'QUIZ' && lesson.quizQuestions && (
          <div key={quizKey}>
            <QuizLesson
              quiz={{
                questions: lesson.quizQuestions.map(q => ({
                  id: q.id,
                  question: q.question,
                  options: q.option ? [q.option.optionText1, q.option.optionText2, q.option.optionText3] : [],
                  answer: 0,
                  type: q.type === 'MULTIPLE_CHOICE' ? 'multiple-choice' : 'card-matching',
                  pairs: q.pairs ? q.pairs.prompts.map((p, i) => ({
                    prompt: { id: p.id, content: p.content },
                    answer: q.pairs!.answers[i].content
                  })) : undefined
                }))
              }}
              lessonId={lesson.id}
              onComplete={handleQuizComplete}
            />
          </div>
        )}
      </div>

      {/* Tabs for Overview, Notes, Reviews */}
      <TabView className="custom-tabview" style={{ background: 'transparent' }}>
        <TabPanel header="Overview">
          <div style={{ color: '#23243a', background: 'transparent', padding: '0 0 2rem 0' }}>
            {/* Course Title & Stats */}
            <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 8 }}>{courseInfo.title}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '1rem', color: '#555', marginBottom: 16 }}>
              <div><strong>Lectures:</strong> {courseInfo.totalLessons}</div>
              <div><strong>Duration:</strong> {courseInfo.duration} min</div>
            </div>

            {/* Course Description */}
            <div style={{ color: '#444', fontSize: '1.1rem', marginBottom: 16 }}>
              <ReactMarkdown>{courseInfo.description}</ReactMarkdown>
            </div>

            {/* What You'll Learn */}
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', margin: '24px 0 8px 0' }}>What you'll learn</h3>
            <div style={{ color: '#23243a', fontSize: '1rem', marginBottom: 24 }}>
              <ReactMarkdown>{courseInfo.objective}</ReactMarkdown>
            </div>

            {/* Course Content Summary */}
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', margin: '24px 0 8px 0' }}>Course Content</h3>
            <div style={{ 
              maxHeight: isExpanded ? 'none' : '10px', 
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '1rem'
            }}>
              <ul style={{ color: '#23243a', fontSize: '1rem', paddingLeft: 20 }}>
                {courseInfo.sections.map((section) => (
                  <li key={section.id} style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>{section.title}</div>
                    <ul style={{ paddingLeft: 20 }}>
                      {section.lessons.map((lesson) => (
                        <li key={lesson.id} style={{ marginBottom: 6 }}>
                          <span style={{ fontWeight: 500 }}>{lesson.title}</span>
                          <span style={{ marginLeft: 8, color: '#666' }}>— {lesson.duration} min</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              {!isExpanded && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '10px',
                  background: 'linear-gradient(transparent, #fff)',
                  pointerEvents: 'none'
                }} />
              )}
            </div>
            <Button 
              label={isExpanded ? "Show Less" : "Show More"} 
              icon={isExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
              className="p-button-text" 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ color: '#6d28d2', fontWeight: 600 }}
            />
          </div>
        </TabPanel>
        <TabPanel header="Reviews">
          <div style={{ color: '#23243a', background: 'transparent', padding: '0 0 2rem 0' }}>
            {/* Student Feedback Summary */}
            <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 16 }}>Student feedback</h2>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, marginBottom: 32, width: '100%' }}>
              {/* Average Rating */}
              <div style={{ minWidth: 120, maxWidth: 140, flex: '0 0 140px', textAlign: 'center', paddingRight: 16 }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#b4690e', lineHeight: 1 }}>{4.5}</div>
                <div style={{ color: '#b4690e', fontSize: '1.2rem', marginBottom: 4, letterSpacing: 2 }}>
                  {'★'.repeat(4)}<span style={{ opacity: 0.5 }}>★</span>
                </div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Tutorial rating</div>
              </div>
              {/* Rating Breakdown */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star} style={{ display: 'grid', gridTemplateColumns: '220px 90px 50px', alignItems: 'center', gap: 0, marginBottom: 2 }}>
                    <div style={{ height: 10, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden', width: '100%', marginRight: 0 }}>
                      <div style={{ width: `${[55, 32, 10, 2, 1][i]}%`, height: '100%', background: '#b4690e' }}></div>
                    </div>
                    <span style={{ color: '#b4690e', fontSize: '1.1rem', letterSpacing: 1, display: 'inline-block', textAlign: 'left', paddingLeft: 16, marginRight: 16 }}>{'★'.repeat(star)}</span>
                    <span style={{ color: '#5624d0', fontSize: '0.95rem', cursor: 'pointer', display: 'inline-block', paddingLeft: '2rem' }}>{[55, 32, 10, 2, 1][i]}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', margin: '32px 0 16px 0' }}>Reviews</h3>
            {/* Mock reviews data */}
            {[
              {
                username: 'Ana C.',
                rating: 5,
                time: 'a week ago',
                comment: "Super useful! I'm a beginner and found this course an invaluable resource. It's fast, concrete, easy to follow and not boring at all. Thanks a lot for making this tool available.",
              },
              {
                username: 'Johanna A.',
                rating: 4,
                time: 'a week ago',
                comment: 'Very helpful and super informative, love that they provided a cheat sheet and pictures of the work course slides',
              },
              {
                username: 'Suliman K.',
                rating: 3,
                time: 'a week ago',
                comment: 'dont waste your time here. here are just slides and nothing else. find a real practical course where you can learn practically.',
              },
            ].map((review, idx) => (
              <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#23243a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, marginRight: 16 }}>
                    {review.username.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{review.username}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{review.time}</div>
                  </div>
                  <div style={{ color: '#b4690e', fontSize: 18, fontWeight: 700, marginLeft: 8 }}>{'★'.repeat(review.rating)}<span style={{ opacity: 0.3 }}>{'★'.repeat(5 - review.rating)}</span></div>
                </div>
                <div style={{ fontSize: 16, color: '#23243a', marginBottom: 16 }}>{review.comment}</div>
              </div>
            ))}
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default CourseBody;