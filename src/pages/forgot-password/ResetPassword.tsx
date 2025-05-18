import axios from "axios"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { FloatLabel } from "primereact/floatlabel"
import { InputOtp } from "primereact/inputotp"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Toast } from "primereact/toast"
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { callResetPass } from "../../services/AuthService"

interface ResetPassRequest {
    email: string
    otp: null | undefined | string | number
    newPassword: string
    confirmPass: string
}

const ResetPassword = () => {

    const navigate = useNavigate()
    const toast = useRef<Toast>(null)
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const email = queryParams.get('email')!
    const [otp, setOtp] = useState<null | undefined | string | number>()
    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmPass, setConfirmPass] = useState<string>('')
    const [isValidForm, setValidForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Partial<ResetPassRequest>>({})

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
        const validateForm = (): boolean => {
            const newErrors: Partial<ResetPassRequest> = {}

            if (otp === null || otp === undefined || otp.toString().length < 6) {
                newErrors.otp = 'OTP is required'
            }

            // regex for minimum 6 characters, contain at least one letter and one number
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
            if (!newPassword.trim()) {
                newErrors.newPassword = 'Password is required'
            } else if (!passwordRegex.test(newPassword)) {
                newErrors.newPassword = 'Minimum 6 characters, at least 1 letter and 1 number'
            }

            if (!confirmPass.trim()) {
                newErrors.confirmPass = 'Confirm Password is required'
            } else if (confirmPass !== newPassword) {
                newErrors.confirmPass = 'Passwords do not match'
            }

            setErrors(newErrors)
            return Object.keys(newErrors).length === 0
        }
        setValidForm(validateForm)
    }, [confirmPass, newPassword, otp])

    const handleResetPass = async () => {
        try {
            setLoading(true)
           
            await callResetPass({ email, otp, newPassword })
            setOtp('')
            setNewPassword('')
            setConfirmPass('')
            toast.current?.show({ severity: 'success', detail: 'New password has been saved, you can login now' })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.current?.show({ severity: 'error', detail: error.response?.data.message })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-column align-items-center">
            <Toast ref={toast} />
            <p className="font-bold text-xl mb-2">Reset your password</p>
            <p className="text-color-secondary block mb-5">Please enter the code sent to your email.</p>
            <FloatLabel className="my-5">
                <div className="p-inputgroup">
                    <InputText
                        id="email"
                        name="email"
                        value={email}
                        className="w-full"
                        disabled
                    />
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-envelope"></i>
                    </span>
                </div>
                <label htmlFor="email">Email</label>
            </FloatLabel>
            <InputOtp value={otp} onChange={(e) => setOtp(e.value)} length={6} integerOnly name="otp" invalid={!!errors.otp} />
            <FloatLabel className="my-5">
                <Password
                    inputId="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    toggleMask
                    header={header}
                    footer={footer}
                    className="w-full"
                    pt={{
                        input: { className: 'w-full' },
                        iconField: { root: { className: 'w-full' } }
                    }}
                    tooltip={errors.newPassword}
                    tooltipOptions={{
                        position: 'right',
                        pt: {
                            text: { className: 'bg-red-600' }
                        }
                    }}
                    invalid={!!errors.newPassword}
                />
                <label htmlFor="newPassword">New Password</label>
            </FloatLabel>

            <FloatLabel>
                <Password
                    inputId="confirmPass"
                    name="confirmPass"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    toggleMask
                    feedback={false}
                    header={header}
                    footer={footer}
                    className="w-full"
                    pt={{
                        input: { className: 'w-full' },
                        iconField: { root: { className: 'w-full' } }
                    }}
                    tooltip={errors.confirmPass}
                    tooltipOptions={{
                        position: 'right',
                        pt: {
                            text: { className: 'bg-red-600' }
                        }
                    }}
                    invalid={!!errors.confirmPass}
                />
                <label htmlFor="confirmPass">Confirm Password</label>
            </FloatLabel>
            <div className="flex justify-content-center mt-5 align-self-stretch gap-3">
                <Button label="Resend Code" link className="p-0" onClick={() => navigate("/forgot-password")}></Button>
                <Button label="Submit" onClick={handleResetPass} loading={loading} disabled={!isValidForm}></Button>
            </div>
        </div>
    )
}

export default ResetPassword