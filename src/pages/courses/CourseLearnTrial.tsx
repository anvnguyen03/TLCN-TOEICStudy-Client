import React, { useContext } from "react";
import TopBar from "../../components/course/TopBar";
import { CourseTrialContext } from "../../context/CourseTrialContext";
import CourseContentSidebarTrial from "../../components/course/course trial/CourseContentSidebarTrial";
import CourseTrialBody from "../../components/course/course trial/CourseTrialBody";
import { useParams } from "react-router-dom";

const SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSED_WIDTH = 0;

const CourseTrial: React.FC = () => {
    const context = useContext(CourseTrialContext);
    const { id } = useParams<{ id: string }>();
    
    if (!context) return null;
    const { isSidebarOpen, setIsSidebarOpen, courseInfo } = context;

    return (
        <div className="flex flex-column min-h-screen" style={{ background: '#181922' }}>
            <TopBar courseTitle={courseInfo?.title || ''} courseId={parseInt(id || '0')} />
            <div className="flex flex-row flex-1" style={{ minHeight: 'calc(100vh - 4rem)', position: 'relative' }}>
                {/* Sidebar with smooth transition */}
                <div
                    style={{
                        width: isSidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
                        minWidth: isSidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
                        maxWidth: SIDEBAR_WIDTH,
                        overflow: 'visible',
                        background: '#23243a',
                        borderRight: '1px solid #2d2e41',
                        transition: 'width 0.3s cubic-bezier(.4,0,.2,1), min-width 0.3s cubic-bezier(.4,0,.2,1)',
                        position: 'relative',
                        zIndex: 10,
                        boxSizing: 'border-box',
                    }}
                >
                    <div
                        style={{
                            opacity: isSidebarOpen ? 1 : 0,
                            pointerEvents: isSidebarOpen ? 'auto' : 'none',
                            transition: 'opacity 0.2s cubic-bezier(.4,0,.2,1)',
                            height: '100%',
                        }}
                    >
                        <CourseContentSidebarTrial />
                    </div>
                    {/* Expand button overlays when collapsed */}
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 16,
                                zIndex: 20,
                                background: '#6d28d2',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0 6px 6px 0',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)'
                            }}
                            aria-label="Expand sidebar"
                        >
                            <i className="pi pi-angle-right" style={{ fontSize: 20 }}></i>
                        </button>
                    )}
                </div>
                <div className="flex-1 flex flex-column" style={{ minWidth: 0 }}>
                    <CourseTrialBody />
                </div>
            </div>
        </div>
    )
}

export default CourseTrial; 