import { UserLayout } from "../layouts/user layouts/Userlayout"

const UnauthorizedAccess: React.FC = () => {
    return (
        <UserLayout>
            <div className="flex text-center justify-content-center align-items-center h-full">
                <h1>Unauthorized Access</h1>
            </div>
        </UserLayout>
    )
}

export default UnauthorizedAccess