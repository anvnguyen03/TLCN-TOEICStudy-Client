import { Button } from "primereact/button"
import { useAppSelector } from "../../hooks/reduxHooks"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import { useNavigate } from "react-router-dom"

const HomePage = () => {

    const navigate = useNavigate()
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
    const fullname = useAppSelector(state => state.auth.fullname)

    return (
        <UserLayout>
            <div className="surface-200">
                {isAuthenticated &&
                    <div className="bg-bluegray-900 text-gray-100 p-3 flex justify-content-between 
                lg:justify-content-center align-items-center flex-wrap">
                        <div className="font-bold mr-4">🔥 Welcome back!</div>
                        <div className="align-items-center hidden lg:flex">
                            <span className="line-height-3">{fullname}</span>
                        </div>
                    </div>
                }

                <div className="relative p-6 overflow-hidden">
                    <img id="j_idt42:blockViewerForm:j_idt49" src="/hero-2.jpg" className="absolute top-0 left-0 w-auto h-full block md:w-full" alt="Image" />
                    <div className="text-center my-6 relative">
                        <div className="text-6xl text-white font-bold mb-1">The Platform For</div>
                        <div className="text-6xl text-primary font-bold mb-4">Today's Generation</div>
                        <p className="mt-0 mb-4 line-height-3 text-center mx-auto text-white" style={{ maxWidth: '500px' }}>
                            Nền tảng học tập và luyện thi TOEIC trực tuyến - TOEIC STUDY
                        </p>
                        <Button className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" type="button" onClick={() => navigate('/tests')}>
                            <span className="ui-button-text ui-c">Explore now</span>
                        </Button>

                        <p className="text-sm mt-4 mb-4 line-height-3 text-white">Available for MacOS, Web and Google accounts
                            only</p>
                        <div className="flex justify-content-center align-items-center">
                            <a href="https://www.apple.com" className="text-white mr-3">
                                <i className="pi pi-apple text-2xl"></i>
                            </a>
                            <a href="https://play.google.com" className="text-white mr-3">
                                <i className="pi pi-android text-2xl"></i>
                            </a>
                            <a href="https://www.facebook.com" className="text-white">
                                <i className="pi pi-facebook text-2xl"></i>
                            </a>
                        </div>
                    </div>
                </div>


                <div className="surface-0 text-center px-4 py-8">
                    <div className="mb-3 font-bold text-3xl">
                        <span className="text-900">One Product, </span>
                        <span className="text-blue-600">Many Solutions</span>
                    </div>
                    <div className="text-700 mb-6">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.</div>
                    <div className="grid">
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-desktop text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">Built for Everyone</div>
                            <span className="text-700 line-height-3">Toeic Study là nền tảng học tập được xây dựng phù hợp cho tất cả mọi người từ học sinh, sinh viên đến người đi làm.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-lock text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">End-to-End Encryption</div>
                            <span className="text-700 line-height-3">Cam kết bảo mật thông tin cá nhân của người dùng.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-check-circle text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">Easy to Use</div>
                            <span className="text-700 line-height-3">Giao diện thân thiện trực quan, dễ tiếp cận và sử dụng cho đa dạng lứa tuổi.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-globe text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">Fast & Global Support</div>
                            <span className="text-700 line-height-3">Hỗ trợ nhanh chóng trên toàn cầu.</span>
                        </div>
                        
                        <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-shield text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">Trusted Resources</div>
                            <span className="text-700 line-height-3">Cung cấp đa dạng phong phú bài thi, tài nguyên học tập được đảm bảo chất lượng.</span>
                        </div>
                    </div>
                </div>

                <div className="surface-section px-4 pb-8 md:px-6 lg:px-8">
                    <div
                        className="p-6 shadow-2 flex flex-column md:flex-row align-items-center justify-content-between"
                        style={{ borderRadius: '1rem', background: 'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)' }}
                    >
                        <div className="pr-6">
                            <div className="text-blue-100 font-medium text-xl mb-3">TAKE THE NEXT STEP</div>
                            <div className="text-white font-medium text-5xl">Empower your customer experience</div>
                        </div>
                        <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                            <Button className="font-bold px-3 py-2 white-space-nowrap" raised rounded severity="warning">
                                <span className="px-3 py-2">Get Started</span>
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </UserLayout>
    )
}

export default HomePage