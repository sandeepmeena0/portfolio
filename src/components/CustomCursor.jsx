import { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
    const dotRef = useRef(null)
    const outlineRef = useRef(null)
    const mousePos = useRef({ x: 0, y: 0 })
    const outlinePos = useRef({ x: 0, y: 0 })

    useEffect(() => {
        // Hide on touch devices
        if ('ontouchstart' in window) return

        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
            if (dotRef.current) {
                dotRef.current.style.left = e.clientX - 4 + 'px'
                dotRef.current.style.top = e.clientY - 4 + 'px'
            }
        }

        const animate = () => {
            outlinePos.current.x += (mousePos.current.x - outlinePos.current.x) * 0.15
            outlinePos.current.y += (mousePos.current.y - outlinePos.current.y) * 0.15
            if (outlineRef.current) {
                outlineRef.current.style.left = outlinePos.current.x - 18 + 'px'
                outlineRef.current.style.top = outlinePos.current.y - 18 + 'px'
            }
            requestAnimationFrame(animate)
        }

        const handleMouseEnterInteractive = () => {
            outlineRef.current?.classList.add('cursor-hover')
        }
        const handleMouseLeaveInteractive = () => {
            outlineRef.current?.classList.remove('cursor-hover')
        }

        document.addEventListener('mousemove', handleMouseMove)
        const frameId = requestAnimationFrame(animate)

        // Observe for interactive elements
        const observer = new MutationObserver(() => {
            document.querySelectorAll('a, button, .project-card, .skill-item, .filter-btn').forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnterInteractive)
                el.removeEventListener('mouseleave', handleMouseLeaveInteractive)
                el.addEventListener('mouseenter', handleMouseEnterInteractive)
                el.addEventListener('mouseleave', handleMouseLeaveInteractive)
            })
        })
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(frameId)
            observer.disconnect()
        }
    }, [])

    if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

    return (
        <>
            <div className="cursor-dot" ref={dotRef}></div>
            <div className="cursor-outline" ref={outlineRef}></div>
        </>
    )
}
