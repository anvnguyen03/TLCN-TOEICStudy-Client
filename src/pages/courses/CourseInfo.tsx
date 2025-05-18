import { Rating } from 'primereact/rating';
import './CourseInfo.css';
import { UserLayout } from '../../layouts/user layouts/Userlayout';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useNavigate } from 'react-router-dom';

const CourseInfo = () => {

    const navigate = useNavigate()

    // Trạng thái để mở rộng tất cả sections
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const [expandAll, setExpandAll] = useState<boolean>(false);

    const course = {
        title: 'Khóa học TOEIC 900+ - Lộ trình từ A-Z',
        image: 'https://via.placeholder.com/1200x400', // Thay bằng ảnh thực tế
        description: 'Khóa học toàn diện giúp bạn chinh phục TOEIC 900+ với lộ trình bài bản, từ cơ bản đến nâng cao.',
        lessons: 50,
        students: 1200,
        level: 'Beginner to Advanced',
        price: 2500000,
        rating: 4.5,
        whatYouWillLearn: [
            'Nắm vững chiến lược làm bài TOEIC Listening và Reading.',
            'Tăng cường từ vựng và ngữ pháp cần thiết cho TOEIC.',
            'Luyện tập với các đề thi thực tế và phân tích chi tiết.',
            'Phát triển kỹ năng nghe và đọc hiểu hiệu quả.',
        ],
        courseContent: [
            { section: 'Phần 1: Giới thiệu về TOEIC', lectures: 5, duration: '2h 30m' },
            { section: 'Phần 2: Luyện Listening TOEIC', lectures: 15, duration: '7h 45m' },
            { section: 'Phần 3: Luyện Reading TOEIC', lectures: 15, duration: '7h 45m' },
            { section: 'Phần 4: Đề thi thử và phân tích', lectures: 10, duration: '5h 00m' },
            { section: 'Phần 5: Chiến lược đạt điểm cao', lectures: 5, duration: '2h 30m' },
        ],
        reviews: [
            { name: 'Nguyễn Văn A', score: '900', comment: 'Khóa học rất chi tiết, nhờ đó mình đã đạt 900 điểm TOEIC!' },
            { name: 'Trần Thị B', score: '815', comment: 'Giảng viên nhiệt tình, bài tập thực tế, mình tiến bộ rõ rệt.' },
        ],
    }

    const courseContent = [
        {
            title: 'Setup & Intro',
            duration: '2hr 11min',
            lectures: 19,
            lessons: [
                { title: 'Welcome to the Python Programming Language', duration: '11:59', preview: true },
                { title: 'About Me', duration: '00:56', preview: true },
                { title: 'About You', duration: '04:12', questions: 4 },
                { title: 'Download Course Files', duration: '00:17' },
                { title: 'FREE DOWNLOAD: Learn to Code with Python Course Notes PDF', duration: '00:17' },
                { title: 'Note on Installation Videos', duration: '00:23' },
                { title: 'macOS - Use the Terminal to Issue Commands to Your Operating System', duration: '09:40', preview: true },
                { title: 'macOS - Download and Install Python 3', duration: '09:11' },
                { title: 'macOS - Download and Install Visual Studio Code', duration: '02:01' },
            ],
        },
        {
            title: 'Welcome to Python',
            duration: '1hr 4min',
            lectures: 8,
            lessons: [
                { title: 'Introduction to Python', duration: '05:00', preview: true },
                { title: 'Python Basics', duration: '10:00' },
            ],
        },
        {
            title: 'Numbers, Booleans and Equality',
            duration: '55min',
            lectures: 6,
            lessons: [
                { title: 'Numbers in Python', duration: '08:00' },
                { title: 'Booleans in Python', duration: '07:00' },
            ],
        },
        // Thêm các sections khác tương tự...
    ]

    // Dữ liệu mẫu cho reviews
    const reviews = [
        {
            username: 'Tarang V.',
            courses: 13,
            reviews: 9,
            rating: 5,
            time: '4 years ago',
            comment:
                'Very good course! I really am liking the way Mr. Boris is teaching me, he also answers to doubts faster than expected and he makes the class very interesting. The coding challenges are very beneficial as they review our understanding of the topics...',
        },
        // Thêm các reviews khác nếu cần
    ]

    const handleExpandAll = () => {
        if (expandAll) {
            setActiveIndices([]);
        } else {
            setActiveIndices(courseContent.map((_, index) => index));
        }
        setExpandAll(!expandAll);
    }

    return (
        <UserLayout>
            {/* Banner */}
            <div className="banner relative">
                <img src="/online-courses.jpg" alt={course.title} className="w-full h-20rem" style={{ objectFit: 'cover' }} />
                <div className="absolute top-0 left-0 p-4 text-white">
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <p className="text-lg">{course.description}</p>
                    <div className="flex align-items-center mt-2">
                        <span className="mr-2 text-primary">{course.rating}</span>
                        <Rating value={course.rating} readOnly cancel={false} />
                        <span className="ml-2 text-yellow-500">(1200 đánh giá) 34,101 học viên</span>
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
                                <li style={{ width: 'calc(50% -(2.4rem / 2));', display: 'list-item' }} className='pl-0'>
                                    <div className="flex align-items-start w-full h-auto text-left" style={{ color: '#303141', padding: '0.4rem 0', letterSpacing: 'normal', whiteSpace: 'normal' }}>
                                        <i className='pi pi-check inline-block flex-shrink-0' style={{ color: 'black', width: '1.6rem', height: '1,6rem', fill: 'black' }}></i>
                                        <div className="ml-4" style={{ minHeight: '1.96rem', flex: 1, minWidth: '1px', }}>
                                            <span className="text-sm">Master programming in Python, a popular language that powers codebas
                                                es in tech companies like Instagram, Pinterest, Dropbox and more
                                            </span>
                                        </div>
                                    </div>
                                </li>
                                <li style={{ width: 'calc(50% -(2.4rem / 2));', display: 'list-item' }} className='pl-0'>
                                    <div className="flex align-items-start w-full h-auto text-left" style={{ color: '#303141', padding: '0.4rem 0', letterSpacing: 'normal', whiteSpace: 'normal' }}>
                                        <i className='pi pi-check inline-block flex-shrink-0' style={{ color: 'black', width: '1.6rem', height: '1,6rem', fill: 'black' }}></i>
                                        <div className="ml-4" style={{ minHeight: '1.96rem', flex: 1, minWidth: '1px', }}>
                                            <span className="text-sm">Master programming in Python, a popular language that powers codebas
                                                es in tech companies like Instagram, Pinterest, Dropbox and more
                                            </span>
                                        </div>
                                    </div>
                                </li>
                                <li style={{ width: 'calc(50% -(2.4rem / 2));', display: 'list-item' }} className='pl-0'>
                                    <div className="flex align-items-start w-full h-auto text-left" style={{ color: '#303141', padding: '0.4rem 0', letterSpacing: 'normal', whiteSpace: 'normal' }}>
                                        <i className='pi pi-check inline-block flex-shrink-0' style={{ color: 'black', width: '1.6rem', height: '1,6rem', fill: 'black' }}></i>
                                        <div className="ml-4" style={{ minHeight: '1.96rem', flex: 1, minWidth: '1px', }}>
                                            <span className="text-sm">Master programming in Python, a popular language that powers codebas
                                                es in tech companies like Instagram, Pinterest, Dropbox and more
                                            </span>
                                        </div>
                                    </div>
                                </li>
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
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Thay bằng link video thực tế
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
                                <p>36 sections • 412 lectures • 58h 3m total length</p>
                                <Button
                                    label={expandAll ? 'Collapse all sections' : 'Expand all sections'}
                                    className="p-button-text p-button-link"
                                    onClick={handleExpandAll}
                                />
                            </div>
                            <Accordion multiple activeIndex={activeIndices} onTabChange={(e) => setActiveIndices(e.index as number[])}>
                                {courseContent.map((section, index) => (
                                    <AccordionTab
                                        key={index}
                                        header={
                                            <div className="accordion-header">
                                                <span>{section.title}</span>
                                                <span>{`${section.lectures} lectures • ${section.duration}`}</span>
                                            </div>
                                        }
                                    >
                                        <ul className="lesson-list">
                                            {section.lessons.map((lesson, lessonIndex) => (
                                                <li key={lessonIndex} className="lesson-item">
                                                    <div className="lesson-title">
                                                        <i className="pi pi-play-circle" style={{ marginRight: '8px' }} />
                                                        {lesson.title}
                                                    </div>
                                                    <div className="lesson-details">
                                                        {lesson.preview && <span className="preview-label">Preview</span>}
                                                        <span>{lesson.duration}</span>
                                                        {lesson.questions && <span>{`${lesson.questions} questions`}</span>}
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
                            <h2>Description</h2>
                            <h4>Student Testimonials:</h4>
                            <ul>
                                <li>
                                    The course is extremely well organized with tons of great explanations and exercises for each and every
                                    topic imaginable! The instructor is a very good teacher, and gives great feedback, while rapidly answering
                                    any questions you may have. Highly recommend the course to anyone interested in Python or programming in
                                    general. - Sathvik H.
                                </li>
                                <li>
                                    The most comprehensive and personalized learning experience in a programming course. Highly recommend to
                                    anyone interested, regardless of experience! - Danny N.
                                </li>
                                <li>
                                    The instructor is great. Everything is really well explained. Appropriate for complete beginners as a intro to
                                    programming if that is needed. Also good if you are coming from other languages. The instructor also speaks
                                    super clearly. - Jon
                                </li>
                            </ul>
                            <p>
                                Learn to Code with Python is a comprehensive introduction to programming in Python, the most popular
                                programming language in the world. Python powers codebases in companies like Google, Facebook, Pinterest,
                                Dropbox, and more. It is used in a variety of disciplines including data science, machine learning, web
                                development, natural language processing, and more.
                            </p>
                            <p>
                                Over more than 58 hours of video content, we’ll tackle the language from A to Z, covering everything you need
                                to know about Python to be an effective developer in 2020.
                            </p>
                            <p>The course is jam-packed with:</p>
                            <ul>
                                <li>58+ hours of video, with new content added frequently</li>
                                <li>FREE 300-page PDF study manual with all the code samples written throughout the course</li>
                                <li>60+ coding challenges that you can complete in your browser</li>
                                <li>40+ multiple-choice quizzes</li>
                            </ul>
                        </div>

                        {/* Reviews */}
                        <div className="course-reviews">
                            <h2>Featured review</h2>
                            {reviews.map((review, index) => (
                                <div key={index} className="review-item">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <div className="avatar"></div>
                                            <div>
                                                <h4>{review.username}</h4>
                                                <p>{`${review.courses} courses, ${review.reviews} reviews`}</p>
                                            </div>
                                        </div>
                                        <div className="review-meta">
                                            <Rating value={review.rating} readOnly cancel={false} />
                                            <span>{review.time}</span>
                                        </div>
                                    </div>
                                    <p>{review.comment}</p>
                                    <div className="review-actions">
                                        <p>Was this review helpful?</p>
                                        <Button icon="pi pi-thumbs-up" className="p-button-text" />
                                        <Button icon="pi pi-thumbs-down" className="p-button-text" />
                                        <Button label="Report" className="p-button-text p-button-link" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>

                <aside style={{ position: 'sticky', top: '6rem', marginRight: '20px' }}>
                    {/* <div className="widget golden" style={{ minHeight: '250px', borderRadius: '8px', background: 'repeating-linear-gradient(45deg,#f6ba52,#f6ba52 10px,#ffd180 10px,#ffd180 20px)'}} ></div> */}
                    <div className="course-sidebar" id="course-sidebar">
                        <div className="course-sidebar__inner">
                            {/* Top Cover Image */}
                            <div className="course-sidebar-top-cover">
                                <img
                                    src="/toeic-course-demo.jpg"
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
                                            <span className="course-price">989.000đ</span>

                                        </div>
                                    </div>
                                    <Button
                                        label="ĐĂNG KÝ HỌC NGAY"
                                        className="btn btn-primary btn-block p-mt-2"
                                        onClick={() => alert('Đăng ký học ngay!')}
                                    />
                                    <Button
                                        label="Học thử miễn phí"
                                        className="btn btn-outline-secondary btn-block p-mt-2"
                                        onClick={() => navigate('/courses/id/learn')}
                                    />
                                </div>

                                <div className="divider"></div>

                                <div className="course-sidebar-item">
                                    <div className="course-sidebar-icon">
                                        <i className="fa-solid fa-users"></i>
                                    </div>
                                    <div className="course-sidebar-text">36,603 học viên đã đăng ký</div>
                                </div>

                                <div className="course-sidebar-item">
                                    <div className="course-sidebar-icon">
                                        <i className="far fa-play-circle"></i>
                                    </div>
                                    <div className="course-sidebar-text">50.0 giờ bài học</div>
                                </div>

                                <div className="course-sidebar-item">
                                    <div className="course-sidebar-icon">
                                        <i className="fa fa-book-open"></i>
                                    </div>
                                    <div className="course-sidebar-text">10 chủ đề, 188 bài học</div>
                                </div>

                                <div className="course-sidebar-item">
                                    <div className="course-sidebar-icon">
                                        <i className="fa fa-pencil"></i>
                                    </div>
                                    <div className="course-sidebar-text">514 bài tập thực hành</div>
                                </div>

                                <div className="course-sidebar-item">
                                    <div className="course-sidebar-icon">
                                        <i className="fa fa-user-clock"></i>
                                    </div>
                                    <div className="course-sidebar-text">Khóa học có giá trị trong 12 tháng.</div>
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