import { Avatar } from "primereact/avatar"
import { MenuItem } from "primereact/menuitem"
import { Menu } from 'primereact/menu'
import { useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { logout } from "../../store/authSlice"


const AvatarHeader: React.FC = () => {

    const fullname = useAppSelector(state => state.auth.fullname)
    const menuAvatar = useRef<Menu>(null)
    const dispatch = useAppDispatch()

    const handleLogout = () => {
        dispatch(logout())
        window.location.reload()
    }

    const items: MenuItem[] = [
        {
            label: `Hello ${fullname?.split('@')[0]}`,
            items: [
                {
                    label: 'Profile',
                    icon: 'pi pi-user',
                    url: '/profile'
                },
                {
                    label: 'Test history',
                    icon: 'pi pi-history',
                    url: '/test-history'
                },
                {
                    label: 'My learning',
                    icon: 'pi pi-book',
                    url: '/my-learning'
                },
                {
                    label: 'Log out',
                    icon: 'pi pi-sign-out',
                    command: handleLogout
                }
            ]
        }
    ]

    return (
        <div className="card flex justify-content-center">
            <Menu model={items} popup ref={menuAvatar} id="popup_menu_right" popupAlignment="right" />
            <Avatar 
                image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" 
                shape="circle" 
                onClick={(e) => menuAvatar.current?.toggle(e)}
                aria-controls="popup_menu_right" aria-haspopup />
        </div>
    )
}

export default AvatarHeader;