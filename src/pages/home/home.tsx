import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Badge } from "primereact/badge"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
    const navigate = useNavigate()

    const features = [
        {
            icon: "pi pi-book",
            title: "Comprehensive Study Materials",
            description: "Access thousands of TOEIC practice questions, listening exercises, and reading comprehension materials designed by experts."
        },
        {
            icon: "pi pi-chart-line",
            title: "Progress Tracking",
            description: "Monitor your improvement with detailed analytics and personalized study recommendations based on your performance."
        },
        {
            icon: "pi pi-clock",
            title: "Timed Practice Tests",
            description: "Simulate real TOEIC exam conditions with full-length practice tests and section-specific drills."
        },
        {
            icon: "pi pi-users",
            title: "Expert Support",
            description: "Get guidance from certified TOEIC instructors and join our community of learners worldwide."
        },
        {
            icon: "pi pi-mobile",
            title: "Learn Anywhere",
            description: "Study on-the-go with our mobile-optimized platform. Practice during commutes or breaks."
        },
        {
            icon: "pi pi-star",
            title: "Proven Results",
            description: "Join thousands of successful students who improved their TOEIC scores by an average of 150+ points."
        }
    ]

    const testimonials = [
        {
            score: "950",
            improvement: "+200",
            name: "Sarah Chen",
            role: "Marketing Manager",
            comment: "TOEIC Study helped me achieve my dream score for my promotion!"
        },
        {
            score: "880",
            improvement: "+180",
            name: "Hiroshi Tanaka",
            role: "Software Engineer",
            comment: "The practice tests were incredibly similar to the real exam."
        },
        {
            score: "920",
            improvement: "+160",
            name: "Maria Rodriguez",
            role: "International Student",
            comment: "Perfect preparation for university applications abroad."
        }
    ]

    return (
        <UserLayout>
            <div className="surface-200">
                {/* Hero Section */}
                <div className="relative p-6 overflow-hidden" style={{ minHeight: '70vh' }}>
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundColor: 'rgba(13, 71, 161, 0.85)' }}></div>
                    <img 
                        src="/carousel-1.jpg" 
                        className="absolute top-0 left-0 w-full h-full object-cover" 
                        style={{ opacity: 0.2 }} 
                        alt="TOEIC Study Background" 
                    />
                    
                    <div className="relative z-1 flex flex-column align-items-center justify-content-center h-full text-center py-8">
                        <Badge value="🏆 #1 TOEIC Prep Platform" className="mb-4" severity="warning" />
                        
                        <h1 className="text-6xl md:text-7xl text-white font-bold mb-3 line-height-2">
                            Master Your
                            <span className="text-yellow-300 block">TOEIC Score</span>
                        </h1>
                        
                        <p className="text-xl text-blue-100 mb-6 max-w-600px line-height-3">
                            Join over 100,000+ students who achieved their target TOEIC scores with our comprehensive online learning platform
                        </p>
                        
                        <div className="flex flex-column md:flex-row gap-3 mb-6">
                            <Button 
                                label="Start Free Trial" 
                                icon="pi pi-play"
                                className="p-button-warning p-button-lg font-bold px-6 py-3"
                                raised
                                onClick={() => navigate('/courses')}
                            />
                            <Button 
                                label="View Sample Test" 
                                icon="pi pi-eye"
                                className="p-button-outlined p-button-lg font-bold px-6 py-3"
                                style={{ color: 'white', borderColor: 'white' }}
                                onClick={() => navigate('/tests')}
                            />
                        </div>
                        
                        <div className="flex align-items-center gap-4 text-blue-100">
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-check-circle text-green-300"></i>
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-users text-blue-300"></i>
                                <span>100,000+ Active Users</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="surface-0 py-6">
                    <div className="grid text-center">
                        <div className="col-12 md:col-3">
                            <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
                            <div className="text-700">Average Score Improvement</div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                            <div className="text-700">Practice Questions</div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                            <div className="text-700">Success Rate</div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                            <div className="text-700">Study Access</div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="surface-50 px-4 py-8">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-900 mb-3">
                            Why Choose <span className="text-blue-600">TOEIC Study?</span>
                        </h2>
                        <p className="text-700 text-xl max-w-600px mx-auto">
                            Everything you need to achieve your target TOEIC score in one comprehensive platform
                        </p>
                    </div>
                    
                    <div className="grid">
                        {features.map((feature, index) => (
                            <div key={index} className="col-12 md:col-6 lg:col-4 p-3">
                                <Card className="h-full hover:shadow-4 transition-all transition-duration-300">
                                    <div className="text-center p-4">
                                        <div 
                                            className="inline-flex align-items-center justify-content-center mb-4"
                                            style={{ 
                                                width: '80px', 
                                                height: '80px', 
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            }}
                                        >
                                            <i className={`${feature.icon} text-3xl text-white`}></i>
                                        </div>
                                        <h3 className="text-xl font-bold text-900 mb-3">{feature.title}</h3>
                                        <p className="text-700 line-height-3">{feature.description}</p>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="surface-0 px-4 py-8">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-900 mb-3">
                            <span className="text-blue-600">Success Stories</span> from Our Students
                        </h2>
                        <p className="text-700 text-xl">Real results from real students</p>
                    </div>
                    
                    <div className="grid">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="col-12 md:col-4 p-3">
                                <Card className="h-full">
                                    <div className="p-4">
                                        <div className="flex align-items-center justify-content-between mb-4">
                                            <div className="flex align-items-center gap-3">
                                                <div 
                                                    className="w-4rem h-4rem border-circle flex align-items-center justify-content-center text-white font-bold text-xl"
                                                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                                >
                                                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-900">{testimonial.name}</div>
                                                    <div className="text-600 text-sm">{testimonial.role}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-blue-600">{testimonial.score}</div>
                                                <Badge value={testimonial.improvement} severity="success" />
                                            </div>
                                        </div>
                                        <p className="text-700 italic">"{testimonial.comment}"</p>
                                        <div className="flex mt-3">
                                            {[1,2,3,4,5].map(star => (
                                                <i key={star} className="pi pi-star-fill text-yellow-500"></i>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="surface-section px-4 py-8">
                    <Card 
                        className="shadow-4"
                        style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none'
                        }}
                    >
                        <div className="p-6 text-center text-white">
                            <h2 className="text-5xl font-bold mb-3">Ready to Boost Your TOEIC Score?</h2>
                            <p className="text-xl mb-6 opacity-90">
                                Join thousands of successful students and start your journey to TOEIC mastery today
                            </p>
                            
                            <div className="flex flex-column md:flex-row align-items-center justify-content-center gap-4 mb-6">
                                <Button 
                                    label="Start Your Free Trial"
                                    icon="pi pi-arrow-right"
                                    className="p-button-warning p-button-lg font-bold px-6 py-3"
                                    raised
                                    onClick={() => navigate('/register')}
                                />
                            </div>
                            
                            <div className="flex align-items-center justify-content-center gap-6 text-sm opacity-80">
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-shield"></i>
                                    <span>30-Day Money Back Guarantee</span>
                                </div>
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-clock"></i>
                                    <span>Cancel Anytime</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </UserLayout>
    )
}

export default HomePage