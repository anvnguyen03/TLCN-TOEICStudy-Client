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
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

    useEffect(() => {
        const from = location.state?.from

        if (isAuthenticated) {
            if (from) {
                navigate(from)
            } else {
                navigate('/home')
            }
        }

        const isValid = validateForm()
        setValidForm(isValid)
    }, [form, isAuthenticated])

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
        <form onSubmit={handleLogin}>
            <div className="px-5 py-5 flex align-items-center justify-content-center h-screen">
                <div className="surface-card shadow-2 p-4 border-round w-11 sm:w-8 md:w-6 lg:w-4">
                    <h2 className="text-center">Login</h2>

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
                                    position: 'right',
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

                    <FloatLabel className="my-5">
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
                                position: 'right',
                                pt: {
                                    text: { className: 'bg-red-600' }
                                }
                            }}
                            invalid={!!errors.password}
                        />
                        <label htmlFor="password">Password</label>
                    </FloatLabel>

                    <div className="flex align-items-center justify-content-between field">
                        <span className="text-600 font-medium line-height-3">Bạn chưa có tài khoản?</span>
                        <Link to="/register" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Đăng ký ngay!</Link>
                    </div>

                    <Button
                        label="Login"
                        className="w-full mt-3"
                        disabled={!isValidForm}
                    />
                </div>
            </div>
        </form>
    )
}