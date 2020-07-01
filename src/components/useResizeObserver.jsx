import { useState, useEffect } from "react"
import ResizeObserver from "resize-observer-polyfill" //polyfill for browsers which dont support ResizeObserver

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null)

  useEffect(() => {
    const observeTarget = ref.current

    const resizeObserver = new ResizeObserver((entries) => {
      // console.log(entries)
      entries.forEach((entry) => {
        setDimensions(entry.contentRect)
      })
    })

    resizeObserver.observe(observeTarget)

    // Return a clean up function for this useEffect hook.
    // It will be called whenever the component that uses this resizeObserver hook gets removed or unmounted.
    return () => {
      resizeObserver.unobserve(observeTarget)
    }
  }, [ref])

  return dimensions
}

export default useResizeObserver
