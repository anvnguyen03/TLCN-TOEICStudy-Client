import React, { useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { CourseTrialContext } from '../../../context/CourseTrialContext';
import 'primeicons/primeicons.css';
import '../CourseContentSidebar.css';

const CourseContentSidebarTrial: React.FC = () => {
    const context = useContext(CourseTrialContext);
    const currentLessonRef = useRef<HTMLLIElement | null>(null);
    if (!context) return null;
    const { lessons, currentLesson, setCurrentLesson, setIsSidebarOpen } = context;

    // For trial, all lessons are unlocked
    const totalLessons = lessons.length;

    return (
        <aside className="sidebar-content flex flex-column h-full p-3" style={{ position: 'relative' }}>
            {/* Collapse button */}
            <button
                onClick={() => setIsSidebarOpen(false)}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 16,
                    zIndex: 10,
                    background: '#6d28d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px 0 0 6px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)'
                }}
                aria-label="Collapse sidebar"
            >
                <i className="pi pi-angle-left" style={{ fontSize: 20 }}></i>
            </button>
            <div className="mb-4">
                <div className="flex align-items-center justify-content-between mb-2">
                    <span className="font-bold text-lg" style={{ color: '#fff' }}>Free Lessons</span>
                    <Button icon="pi pi-times" className="p-button-rounded p-button-text md:hidden" onClick={() => setIsSidebarOpen(false)} />
                </div>
                <div className="text-xs mt-1" style={{ color: '#aaa' }}>{totalLessons} lessons available</div>
            </div>
            
            <ul className="list-none p-0 m-0">
                {lessons.map((lesson, idx) => {
                    const isCurrent = idx === currentLesson.lessonIndex;
                    return (
                        <li
                            key={lesson.id}
                            ref={isCurrent ? currentLessonRef : undefined}
                            className={`lesson-item flex align-items-center gap-2 px-2 py-2 border-round cursor-pointer ${isCurrent ? 'active' : ''}`}
                            style={{ 
                                background: isCurrent ? '#28294a' : 'transparent', 
                                color: isCurrent ? '#fff' : '#b3b3b3', 
                                fontWeight: isCurrent ? 600 : 400, 
                                opacity: 1 
                            }}
                            onClick={() => setCurrentLesson({ lessonIndex: idx })}
                        >
                            <i className={`pi ${isCurrent ? 'pi-play-circle text-purple-400' : 'pi-circle text-gray-500'}`} style={{ fontSize: '1.2rem' }}></i>
                            <span className="flex-1 text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</span>
                            <span className="text-xs" style={{ color: '#aaa' }}>{lesson.duration} min</span>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default CourseContentSidebarTrial; 