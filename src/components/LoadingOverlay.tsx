import React from "react"
import { ProgressSpinner } from "primereact/progressspinner"

type LoadingOverlayProps = {
  visible: boolean
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  if (!visible) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền đen mờ
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <ProgressSpinner style={{ width: "50px", height: "50px" }} />
    </div>
  )
}

export default LoadingOverlay
