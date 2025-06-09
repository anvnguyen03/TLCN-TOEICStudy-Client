import React, { useState, useEffect, useRef } from "react"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Rating } from "primereact/rating"
import { callGetUserLearningInfo } from "../../services/CourseEnrollmentService"
import { UserLearningDTO } from "../../types/type"
import { useNavigate } from "react-router-dom"
import { Toast } from "primereact/toast"
import { callAddCourseReview, callUpdateCourseReview } from "../../services/CourseReviewService"

const MyLearning: React.FC = () => {
    // Lưu rating & review cho từng khóa học
    const [ratings, setRatings] = useState<{ [courseId: number]: { rating: number, review: string, done: boolean } }>({})
    const [editing, setEditing] = useState<{ [courseId: number]: boolean }>({})
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [courses, setCourses] = useState<UserLearningDTO[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const toast = useRef<Toast>(null)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await callGetUserLearningInfo()
                if (response.data) {
                    setCourses(response.data)
                    // Initialize ratings from existing reviews
                    const initialRatings = response.data.reduce((acc, course) => {
                        if (course.rating && course.review) {
                            acc[course.id] = {
                                rating: course.rating,
                                review: course.review,
                                done: true
                            }
                        }
                        return acc
                    }, {} as { [courseId: number]: { rating: number, review: string, done: boolean } })
                    setRatings(initialRatings)
                }
            } catch (error) {
                console.error('Error fetching courses:', error)
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch your courses',
                    life: 3000
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourses()
    }, [])

    const validateReview = (courseId: number): boolean => {
        const review = ratings[courseId]
        if (!review) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please provide both rating and review',
                life: 3000
            })
            return false
        }
        if (!review.rating || review.rating === 0) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please provide a rating',
                life: 3000
            })
            return false
        }
        if (!review.review.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please provide a review comment',
                life: 3000
            })
            return false
        }
        return true
    }

    const handleSave = async (id: number) => {
        if (!validateReview(id)) return

        try {
            const review = ratings[id]
            const reviewRequest = {
                courseId: id,
                rating: review.rating,
                comment: review.review
            }

            if (review.done) {
                // Update existing review
                await callUpdateCourseReview(reviewRequest)
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Review updated successfully',
                    life: 3000
                })
            } else {
                // Create new review
                await callAddCourseReview(reviewRequest)
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Review added successfully',
                    life: 3000
                })
            }

            setEditing(prev => ({ ...prev, [id]: false }))
            setRatings(prev => ({ ...prev, [id]: { ...prev[id], done: true } }))
        } catch (error) {
            console.error('Error saving review:', error)
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save review',
                life: 3000
            })
        }
    }

    if (isLoading) {
        return (
            <UserLayout>
                <div style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4facfe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading your courses...</div>
                </div>
            </UserLayout>
        )
    }

    return (
        <UserLayout>
            <Toast ref={toast} />
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4facfe 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '20px 0'
            }}>
                {/* Background Pattern Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    pointerEvents: 'none'
                }} />
                
                {/* Header Section */}
                <div style={{ 
                    textAlign: 'center', 
                    margin: '0 auto 40px auto', 
                    position: 'relative',
                    zIndex: 1
                }}>
                    <h1 style={{ 
                        fontWeight: 700, 
                        fontSize: '2.5rem',
                        color: '#ffffff',
                        marginBottom: '8px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        My TOEIC Learning Journey
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '1.1rem',
                        margin: 0,
                        fontWeight: 400
                    }}>
                        Track your progress and master the TOEIC exam
                    </p>
                </div>

                <div
                    style={{
                        width: '100%',
                        maxWidth: 1200,
                        margin: '0 auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 20,
                        position: 'relative',
                        zIndex: 1,
                        justifyContent: 'start'
                    }}
                >
                    {courses.map((course, idx) => (
                        <div
                            key={course.id}
                            style={{
                                background: '#fff',
                                borderRadius: 18,
                                boxShadow: '0 4px 24px 0 rgba(31,38,135,0.10)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                position: 'relative',
                                border: '1px solid #f3f3f3',
                                flex: '0 0 calc(33.333% - 14px)',
                                minWidth: 260,
                                margin: '0',
                                padding: '12px',
                                boxSizing: 'border-box',
                            }}
                            onMouseOver={e => {
                                setHoveredIndex(idx);
                                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px) scale(1.02)';
                                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px 0 rgba(31,38,135,0.18)';
                            }}
                            onMouseOut={e => {
                                setHoveredIndex(null);
                                (e.currentTarget as HTMLDivElement).style.transform = '';
                                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px 0 rgba(31,38,135,0.10)';
                            }}
                        >
                            {/* Thumbnail */}
                            <div style={{
                                width: '100%',
                                height: '8rem',
                                background: '#eee',
                                position: 'relative',
                                flexShrink: 0,
                                overflow: 'hidden',
                                borderRadius: 12,
                                transition: 'box-shadow 0.2s',
                                boxShadow: hoveredIndex === idx ? '0 4px 24px 0 #1e3c7233' : 'none',
                            }}>
                                <img
                                    src={course.thumbnailUrl || "/placeholder.svg"}
                                    alt={course.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.25s, filter 0.25s',
                                        transform: hoveredIndex === idx ? 'scale(1.07)' : 'scale(1)',
                                        filter: hoveredIndex === idx ? 'brightness(1.08) contrast(1.08)' : 'none',
                                        borderRadius: 12,
                                    }}
                                />
                                {/* Overlay đen khi hover */}
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(0,0,0,0.35)',
                                    opacity: hoveredIndex === idx ? 1 : 0,
                                    transition: 'opacity 0.25s',
                                    pointerEvents: 'none',
                                    borderRadius: 12,
                                }} />
                                <Button 
                                    icon="pi pi-play" 
                                    rounded 
                                    style={{ 
                                        position: 'absolute', 
                                        left: '50%', 
                                        top: '50%', 
                                        transform: 'translate(-50%,-50%)', 
                                        background: '#fff', 
                                        color: '#1e3c72', 
                                        fontSize: 18, 
                                        width: 36, 
                                        height: 36, 
                                        boxShadow: '0 2px 8px #0002', 
                                        border: 'none' 
                                    }} 
                                    onClick={() => navigate(`/courses/${course.id}`)}    
                                />
                            </div>
                            {/* Info */}
                            <div style={{ padding: '12px 12px 8px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: '#222' }}>{course.title}</div>
                                    <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>{course.level}</div>
                                </div>
                                <div style={{ margin: '8px 0 0 0' }}>
                                    <div style={{ height: 3, background: '#eee', borderRadius: 2, marginBottom: 2, position: 'relative' }}>
                                        <div style={{ 
                                            width: `${course.progress}%`, 
                                            height: 3, 
                                            background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)', 
                                            borderRadius: 2, 
                                            position: 'absolute', 
                                            left: 0, 
                                            top: 0 
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#444' }}>
                                        <span>{course.progress}% complete</span>
                                        <span style={{ 
                                            background: course.progress >= 80 ? '#4caf50' : course.progress >= 50 ? '#ff9800' : '#2196f3',
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            fontSize: '10px',
                                            fontWeight: 600
                                        }}>
                                            {course.progress >= 80 ? 'Almost Done!' : course.progress >= 50 ? 'In Progress' : 'Getting Started'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Enhanced Review Section */}
                                <div style={{ 
                                    marginTop: '12px',
                                    padding: '12px',
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        marginBottom: '8px'
                                    }}>
                                        <span style={{ 
                                            fontSize: '12px', 
                                            fontWeight: 600, 
                                            color: '#495057',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <i className="pi pi-star" style={{ fontSize: '10px' }}></i>
                                            {ratings[course.id]?.done ? 'Your Review' : 'Rate This Course'}
                                        </span>
                                        {ratings[course.id]?.done && (
                                            <span style={{
                                                background: '#28a745',
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: '10px',
                                                fontSize: '9px',
                                                fontWeight: 600
                                            }}>
                                                REVIEWED
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <Rating
                                            value={ratings[course.id]?.rating || 0}
                                            cancel={false}
                                            readOnly={ratings[course.id]?.done && !editing[course.id]}
                                            onChange={e => setRatings(prev => ({ ...prev, [course.id]: { ...prev[course.id], rating: e.value ?? 0 } }))}
                                            stars={5}
                                            style={{ fontSize: 16 }}
                                        />
                                        {ratings[course.id]?.rating > 0 && (
                                            <span style={{ 
                                                color: '#6c757d', 
                                                fontSize: 11,
                                                fontWeight: 500
                                            }}>
                                                ({ratings[course.id]?.rating}/5)
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <InputText
                                            placeholder="Share your learning experience..."
                                            value={ratings[course.id]?.review || ''}
                                            onChange={e => setRatings(prev => ({ ...prev, [course.id]: { ...prev[course.id], review: e.target.value } }))}
                                            disabled={ratings[course.id]?.done && !editing[course.id]}
                                            style={{ 
                                                flex: 1, 
                                                fontSize: 12, 
                                                padding: '6px 10px',
                                                border: '1px solid #ced4da',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        {(!ratings[course.id]?.done || editing[course.id]) && (
                                            <Button 
                                                label="Save" 
                                                icon="pi pi-check" 
                                                size="small" 
                                                style={{ 
                                                    background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)', 
                                                    border: 'none', 
                                                    color: '#fff', 
                                                    fontWeight: 600, 
                                                    fontSize: 11, 
                                                    padding: '6px 12px',
                                                    borderRadius: '4px'
                                                }} 
                                                onClick={() => handleSave(course.id)} 
                                            />
                                        )}
                                        {ratings[course.id]?.done && !editing[course.id] && (
                                            <Button 
                                                icon="pi pi-pencil" 
                                                text 
                                                size="small" 
                                                style={{ 
                                                    fontSize: 12,
                                                    color: '#6c757d'
                                                }} 
                                                onClick={() => setEditing(prev => ({ ...prev, [course.id]: true }))} 
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </UserLayout>
    )
}

export default MyLearning