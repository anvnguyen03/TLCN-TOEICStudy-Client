import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react"

const DurationCountdown = forwardRef<
    { getTimeLeft: () => number; stopTimer: () => void }, // Các hành động mà component cha có thể gọi
    { duration: number; onTimeUp: () => void }
>(({ duration, onTimeUp }, ref) => {
    const [timeLeftInSecond, setTimeLeftInSecond] = useState<number>(duration * 60)
    const timerId = useRef<number | null>(null); // Lưu trữ id của interval

    const stopTimer = () => {
        if (timerId.current !== null) {
            clearInterval(timerId.current); // Xóa interval hiện tại
            timerId.current = null; // Reset timerId
        }
    }

    // Sử dụng useImperativeHandle để truyền các hành động cho component cha
    useImperativeHandle(ref, () => ({
        getTimeLeft: () => timeLeftInSecond, // Lấy thời gian còn lại
        stopTimer,
    }))

    useEffect(() => {
        if (timeLeftInSecond <= 0) {
            onTimeUp()
            return
        }

        timerId.current = window.setInterval(() => {
            setTimeLeftInSecond((prevTime) => prevTime - 1)
        }, 1000) // 1000ms

        return () => {
            if (timerId.current !== null) {
                clearInterval(timerId.current); // Xóa timer khi component unmount
            }
        }
    }, [onTimeUp, timeLeftInSecond])

    const minutes = Math.floor(timeLeftInSecond / 60)
    const seconds = timeLeftInSecond % 60

    const bgColorClass = timeLeftInSecond <= 300 ? "bg-red-500" : "bg-gray-300" // 5 phút

    return (
        <div className="text-center flex-1 align-items-center justify-content-center">
            <h5 className={`px-3 inline py-3 ${bgColorClass} border-round-md`}>
                {minutes} phút {seconds < 10 ? `0${seconds}` : seconds} giây
            </h5>
        </div>
    )
})

// React.memo chỉ re-render khi props truyền vào từ Component cha thay đổi
export default React.memo(DurationCountdown)

