"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "primereact/button"
import { Checkbox } from "primereact/checkbox"
import { Divider } from "primereact/divider"
import { FloatLabel } from "primereact/floatlabel"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./register.css"
import { callRegister } from "../../services/AuthService"
import type { ApiResponse } from "../../types/type"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import type { AxiosError } from "axios"
import logo from "../../assets/Logo.svg"

interface FormData {
  fullname: string
  email: string
  password: string
  cpassword: string
}

export const RegisterPage = () => {
  const navigate = useNavigate()
  const MySwal = withReactContent(Swal)

  const [form, setForm] = useState<FormData>({
    fullname: "",
    email: "",
    password: "",
    cpassword: "",
  })
  const [isValidForm, setValidForm] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [agree, setAgree] = useState(false)

  const header = <div className="font-bold mb-3">Pick a password</div>
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
      newErrors.fullname = "Enter you name"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!form.email.trim()) {
      newErrors.email = "Enter your email"
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email address"
    }

    // regex for minimum 6 characters, contain at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    if (!form.password.trim()) {
      newErrors.password = "Password is required"
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password = "Minimum 6 characters, at least 1 letter and 1 number"
    }

    if (!form.cpassword.trim()) {
      newErrors.cpassword = "Confirm Password is required"
    } else if (form.cpassword !== form.password) {
      newErrors.cpassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // validateForm()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValidForm || !agree) return

    try {
      fireLoading()
      const response: ApiResponse<any> = await callRegister(form)
      closeLoading()
      if (response.status === "CREATED") {
        MySwal.fire({
          position: "center",
          icon: "success",
          title: "Success",
          text: response.message,
          allowOutsideClick: false,
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
        icon: "error",
      })
    }
  }

  const fireLoading = () => {
    MySwal.fire({
      title: "Please wait...",
      html: "Loading...",
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading()
      },
    })
  }

  const closeLoading = () => {
    MySwal.close()
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4facfe 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }}
      />

      <form onSubmit={handleSubmit}>
        <div className="px-5 py-5 flex align-items-center justify-content-center min-h-screen relative z-1">
          <div className="grid w-full max-w-6xl">
            {/* Left Side - Welcome Section */}
            <div className="col-12 lg:col-6 flex align-items-center justify-content-center p-4">
              <div className="text-center text-white">
                <div className="mb-4">
                  <i className="pi pi-user-plus text-6xl mb-4 opacity-90"></i>
                </div>
                <h1 className="text-5xl font-bold mb-4 line-height-2">
                  Join Our
                  <span className="block text-yellow-300">TOEIC Community</span>
                </h1>
                <p className="text-xl mb-6 opacity-90 line-height-3">
                  Start your TOEIC journey today and unlock your potential with our comprehensive learning platform
                  designed for success.
                </p>
                <div className="grid text-sm">
                  <div className="col-12 md:col-4 mb-3">
                    <div className="flex align-items-center gap-2 justify-content-center">
                      <i className="pi pi-check-circle text-green-300"></i>
                      <span>Free Practice Tests</span>
                    </div>
                  </div>
                  <div className="col-12 md:col-4 mb-3">
                    <div className="flex align-items-center gap-2 justify-content-center">
                      <i className="pi pi-chart-line text-blue-300"></i>
                      <span>Progress Tracking</span>
                    </div>
                  </div>
                  <div className="col-12 md:col-4 mb-3">
                    <div className="flex align-items-center gap-2 justify-content-center">
                      <i className="pi pi-trophy text-yellow-300"></i>
                      <span>Expert Guidance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="col-12 lg:col-6 flex align-items-center justify-content-center p-4">
              <div
                className="w-full max-w-md"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "20px",
                  padding: "2.5rem",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {/* Logo and Header */}
                <div className="text-center mb-4">
                  <Link to="/home" className="inline-block mb-3">
                    <img
                      src={logo || "/placeholder.svg"}
                      alt="TOEIC Study Logo"
                      height="50"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                    />
                  </Link>
                  <h2 className="text-3xl font-bold text-900 mb-2">Create Account</h2>
                  <p className="text-600 mb-0">Join thousands of successful TOEIC learners</p>
                </div>

                {/* Login Link */}
                <div className="text-center mb-4 p-3 border-round" style={{ background: "#f8f9fa" }}>
                  <span className="text-600 font-medium">Bạn đã có tài khoản?</span>
                  <Link
                    to="/login"
                    className="font-medium no-underline ml-2 text-primary cursor-pointer hover:text-primary-600 transition-colors"
                  >
                    Đăng nhập ngay!
                  </Link>
                </div>

                {/* Full Name Input - Original Structure */}
                <FloatLabel className="my-5">
                  <InputText
                    id="fullname"
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    className="w-full"
                    tooltip={errors.fullname}
                    tooltipOptions={{
                      position: "right",
                      pt: {
                        text: { className: "bg-red-600" },
                      },
                    }}
                    invalid={!!errors.fullname}
                  />
                  <label htmlFor="fullname">Full Name</label>
                </FloatLabel>

                {/* Email Input - Original Structure */}
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
                        position: "right",
                        pt: {
                          text: { className: "bg-red-600" },
                        },
                      }}
                      invalid={!!errors.email}
                    />
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-envelope"></i>
                    </span>
                  </div>
                  <label htmlFor="email">Email</label>
                </FloatLabel>

                {/* Password Input - Original Structure */}
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
                      input: { className: "w-full" },
                      iconField: { root: { className: "w-full" } },
                    }}
                    tooltip={errors.password}
                    tooltipOptions={{
                      position: "right",
                      pt: {
                        text: { className: "bg-red-600" },
                      },
                    }}
                    invalid={!!errors.password}
                  />
                  <label htmlFor="password">Password</label>
                </FloatLabel>

                {/* Confirm Password Input - Original Structure */}
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
                      input: { className: "w-full" },
                      iconField: { root: { className: "w-full" } },
                    }}
                    tooltip={errors.cpassword}
                    tooltipOptions={{
                      position: "right",
                      pt: {
                        text: { className: "bg-red-600" },
                      },
                    }}
                    invalid={!!errors.cpassword}
                  />
                  <label htmlFor="cpassword">Confirm Password</label>
                </FloatLabel>

                {/* Terms Checkbox - Original Structure */}
                <div className="field-checkbox mb-4">
                  <Checkbox inputId="agree" checked={agree} onChange={(e) => setAgree(e.checked ?? false)} />
                  <label htmlFor="agree" className="ml-2">
                    I agree to the terms and conditions*
                  </label>
                </div>

                {/* Register Button */}
                <Button
                  label="Create Account"
                  className="w-full mt-3 p-3 text-lg font-bold"
                  style={{
                    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(30, 60, 114, 0.3)",
                  }}
                  disabled={!isValidForm || !agree}
                />

                {/* Additional Info */}
                <div className="text-center mt-4 pt-3 border-top-1 border-200">
                  <p className="text-xs text-500 mb-0">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
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
