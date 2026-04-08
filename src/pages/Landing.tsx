import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return value
}

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

function AnimatedNumber({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const { ref, inView } = useInView()
  const count = useCountUp(value, duration, inView)
  return <span ref={ref}>{count.toLocaleString('ru')}{suffix}</span>
}

function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 8,
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-blue-400/30"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'mini' | 'minor' | 'major'>('mini')
  const [heroVisible, setHeroVisible] = useState(false)
  const [membersCount] = useState(1247)

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100)
  }, [])

  const tariffs = [
    {
      key: 'mini', name: 'Мини', price: 300,
      color: 'from-blue-500 to-blue-700', border: 'border-blue-500',
      glow: 'shadow-blue-500/20',
      levels: [
        { level: 1, payout: 300, slots: 2 },
        { level: 2, payout: 600, slots: 2 },
        { level: 3, payout: 1200, slots: 4 },
        { level: 4, payout: 2400, slots: 4 },
        { level: 5, payout: 4800, slots: 4 },
      ],
      total: 14700,
    },
    {
      key: 'minor', name: 'Минор', price: 6000,
      color: 'from-purple-500 to-purple-700', border: 'border-purple-500',
      glow: 'shadow-purple-500/20',
      levels: [
        { level: 1, payout: 6000, slots: 2 },
        { level: 2, payout: 12000, slots: 2 },
        { level: 3, payout: 24000, slots: 4 },
        { level: 4, payout: 48000, slots: 4 },
        { level: 5, payout: 96000, slots: 4 },
      ],
      total: 294000,
    },
    {
      key: 'major', name: 'Мажор', price: 120000,
      color: 'from-yellow-500 to-orange-600', border: 'border-yellow-500',
      glow: 'shadow-yellow-500/20',
      levels: [
        { level: 1, payout: 120000, slots: 2 },
        { level: 2, payout: 240000, slots: 2 },
        { level: 3, payout: 480000, slots: 4 },
        { level: 4, payout: 960000, slots: 4 },
        { level: 5, payout: 1920000, slots: 4 },
      ],
      total: 5880000,
    },
  ]

  const activeTariff = tariffs.find(t => t.key === activeTab)!

  return (
    <div className="min-h-screen bg-[#050a18] text-white overflow-x-hidden">
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          33% { transform: translateY(-30px) translateX(10px); opacity: 0.8; }
          66% { transform: translateY(-15px) translateX(-10px); opacity: 0.5; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-slide-up { animation: slide-up 0.7s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .shimmer-text {
          background: linear-gradient(90deg, #60a5fa, #a78bfa, #34d399, #60a5fa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050a18]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-xs font-bold">П</div>
            <span className="font-bold text-lg">Плям про<span className="text-blue-400">100</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              {membersCount.toLocaleString('ru')} участников
            </div>
            <Button variant="ghost" className="text-white/80 hover:text-white" onClick={() => navigate('/login')}>
              Войти
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/register')}>
              Начать
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a2a6c44_0%,_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_#7c3aed22_0%,_transparent_50%)]" />
        <FloatingParticles />

        <div className="relative max-w-3xl mx-auto">
          <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-6">
              <Icon name="Rocket" size={14} />
              Матричная система заработка
            </div>
          </div>

          <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Плям про<span className="shimmer-text">100</span>
          </h1>

          <p className={`text-xl text-white/60 mb-4 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '200ms' }}>
            Зарабатывай приглашая друзей. Три тарифа — три уровня дохода.
          </p>

          <p className={`text-white/40 mb-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '300ms' }}>
            Вход от <span className="text-white font-semibold">300 ₽</span> · Заработок до <span className="text-yellow-400 font-semibold">5 880 000 ₽</span>
          </p>

          <div className={`flex gap-4 justify-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '400ms' }}>
            <Button size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
              onClick={() => navigate('/register')}>
              <Icon name="Zap" size={16} className="mr-2" />
              Начать зарабатывать
            </Button>
            <Button size="lg" variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => document.getElementById('tariffs')?.scrollIntoView({ behavior: 'smooth' })}>
              Подробнее
            </Button>
          </div>

          {/* Pulse rings under button */}
          <div className="relative flex justify-center mt-6">
            <div className="absolute w-4 h-4 rounded-full bg-blue-400/40" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
            <div className="absolute w-4 h-4 rounded-full bg-blue-400/40" style={{ animation: 'pulse-ring 2s ease-out 0.7s infinite' }} />
          </div>
        </div>
      </section>

      {/* Live counter */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="text-green-400 text-sm font-medium">Онлайн сейчас</span>
            </div>
            <div className="text-4xl font-bold mb-1">
              <AnimatedNumber value={membersCount} /> <span className="text-blue-400">участников</span>
            </div>
            <p className="text-white/40 text-sm">уже зарабатывают в системе Плям про100</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Тарифов', value: 3, suffix: '' },
            { label: 'Уровней матрицы', value: 5, suffix: '' },
            { label: 'Выплачено', value: 4800000, suffix: ' ₽' },
            { label: 'Макс. заработок', value: 5880000, suffix: ' ₽' },
          ].map(s => (
            <div key={s.label} className="card-hover bg-white/3 rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-bold text-blue-400">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Как это работает</h2>
          <p className="text-white/40 text-center mb-12">Три простых шага до первого заработка</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: 'UserPlus', title: '1. Регистрируйся', desc: 'Создай аккаунт и пополни баланс. Вход от 300 ₽.', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', iconColor: 'text-blue-400', glow: 'bg-blue-600/20' },
              { icon: 'Share2', title: '2. Приглашай', desc: 'Делись своей реферальной ссылкой с друзьями и знакомыми.', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', iconColor: 'text-purple-400', glow: 'bg-purple-600/20' },
              { icon: 'TrendingUp', title: '3. Зарабатывай', desc: 'Получай выплаты на баланс за каждого участника в матрице.', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', iconColor: 'text-green-400', glow: 'bg-green-600/20' },
            ].map((s, i) => (
              <div key={i} className={`card-hover bg-gradient-to-b ${s.color} border ${s.border} rounded-2xl p-6 text-center`}>
                <div className={`w-14 h-14 rounded-2xl ${s.glow} flex items-center justify-center mx-auto mb-4`}>
                  <Icon name={s.icon} size={26} className={s.iconColor} />
                </div>
                <h3 className="font-semibold mb-2 text-lg">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income showcase */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Реальные цифры</h2>
          <p className="text-white/40 text-center mb-10">Сколько можно заработать на каждом тарифе</p>
          <div className="grid md:grid-cols-3 gap-6">
            {tariffs.map((t, i) => (
              <div key={t.key}
                className={`card-hover bg-gradient-to-b from-white/5 to-transparent border ${t.border} rounded-2xl p-6 shadow-xl ${t.glow}`}
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${t.color} mb-4`}>
                  {t.name}
                </div>
                <div className="text-white/50 text-sm mb-1">Вход</div>
                <div className="text-xl font-bold mb-4">{t.price.toLocaleString('ru')} ₽</div>
                <div className="text-white/50 text-sm mb-1">Заработок</div>
                <div className="text-3xl font-bold text-green-400 mb-4">
                  <AnimatedNumber value={t.total} suffix=" ₽" duration={2500} />
                </div>
                <div className="space-y-1.5">
                  {t.levels.map(l => (
                    <div key={l.level} className="flex justify-between text-sm">
                      <span className="text-white/40">Матрица {l.level}</span>
                      <span className="text-white/80 font-medium">+{(l.payout * l.slots).toLocaleString('ru')} ₽</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tariffs detail */}
      <section id="tariffs" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Выбери тариф</h2>
          <p className="text-white/50 text-center mb-10">Подробная схема матрицы по каждому тарифу</p>

          <div className="flex justify-center gap-2 mb-8">
            {tariffs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as 'mini' | 'minor' | 'major')}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${activeTab === t.key
                  ? `bg-gradient-to-r ${t.color} text-white shadow-lg`
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className={`bg-white/5 border ${activeTariff.border} rounded-2xl p-8 shadow-2xl ${activeTariff.glow} transition-all duration-300`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold">Тариф «{activeTariff.name}»</div>
                <div className="text-white/50">Вход: {activeTariff.price.toLocaleString('ru')} ₽</div>
              </div>
              <div className="text-right">
                <div className="text-white/50 text-sm">Итоговый заработок</div>
                <div className="text-2xl font-bold text-green-400">{activeTariff.total.toLocaleString('ru')} ₽</div>
              </div>
            </div>

            <div className="space-y-3">
              {activeTariff.levels.map((l, i) => (
                <div key={l.level}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/8 rounded-xl px-4 py-3 transition-all"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${activeTariff.color} flex items-center justify-center text-xs font-bold`}>{l.level}</div>
                    <span className="text-white/70">Матрица {l.level}</span>
                    <span className="text-white/40 text-sm">{l.slots} слота</span>
                  </div>
                  <div className="font-semibold text-green-400">+{(l.payout * l.slots).toLocaleString('ru')} ₽</div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className={`w-full mt-6 bg-gradient-to-r ${activeTariff.color} hover:opacity-90 text-white shadow-lg transition-all`}
              onClick={() => navigate('/register')}
            >
              <Icon name="Zap" size={16} className="mr-2" />
              Начать с тарифа «{activeTariff.name}»
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-b from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#3b82f620_0%,_transparent_70%)]" />
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold mb-4">Готов начать?</h2>
              <p className="text-white/50 mb-8">Регистрация бесплатна. Вход в матрицу от 300 ₽.</p>
              <Button size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
                onClick={() => navigate('/register')}>
                Зарегистрироваться бесплатно
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center text-white/30 text-sm">
        © 2026 Плям про100 · Матричная система заработка
      </footer>
    </div>
  )
}
