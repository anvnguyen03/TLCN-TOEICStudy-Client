import { useEffect, useState } from "react"
import { DisplayTestItemDTO, ETestItemType } from "../types/type"
import { callGetDisplayTestItems } from "../services/TestService"
import { PART_1_DIRECTIONS, PART_2_DIRECTIONS, PART_3_DIRECTIONS, PART_4_DIRECTIONS, PART_5_DIRECTIONS, PART_6_DIRECTIONS, PART_7_DIRECTIONS } from "../constant/StaticPartDirections"

export const useTestItem = (testId: number) => {
    const [displayTestItemDTO, setDisplayTestItemDTO] = useState<DisplayTestItemDTO[]>([])

    const SetPartDirections = () => {
        const updatedDisplayTestItems = displayTestItemDTO
            .filter(item => item.type === ETestItemType.PART)
            .map(item => {
                switch (item.part?.partNum) {
                    case 1:
                        return { ...item, part: { ...item.part, content: PART_1_DIRECTIONS } }
                    case 2:
                        return { ...item, part: { ...item.part, content: PART_2_DIRECTIONS } }
                    case 3:
                        return { ...item, part: { ...item.part, content: PART_3_DIRECTIONS } }
                    case 4:
                        return { ...item, part: { ...item.part, content: PART_4_DIRECTIONS } }
                    case 5:
                        return { ...item, part: { ...item.part, content: PART_5_DIRECTIONS } }
                    case 6:
                        return { ...item, part: { ...item.part, content: PART_6_DIRECTIONS } }
                    case 7:
                        return { ...item, part: { ...item.part, content: PART_7_DIRECTIONS } }
                    default:
                        return item
                }
            })

        setDisplayTestItemDTO(updatedDisplayTestItems)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await callGetDisplayTestItems(testId)
                setDisplayTestItemDTO(responseData.data)
                // SetPartDirections()
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [testId])

    return displayTestItemDTO
}