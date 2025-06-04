import React, { createContext, useState, ReactNode } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // index of correct answer
  type: 'multiple-choice' | 'card-matching';
  pairs?: { prompt: string; answer: string }[]; // Only used for card-matching type
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  url?: string;
  content?: string;
  quiz?: {
    questions: QuizQuestion[];
  };
  free?: boolean;
}

interface Section {
  title: string;
  duration: string;
  lectures: number;
  lessons: Lesson[];
}

interface CurrentLessonPointer {
  sectionIndex: number;
  lessonIndex: number;
}

interface CourseContextType {
  currentLesson: CurrentLessonPointer;
  setCurrentLesson: (pointer: CurrentLessonPointer) => void;
  sections: Section[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  completedLessons: { [lessonId: number]: boolean };
  markLessonCompleted: (lessonId: number) => void;
  isLessonCompleted: (lessonId: number) => boolean;
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLesson, setCurrentLesson] = useState<CurrentLessonPointer>({ sectionIndex: 0, lessonIndex: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [completedLessons, setCompletedLessons] = useState<{ [lessonId: number]: boolean }>({ 1: true }); // Only first lesson unlocked

  const sections: Section[] = [
    {
      title: 'Section 1: Course Introduction',
      duration: '3min',
      lectures: 4,
      lessons: [
        { id: 1, title: 'Welcome To This Course', duration: '3min', type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', free: true },
        { id: 2, title: 'READ BEFORE YOU START!', duration: '1min', type: 'text', content: 'Some text content...', free: true },
        { id: 3, title: 'E-Book Resources 2.0', duration: '1min', type: 'text', content: 'E-book content...' },
        {
          id: 4,
          title: 'Quiz: Front-end Basics',
          duration: '2min',
          type: 'quiz',
          quiz: {
            questions: [
              {
                question: 'A front-end developer works with languages like',
                options: [
                  'HTML, CSS and PHP',
                  'HTML, Java and Swift',
                  'HTML, CSS and Javascript'
                ],
                answer: 2,
                type: 'multiple-choice'
              }
            ]
          }
        },
        {
          id: 5,
          title: 'Quiz: Vocabulary Matching',
          duration: '5min',
          type: 'quiz',
          quiz: {
            questions: [
              {
                question: 'Match the following vocabulary words with their correct usage:',
                options: [],
                answer: 0,
                type: 'card-matching',
                pairs: [
                  { prompt: "This ancient burial ground, which is ______ed ground to many Native Americans, attracts a few too many tourists for comfort.", answer: "hallow" },
                  { prompt: "Tom's tendency to ______ eventually made him an unwelcome dinner guest.", answer: "gormandize" },
                  { prompt: "Roger managed to ___ out an existence by working two jobs.", answer: "eke" },
                  { prompt: "The witnesses were _____ed to avoid any contact with the accused.", answer: "adjure" },
                ]
              }
            ]
          }
        }
      ]
    },
    {
      title: 'Section 2: The 25+ Guidelines Of Amazing Web Design',
      duration: '45min',
      lectures: 13,
      lessons: [
        { id: 5, title: 'Guideline 1', duration: '3min', type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        // ...more lessons
      ]
    },
    // ...more sections
  ];

  // const getCurrentLessonId = () => {
  //   const { sectionIndex, lessonIndex } = currentLesson;
  //   return sections[sectionIndex]?.lessons[lessonIndex]?.id;
  // };

  const markLessonCompleted = (lessonId: number) => {
    setCompletedLessons((prev) => ({ ...prev, [lessonId]: true }));
  };

  const isLessonCompleted = (lessonId: number) => !!completedLessons[lessonId];

  return (
    <CourseContext.Provider
      value={{
        currentLesson,
        setCurrentLesson,
        sections,
        isSidebarOpen,
        setIsSidebarOpen,
        completedLessons,
        markLessonCompleted,
        isLessonCompleted,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};