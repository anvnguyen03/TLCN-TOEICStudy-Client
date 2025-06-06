import React from 'react';
import { CourseProvider } from '../../context/CourseContext';
import CourseLearn from '../../pages/courses/CourseLearn';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';

const CourseLearnWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = useAppSelector(state => state.auth.userId);
  
  if (!id) {
    return <div>Course ID is required</div>;
  }

  if (!userId) {
    return <div>User ID is required</div>;
  }

  return (
    <CourseProvider courseId={parseInt(id)} userId={userId}>
      <CourseLearn />
    </CourseProvider>
  );
};

export default CourseLearnWrapper;