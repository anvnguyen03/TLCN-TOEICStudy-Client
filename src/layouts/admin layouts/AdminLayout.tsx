import { ReactNode, useRef } from "react"
import logo from "../../assets/Logo.svg"
import "./AdminLayout.css"
import { Button } from "primereact/button"
import { Menu } from "primereact/menu"
import { MenuItem } from "primereact/menuitem"
import { Avatar } from "primereact/avatar"
import { classNames } from "primereact/utils"
import { Ripple } from "primereact/ripple"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { logout } from "../../store/authSlice"

export const AdminLayout = ({ children, tabName }: { children: ReactNode, tabName: string }) => {

    const username = useAppSelector(state => state.auth.fullname)
    const profileMenuRef = useRef<Menu>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const itemRenderer = (item: MenuItem) => (

        <div className={`p-menuitem-content hover:bg-primary-100 ${tabName === item.label && 'bg-primary-100'}`}>
            <Link to={item.data} style={{textDecoration: 'none'}}>
                <a className="flex align-items-center p-menuitem-link">
                    <span className={item.icon} />
                    <span className="mx-2">{item.label}</span>
                    <Ripple />
                </a>
            </Link>
        </div>

    )
    const items: MenuItem[] = [
        {
            // command: () => {
            //     toast.current.show({ severity: 'info', summary: 'Info', detail: 'Item Selected', life: 3000 });
            // },
            template: (item, options) => {
                return (
                    <button onClick={(e) => profileMenuRef.current?.toggle(e)} className={classNames(options.className, 'w-full p-link flex align-items-center p-2 pl-4 text-color hover:bg-primary-100 border-noround')}>
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="mr-2" shape="circle" />
                        <div className="flex flex-column align">
                            <span className="font-bold">{username}</span>
                            <span className="text-sm">Admin</span>
                        </div>
                        <Ripple />
                    </button>
                );
            }
        },
        { separator: true },
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            data: '/admin/dashboard',
            template: itemRenderer
        },
        {
            label: 'Online Test',
            items: [
                {
                    label: 'Category',
                    icon: 'pi pi-book',
                    data: '/admin/test-category',
                    template: itemRenderer
                },
                {
                    label: 'Test',
                    icon: 'pi pi-graduation-cap',
                    url: '/admin/test',
                    data: '/admin/test',
                    template: itemRenderer
                }
            ]
        },
        {
            label: 'User',
            items: [
                {
                    label: 'Account',
                    icon: 'pi pi-user',
                    data: '/admin/user',
                    template: itemRenderer
                },
                {
                    label: 'Test Result',
                    icon: 'pi pi-check',
                    data: '/admin/user-result',
                    template: itemRenderer
                }
            ]
        }
    ]

    const handleLogout = () => {
        dispatch(logout())
        navigate('/home')
    }

    const itemsProfile: MenuItem[] = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Profile',
                    icon: 'pi pi-user'
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: handleLogout
                }
            ]
        }
    ]

    return (
        <div className="layout-container layout-topbar-purple layout-menu-light 
        layout-menu-profile-start layout-static"
        >
            <div className="layout-topbar">
                <div className="layout-topbar-start">
                    <a href="/admin/dashboard"><img src={logo} alt="bastion-300" /></a>
                </div>
                <div className="layout-topbar-end">
                    <div className="layout-topbar-actions-end">
                        <ul className="layout-topbar-items">
                            <li className="layout-topbar-search">
                                <input type="text" placeholder="Search" />
                                <i className="pi-fw pi pi-search"></i>
                            </li>
                            <li>
                                <a className="p-ripple">
                                    <Button icon="pi pi-bell" severity="secondary" />
                                </a>
                            </li>
                            <li>
                                <a className="p-ripple">
                                    <Button icon="pi pi-envelope" severity="secondary" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Menu model={itemsProfile} popup ref={profileMenuRef} style={{marginLeft: '15rem', marginTop: '-3rem'}}/>
            <div className="layout-sidebar">
                <Menu model={items} className="w-full h-full" />
            </div>

            <div className="layout-content-wrapper">
                {children}
            </div>

        </div>
    )
}