import React, { useContext } from "react";
import TopBar from "../../components/course/TopBar";
import CourseContentSidebar from "../../components/course/CourseContentSidebar";
import CourseBody from "../../components/course/CourseBody";
import { CourseContext } from "../../context/CourseContext";
import LoadingOverlay from "../../components/LoadingOverlay";

const SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSED_WIDTH = 0;

const CourseLearn: React.FC = () => {
    const context = useContext(CourseContext);
    if (!context) return null;
    const { isSidebarOpen, setIsSidebarOpen, loading, error, courseData } = context;

    if (loading) {
        return <LoadingOverlay visible={true} />;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen bg-[#181922] text-white">{error}</div>;
    }

    if (!courseData) {
        return <div className="flex items-center justify-center min-h-screen bg-[#181922] text-white">Course data not found</div>;
    }

    return (
        <div className="flex flex-column min-h-screen" style={{ background: '#181922' }}>
            <TopBar courseTitle={courseData.title} courseId={courseData.id} />
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
                        <CourseContentSidebar />
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
                    <CourseBody />
                </div>
            </div>
        </div>
    )
}

export default CourseLearn