import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { callGetFreeLessons } from '../services/CourseService';
import { Lesson } from '../types/type';

interface CurrentLessonPointer {
  lessonIndex: number;
}

interface CourseTrialContextType {
  currentLesson: CurrentLessonPointer;
  setCurrentLesson: (pointer: CurrentLessonPointer) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  lessons: Lesson[];
  isLoading: boolean;
  error: string | null;
}

export const CourseTrialContext = createContext<CourseTrialContextType | undefined>(undefined);

interface CourseTrialProviderProps {
  children: ReactNode;
  courseId: number;
}

export const CourseTrialProvider: React.FC<CourseTrialProviderProps> = ({ children, courseId }) => {
  const [currentLesson, setCurrentLesson] = useState<CurrentLessonPointer>({ lessonIndex: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreeLessons = async () => {
      try {
        setIsLoading(true);
        const response = await callGetFreeLessons(courseId);
        setLessons(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch free lessons. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreeLessons();
  }, [courseId]);

  return (
    <CourseTrialContext.Provider
      value={{
        currentLesson,
        setCurrentLesson,
        isSidebarOpen,
        setIsSidebarOpen,
        lessons,
        isLoading,
        error,
      }}
    >
      {children}
    </CourseTrialContext.Provider>
  );
}; 