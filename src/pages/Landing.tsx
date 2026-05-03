import { useState, useEffect } from 'react'
import LandingHero from '@/components/landing/LandingHero'
import LandingHowItWorks from '@/components/landing/LandingHowItWorks'
import LandingTariffs from '@/components/landing/LandingTariffs'
import LandingFooter from '@/components/landing/LandingFooter'

const tariffs = [
  {
    key: 'mini', name: 'Мини', price: 300,
    color: 'from-blue-500 to-blue-700', border: 'border-blue-500',
    glow: 'shadow-blue-500/20',
    nextTariff: { name: 'Минор', price: 6000 },
    levels: [
      { level: 1, payout: 300, slots: 2, autoBuy: null },
      { level: 2, payout: 600, slots: 2, autoBuy: null },
      { level: 3, payout: 1200, slots: 4, autoBuy: null },
      { level: 4, payout: 2400, slots: 4, autoBuy: null },
      { level: 5, payout: 4800, slots: 4, autoBuy: { name: 'Минор', price: 6000 } },
    ],
    total: 8700,
  },
  {
    key: 'minor', name: 'Минор', price: 6000,
    color: 'from-purple-500 to-purple-700', border: 'border-purple-500',
    glow: 'shadow-purple-500/20',
    nextTariff: { name: 'Мажор', price: 120000 },
    levels: [
      { level: 1, payout: 6000, slots: 2, autoBuy: null },
      { level: 2, payout: 12000, slots: 2, autoBuy: null },
      { level: 3, payout: 24000, slots: 4, autoBuy: null },
      { level: 4, payout: 48000, slots: 4, autoBuy: null },
      { level: 5, payout: 96000, slots: 4, autoBuy: { name: 'Мажор', price: 120000 } },
    ],
    total: 174000,
  },
  {
    key: 'major', name: 'Мажор', price: 120000,
    color: 'from-yellow-500 to-orange-600', border: 'border-yellow-500',
    glow: 'shadow-yellow-500/20',
    nextTariff: null,
    levels: [
      { level: 1, payout: 120000, slots: 2, autoBuy: null },
      { level: 2, payout: 240000, slots: 2, autoBuy: null },
      { level: 3, payout: 480000, slots: 4, autoBuy: null },
      { level: 4, payout: 960000, slots: 4, autoBuy: null },
      { level: 5, payout: 1920000, slots: 4, autoBuy: null },
    ],
    total: 5880000,
  },
]

const BALANCE_URL = 'https://functions.poehali.dev/4466c646-9adb-42c9-adf7-314bc4a3165d'

export default function Landing() {
  const [activeTab, setActiveTab] = useState<'mini' | 'minor' | 'major'>('mini')
  const [heroVisible, setHeroVisible] = useState(false)
  const [membersCount, setMembersCount] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100)
    fetch(BALANCE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_stats' })
    })
      .then(r => r.json())
      .then(data => {
        setMembersCount(data.users_count ?? 0)
        setTotalPaid(data.total_paid ?? 0)
      })
      .catch(() => {})
  }, [])

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

      <LandingHero heroVisible={heroVisible} membersCount={membersCount} totalPaid={totalPaid} />

      {/* Рекламный баннер */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/10 border border-white/10 group">
          <img
            src="https://cdn.poehali.dev/projects/37f6797b-2bcf-4239-aa52-cd5768175cd6/bucket/f197ae0a-3122-4fb0-b7f5-7971cd8e7c3d.png"
            alt="Плям про100 — зарабатывай приглашая друзей"
            className="w-full object-cover max-h-[420px] transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: 'center top' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050a18]/80 via-transparent to-[#050a18]/40 flex items-center px-10">
            <div className="max-w-sm">
              <div className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2">Начни прямо сейчас</div>
              <h2 className="text-3xl font-bold text-white leading-tight mb-3">
                Зарабатывай<br />приглашая друзей
              </h2>
              <p className="text-white/60 text-sm mb-5">От 300 ₽ до 5 880 000 ₽ — выбери свой уровень дохода</p>
              <button
                onClick={() => document.getElementById('tariffs')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Выбрать тариф
              </button>
              <a
                href="https://cdn.poehali.dev/projects/37f6797b-2bcf-4239-aa52-cd5768175cd6/bucket/f197ae0a-3122-4fb0-b7f5-7971cd8e7c3d.png"
                download="plyam-banner.png"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors text-xs"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Скачать баннер для рекламы
              </a>
            </div>
          </div>
        </div>
      </section>

      <LandingHowItWorks tariffs={tariffs} />
      <LandingTariffs tariffs={tariffs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <LandingFooter />
    </div>
  )
}