import React, { useEffect, useState } from 'react';
import { CourseProvider } from '../../context/CourseContext';
import CourseLearn from '../../pages/courses/CourseLearn';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import { callCheckCourseEnrollment } from '../../services/UserService';

const CourseLearnWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = useAppSelector(state => state.auth.userId);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!id || !userId) return;
      
      try {
        const response = await callCheckCourseEnrollment(parseInt(id));
        if (response.data == false) {
          // If not enrolled, redirect to course info page
          navigate(`/courses/${id}`);
        }
      } catch (error) {
        console.error('Error checking enrollment:', error);
        navigate(`/courses/${id}`);
      } finally {
        setIsChecking(false);
      }
    };

    checkEnrollment();
  }, [id, userId, navigate]);

  if (!id) {
    return <div>Course ID is required</div>;
  }

  if (!userId) {
    return <div>User ID is required</div>;
  }

  if (isChecking) {
    return <div>Checking enrollment status...</div>;
  }

  return (
    <CourseProvider courseId={parseInt(id)} userId={userId}>
      <CourseLearn />
    </CourseProvider>
  );
};

export default CourseLearnWrapper;