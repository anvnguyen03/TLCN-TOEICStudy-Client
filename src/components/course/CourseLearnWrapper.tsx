import React from 'react';
import { CourseProvider } from '../../context/CourseContext';
import CourseLearn from '../../pages/courses/CourseLearn';
import { useParams } from 'react-router-dom';

const CourseLearnWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Course ID is required</div>;
  }

  return (
    <CourseProvider>
      <CourseLearn />
    </CourseProvider>
  );
};

export default CourseLearnWrapper;