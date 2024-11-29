import { Link } from "react-router-dom"
import { useAppSelector } from "../../hooks/reduxHooks"
import { UserLayout } from "../../layouts/user layouts/Userlayout"

const HomePage = () => {

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
    const fullname = useAppSelector(state => state.auth.fullname)

    return (
        <UserLayout>
            <div className="surface-200">
            { isAuthenticated &&
                <div className="bg-bluegray-900 text-gray-100 p-3 flex justify-content-between 
                lg:justify-content-center align-items-center flex-wrap">
                <div className="font-bold mr-4">🔥 Welcome back!</div>
                <div className="align-items-center hidden lg:flex">
                    <span className="line-height-3">{fullname}</span>
                </div>
                
            </div>
            }
            <p>daaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
            <Link to={"/test/4/Practice-Test/exam-simulation/start"}>Start</Link>
            </div>
        </UserLayout>
    )
}

export default HomePage