import { Button } from "primereact/button";
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import "./courses.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { callGetAllPublishedCourses } from "../../services/CourseService";
import { ProgressSpinner } from 'primereact/progressspinner';
import { CourseCardDTO } from "../../types/type";

const Courses: React.FC = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<CourseCardDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await callGetAllPublishedCourses();
                setCourses(data.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch courses. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <UserLayout>
                <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <ProgressSpinner />
                </div>
            </UserLayout>
        );
    }

    if (error) {
        return (
            <UserLayout>
                <div className="flex justify-content-center align-items-center text-red-500" style={{ height: '50vh' }}>
                    {error}
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div
                className="flex flex-column justify-content-between align-items-center text-2xl py-5 "
                style={{ height: 300, backgroundImage: 'url(/online-courses.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
            </div>

            <div className="p-4 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">ALL COURSES</h1>

                <div className="grid grid-nogutter ">
                    {courses.map((course, index) => (
                        <div key={index} className="col-12 sm:col-6 lg:col-4 p-2">
                            <div className="course-card bg-white border-round-lg shadow-2 overflow-hidden" onClick={() => navigate(`/courses/${course.id}`)}>
                                <img
                                    alt={course.title}
                                    className="w-full h-12rem"
                                    src={course.image}
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
                                    <div className="flex align-items-center text-gray-600 text-sm mb-2">
                                        <i className="fas fa-book mr-2"></i>
                                        Lesson: {course.lessons}
                                        <i className="fas fa-user ml-4 mr-2"></i>
                                        Student: {course.students}
                                        <i className="fas fa-signal ml-4 mr-2"></i>
                                        {course.level}
                                    </div>
                                    <div className="text-green-600 text-base font-semibold mb-3">
                                        ₫{course.price.toLocaleString("vi-VN")}
                                    </div>
                                    <div className="flex align-items-center justify-content-between">
                                        <Button className="px-4 py-2" severity="contrast">
                                            Start Course
                                        </Button>
                                        <div className="flex align-items-center mt-2">
                                            <span className="text-yellow-500 text-lg font-bold">{Math.round(course.rating * 10) / 10}</span>
                                            <i className="fas fa-star text-yellow-500 ml-1"></i>
                                        </div>
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

export default Courses