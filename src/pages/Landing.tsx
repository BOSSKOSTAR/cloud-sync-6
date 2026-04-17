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

export default function Landing() {
  const [activeTab, setActiveTab] = useState<'mini' | 'minor' | 'major'>('mini')
  const [heroVisible, setHeroVisible] = useState(false)
  const [membersCount] = useState(1247)

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100)
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

      <LandingHero heroVisible={heroVisible} membersCount={membersCount} />
      <LandingHowItWorks tariffs={tariffs} />
      <LandingTariffs tariffs={tariffs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <LandingFooter />
    </div>
  )
}
