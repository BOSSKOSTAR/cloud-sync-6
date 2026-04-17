import { useState, useEffect } from 'react'

const TARGET = new Date('2026-04-25T00:00:00')

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border border-yellow-600/30 text-2xl md:text-3xl font-black text-yellow-400"
        style={{ background: 'rgba(120,80,0,0.2)', backdropFilter: 'blur(8px)' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-white/30 text-xs uppercase tracking-widest">{label}</div>
    </div>
  )
}

export default function ComingSoon() {
  const [time, setTime] = useState(getTimeLeft())

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020d05 0%, #051a0a 50%, #020d05 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-yellow-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-yellow-600/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-yellow-600/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-yellow-600/5" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center text-2xl font-black text-green-900 mx-auto mb-8 shadow-lg shadow-yellow-600/20">
          П
        </div>

        <div className="text-yellow-400/60 text-sm font-medium tracking-widest uppercase mb-4">
          Скоро открытие
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          Плям про<span className="text-yellow-400">100</span>
        </h1>

        <p className="text-white/40 text-lg mb-8 leading-relaxed">
          Мы готовим кое-что интересное.<br />Совсем скоро откроем двери.
        </p>

        {/* Таймер */}
        <div className="flex items-start justify-center gap-3 md:gap-4 mb-8">
          <Digit value={time.days} label="дней" />
          <div className="text-yellow-600/40 text-3xl font-black mt-3">:</div>
          <Digit value={time.hours} label="часов" />
          <div className="text-yellow-600/40 text-3xl font-black mt-3">:</div>
          <Digit value={time.minutes} label="минут" />
          <div className="text-yellow-600/40 text-3xl font-black mt-3">:</div>
          <Digit value={time.seconds} label="секунд" />
        </div>

        <div className="inline-flex items-center gap-3 bg-yellow-600/10 border border-yellow-600/30 rounded-2xl px-6 py-3 mb-10">
          <div className="text-yellow-400/60 text-sm">Дата открытия</div>
          <div className="w-px h-4 bg-yellow-600/30" />
          <div className="text-yellow-400 text-base font-black">25 апреля 2026</div>
        </div>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent mx-auto" />
      </div>
    </div>
  )
}
