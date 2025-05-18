import { Link } from "react-router-dom"
import logo from "../../assets/Logo.svg"
import { FloatLabel } from "primereact/floatlabel"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Toast } from "primereact/toast"
import { callForgotPass } from "../../services/AuthService"
import axios from "axios"

const ForgotPassword: React.FC = () => {

    const [email, setEmail] = useState<string>('')
    const [errors, setErrors] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const toast = useRef<Toast>(null)

    useEffect(() => {
        const validateEmail = () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            let newError: string = ''
            if (!email.trim()) {
                newError = 'Enter your email'
            } else if (!emailRegex.test(email)) {
                newError = 'Invalid email address'
            }

            setErrors(newError)
        }
        validateEmail()
    }, [email])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await callForgotPass(email)
            setSubmitted(true)
            toast.current?.show({ severity: 'success', detail: response.message, sticky: true })
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data.message, sticky: true })
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <form>
            <Toast ref={toast} />
            <div className="px-5 py-5 flex align-items-center justify-content-center h-screen">
                <div className="surface-card shadow-2 p-4 border-round w-11 sm:w-8 md:w-6 lg:w-4">
                    <Link to="/home"><img
                        src={logo}
                        alt="bastion-300"
                        height="40"
                        className="mr-0 lg:mr-6"
                    /></Link>
                    <h2 className="text-left">Forgot Password?</h2>
                    <div className="flex align-items-center field">
                        <span className="text-600 font-medium line-height-3">Điền email gắn với tài khoản của bạn để yêu cầu cấp mật khẩu mới</span>
                    </div>

                    <FloatLabel className="my-5">
                        <div className="p-inputgroup">
                            <InputText
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className="w-full"
                                tooltip={errors}
                                tooltipOptions={{
                                    position: 'right',
                                    pt: {
                                        text: { className: 'bg-red-600' }
                                    }
                                }}
                                invalid={!!errors}
                                disabled={submitted || loading}
                            />
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-envelope"></i>
                            </span>
                        </div>
                        <label htmlFor="email">Email</label>
                    </FloatLabel>

                    <Button
                        label="Tiếp tục"
                        className="w-full mt-3"
                        disabled={!!errors || submitted}
                        onClick={handleSubmit}
                        loading={loading}
                    />
                    <div className="mt-2 flex justify-content-center">
                        <Link className="text-primary no-underline font-bold " to={"/login"}>Quay lại đăng nhập</Link>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default ForgotPassword