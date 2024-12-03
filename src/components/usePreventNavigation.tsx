import { useEffect } from "react"

const usePreventNavigation = () => {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        window.addEventListener('close', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            window.removeEventListener('close', handleBeforeUnload)
        }
    }, [])
}

export default usePreventNavigation