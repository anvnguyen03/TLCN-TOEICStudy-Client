import React, { useEffect, useRef, useState } from "react"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import { Toast } from "primereact/toast"
import { useAppSelector } from "../../hooks/reduxHooks"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import axios from "axios"
import { callUpdateInfo } from "../../services/UserService"
import { Dialog } from "primereact/dialog"
import { Password } from "primereact/password"
import { FloatLabel } from "primereact/floatlabel"
import { Divider } from "primereact/divider"
import { callChangePassword } from "../../services/AccountService"

const Profile: React.FC = () => {

    const toast = useRef<Toast>(null)
    const auth = useAppSelector(state => state.auth)
    const [fullname, setFullname] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [visible, setVisible] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [cPassword, setCPassword] = useState<string>('')
    const [errors, setErrors] = useState<Partial<{ password: string, newPassword: string, cPassword: string }>>({})

    useEffect(() => {
        if (auth.fullname) {
            setFullname(auth.fullname)
        }
    }, [auth.fullname])

    useEffect(() => {
        const validateForm = () => {
            const newErrors: Partial<{ password: string, newPassword: string, cPassword: string }> = {}
    
            // regex for minimum 6 characters, contain at least one letter and one number
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
            if (!newPassword.trim()) {
                newErrors.newPassword = 'New password is required'
            } else if (!passwordRegex.test(newPassword)) {
                newErrors.newPassword = 'Minimum 6 characters, at least 1 letter and 1 number'
            }
    
            if (!cPassword.trim()) {
                newErrors.cPassword = 'Confirm Password is required'
            } else if (cPassword !== newPassword) {
                newErrors.cPassword = 'Passwords do not match'
            }
    
            setErrors(newErrors)
        }
        validateForm()
    }, [cPassword, newPassword])

    const handleUpdateInfo = async () => {
        try {
            setLoading(true)
            if (fullname === auth.fullname || fullname === '' || !fullname.trim()) {
                return
            }
            await callUpdateInfo(fullname)
            toast.current?.show({ severity: 'success', detail: 'Info updated' })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.current?.show({ severity: 'error', detail: error.response?.data.message })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async () => {
        try {
            setLoading(true)
            await callChangePassword(password, newPassword)
            setPassword('')
            setNewPassword('')
            setCPassword('')
            setVisible(false)
            toast.current?.show({ severity: 'success', detail: 'Password has been changed' })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.current?.show({ severity: 'error', detail: error.response?.data.message })
            }
        } finally {
            setLoading(false)
        }
    }

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


    return (
        <UserLayout>
            <Toast ref={toast} />
            <Dialog visible={visible} modal header={<div className="text-center">Đổi mật khẩu</div>} style={{ width: '30rem' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                <p className="m-0">
                    <FloatLabel className="my-5">
                        <Password
                            inputId="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            toggleMask
                            feedback={false}
                            className="w-full"
                            pt={{
                                input: { className: 'w-full' },
                                iconField: { root: { className: 'w-full' } }
                            }}
                            invalid={!!errors.password}
                            disabled={loading}
                        />
                        <label htmlFor="cpassword">Password</label>
                    </FloatLabel>

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
                            disabled={loading}
                        />
                        <label htmlFor="password">New Password</label>
                    </FloatLabel>

                    <FloatLabel className="my-5">
                        <Password
                            inputId="cpassword"
                            name="cpassword"
                            value={cPassword}
                            onChange={(e) => setCPassword(e.target.value)}
                            toggleMask
                            feedback={false}
                            className="w-full"
                            pt={{
                                input: { className: 'w-full' },
                                iconField: { root: { className: 'w-full' } }
                            }}
                            tooltip={errors.cPassword}
                            tooltipOptions={{
                                position: 'right',
                                pt: {
                                    text: { className: 'bg-red-600' }
                                }
                            }}
                            invalid={!!errors.cPassword}
                            disabled={loading}
                        />
                        <label htmlFor="cpassword">Confirm Password</label>
                    </FloatLabel>
                    <div className="flex justify-content-center">
                        <Button label="Xác nhận" onClick={handleChangePassword} loading={loading} />
                    </div>
                </p>
            </Dialog>
            <h2 className="font-bold text-center text-primary p-5">Thông tin cá nhân</h2>
            <div className="flex w-full justify-content-center">
                <div className="contentblock w-6 ">
                    <div className="flex gap-2">
                        <b>Tài khoản: </b>
                        <div className="text-green-400 font-semibold">{auth.role}</div>
                    </div>

                    <div className="flex flex-column gap-2 my-4">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-envelope"></i>
                            </span>
                            <InputText placeholder="Email" disabled value={auth.email} />
                        </div>
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText placeholder="Username" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex justify-content-between">
                        <Button label="Đổi mật khẩu" text rounded severity="help" loading={loading} onClick={() => setVisible(true)} />
                        <Button label="Cập nhật" text rounded severity="info" loading={loading} onClick={handleUpdateInfo} />
                    </div>

                </div>
            </div>
        </UserLayout>
    )
}

export default Profile