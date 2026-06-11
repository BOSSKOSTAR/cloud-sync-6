import { useState, useEffect, useRef } from 'react'

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useSlotCount(target: number, duration = 2200, start = false) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start || target === 0) return
    let frame: number
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (progress < 0.7) {
        // фаза "рулетки" — быстро мелькают случайные числа вблизи target
        const randomOffset = Math.random() * target * 0.4
        setValue(Math.floor(target * 0.6 + randomOffset))
      } else {
        // фаза "торможения" — плавно приближаемся к target
        const slowProgress = (progress - 0.7) / 0.3
        const eased = 1 - Math.pow(1 - slowProgress, 4)
        setValue(Math.floor(target * (0.6 + eased * 0.4)))
      }

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, target, duration])

  return value
}

export default function AnimatedNumber({ value, suffix = '', duration = 2200 }: { value: number; suffix?: string; duration?: number }) {
  const { ref, inView } = useInView()
  const count = useSlotCount(value, duration, inView)
  return <span ref={ref}>{count.toLocaleString('ru')}{suffix}</span>
}
