import React from "react"

const FilterButton = ({ onClick, title, className, showSecondaryStyle }) => {
  return (
    <button
      className={className}
      onClick={onClick}
      style={{
        color: showSecondaryStyle ? "#94CEA5" : null,
        borderColor: showSecondaryStyle ? "#94CEA5" : null,
      }}
    >
      {title}
    </button>
  )
}

export default FilterButton
