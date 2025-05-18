import React, { useContext } from "react";
import TopBar from "../../components/course/TopBar";
import CourseContentSidebar from "../../components/course/CourseContentSidebar";
import CourseBody from "../../components/course/CourseBody";
import { CourseContext } from "../../context/CourseContext";

const CourseLearn: React.FC = () => {
    const context = useContext(CourseContext);
    if (!context) return null;
    const { isSidebarOpen, setIsSidebarOpen } = context;

    return (
        <div className="flex flex-column min-h-screen" style={{ background: '#181922' }}>
            <TopBar />
            <div className="flex flex-row flex-1" style={{ minHeight: 'calc(100vh - 4rem)' }}>
                {isSidebarOpen ? (
                    <div style={{ width: 300, background: '#23243a', borderRight: '1px solid #2d2e41', transition: 'width 0.2s' }}>
                        <CourseContentSidebar />
                    </div>
                ) : (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: '5rem',
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
                <div className="flex-1 flex flex-column" style={{ minWidth: 0 }}>
                    <CourseBody />
                </div>
            </div>
        </div>
    )
}

export default CourseLearn