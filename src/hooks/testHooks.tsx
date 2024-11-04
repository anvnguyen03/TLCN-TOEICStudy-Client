import { useEffect, useState } from "react"
import { DisplayTestItemDTO } from "../types/type"
import { callGetDisplayTestItems } from "../services/TestService"

export const useTestItem = (testId: number) => {
    const [displayTestItemDTO, setDisplayTestItemDTO] = useState<DisplayTestItemDTO[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await callGetDisplayTestItems(testId)
                setDisplayTestItemDTO(responseData.data)
            } catch (error) {   
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [testId])

    return displayTestItemDTO
}