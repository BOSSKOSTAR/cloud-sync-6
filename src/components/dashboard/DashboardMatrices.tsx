import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface Matrix {
  id: number
  tariff_name: string
  tariff_slug: string
  entry_price: number
  level: number
  status: string
  slots_filled: number
  created_at: string
}

interface Props {
  matrices: Matrix[]
  onSwitchToOverview: () => void
}

export default function DashboardMatrices({ matrices, onSwitchToOverview }: Props) {
  return (
    <div className="space-y-4">
      {matrices.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
          <Icon name="Grid3X3" size={40} className="text-white/20 mx-auto mb-3" />
          <div className="text-white/50">Нет активных матриц</div>
          <Button className="mt-4 bg-yellow-700 hover:bg-yellow-600 text-white" onClick={onSwitchToOverview}>Купить тариф</Button>
        </div>
      ) : (
        matrices.map(m => {
          const levelSlots = [2, 2, 4, 4, 4]
          const levelMultiplier = [1, 2, 4, 8, 16]
          const totalSlotsBefore = levelSlots.slice(0, m.level - 1).reduce((a, b) => a + b, 0)
          const currentLevelSlots = levelSlots[m.level - 1] ?? 4
          const filledInLevel = Math.max(0, m.slots_filled - totalSlotsBefore)
          const progress = Math.min(100, Math.round((filledInLevel / currentLevelSlots) * 100))
          const slotsLeft = currentLevelSlots - filledInLevel
          const levelPayout = m.entry_price * levelMultiplier[m.level - 1]
          const nextTariff = m.tariff_slug === 'mini' ? { name: 'Минор', price: 6000 } : m.tariff_slug === 'minor' ? { name: 'Мажор', price: 120000 } : null
          const isLastLevel = m.level === 5
          const netPayout = isLastLevel && nextTariff ? levelPayout * currentLevelSlots - nextTariff.price : levelPayout * currentLevelSlots

          const tariffColors: Record<string, { bar: string; badge: string; dot: string }> = {
            mini:  { bar: 'bg-blue-500',   badge: 'bg-blue-900/50 text-blue-400',   dot: 'bg-blue-400' },
            minor: { bar: 'bg-purple-500', badge: 'bg-purple-900/50 text-purple-400', dot: 'bg-purple-400' },
            major: { bar: 'bg-yellow-500', badge: 'bg-yellow-900/50 text-yellow-400', dot: 'bg-yellow-400' },
          }
          const colors = tariffColors[m.tariff_slug] ?? tariffColors.mini

          return (
            <div key={m.id} className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="font-semibold text-white text-lg">Тариф «{m.tariff_name}»</div>
                  <div className="text-white/40 text-sm">Вход: {m.entry_price.toLocaleString('ru')} ₽</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${m.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-white/10 text-white/50'}`}>
                  {m.status === 'active' ? 'Активна' : 'Завершена'}
                </div>
              </div>

              <div className="flex items-center gap-1 mb-5">
                {[1,2,3,4,5].map(lvl => (
                  <div key={lvl} className="flex items-center flex-1">
                    <div className={`flex-1 flex flex-col items-center gap-1`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                        ${lvl < m.level ? `${colors.bar} border-transparent text-white` : ''}
                        ${lvl === m.level ? `border-current ${colors.badge} scale-110 shadow-lg` : ''}
                        ${lvl > m.level ? 'border-white/10 text-white/20 bg-white/5' : ''}
                      `}>
                        {lvl < m.level ? <Icon name="Check" size={12} /> : lvl}
                      </div>
                      <div className={`text-[10px] ${lvl === m.level ? 'text-white/70' : 'text-white/20'}`}>М{lvl}</div>
                    </div>
                    {lvl < 5 && <div className={`h-px flex-1 mb-4 ${lvl < m.level ? colors.bar : 'bg-white/10'}`} />}
                  </div>
                ))}
              </div>

              {m.status === 'active' && (
                <div className="bg-white/5 rounded-xl px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">Матрица {m.level} — слоты</span>
                    <span className="text-white font-semibold text-sm">{filledInLevel} / {currentLevelSlots}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${colors.bar}`} style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <div className="text-xs text-white/30">
                      {slotsLeft > 0
                        ? `Ещё ${slotsLeft} ${slotsLeft === 1 ? 'слот' : slotsLeft < 5 ? 'слота' : 'слотов'} до ${isLastLevel ? 'выплаты' : `матрицы ${m.level + 1}`}`
                        : isLastLevel ? 'Финальная выплата!' : 'Переход на следующую матрицу!'
                      }
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/30">выплата</div>
                      <div className="text-green-400 font-bold text-sm">
                        {netPayout.toLocaleString('ru')} ₽
                      </div>
                      {isLastLevel && nextTariff && (
                        <div className="text-yellow-400/60 text-[10px]">−{nextTariff.price.toLocaleString('ru')} ₽ «{nextTariff.name}»</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
