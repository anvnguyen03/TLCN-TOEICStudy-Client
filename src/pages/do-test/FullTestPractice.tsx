import React from "react"
import "./FullTestPractice.css"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import usePreventNavigation from "../../components/usePreventNavigation"

const FullTestPractice: React.FC = () => {

    usePreventNavigation()

    return (
        <UserLayout>
            Practice test
        </UserLayout>
    )
}

export default FullTestPractice