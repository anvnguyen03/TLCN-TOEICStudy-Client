import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { callGetCompleteCourseDetail, callMarkLessonCompleted, callUnmarkLessonCompleted } from '../services/DoCourseService';
import { CourseDetailResponse } from '../types/type';

interface CurrentLessonPointer {
  sectionIndex: number;
  lessonIndex: number;
}

interface CourseContextType {
  currentLesson: CurrentLessonPointer;
  setCurrentLesson: (pointer: CurrentLessonPointer) => void;
  sections: CourseDetailResponse['sections'];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  completedLessons: { [lessonId: number]: boolean };
  markLessonCompleted: (lessonId: number) => void;
  unmarkLessonCompleted: (lessonId: number) => void;
  isLessonCompleted: (lessonId: number) => boolean;
  courseData: CourseDetailResponse | null;
  loading: boolean;
  error: string | null;
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
  courseId: number;
  userId: number;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children, courseId, userId }) => {
  const [currentLesson, setCurrentLesson] = useState<CurrentLessonPointer>({ sectionIndex: 0, lessonIndex: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [completedLessons, setCompletedLessons] = useState<{ [lessonId: number]: boolean }>({});
  const [courseData, setCourseData] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await callGetCompleteCourseDetail(courseId, userId);
        if (response.status === "OK" && response.data) {
          setCourseData(response.data);
          // Initialize completed lessons from API data
          const completedLessonsMap: { [lessonId: number]: boolean } = {};
          response.data.sections.forEach((section) => {
            section.lessons.forEach((lesson) => {
              if (lesson.isCompleted) {
                completedLessonsMap[lesson.id] = true;
              }
            });
          });
          setCompletedLessons(completedLessonsMap);
        } else {
          setError(response.message || "Failed to fetch course data");
        }
      } catch (err) {
        setError("Failed to fetch course data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, userId]);

  const markLessonCompleted = async (lessonId: number) => {
    try {
        const response = await callMarkLessonCompleted(lessonId, userId);
        if (response.status === "OK") {
            setCompletedLessons((prev) => ({ ...prev, [lessonId]: true }));
        }
    } catch (err) {
      console.error("Error marking lesson as completed:", err);
    }
  };

  const unmarkLessonCompleted = async (lessonId: number) => {
    try {
        const response = await callUnmarkLessonCompleted(lessonId, userId);
        if (response.status === "OK") {
            setCompletedLessons((prev) => {
                const newState = { ...prev };
                delete newState[lessonId];
                return newState;
            });
        }
    } catch (err) {
      console.error("Error unmarking lesson as completed:", err);
    }
  };

  const isLessonCompleted = (lessonId: number) => !!completedLessons[lessonId];

  return (
    <CourseContext.Provider
      value={{
        currentLesson,
        setCurrentLesson,
        sections: courseData?.sections || [],
        isSidebarOpen,
        setIsSidebarOpen,
        completedLessons,
        markLessonCompleted,
        unmarkLessonCompleted,
        isLessonCompleted,
        courseData,
        loading,
        error
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};