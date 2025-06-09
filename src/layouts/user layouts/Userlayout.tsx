import React, { ReactNode } from "react"
import AvatarHeader from "./avatar"
import { Button } from "primereact/button"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../hooks/reduxHooks"
import { Divider } from "primereact/divider"
import logo from "../../assets/Logo.svg"

export const UserLayout = ({ children }: { children: ReactNode }) => {

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
    const navigate = useNavigate()

    // Logo
    const Logo = () => (
        <a href="/home"><img
            src={logo}
            alt="bastion-300"
            height="40"
            className="mr-0 lg:mr-6"
        /></a>
    )

    // Menu Button (for small screens)
    const MenuButton = () => (
        <a className="p-ripple cursor-pointer block lg:hidden text-gray-400 z-5">
            <i className="pi pi-bars text-4xl"></i>
        </a>
    )

    // Menu Items
    const MenuItems = () => (
        <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row z-5">
            <MenuItem icon="fa-solid fa-house" label="Trang chủ" url="/home" />
            <MenuItem icon="fa-solid fa-graduation-cap" label="Đề thi online" url="/tests" />
            <MenuItem icon="fa-solid fa-book" label="Khóa học" url="/courses" />
        </ul>
    )

    // Generic Menu Item Component
    const MenuItem: React.FC<{ icon: string; label: string; url: string }> = ({ icon, label, url }) => (
        <li>
            <a href={url} style={{ textDecoration: "none" }} className="p-ripple flex px-6 p-3 lg:px-3 lg:py-2 align-items-center text-white hover:text-primary hover:bg-white font-medium border-round cursor-pointer transition-colors transition-duration-150 w-full z-5">
                <i className={`${icon} mr-2`}></i>
                <span>{label}</span>
            </a>
        </li>
    )

    const hanldeLoginClick = () => {
        navigate('/login', {
            state: { from: window.location.pathname }
        })
    }

    // User Avatar & Info
    const UserAvatar = () => (
        <div className="flex align-items-center gap-2">
            {
                isAuthenticated ? <AvatarHeader /> : <Button label='Đăng nhập' rounded severity="secondary" onClick={() => hanldeLoginClick()} />
            }
        </div>
    )

    const TopBar = (): JSX.Element => (
        <div
            id="topbar"
            className="fixed top-0 right-0 left-0 py-3 px-6 shadow-2 flex align-items-center justify-content-between border-bottom-1 z-5 opacity-90"
            style={{ minHeight: '60px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderBottom: '1px solid #00f2fe',
            }}
        >
            <Logo />
            <MenuButton />
            <div className="align-items-center flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 top-100 z-5 shadow-2 lg:shadow-none border-1 lg:border-none pb">
                <MenuItems />
                <div className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row">
                    <li className="border-top-1 border-gray-800 lg:border-top-none">
                        <UserAvatar />
                    </li>
                </div>
            </div>
        </div>
    )

    const Footer = (): JSX.Element => (
        <div id="footer" className="surface-section px-4 py-6 md:px-6 lg:px-8 text-center">
            <img src={logo} alt="Image" height="50" />
            <div className="font-medium text-900 mt-4 mb-3">© 2024 TOEIC Study, Inc</div>
            <p className="text-600 line-height-3 mt-0 mb-4">Cursus metus aliquam eleifend mi.
                Malesuada pellentesque elit eget gravida.
                Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum.
                Massa tincidunt dui ut ornare lectus sit amet est placerat.</p>
            <div className="flex align-items-center justify-content-center">
                <a className="cursor-pointer text-700 mr-5">
                    <i className="pi pi-twitter"></i></a>
                <a className="cursor-pointer text-700 mr-5">
                    <i className="pi pi-facebook"></i></a>
                <a className="cursor-pointer text-700">
                    <i className="pi pi-github"></i>
                </a></div>
        </div>
    )

    return (
        <React.Fragment>
            <TopBar />
            <div className="min-h-screen mt-8">
                {children}
            </div>
            <Divider />
            <Footer />
        </React.Fragment>
    )
}