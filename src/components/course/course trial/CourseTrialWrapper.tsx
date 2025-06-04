import React from 'react';
import { CourseTrialProvider } from '../../../context/CourseTrialContext';
import CourseTrial from '../../../pages/courses/CourseLearnTrial';
import { useParams } from 'react-router-dom';

const CourseTrialWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Course ID is required</div>;
  }

  return (
    <CourseTrialProvider courseId={parseInt(id)}>
      <CourseTrial />
    </CourseTrialProvider>
  );
};

export default CourseTrialWrapper;