import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface Level {
  level: number
  payout: number
  slots: number
  autoBuy: { name: string; price: number } | null
}

interface Tariff {
  key: string
  name: string
  price: number
  color: string
  border: string
  glow: string
  nextTariff: { name: string; price: number } | null
  levels: Level[]
  total: number
}

interface LandingTariffsProps {
  tariffs: Tariff[]
  activeTab: 'mini' | 'minor' | 'major'
  setActiveTab: (tab: 'mini' | 'minor' | 'major') => void
}

export default function LandingTariffs({ tariffs, activeTab, setActiveTab }: LandingTariffsProps) {
  const navigate = useNavigate()
  const activeTariff = tariffs.find(t => t.key === activeTab)!

  return (
    <section id="tariffs" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Выбери тариф</h2>
        <p className="text-white/50 text-center mb-10">Наглядная схема — как работает матрица на каждом уровне</p>

        <div className="flex justify-center gap-2 mb-8">
          {tariffs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as 'mini' | 'minor' | 'major')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${activeTab === t.key
                ? `bg-gradient-to-r ${t.color} text-white shadow-lg`
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className={`bg-white/5 border ${activeTariff.border} rounded-2xl p-6 md:p-10 shadow-2xl transition-all duration-300`}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-2xl font-bold">Тариф «{activeTariff.name}»</div>
              <div className="text-white/50">Вход: <span className="text-white font-semibold">{activeTariff.price.toLocaleString('ru')} ₽</span></div>
            </div>
            <div className="text-right">
              <div className="text-white/50 text-sm">Итоговый заработок</div>
              <div className="text-2xl font-bold text-green-400">{activeTariff.total.toLocaleString('ru')} ₽</div>
            </div>
          </div>

          {/* Matrix visual */}
          <div className="space-y-6">
            {activeTariff.levels.map((l, i) => {
              const isLast = i === activeTariff.levels.length - 1
              const slots = l.slots
              const payout = l.payout
              const autoBuy = l.autoBuy
              const netPayout = autoBuy ? (payout * slots) - autoBuy.price : payout * slots
              return (
                <div key={l.level} className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeTariff.color} flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg`}>
                      {l.level}
                    </div>
                    <div className="text-sm text-white/60">Матрица {l.level}</div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className="text-sm font-semibold text-green-400">
                      {autoBuy
                        ? <span>+{netPayout.toLocaleString('ru')} ₽ <span className="text-white/30 font-normal text-xs">чистыми</span></span>
                        : <span>+{(payout * slots).toLocaleString('ru')} ₽</span>
                      }
                    </div>
                  </div>

                  <div className="flex items-start justify-center gap-2 flex-wrap">
                    <div className="w-full flex justify-center mb-2">
                      <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${activeTariff.color} flex items-center justify-center font-bold text-sm shadow-xl border-2 border-white/20`}>
                        {payout.toLocaleString('ru')}
                        <div className="absolute -bottom-5 w-px h-5 bg-white/20 left-1/2" />
                      </div>
                    </div>

                    <div className="w-full flex justify-center gap-3 flex-wrap">
                      {Array.from({ length: slots }).map((_, si) => {
                        const isClone = si >= 1
                        return (
                          <div key={si} className="flex flex-col items-center gap-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-lg
                              ${isClone
                                ? 'bg-purple-900/60 border-purple-500/50 text-purple-300'
                                : 'bg-blue-900/60 border-blue-500/50 text-blue-200'
                              }`}>
                              {payout.toLocaleString('ru')}
                            </div>
                            <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                              ${isClone ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                              {isClone ? 'клон' : 'слот'}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="w-full flex justify-center gap-2 mt-2 flex-wrap">
                      <div className="bg-green-500/20 border border-green-500/30 text-green-300 text-xs px-3 py-1 rounded-full font-medium">
                        выплата {(payout * slots).toLocaleString('ru')} ₽
                      </div>
                      {!isLast && (
                        <div className="bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                          <Icon name="ArrowRight" size={10} />
                          переход в матрицу {l.level + 1}
                        </div>
                      )}
                      {slots > 1 && (
                        <div className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs px-3 py-1 rounded-full font-medium">
                          {slots - 1} {slots - 1 === 1 ? 'клон' : 'клона'}
                        </div>
                      )}
                    </div>

                    {autoBuy && (
                      <div className="w-full mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Icon name="ShoppingCart" size={14} className="text-yellow-400" />
                            <span className="text-yellow-300 text-xs font-medium">Автопокупка тарифа «{autoBuy.name}»</span>
                          </div>
                          <span className="text-red-400 text-xs font-semibold">−{autoBuy.price.toLocaleString('ru')} ₽</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                          <span className="text-white/50 text-xs">Чистая выплата на руки</span>
                          <span className="text-green-400 text-sm font-bold">+{netPayout.toLocaleString('ru')} ₽</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isLast && (
                    <div className="flex justify-center mt-3">
                      <Icon name="ChevronDown" size={20} className="text-white/20" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-4 text-center">
            <div className="text-green-300 text-sm mb-1">Чистый заработок за прохождение всех матриц</div>
            <div className="text-2xl font-bold text-green-400">{activeTariff.total.toLocaleString('ru')} ₽</div>
            {activeTariff.nextTariff && (
              <div className="text-yellow-400/70 text-xs mt-1 flex items-center justify-center gap-1">
                <Icon name="Info" size={11} />
                включает автопокупку тарифа «{activeTariff.nextTariff.name}» на 5-й матрице
              </div>
            )}
            <div className="text-white/40 text-xs mt-1">
              × 25 клонов = {(activeTariff.total * 25).toLocaleString('ru')} ₽ потенциально
            </div>
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
  )
}
