/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "primereact/button"
import { FloatLabel } from "primereact/floatlabel"
import { InputOtp } from "primereact/inputotp"
import { InputText } from "primereact/inputtext"
import { FormEvent, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { ApiResponse } from "../../types/type"
import { callVerify } from "../../services/AuthService"
import { AxiosError } from "axios"

export const VerifyPage = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const MySwal = withReactContent(Swal)

    const [otp, setOtp] = useState<null | undefined | string | number>();
    const queryParams = new URLSearchParams(location.search);
    const [email, setEmail] = useState(queryParams.get('email')!)

    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault()

        try {
            fireLoading()
            const response: ApiResponse<any> = await callVerify({ email, otp })
            if (response.status === 'OK') {
                MySwal.fire({
                    title: 'Success',
                    text: 'Your account has been activated successfully.',
                    icon: 'success'
                }).then(() => {
                    navigate('/login');
                });
            } else {
                MySwal.fire({
                    title: 'Error',
                    text: response.message,
                    icon: 'error'
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse<any>>
            MySwal.close();
            MySwal.fire({
                title: 'Error',
                text: axiosError.response?.data.message,
                icon: 'error'
            });
        }
    }

    const fireLoading = () => {
        MySwal.fire({
            title: 'Please wait...',
            html: 'Verifying OTP...',
            allowOutsideClick: false,
            didOpen: () => {
              MySwal.showLoading()
            }
        })
    }

    return (
        <div className="flex flex-column align-items-center">
            <p className="font-bold text-xl mb-2">Verify Your Account</p>
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
            <InputOtp value={otp} onChange={(e) => setOtp(e.value)} length={6} integerOnly />
            <div className="flex justify-content-center mt-5 align-self-stretch gap-3">
                <Button label="Resend Code" link className="p-0"></Button>
                <Button label="Submit Code" disabled={!otp} onClick={handleVerifyOtp}></Button>
            </div>
        </div>
    )
}