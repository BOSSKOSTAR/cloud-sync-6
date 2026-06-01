import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import AnimatedNumber from './AnimatedNumber'
import FloatingParticles from './FloatingParticles'

interface LandingHeroProps {
  heroVisible: boolean
  membersCount: number
  totalPaid: number
}

export default function LandingHero({ heroVisible, membersCount, totalPaid }: LandingHeroProps) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const pendingRef = localStorage.getItem('pending_ref')
  const toRegister = pendingRef ? `/register?ref=${pendingRef}` : '/register'
  const siteUrl = window.location.origin
  const shareText = 'Заходи в Плям про100 — зарабатывай приглашая друзей! Вход от 300 ₽'

  function handleCopy() {
    navigator.clipboard.writeText(siteUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050a18]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-xs font-bold">П</div>
            <span className="font-bold text-lg">Плям про<span className="text-blue-400">100</span></span>
          </div>
          <div className="flex items-center gap-3">
            {membersCount >= 10 && (
              <div className="hidden md:flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                {membersCount.toLocaleString('ru')} участников
              </div>
            )}
            <Button variant="ghost" className="text-white/80 hover:text-white" onClick={() => navigate('/login')}>
              Войти
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate(toRegister)}>
              Начать
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://cdn.poehali.dev/projects/37f6797b-2bcf-4239-aa52-cd5768175cd6/bucket/351e4084-810c-475e-8417-0b089c0788ab.jpg)' }} />
        <div className="absolute inset-0 bg-[#050a18]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a2a6c44_0%,_transparent_65%)]" />
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
              onClick={() => navigate(toRegister)}>
              <Icon name="Zap" size={16} className="mr-2" />
              Начать зарабатывать
            </Button>
            <Button size="lg" variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => document.getElementById('tariffs')?.scrollIntoView({ behavior: 'smooth' })}>
              Подробнее
            </Button>
          </div>

          {/* Видео */}
          <div className={`mt-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '450ms' }}>
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://vk.com/video_ext.php?oid=-134540866&id=456239020&hd=2&autoplay=0"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          </div>

          {/* Поделиться */}
          <div className={`flex flex-wrap items-center justify-center gap-2 mt-6 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '500ms' }}>
            <span className="text-white/30 text-xs">Поделиться:</span>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-colors text-xs px-3 py-1.5 rounded-full font-medium"
            >
              <Icon name="Send" size={12} /> Telegram
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + siteUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 transition-colors text-xs px-3 py-1.5 rounded-full font-medium"
            >
              <Icon name="MessageCircle" size={12} /> WhatsApp
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-white/5 border border-white/15 text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors text-xs px-3 py-1.5 rounded-full font-medium"
            >
              <Icon name={copied ? 'Check' : 'Link'} size={12} />
              {copied ? 'Скопировано!' : 'Копировать ссылку'}
            </button>
          </div>

          <div className="relative flex justify-center mt-6">
            <div className="absolute w-4 h-4 rounded-full bg-blue-400/40" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
            <div className="absolute w-4 h-4 rounded-full bg-blue-400/40" style={{ animation: 'pulse-ring 2s ease-out 0.7s infinite' }} />
          </div>
        </div>
      </section>

      {/* Live counter */}
      {membersCount >= 10 && (
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
      )}

      {/* Stats */}
      <section className="py-12 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Тарифов', value: 3, suffix: '' },
            { label: 'Уровней матрицы', value: 5, suffix: '' },
            ...(totalPaid > 0 ? [{ label: 'Выплачено', value: totalPaid, suffix: ' ₽' }] : []),
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
    </>
  )
}