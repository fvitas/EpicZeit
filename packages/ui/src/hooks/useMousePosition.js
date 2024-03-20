import { useEffect, useLayoutEffect, useRef } from 'react'

function useMousePosition(callback) {
  const ref = useRef(null)
  const refCallback = useRef(callback)
  const isDragging = useRef(false)

  useLayoutEffect(() => {
    refCallback.current = callback
  })

  useEffect(() => {
    const element = ref.current

    const handleMouseMove = event => {
      if (!isDragging.current) {
        return
      }

      let { offsetX, offsetY } = event

      if (event.target === element && offsetX) {
        refCallback.current({ offsetX, offsetY })
        return
      }

      const elementRect = element.getBoundingClientRect()

      if (event.touches) {
        const touch = event.touches[0]
        offsetX = touch.clientX - elementRect.left
        offsetY = touch.clientY - elementRect.top
      } else {
        offsetX = event.clientX - elementRect.left
        offsetY = event.clientY - elementRect.top
      }

      refCallback.current({ offsetX, offsetY })
    }

    const handleMouseDown = () => {
      isDragging.current = true

      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('touchend', handleMouseUp)
      document.addEventListener('touchmove', handleMouseMove, { passive: true })
    }

    const handleMouseUp = event => {
      handleMouseMove(event)
      isDragging.current = false

      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchend', handleMouseUp)
      document.removeEventListener('touchmove', handleMouseMove)
    }

    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('touchstart', handleMouseDown)

    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('touchstart', handleMouseDown)
    }
  }, [])

  return [ref]
}

export default useMousePosition
