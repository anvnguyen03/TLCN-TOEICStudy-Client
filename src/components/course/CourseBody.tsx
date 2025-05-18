import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import VideoPlayer from './VideoPlayer';
import { CourseContext } from '../../context/CourseContext';
import 'primeflex/primeflex.css';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  type: 'multiple-choice' | 'card-matching';
  pairs?: { prompt: string; answer: string }[];
}

interface QuizLessonProps {
  quiz: { questions: QuizQuestion[] };
  onComplete?: (passed: boolean) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const QuizLesson = ({ quiz, onComplete }: QuizLessonProps) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Card-matching state
  const [promptOrder, setPromptOrder] = useState<number[]>([]);
  const [answerOrder, setAnswerOrder] = useState<number[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [matches, setMatches] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean[]>([]);

  // Re-initialize card-matching state when current question changes and it's card-matching
  React.useEffect(() => {
    const q = quiz.questions[current];
    if (q.type === 'card-matching' && q.pairs) {
      setPromptOrder(shuffleArray(q.pairs.map((_, i) => i)));
      setAnswerOrder(shuffleArray(q.pairs.map((_, i) => i)));
      setMatches(Array(q.pairs.length).fill(null));
      setSelectedPrompt(null);
      setSubmitted(false);
      setResult([]);
    }
    // eslint-disable-next-line
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

  const handleSubmit = () => {
    if (quiz.questions[current].type === 'multiple-choice') {
      let correct = 0;
      quiz.questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });
      setScore(correct);
      setShowResult(true);
      if (onComplete) onComplete(correct === quiz.questions.length);
    } else {
      const res = quiz.questions[current].pairs?.map((pair, i) => {
        const answerIdx = matches[i];
        return answerIdx !== null && pair.answer === quiz.questions[current].pairs![answerOrder[answerIdx]].answer;
      }) || [];
      setResult(res);
      setSubmitted(true);
      if (onComplete) onComplete(res.every(Boolean));
    }
  };

  const handleRetry = () => {
    if (quiz.questions[current].type === 'multiple-choice') {
      setAnswers(Array(quiz.questions.length).fill(null));
      setShowResult(false);
      setCurrent(0);
    } else {
      setMatches(Array(quiz.questions[current].pairs?.length || 0).fill(null));
      setSubmitted(false);
      setResult([]);
      setSelectedPrompt(null);
    }
    if (onComplete) onComplete(false);
  };

  if (showResult && quiz.questions[current].type === 'multiple-choice') {
    return (
      <div className="p-4" style={{ background: '#fff', borderRadius: '1rem', maxWidth: 700, margin: '0 auto' }}>
        <div className="mb-3" style={{ color: '#23243a', fontWeight: 600, fontSize: '1.2rem' }}>Quiz Results</div>
        <div className="mb-2" style={{ color: '#23243a', fontWeight: 500 }}>
          You got {score} / {quiz.questions.length} correct!
        </div>
        <ul className="list-none p-0 m-0 mb-4">
          {quiz.questions.map((q, i) => (
            <li key={i} className="mb-3">
              <div style={{ color: '#23243a', fontWeight: 600 }}>{i + 1}. {q.question}</div>
              <div>
                {q.options.map((opt, idx) => (
                  <div key={idx} style={{
                    color: idx === q.answer ? '#22c55e' : (answers[i] === idx && answers[i] !== q.answer ? '#ef4444' : '#23243a'),
                    fontWeight: idx === q.answer ? 700 : 400,
                    marginLeft: 8
                  }}>
                    {idx === q.answer ? '✔ ' : ''}{opt}
                    {answers[i] === idx && answers[i] !== q.answer ? ' (Your answer)' : ''}
                  </div>
                ))}
              </div>
            </li>
          ))}
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
              style={{ borderColor: selectedPrompt === i ? '#a78bfa' : '#d1d5db', background: matches[i] !== null ? '#f6f3ff' : '#fff', minHeight: 60, opacity: submitted && !result[i] ? 0.6 : 1 }}
              onClick={() => handlePromptClick(i)}
            >
              {q.pairs![pIdx].prompt}
              {matches[i] !== null && (
                <span className="ml-2 text-xs" style={{ color: '#a78bfa' }}>
                  → {q.pairs![answerOrder[matches[i]!]].answer}
                </span>
              )}
              {submitted && result[i] !== undefined && (
                <span className="ml-2" style={{ fontWeight: 700, color: result[i] ? '#22c55e' : '#ef4444' }}>{result[i] ? '✔' : '✗'}</span>
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
                style={{ background: matchedPrompt !== -1 ? '#f6f3ff' : '#fff', minHeight: 60, opacity: submitted && matchedPrompt === -1 ? 0.6 : 1 }}
                onClick={() => handleAnswerClick(i)}
              >
                {q.pairs![aIdx].answer}
                {matchedPrompt !== -1 && (
                  <span className="ml-2 text-xs" style={{ color: '#a78bfa' }}>
                    ← {q.pairs![promptOrder[matchedPrompt]].prompt.slice(0, 12)}...
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex align-items-center gap-3 mt-4">
        <Button label="Submit" onClick={handleSubmit} disabled={matches.some(m => m === null) || submitted} style={{ background: '#a78bfa', border: 'none', fontWeight: 700 }} />
        {submitted && !result.every(Boolean) && (
          <Button label="Retry" onClick={handleRetry} className="p-button-sm" style={{ background: '#a78bfa', border: 'none', fontWeight: 700 }} />
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
  const context = useContext(CourseContext);
  const [newNote, setNewNote] = useState<string>('');
  const [quizPassed, setQuizPassed] = useState(false);
  if (!context) return null;

  const { currentLesson, setCurrentLesson, sections, notes, addNote, videoTime, markLessonCompleted, isLessonCompleted } = context;
  const { sectionIndex, lessonIndex } = currentLesson;
  const section = sections[sectionIndex];
  const lesson = section.lessons[lessonIndex];

  // Navigation logic
  const goToPreviousLesson = () => {
    if (lessonIndex > 0) {
      setCurrentLesson({ sectionIndex, lessonIndex: lessonIndex - 1 });
    } else if (sectionIndex > 0) {
      const prevSection = sections[sectionIndex - 1];
      setCurrentLesson({ sectionIndex: sectionIndex - 1, lessonIndex: prevSection.lessons.length - 1 });
    }
  };

  const goToNextLesson = () => {
    if (!isLessonCompleted(lesson.id) && lesson.type !== 'quiz') {
      markLessonCompleted(lesson.id);
    }
    if (lessonIndex < section.lessons.length - 1) {
      setCurrentLesson({ sectionIndex, lessonIndex: lessonIndex + 1 });
    } else if (sectionIndex < sections.length - 1) {
      setCurrentLesson({ sectionIndex: sectionIndex + 1, lessonIndex: 0 });
    }
  };

  const handleAddNote = () => {
    if (newNote) {
      addNote(newNote);
      setNewNote('');
    }
  };

  // For disabling navigation
  const isFirstLesson = sectionIndex === 0 && lessonIndex === 0;
  const isLastLesson = sectionIndex === sections.length - 1 && lessonIndex === section.lessons.length - 1;
  const isQuiz = lesson.type === 'quiz';

  // For quiz, mark as completed only when passed
  const handleQuizComplete = (passed: boolean) => {
    setQuizPassed(passed);
    if (passed && !isLessonCompleted(lesson.id)) {
      markLessonCompleted(lesson.id);
    }
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
          disabled={isLastLesson || (isQuiz && !quizPassed)}
          className="p-button-text p-button-lg"
        />
      </div>

      {/* Video, text, or quiz lesson */}
      <div className="lesson-media mb-4" style={{ borderRadius: '1rem', overflow: 'hidden', background: '#23243a', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
        {lesson.type === 'video' && lesson.url && <VideoPlayer url={lesson.url} />}
        {lesson.type === 'text' && <div className="p-4 text-base" style={{ color: '#fff' }}>{lesson.content}</div>}
        {lesson.type === 'quiz' && lesson.quiz && <QuizLesson quiz={lesson.quiz} onComplete={handleQuizComplete} />}
      </div>

      {/* Tabs for Overview, Notes, Reviews */}
      <TabView className="custom-tabview" style={{ background: 'transparent' }}>
        <TabPanel header="Overview">
          <div style={{ color: '#23243a', background: 'transparent', padding: '0 0 2rem 0' }}>
            {/* Course Title & Description */}
            <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 8 }}>{section.title.replace('Section 1: ', '') || 'Course Overview'}</h2>
            <p style={{ color: '#444', fontSize: '1.1rem', marginBottom: 16 }}>
              Welcome to the TOEIC Study course! This comprehensive course is designed to help you master the skills needed to excel in the TOEIC exam, with engaging lessons, quizzes, and practical exercises.
            </p>

            {/* Course Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '1rem', color: '#555', marginBottom: 16 }}>
              <div><strong>Level:</strong> Beginner to Advanced</div>
              <div><strong>Lectures:</strong> {sections.reduce((sum, sec) => sum + sec.lectures, 0)}</div>
              <div><strong>Duration:</strong> {sections.reduce((sum, sec) => {
                const mins = parseInt(sec.duration) || 0;
                return sum + mins;
              }, 0)} min</div>
              <div><strong>Language:</strong> English</div>
            </div>

            {/* What You'll Learn */}
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', margin: '24px 0 8px 0' }}>What you'll learn</h3>
            <ul style={{ color: '#23243a', fontSize: '1rem', paddingLeft: 20, marginBottom: 24 }}>
              <li>Master TOEIC Listening and Reading strategies</li>
              <li>Expand essential TOEIC vocabulary and grammar</li>
              <li>Practice with real exam questions and detailed analysis</li>
              <li>Develop effective listening and reading comprehension skills</li>
            </ul>

            {/* Course Content Summary */}
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', margin: '24px 0 8px 0' }}>Course Content</h3>
            <ul style={{ color: '#23243a', fontSize: '1rem', paddingLeft: 20 }}>
              {sections.map((sec, idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{sec.title.replace('Section ', 'Section ')}</span> — {sec.lectures} lectures • {sec.duration}
                </li>
              ))}
            </ul>
          </div>
        </TabPanel>
        <TabPanel header="Notes">
          {lesson.type === 'video' && (
            <div className="flex align-items-center gap-2 mb-3">
              <InputText
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={`Create a new note at ${Math.floor(videoTime)}s`}
                style={{ width: '300px' }}
              />
              <Button label="Add Note" onClick={handleAddNote} className="p-button-sm" />
            </div>
          )}
          <ul className="list-none p-0 m-0">
            {notes
              .filter((note) => note.lessonId === lesson.id)
              .map((note, index) => (
                <li key={index} className="mb-2" style={{ color: '#fff' }}>
                  <span className="text-xs text-gray-400 mr-2">{note.time.toFixed(1)}s:</span> {note.content}
                </li>
              ))}
          </ul>
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
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, maxWidth: 220, height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden', marginRight: 8 }}>
                      <div style={{ width: `${[55, 32, 10, 2, 1][i]}%`, height: '100%', background: '#b4690e' }}></div>
                    </div>
                    <span style={{ color: '#b4690e', fontSize: '1.1rem', minWidth: 80, letterSpacing: 1 }}>{'★'.repeat(star)}</span>
                    <span style={{ color: '#5624d0', fontSize: '0.95rem', minWidth: 36, textAlign: 'right', textDecoration: 'underline', cursor: 'pointer' }}>{[55, 32, 10, 2, 1][i]}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', margin: '32px 0 16px 0' }}>Reviews</h3>
            <div style={{ marginBottom: 24 }}>
              <input type="text" placeholder="Search reviews" style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', width: 260, marginRight: 16 }} />
              <select style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}>
                <option>All ratings</option>
                <option>5 stars</option>
                <option>4 stars</option>
                <option>3 stars</option>
                <option>2 stars</option>
                <option>1 star</option>
              </select>
            </div>
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