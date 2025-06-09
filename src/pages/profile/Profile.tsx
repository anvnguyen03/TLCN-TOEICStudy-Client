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
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '40px 0'
            }}>
                <div style={{
                    position: 'relative',
                    background: '#fff',
                    borderRadius: '32px',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    width: '100%',
                    maxWidth: 480,
                    padding: '56px 32px 32px 32px',
                    textAlign: 'center',
                    marginTop: 60
                }}>
                    <div style={{
                        position: 'absolute',
                        top: -60,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '6px solid #fff',
                        zIndex: 2
                    }}>
                        <i className="pi pi-user" style={{ fontSize: 64, color: '#4facfe' }} />
                    </div>
                    <h2 style={{ fontWeight: 700, marginTop: 70, marginBottom: 8 }}>{fullname || 'Chưa đặt tên'}</h2>
                    <div style={{ color: '#888', fontSize: 16, marginBottom: 8 }}>{auth.email}</div>
                    <div style={{ color: '#aaa', fontSize: 15, marginBottom: 24 }}>{auth.role}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                        <Button label="Đổi mật khẩu" icon="pi pi-key" text rounded severity="help" loading={loading} onClick={() => setVisible(true)} style={{ fontWeight: 600 }} />
                        <Button label="Cập nhật tên" icon="pi pi-save" text rounded severity="info" loading={loading} onClick={handleUpdateInfo} style={{ fontWeight: 600 }} />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <InputText placeholder="Tên hiển thị" value={fullname} onChange={(e) => setFullname(e.target.value)} style={{ width: '100%', maxWidth: 320, textAlign: 'center' }} />
                    </div>
                    <button style={{
                        background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 24,
                        padding: '12px 36px',
                        fontWeight: 600,
                        fontSize: 18,
                        boxShadow: '0 2px 8px 0 rgba(79,172,254,0.10)',
                        cursor: 'pointer',
                        marginTop: 8,
                        transition: 'filter 0.2s',
                    }}
                        onClick={() => toast.current?.show({ severity: 'info', detail: 'Chức năng sắp ra mắt!' })}
                        onMouseOver={e => (e.currentTarget.style.filter = 'brightness(0.95)')}
                        onMouseOut={e => (e.currentTarget.style.filter = 'none')}
                    >
                        Show more
                    </button>
                </div>
            </div>
        </UserLayout>
    )
}

export default Profile