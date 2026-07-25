import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.1, rootMargin = '0px 0px -80px 0px') {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            { threshold, rootMargin }
        )

        const current = ref.current
        if (current) observer.observe(current)

        return () => {
            if (current) observer.unobserve(current)
        }
    }, [threshold, rootMargin])

    return [ref, isVisible]
}

export function useCountUp(target, duration = 2000, isActive = false) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!isActive) return
        let startTime = null
        let animationFrame

        function update(timestamp) {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(update)
            } else {
                setCount(target)
            }
        }

        animationFrame = requestAnimationFrame(update)
        return () => cancelAnimationFrame(animationFrame)
    }, [target, duration, isActive])

    return count
}
