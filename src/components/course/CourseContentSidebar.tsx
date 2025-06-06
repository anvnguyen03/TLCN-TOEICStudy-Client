import React, { useContext, useState, useEffect } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { CourseContext } from '../../context/CourseContext';
import 'primeicons/primeicons.css';
import './CourseContentSidebar.css';

const CourseContentSidebar: React.FC = () => {
    const context = useContext(CourseContext);
    const [activeIndices, setActiveIndices] = useState<number[]>([]);

    // Auto-expand the current section
    useEffect(() => {
        if (!context) return;
        if (!activeIndices.includes(context.currentLesson.sectionIndex)) {
            setActiveIndices((prev) => [...prev, context.currentLesson.sectionIndex]);
        }
        // eslint-disable-next-line
    }, [context && context.currentLesson.sectionIndex]);

    if (!context) return null;

    const { sections, currentLesson, setCurrentLesson, setIsSidebarOpen, isLessonCompleted, completedLessons } = context;

    // Calculate progress
    const completedCount = Object.keys(completedLessons).length
    const totalLessons = sections.reduce((sum, section) => sum + section.lessons.length, 0)
    const progress = Math.round((completedCount / totalLessons) * 100)

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
                    <span className="font-bold text-lg" style={{ color: '#fff' }}>Course Content</span>
                    <Button icon="pi pi-times" className="p-button-rounded p-button-text md:hidden" onClick={() => setIsSidebarOpen(false)} />
                </div>
                <ProgressBar value={progress} showValue={false} style={{ height: '8px', background: '#23243a' }} color="#6d28d2" />
                <div className="text-xs mt-1" style={{ color: '#aaa' }}>{completedCount} / {totalLessons} lessons completed</div>
            </div>
            
            <Accordion multiple activeIndex={activeIndices} onTabChange={(e) => setActiveIndices(e.index as number[])} className="course-sidebar-accordion">
                {sections.map((section, sIdx) => (
                    <AccordionTab
                        key={sIdx}
                        headerClassName={sIdx === currentLesson.sectionIndex ? 'current-section' : ''}
                        header={<div className="font-bold text-base flex justify-content-between align-items-center"><span>{section.title}</span><span className="text-xs" style={{ color: '#aaa' }}>{section.duration} min</span></div>}
                    >
                        <ul className="list-none p-0 m-0">
                            {section.lessons.map((lesson, lIdx) => {
                                const isCurrent = sIdx === currentLesson.sectionIndex && lIdx === currentLesson.lessonIndex
                                const isCompleted = isLessonCompleted(lesson.id)
                                return (
                                    <li
                                        key={lesson.id}
                                        className={`lesson-item flex align-items-center gap-2 px-2 py-2 border-round cursor-pointer ${isCurrent ? 'active' : ''}`}
                                        style={{ background: isCurrent ? '#28294a' : 'transparent', color: isCurrent ? '#fff' : '#b3b3b3', fontWeight: isCurrent ? 600 : 400 }}
                                        onClick={() => setCurrentLesson({ sectionIndex: sIdx, lessonIndex: lIdx })}
                                    >
                                        <i className={`pi ${isCompleted ? 'pi-check-circle text-green-400' : isCurrent ? 'pi-play-circle text-purple-400' : 'pi-circle text-gray-500'}`} style={{ fontSize: '1.2rem' }}></i>
                                        <span className="flex-1 text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </AccordionTab>
                ))}
            </Accordion>
        </aside>
    );
};

export default CourseContentSidebar;