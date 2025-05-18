import React from 'react';
import { CourseProvider } from '../../context/CourseContext';
import CourseLearn from '../../pages/courses/CourseLearn';

const CourseLearnWrapper: React.FC = () => {
  return (
    <CourseProvider>
      <CourseLearn />
    </CourseProvider>
  );
};

export default CourseLearnWrapper;