import React, { useContext, useState, useEffect, useRef } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { CourseContext } from '../../context/CourseContext';
import 'primeicons/primeicons.css';
import './CourseContentSidebar.css';

const CourseContentSidebar: React.FC = () => {
    const context = useContext(CourseContext);
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const currentLessonRef = useRef<HTMLLIElement | null>(null);

    // Auto-expand the current section
    useEffect(() => {
        if (!context) return;
        if (!activeIndices.includes(context.currentLesson.sectionIndex)) {
            setActiveIndices((prev) => [...prev, context.currentLesson.sectionIndex]);
        }
        // eslint-disable-next-line
    }, [context && context.currentLesson.sectionIndex]);

    // Auto-scroll to current lesson
    useEffect(() => {
        if (currentLessonRef.current) {
            currentLessonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [context && context.currentLesson.sectionIndex, context && context.currentLesson.lessonIndex]);

    if (!context) return null;

    const { sections, currentLesson, setCurrentLesson, setIsSidebarOpen, isLessonCompleted, completedLessons } = context;

    // Calculate progress
    const completedCount = Object.keys(completedLessons).length
    const totalLessons = sections.reduce((sum, section) => sum + section.lessons.length, 0)
    const progress = Math.round((completedCount / totalLessons) * 100)

    // Helper to determine if a lesson is unlocked
    const isUnlocked = (sIdx: number, lIdx: number) => {
        const lesson = sections[sIdx].lessons[lIdx]
        // Always unlock the current lesson
        if (sIdx === currentLesson.sectionIndex && lIdx === currentLesson.lessonIndex) {
            return true
        }
        // Always unlock completed lessons
        if (isLessonCompleted(lesson.id)) {
            return true
        }
        // Find the highest completed lesson index in this section
        const completedIdx = sections[sIdx].lessons.findIndex(l => !isLessonCompleted(l.id))
        // If all previous lessons are completed, unlock the next one
        if (completedIdx === lIdx && lIdx !== 0) {
            return isLessonCompleted(sections[sIdx].lessons[lIdx - 1].id)
        }
        // If first lesson and no completed lessons, unlock it
        if (lIdx === 0 && completedIdx === 0) {
            return true
        }
        return false
    }

    return (
        <aside className="sidebar-content flex flex-column h-full p-3" style={{ position: 'relative' }}>
            {/* Collapse button */}
            <button
                onClick={() => setIsSidebarOpen(false)}
                style={{
                    position: 'absolute',
                    left: -18,
                    top: 16,
                    zIndex: 10,
                    background: '#6d28d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0 6px 6px 0',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)'
                }}
                aria-label="Collapse sidebar"
            >
                <i className="pi pi-angle-left" style={{ fontSize: 18 }}></i>
            </button>
            <div className="mb-4">
                <div className="flex align-items-center justify-content-between mb-2">
                    <span className="font-bold text-lg" style={{ color: '#fff' }}>Course Content</span>
                    <Button icon="pi pi-times" className="p-button-rounded p-button-text md:hidden" onClick={() => setIsSidebarOpen(false)} />
                </div>
                <ProgressBar value={progress} showValue={false} style={{ height: '8px', background: '#23243a' }} color="#6d28d2" />
                <div className="text-xs mt-1" style={{ color: '#aaa' }}>{completedCount} / {totalLessons} lessons completed</div>
            </div>
            <Accordion multiple activeIndex={activeIndices} onTabChange={e => setActiveIndices(e.index as number[])} className="course-sidebar-accordion">
                {sections.map((section, sIdx) => (
                    <AccordionTab
                        key={sIdx}
                        headerClassName={sIdx === currentLesson.sectionIndex ? 'current-section' : ''}
                        header={<div className="font-bold text-base flex justify-content-between align-items-center"><span>{section.title}</span><span className="text-xs" style={{ color: '#aaa' }}>{section.lessons.length} | {section.duration}</span></div>}
                    >
                        <ul className="list-none p-0 m-0">
                            {section.lessons.map((lesson, lIdx) => {
                                const isCurrent = sIdx === currentLesson.sectionIndex && lIdx === currentLesson.lessonIndex
                                const isCompleted = isLessonCompleted(lesson.id)
                                const unlocked = isUnlocked(sIdx, lIdx)
                                return (
                                    <li
                                        key={lesson.id}
                                        ref={isCurrent ? currentLessonRef : undefined}
                                        className={`lesson-item flex align-items-center gap-2 px-2 py-2 border-round cursor-pointer ${isCurrent ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
                                        style={{ background: isCurrent ? '#28294a' : 'transparent', color: isCurrent ? '#fff' : unlocked ? '#b3b3b3' : '#888', fontWeight: isCurrent ? 600 : 400, opacity: unlocked ? 1 : 0.5 }}
                                        onClick={() => unlocked && setCurrentLesson({ sectionIndex: sIdx, lessonIndex: lIdx })}
                                    >
                                        {unlocked ? (
                                            <i className={`pi ${isCompleted ? 'pi-check-circle text-green-400' : isCurrent ? 'pi-play-circle text-purple-400' : 'pi-circle text-gray-500'}`} style={{ fontSize: '1.2rem' }}></i>
                                        ) : (
                                            <i className="pi pi-lock" style={{ fontSize: '1.2rem', color: '#aaa' }}></i>
                                        )}
                                        <span className="flex-1 text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</span>
                                        <span className="text-xs" style={{ color: '#aaa' }}>{lesson.duration}</span>
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