import { Rating } from 'primereact/rating';
import './CourseInfo.css';
import { UserLayout } from '../../layouts/user layouts/Userlayout';
import { Button } from 'primereact/button';
import { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { callGetCourseById, callGetCourseRecentReviews } from '../../services/CourseService';
import ReactMarkdown from 'react-markdown';
import { CourseInfoDTO, CourseReviewDTO } from '../../types/type';
import { useAppSelector } from '../../hooks/reduxHooks';
import { Toast } from 'primereact/toast';

const CourseInfo = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<CourseInfoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<CourseReviewDTO[]>([]);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const toast = useRef<Toast>(null);

    // Trạng thái để mở rộng tất cả sections
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const [expandAll, setExpandAll] = useState<boolean>(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                if (!id) {
                    throw new Error('Course ID is required');
                }
                const [courseResponse, reviewsResponse] = await Promise.all([
                    callGetCourseById(parseInt(id)),
                    callGetCourseRecentReviews(parseInt(id))
                ]);
                setCourse(courseResponse.data);
                setReviews(reviewsResponse.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch course data');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    const handleExpandAll = () => {
        if (expandAll) {
            setActiveIndices([]);
        } else {
            setActiveIndices(course?.sections.map((_, index) => index) || []);
        }
        setExpandAll(!expandAll);
    }

    const handleEnrollClick = () => {
        if (!isAuthenticated) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Authentication Required',
                detail: (
                    <div>
                        Vui lòng <Link to="/login" state={{ from: window.location.pathname }} className="text-primary font-semibold">đăng nhập</Link> để tiếp tục
                    </div>
                ),
                life: 3000
            });
            return;
        }
        navigate(`/courses/${id}/learn`);
    };

    const handleTrialClick = () => {
        if (!isAuthenticated) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Authentication Required',
                detail: (
                    <div>
                        Vui lòng <Link to="/login" state={{ from: window.location.pathname }} className="text-primary font-semibold">đăng nhập</Link> để tiếp tục
                    </div>
                ),
                life: 3000
            });
            return;
        }
        navigate(`/courses/${id}/trial`);
    };

    if (loading) {
        return <UserLayout><div>Loading...</div></UserLayout>;
    }

    if (error || !course) {
        return <UserLayout><div>Error: {error || 'Course not found'}</div></UserLayout>;
    }

    // Format duration from minutes to hours and minutes
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // Format price to VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <UserLayout>
            <Toast ref={toast} />
            {/* Banner */}
            <div className="banner relative">
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-20rem" style={{ objectFit: 'cover' }} />
                <div className="absolute top-0 left-0 p-4 text-white">
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <div className="flex align-items-center mt-2">
                        <span className="mr-2 text-primary">{course.rating}</span>
                        <Rating value={course.rating} readOnly cancel={false} />
                        <span className="ml-2 text-yellow-500">({course.totalReviews} đánh giá) {course.students} học viên</span>
                    </div>
                </div>
            </div>

            <main style={{ paddingBlock: '2rem', display: 'grid', gridTemplateColumns: '1fr 300px', alignItems: 'start', gap: '2rem', marginRight: '30px', marginLeft: '30px' }}>
                <article>
                    {/* Objective */}
                    <div className='pb-4 mb-6' style={{ border: '1px solid #d1d2e0', padding: '2.4rem 0', boxSizing: 'border-box' }}>
                        <h2 style={{ margin: '0 2.4rem 1.6rem 2.4rem' }}>What you'll learn</h2>
                        <div style={{ margin: '0 2.4rem', boxSizing: 'border-box' }}>
                            <ul style={{ maxWidth: '118.4rem' }} className='flex flex-wrap justify-content-between list-none m-0 p-0'>
                                {course.objective.split('\\n').map((item, index) => (   
                                    <li key={index} style={{ width: 'calc(50% -(2.4rem / 2));', display: 'list-item' }} className='pl-0'>
                                        <div className="flex align-items-start w-full h-auto text-left" style={{ color: '#303141', padding: '0.4rem 0', letterSpacing: 'normal', whiteSpace: 'normal' }}>
                                            <i className='pi pi-check inline-block flex-shrink-0' style={{ color: 'black', width: '1.6rem', height: '1,6rem', fill: 'black' }}></i>
                                            <div className="ml-4" style={{ minHeight: '1.96rem', flex: 1, minWidth: '1px', }}>
                                                <ReactMarkdown className="text-sm">{item.replace('- ✓', '').trim()}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="course-info-container">
                        {/* Video giới thiệu khóa học */}
                        <div className="course-video">
                            <h2>Course Preview</h2>
                            <div className="video-player">
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={course.previewVideoUrl}
                                    title="Course Preview"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Course Content */}
                        <div className="course-content">
                            <div className="course-content-header">
                                <h2>Course content</h2>
                                <p>{course.totalSections} sections • {course.totalLessons} lectures • {formatDuration(course.duration)} total length</p>
                                <Button
                                    label={expandAll ? 'Collapse all sections' : 'Expand all sections'}
                                    className="p-button-text p-button-link"
                                    onClick={handleExpandAll}
                                />
                            </div>
                            <Accordion multiple activeIndex={activeIndices} onTabChange={(e) => setActiveIndices(e.index as number[])}>
                                {course.sections.map((section) => (
                                    <AccordionTab
                                        key={section.id}
                                        header={
                                            <div className="accordion-header">
                                                <span>{section.title}</span>
                                                <span>{`${section.totalLessons} lectures • ${formatDuration(section.duration)}`}</span>
                                            </div>
                                        }
                                    >
                                        <ul className="lesson-list">
                                            {section.lessons.map((lesson) => (
                                                <li key={lesson.id} className="lesson-item">
                                                    <div className="lesson-title">
                                                        {lesson.type === 'VIDEO' && <i className="pi pi-play-circle" style={{ marginRight: '8px' }} />}
                                                        {lesson.type === 'TEXT' && <i className="pi pi-file-word" style={{ marginRight: '8px' }} />}
                                                        {lesson.type === 'QUIZ' && <i className="pi pi-question-circle" style={{ marginRight: '8px' }} />}
                                                        {lesson.title}
                                                    </div>
                                                    <div className="lesson-details">
                                                        {lesson.free && <span className="preview-label text-primary" style={{ textDecoration: 'none' }}>Preview</span>}
                                                        <span>{formatDuration(lesson.duration)}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionTab>
                                ))}
                            </Accordion>
                        </div>

                        {/* Description */}
                        <div className="course-description">
                            <ReactMarkdown>{course.description}</ReactMarkdown>
                        </div>

                        {/* Reviews */}
                        <div className="course-reviews">
                            <h2>Recent reviews</h2>
                            {reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <div className="avatar"></div>
                                            <div>
                                                <h4>{review.username}</h4>
                                                <p>{review.createdAt}</p>
                                            </div>
                                        </div>
                                        <div className="review-meta">
                                            <Rating value={review.rating} readOnly cancel={false} />
                                        </div>
                                    </div>
                                    <p>{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>

                <aside style={{ position: 'sticky', top: '6rem', marginRight: '20px' }}>
                    <div className="course-sidebar" id="course-sidebar">
                        <div className="course-sidebar__inner">
                            {/* Top Cover Image */}
                            <div className="course-sidebar-top-cover">
                                <img
                                    src={course.thumbnailUrl}
                                    alt="Course Cover"
                                    className="w-full"
                                />
                            </div>

                            {/* Sidebar Content */}
                            <div className="course-sidebar-content">
                                <div className="course-sidebar-cta">
                                    <div className="course-prices-wrapper">
                                        <div className="course-prices-promo">Ưu đãi đặc biệt:</div>
                                        <div className="course-prices">
                                            <span className="course-price">{formatPrice(course.price)}</span>
                                        </div>
                                    </div>
                                    <Button
                                        label="ĐĂNG KÝ HỌC NGAY"
                                        className="btn btn-primary btn-block p-mt-2"
                                        onClick={handleEnrollClick}
                                    />
                                    <Button
                                        label="Học thử miễn phí"
                                        className="btn btn-outline-secondary btn-block p-mt-2"
                                        onClick={handleTrialClick}
                                    />
                                </div>

                                <div className="divider"></div>

                                <div className="course-sidebar-item">
                                    <div className="course-sidebar-icon">
                                        <i className="fa-solid fa-users"></i>
                                    </div>
                                    <div className="course-sidebar-text">{course.students} học viên đã đăng ký</div>
                                </div>

                                <div className="course-sidebar-item">
                                    <div className="course-sidebar-icon">
                                        <i className="far fa-play-circle"></i>
                                    </div>
                                    <div className="course-sidebar-text">{formatDuration(course.duration)} bài học</div>
                                </div>

                                <div className="course-sidebar-item">
                                    <div className="course-sidebar-icon">
                                        <i className="fa fa-book-open"></i>
                                    </div>
                                    <div className="course-sidebar-text">{course.totalSections} chủ đề, {course.totalLessons} bài học</div>
                                </div>

                                <div className="divider"></div>

                                <div className="course-cta-trial">
                                    <div>
                                        Chưa chắc chắn khóa học này dành cho bạn?
                                        <a href="tel:096-369-5525" className="text-underline">
                                            Liên hệ để nhận tư vấn miễn phí!
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </UserLayout>
    );
};

export default CourseInfo;