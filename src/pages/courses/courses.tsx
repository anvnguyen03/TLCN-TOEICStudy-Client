import { Button } from "primereact/button";
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import "./courses.css"
import { useNavigate } from "react-router-dom";

const dummy = [
    {
        title: 'Learn Figma - UI/UX Design Essential Training',
        lessons: 6,
        students: 198,
        level: 'Beginner',
        rating: 4,
        price: 250000,
        image: 'https://storage.googleapis.com/a1aa/image/rlQaXyX88byWEJlOshWUqTYUgtHwL2CdnycMbu7qlps.jpg',
        alt: 'A computer screen displaying various design tools and software icons',
    },
    {
        title: 'Python For Beginners - Learn Programming...',
        lessons: 21,
        students: 99,
        level: 'Advanced',
        rating: 3,
        price: 250000,
        image: 'https://storage.googleapis.com/a1aa/image/hAjiCnigmIQKTb8HrHjdz4-yJiEr7HBjOhddaEo8zyU.jpg',
        alt: 'A person using a laptop with a "Learning" graphic on the screen',
    },
    {
        title: 'Acoustic Guitar And Electric Guitar Started',
        lessons: 8,
        students: 301,
        level: 'Average',
        rating: 5,
        price: 250000,
        image: 'https://storage.googleapis.com/a1aa/image/jqCwIIflOCF9ZinW8Do9MCukaAGBTybYFKM7X7xLuug.jpg',
        alt: 'A person playing an acoustic guitar',
    },
    {
        title: 'Mobile App Development With Flutter & Dart...',
        lessons: 15,
        students: 215,
        level: 'Beginner',
        rating: 2,
        price: 250000,
        image: 'https://storage.googleapis.com/a1aa/image/QgAxpnQp2W2YmiBgSAOoTsp71d7WNi9yUSR7Pr4CLcw.jpg',
        alt: 'A person holding a smartphone displaying a mobile app',
    },
    {
        title: 'Ionic React: Mobile Development With Ionic...',
        lessons: 15,
        students: 67,
        level: 'Advanced',
        rating: 5,
        price: 250000,
        image: 'https://storage.googleapis.com/a1aa/image/7p3Z_zGR02NYdhEHHasEVwfGeJGeHTLh1B2hRTTTdrg.jpg',
        alt: 'A smartphone displaying a mobile app with a plant in the background',
    },
    {
        title: 'Sports Management: The Essentials Course',
        lessons: 26,
        students: 156,
        level: 'Average',
        rating: 1,
        price: 250000,
        image: 'https://storage.googleapis.com/a1aa/image/pEskuE8otU0p2lpAivIwjVGtX_HOu7cADubdsFrmSKw.jpg',
        alt: 'A person in workout clothes sitting on a gym floor',
    },
    {
        title: 'How To Market Yourself As A Consultant',
        lessons: 33,
        students: 64,
        level: 'Beginner',
        rating: 3,
        price: 250000,
        image: 'https://storage.googleapis.com/a1aa/image/WNLGI3bbuslX6jGhxUaxdM_7rfixX-1imYhDIPcyhrM.jpg',
        alt: 'A person holding a document and smiling',
    },
    {
        title: 'Become A Product Manager | Learn The Skill...',
        lessons: 5,
        students: 134,
        level: 'Advanced',
        rating: 4,
        price: 250000,
        image: 'https://storage.googleapis.com/a1aa/image/rHDc5MkEjxRkEPttXTtS6Q5N9LbkN56FwOSmi6Z3Vlk.jpg',
        alt: 'A group of people in a meeting with laptops',
    },
]

const Courses: React.FC = () => {
    const navigate = useNavigate()

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
                    {dummy.map((course, index) => (
                        <div key={index} className="col-12 sm:col-6 lg:col-4 p-2">
                            {/* <!-- Course Card --> */}
                            <div className="course-card bg-white border-round-lg shadow-2 overflow-hidden" onClick={() => navigate(`/courses/${index}`)}>
                                <img
                                    alt="A computer screen displaying various design tools and software"
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
                                    {/* Thêm trường Price */}
                                    <div className="text-green-600 text-base font-semibold mb-3">
                                        ₫{course.price.toLocaleString("vi-VN")}
                                    </div>
                                    <div className="flex align-items-center justify-content-between">
                                        <Button className="px-4 py-2" severity="contrast">
                                            Start Course
                                        </Button>
                                        <div className="flex align-items-center mt-2">
                                            <span className="text-yellow-500 text-lg font-bold">4</span>
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