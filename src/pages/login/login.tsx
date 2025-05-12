/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store/store";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { callLogin } from "../../services/AuthService";
import { login } from "../../store/authSlice";
import { AxiosError } from "axios";
import { ApiResponse } from "../../types/type";
import { useAppSelector } from "../../hooks/reduxHooks";
import logo from "../../assets/Logo.svg"

interface FormData {
    email: string,
    password: string,
}

export default function LoginPage() {

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>()
    const [form, setForm] = useState<FormData>({ email: '', password: '' })
    const [isValidForm, setValidForm] = useState(false)
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const MySwal = withReactContent(Swal)
    const auth = useAppSelector(state => state.auth)

    useEffect(() => {
        const from = location.state?.from

        if (auth.isAuthenticated) {

            if (auth.role === 'ADMIN') {
                navigate('/admin/dashboard')
                return
            }

            if (from) {
                navigate(from)
                return
            } else {
                if (auth.role === 'USER') {
                    navigate('/home')
                    return
                }
            }
        }

        const isValid = validateForm()
        setValidForm(isValid)
    }, [form, auth])

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {}

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!form.email.trim()) {
            newErrors.email = 'Enter your email'
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = 'Invalid email address'
        }

        // regex for minimum 6 characters, contain at least one letter and one number
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
        if (!form.password.trim()) {
            newErrors.password = 'Enter your password'
        } else if (!passwordRegex.test(form.password)) {
            newErrors.password = 'Minimum 6 characters, at least 1 letter and 1 number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()

        try {
            fireLoading()
            const response = await callLogin(form)
            MySwal.close()

            const { token, refreshToken } = response.data

            // Dispatch login action to Redux store
            dispatch(login({ token, refreshToken }))
            fireLoggedInToast()

            // Kiểm tra xem có route trước đó trong state hay không
            const from = location.state?.from

            if (from) {
                navigate(from)
            } else {
                navigate('/home')
            }

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse<any>>
            MySwal.close()
            fireErrorToast(axiosError.response?.data.message)
        }
    }

    const fireLoading = () => {
        MySwal.fire({
            title: 'Logging in...',
            allowOutsideClick: false,
            didOpen: () => {
                MySwal.showLoading();
            },
        });
    }

    const fireLoggedInToast = () => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer
                toast.onmouseleave = Swal.resumeTimer
            }
        })
        Toast.fire({
            icon: "success",
            title: "Logged in"
        })
    }

    const fireErrorToast = (error: string | undefined) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer
                toast.onmouseleave = Swal.resumeTimer
            }
        })
        Toast.fire({
            icon: "error",
            title: error
        })
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4facfe 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                pointerEvents: 'none'
            }} />

            <form onSubmit={handleLogin}>
                <div className="px-5 py-5 flex align-items-center justify-content-center h-screen relative z-1">
                    <div className="grid w-full max-w-6xl">
                        {/* Left Side - Welcome Section */}
                        <div className="col-12 lg:col-6 flex align-items-center justify-content-center p-4">
                            <div className="text-center text-white">
                                <div className="mb-4">
                                    <i className="pi pi-graduation-cap text-6xl mb-4 opacity-90"></i>
                                </div>
                                <h1 className="text-5xl font-bold mb-4 line-height-2">
                                    Welcome to
                                    <span className="block text-yellow-300">TOEIC Study</span>
                                </h1>
                                <p className="text-xl mb-6 opacity-90 line-height-3">
                                    Master your TOEIC skills with our comprehensive online learning platform. 
                                    Join thousands of successful students worldwide.
                                </p>
                                <div className="flex align-items-center justify-content-center gap-6 text-sm">
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-check-circle text-green-300"></i>
                                        <span>10,000+ Practice Questions</span>
                                    </div>
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-users text-blue-300"></i>
                                        <span>100,000+ Active Users</span>
                                    </div>
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-star text-yellow-300"></i>
                                        <span>95% Success Rate</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="col-12 lg:col-6 flex align-items-center justify-content-center p-4">
                            <div 
                                className="w-full max-w-md"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '20px',
                                    padding: '2.5rem',
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                {/* Logo and Header */}
                                <div className="text-center mb-4">
                                    <Link to="/home" className="inline-block mb-3">
                                        <img
                                            src={logo || "/placeholder.svg"}
                                            alt="TOEIC Study Logo"
                                            height="50"
                                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                                        />
                                    </Link>
                                    <h2 className="text-3xl font-bold text-900 mb-2">Welcome Back</h2>
                                    <p className="text-600 mb-0">Sign in to continue your TOEIC journey</p>
                                </div>

                                {/* Register Link */}
                                <div className="text-center mb-4 p-3 border-round" style={{ background: '#f8f9fa' }}>
                                    <span className="text-600 font-medium">Bạn chưa có tài khoản?</span>
                                    <Link 
                                        to="/register" 
                                        className="font-medium no-underline ml-2 text-primary cursor-pointer hover:text-primary-600 transition-colors"
                                    >
                                        Đăng ký!
                                    </Link>
                                </div>

                                {/* Email Input - Back to Original */}
                                <FloatLabel className="my-5">
                                    <div className="p-inputgroup">
                                        <InputText
                                            id="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full"
                                            tooltip={errors.email}
                                            tooltipOptions={{
                                                position: 'left',
                                                pt: {
                                                    text: { className: 'bg-red-600' }
                                                }
                                            }}
                                            invalid={!!errors.email}
                                        />
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-envelope"></i>
                                        </span>
                                    </div>
                                    <label htmlFor="email">Email</label>
                                </FloatLabel>

                                {/* Password Input - Back to Original */}
                                <FloatLabel className="mt-5">
                                    <Password
                                        inputId="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        toggleMask
                                        feedback={false}
                                        className="w-full"
                                        pt={{
                                            input: { className: 'w-full' },
                                            iconField: { root: { className: 'w-full' } }
                                        }}
                                        tooltip={errors.password}
                                        tooltipOptions={{
                                            position: 'left',
                                            pt: {
                                                text: { className: 'bg-red-600' }
                                            }
                                        }}
                                        invalid={!!errors.password}
                                    />
                                    <label htmlFor="password">Password</label>
                                </FloatLabel>

                                {/* Forgot Password Link */}
                                <Link 
                                    to={"/forgot-password"} 
                                    className="flex mt-2 text-primary justify-content-end text-sm no-underline hover:text-primary-600 transition-colors"
                                >
                                    Quên mật khẩu?
                                </Link>

                                {/* Login Button */}
                                <Button
                                    label="Login"
                                    className="w-full mt-3 p-3 text-lg font-bold"
                                    style={{
                                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 15px rgba(30, 60, 114, 0.3)'
                                    }}
                                    disabled={!isValidForm}
                                />

                                {/* Additional Info */}
                                <div className="text-center mt-4 pt-3 border-top-1 border-200">
                                    <p className="text-xs text-500 mb-0">
                                        By signing in, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}