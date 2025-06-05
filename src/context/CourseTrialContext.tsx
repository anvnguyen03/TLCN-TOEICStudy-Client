import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { callGetFreeLessons, callGetCourseById } from '../services/CourseService';
import { CourseInfoDTO, Lesson } from '../types/type';

interface CurrentLessonPointer {
  lessonIndex: number;
}

interface CourseTrialContextType {
  currentLesson: CurrentLessonPointer;
  setCurrentLesson: (pointer: CurrentLessonPointer) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  lessons: Lesson[];
  courseInfo: CourseInfoDTO | null;
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
  const [courseInfo, setCourseInfo] = useState<CourseInfoDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [lessonsResponse, courseResponse] = await Promise.all([
          callGetFreeLessons(courseId),
          callGetCourseById(courseId)
        ]);
        setLessons(lessonsResponse?.data || []);
        setCourseInfo(courseResponse?.data || null);
        setError(null);
      } catch (err) {
        setError('Failed to fetch course data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  return (
    <CourseTrialContext.Provider
      value={{
        currentLesson,
        setCurrentLesson,
        isSidebarOpen,
        setIsSidebarOpen,
        lessons,
        courseInfo,
        isLoading,
        error,
      }}
    >
      {children}
    </CourseTrialContext.Provider>
  );
}; 