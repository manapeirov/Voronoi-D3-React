import React from "react"

const KpiToggleButton = ({ onClick, title, className, showSecondaryStyle }) => {
  return (
    <button
      className={className}
      onClick={onClick}
      style={{
        color: showSecondaryStyle ? "#FFFFFF" : null,
        backgroundColor: showSecondaryStyle ? "#94CEA5" : "transparent",
        width: showSecondaryStyle ? "27%" : `${73 / 3}%`,
      }}
    >
      {title}
    </button>
  )
}

export default KpiToggleButton
