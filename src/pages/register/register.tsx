/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "primereact/button"
import { Checkbox } from "primereact/checkbox"
import { Divider } from "primereact/divider"
import { FloatLabel } from "primereact/floatlabel"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./register.css"
import { callRegister } from "../../services/AuthService"
import { ApiResponse } from "../../types/type"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { AxiosError } from "axios"

interface FormData {
    fullname: string,
    email: string,
    password: string,
    cpassword: string
}

export const RegisterPage = () => {

    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)

    const [form, setForm] = useState<FormData>({
        fullname: '',
        email: '',
        password: '',
        cpassword: ''
    })
    const [isValidForm, setValidForm] = useState(false)
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const [agree, setAgree] = useState(false)

    const header = <div className="font-bold mb-3">Pick a password</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one letter</li>
                <li>At least one numeric</li>
                <li>Minimum 6 characters</li>
            </ul>
        </>
    )

    useEffect(() => {
        const isValid = validateForm()
        setValidForm(isValid)
    }, [form])

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {}

        if (!form.fullname.trim()) {
            newErrors.fullname = 'Enter you name'
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!form.email.trim()) {
            newErrors.email = 'Enter your email'
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = 'Invalid email address'
        }

        // regex for minimum 6 characters, contain at least one letter and one number
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
        if (!form.password.trim()) {
            newErrors.password = 'Password is required'
        } else if (!passwordRegex.test(form.password)) {
            newErrors.password = 'Minimum 6 characters, at least 1 letter and 1 number'
        }

        if (!form.cpassword.trim()) {
            newErrors.cpassword = 'Confirm Password is required'
        } else if (form.cpassword !== form.password) {
            newErrors.cpassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({...form, [name]: value})
        // validateForm()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!isValidForm || !agree) return

        try {
            fireLoading()
            const response: ApiResponse<any> =  await callRegister(form)
            closeLoading()
            if (response.status === 'CREATED') {
                MySwal.fire({
                    position: "center",
                    icon: "success",
                    title: "Success", 
                    text: response.message,
                    allowOutsideClick: false
                }).then(() => {
                    navigate(`/register/verify?email=${form.email}`)
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse<any>>
            closeLoading()
            MySwal.fire({
                title: "Cancelled!",
                text: axiosError.response?.data.message,
                icon: "error"
            })
        }
    }

    const fireLoading = () => {
        MySwal.fire({
            title: 'Please wait...',
            html: 'Loading...',
            allowOutsideClick: false,
            didOpen: () => {
              MySwal.showLoading()
            }
        })
    }

    const closeLoading = () => {
        MySwal.close()
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="px-5 py-5 flex align-items-center justify-content-center h-screen">
                <div className="surface-card shadow-2 p-4 border-round w-11 sm:w-8 md:w-6 lg:w-4">
                    <h2 className="text-center">Register</h2>

                    <FloatLabel className="my-5">
                        <InputText
                            id="fullname" 
                            name="fullname"
                            value={form.fullname} 
                            onChange={handleChange}
                            className="w-full" 
                            tooltip={errors.fullname}
                            tooltipOptions={{ 
                                position: 'right',
                                pt: { 
                                    text: { className: 'bg-red-600' }
                                }
                            }}
                            invalid={!!errors.fullname}
                        />
                        <label htmlFor="fullname">Full Name</label>
                    </FloatLabel>

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
                            header={header} 
                            footer={footer} 
                            className="w-full"
                            pt={{ 
                                input: { className: 'w-full' },  
                                iconField: { root: { className: 'w-full' }}
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

                    <FloatLabel className="my-5">
                        <Password 
                            inputId="cpassword" 
                            name="cpassword"
                            value={form.cpassword} 
                            onChange={handleChange} 
                            toggleMask
                            feedback={false}
                            header={header} 
                            footer={footer} 
                            className="w-full"
                            pt={{ 
                                input: { className: 'w-full' },  
                                iconField: { root: { className: 'w-full' }}
                            }}
                            tooltip={errors.cpassword}
                            tooltipOptions={{ 
                                position: 'right',
                                pt: { 
                                    text: { className: 'bg-red-600' }
                                }
                            }}
                            invalid={!!errors.cpassword}
                        />
                        <label htmlFor="cpassword">Confirm Password</label>
                    </FloatLabel>

                    <div className="field-checkbox">
                        <Checkbox inputId="agree" checked={agree} onChange={(e) => setAgree(e.checked ?? false)} />
                        <label htmlFor="agree">I agree to the terms and conditions*</label>
                    </div>

                    <div className="flex align-items-center justify-content-between field">
                        <span className="text-600 font-medium line-height-3">Bạn đã có tài khoản?</span>
                        <Link to="/login" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Đăng nhập ngay!</Link>
                    </div>

                    <Button 
                        label="Confirm" 
                        className="w-full mt-3" 
                        disabled={!isValidForm || !agree}
                    />
                </div>
            </div>
        </form>
    )
}
