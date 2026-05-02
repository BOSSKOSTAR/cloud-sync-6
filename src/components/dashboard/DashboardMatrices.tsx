import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { api } from '@/lib/api'

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

interface Slot {
  position: number
  name: string
  filled_at: string
}

interface MatrixDetail {
  matrix: {
    id: number
    level: number
    status: string
    slots_filled: number
    tariff_name: string
    entry_price: number
  }
  slots: Slot[]
  levels?: { level: number; payout: number }[]
}

interface Props {
  matrices: Matrix[]
  onSwitchToOverview: () => void
}

const POLL_INTERVAL = 6000

// Анимированный узел слота
function SlotNode({
  slot,
  colorClass,
  size = 'md',
  label,
  payout,
  isNew,
}: {
  slot: Slot | null
  colorClass: string
  size?: 'lg' | 'md' | 'sm'
  label?: string
  payout?: number
  isNew?: boolean
}) {
  const [animate, setAnimate] = useState(false)
  const [showPayout, setShowPayout] = useState(false)

  useEffect(() => {
    if (isNew && slot) {
      setAnimate(true)
      setTimeout(() => setShowPayout(true), 400)
      setTimeout(() => setAnimate(false), 1200)
      setTimeout(() => setShowPayout(false), 2000)
    }
  }, [isNew, slot])

  const dim = size === 'lg' ? 'w-14 h-14' : size === 'md' ? 'w-11 h-11' : 'w-9 h-9'
  const iconSize = size === 'lg' ? 18 : size === 'md' ? 15 : 13
  const textSize = size === 'lg' ? 'text-[11px]' : 'text-[9px]'

  if (!slot && !label) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          className={`${dim} rounded-full border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center transition-all duration-500`}
          style={{ animation: 'pulse-slot 3s ease-in-out infinite' }}
        >
          <Icon name="UserPlus" size={iconSize} className="text-white/20" />
        </div>
        <span className={`${textSize} text-white/20`}>свободно</span>
        {payout && <span className="text-[8px] text-green-400/40">{payout.toLocaleString('ru')} ₽</span>}
      </div>
    )
  }

  if (label) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={`${dim} rounded-full flex items-center justify-center ${colorClass} shadow-lg`}>
          <Icon name="User" size={iconSize} className="text-white" />
        </div>
        <span className={`${textSize} text-white/80 font-semibold`}>{label}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1 relative">
      <div
        className={`${dim} rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
          animate ? 'scale-125 shadow-[0_0_20px_rgba(74,222,128,0.6)]' : 'scale-100'
        }`}
        style={{
          borderColor: animate ? '#4ade80' : 'currentColor',
          background: animate ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.1)',
        }}
      >
        <Icon
          name="User"
          size={iconSize}
          className={animate ? 'text-green-400' : `${colorClass.replace('bg-', 'text-').replace('-500', '-400')}`}
        />
      </div>
      <span className={`${textSize} text-white/60 max-w-[64px] text-center truncate`}>
        {slot!.name.split(' ')[0]}
      </span>
      {payout && !animate && (
        <span className="text-[8px] text-green-400 font-semibold">{payout.toLocaleString('ru')} ₽</span>
      )}
      {showPayout && payout && (
        <span
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-400 whitespace-nowrap pointer-events-none"
          style={{ animation: 'float-up 1.6s ease-out forwards' }}
        >
          +{payout.toLocaleString('ru')} ₽
        </span>
      )}
    </div>
  )
}

function VLine() {
  return <div className="w-px h-4 bg-white/15 mx-auto" />
}

function HBranch({ count }: { count: number }) {
  if (count === 2) {
    return (
      <div className="flex items-start justify-center">
        <div className="flex flex-col items-end w-1/2">
          <div className="w-px h-3 bg-white/15 mx-auto" />
          <div className="w-1/2 h-px bg-white/15 self-end" />
        </div>
        <div className="flex flex-col items-start w-1/2">
          <div className="w-px h-3 bg-white/15 mx-auto" />
          <div className="w-1/2 h-px bg-white/15 self-start" />
        </div>
      </div>
    )
  }
  return null
}

// Индикатор "онлайн" — живые обновления
function LiveIndicator({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex h-2 w-2">
        {active && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-green-400' : 'bg-white/20'}`} />
      </div>
      <span className="text-[10px] text-white/30">{active ? 'онлайн' : 'обновление...'}</span>
    </div>
  )
}

function MatrixTree({
  detail,
  matrix,
  colors,
  userName,
  newSlotPositions,
}: {
  detail: MatrixDetail
  matrix: Matrix
  colors: { bar: string; dot: string }
  userName: string
  newSlotPositions: Set<number>
}) {
  const levelSlots = [2, 2, 4, 4, 4]
  const levelMultiplier = [1, 2, 4, 8, 16]
  const isLastLevel = matrix.level === 5
  const levelPayout = matrix.entry_price * levelMultiplier[matrix.level - 1]
  const nextTariff =
    matrix.tariff_slug === 'mini'
      ? { name: 'Минор', price: 6000 }
      : matrix.tariff_slug === 'minor'
      ? { name: 'Мажор', price: 120000 }
      : null
  const currentLevelSlotCount = levelSlots[matrix.level - 1]
  const netPayout =
    isLastLevel && nextTariff
      ? levelPayout * currentLevelSlotCount - nextTariff.price
      : levelPayout * currentLevelSlotCount

  const totalSlotsBefore = levelSlots.slice(0, matrix.level - 1).reduce((a, b) => a + b, 0)
  const filledInLevel = Math.max(0, matrix.slots_filled - totalSlotsBefore)
  const slotsLeft = currentLevelSlotCount - filledInLevel

  const currentLevelData = detail.levels?.find(l => l.level === matrix.level)
  const payoutPerSlot = currentLevelData ? currentLevelData.payout : levelPayout

  const getSlot = (localPos: number): Slot | null =>
    detail.slots.find(s => s.position === totalSlotsBefore + localPos) ?? null

  const isNewSlot = (localPos: number) => newSlotPositions.has(totalSlotsBefore + localPos)

  const row2 = [getSlot(1), getSlot(2)]
  const row3 =
    currentLevelSlotCount >= 4
      ? [getSlot(3), getSlot(4), getSlot(5) ?? null, getSlot(6) ?? null]
      : null

  const dotText = colors.dot

  return (
    <div>
      <div className="flex justify-center">
        <SlotNode slot={null} colorClass={colors.bar} size="lg" label={userName.split(' ')[0]} />
      </div>

      <VLine />

      <div className="relative flex justify-center gap-10">
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-px bg-white/15" />
        {row2.map((slot, i) => (
          <SlotNode key={i} slot={slot} colorClass={dotText} size="md" payout={payoutPerSlot} isNew={isNewSlot(i + 1)} />
        ))}
      </div>

      {row3 && (
        <>
          <div className="flex justify-center gap-10">
            <VLine />
            <VLine />
          </div>
          <div className="relative flex justify-center gap-4">
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-36 h-px bg-white/15" />
            {row3.map((slot, i) => (
              <SlotNode key={i} slot={slot} colorClass={dotText} size="sm" payout={payoutPerSlot} isNew={isNewSlot(i + 3)} />
            ))}
          </div>
        </>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
        <div className="text-xs text-white/30">
          {slotsLeft > 0
            ? `Ещё ${slotsLeft} ${slotsLeft === 1 ? 'слот' : slotsLeft < 5 ? 'слота' : 'слотов'} до ${isLastLevel ? 'выплаты' : `матрицы ${matrix.level + 1}`}`
            : isLastLevel ? 'Финальная выплата!' : 'Переход на следующую матрицу!'}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30">выплата</div>
          <div className="text-green-400 font-bold text-sm">{netPayout.toLocaleString('ru')} ₽</div>
          {isLastLevel && nextTariff && (
            <div className="text-yellow-400/60 text-[10px]">−{nextTariff.price.toLocaleString('ru')} ₽ «{nextTariff.name}»</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardMatrices({ matrices, onSwitchToOverview }: Props) {
  const [details, setDetails] = useState<Record<number, MatrixDetail>>({})
  const [loading, setLoading] = useState<Record<number, boolean>>({})
  const [newSlots, setNewSlots] = useState<Record<number, Set<number>>>({})
  const [isLive, setIsLive] = useState(true)
  const prevSlotsRef = useRef<Record<number, number>>({})
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const userName = (() => {
    try { return JSON.parse(localStorage.getItem('plyam_user') || '{}').name || 'Вы' } catch { return 'Вы' }
  })()

  const loadDetail = useCallback(async (matrixId: number, silent = false) => {
    if (!silent) setLoading(prev => ({ ...prev, [matrixId]: true }))
    try {
      const res: MatrixDetail = await api.getMatrixDetail(matrixId)
      if (res?.matrix) {
        setDetails(prev => {
          const old = prev[matrixId]
          if (old) {
            // Находим новые слоты
            const oldPositions = new Set(old.slots.map(s => s.position))
            const added = res.slots.filter(s => !oldPositions.has(s.position)).map(s => s.position)
            if (added.length > 0) {
              setNewSlots(p => ({ ...p, [matrixId]: new Set(added) }))
              setTimeout(() => setNewSlots(p => ({ ...p, [matrixId]: new Set() })), 2500)
            }
          }
          return { ...prev, [matrixId]: res }
        })
      }
    } finally {
      if (!silent) setLoading(prev => ({ ...prev, [matrixId]: false }))
    }
  }, [])

  // Первичная загрузка
  useEffect(() => {
    matrices.forEach(m => {
      if (!details[m.id] && !loading[m.id]) {
        loadDetail(m.id)
        prevSlotsRef.current[m.id] = m.slots_filled
      }
    })
  }, [matrices]) // eslint-disable-line react-hooks/exhaustive-deps

  // Polling — живые обновления
  useEffect(() => {
    if (matrices.length === 0) return

    const poll = () => {
      setIsLive(false)
      Promise.all(matrices.map(m => loadDetail(m.id, true))).finally(() => {
        setIsLive(true)
        pollTimer.current = setTimeout(poll, POLL_INTERVAL)
      })
    }

    pollTimer.current = setTimeout(poll, POLL_INTERVAL)
    return () => { if (pollTimer.current) clearTimeout(pollTimer.current) }
  }, [matrices, loadDetail])

  if (matrices.length === 0) {
    return (
      <div className="rounded-2xl p-12 text-center border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
        <Icon name="Grid3X3" size={40} className="text-white/20 mx-auto mb-3" />
        <div className="text-white/50">Нет активных матриц</div>
        <Button className="mt-4 bg-yellow-700 hover:bg-yellow-600 text-white" onClick={onSwitchToOverview}>Купить тариф</Button>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes float-up {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-28px); }
        }
        @keyframes pulse-slot {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>

      <div className="space-y-4">
        {matrices.map(m => {
          const tariffColors: Record<string, { bar: string; dot: string; badge: string }> = {
            mini:  { bar: 'bg-blue-500',   dot: 'text-blue-400',   badge: 'bg-blue-900/50 text-blue-400' },
            minor: { bar: 'bg-purple-500', dot: 'text-purple-400', badge: 'bg-purple-900/50 text-purple-400' },
            major: { bar: 'bg-yellow-500', dot: 'text-yellow-400', badge: 'bg-yellow-900/50 text-yellow-400' },
          }
          const colors = tariffColors[m.tariff_slug] ?? tariffColors.mini

          return (
            <div key={m.id} className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
              {/* Заголовок */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="font-semibold text-white text-lg">Тариф «{m.tariff_name}»</div>
                  <div className="text-white/40 text-sm">Вход: {m.entry_price.toLocaleString('ru')} ₽</div>
                </div>
                <div className="flex items-center gap-3">
                  <LiveIndicator active={isLive} />
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${m.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-white/10 text-white/50'}`}>
                    {m.status === 'active' ? 'Активна' : 'Завершена'}
                  </div>
                </div>
              </div>

              {/* Уровни */}
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <div key={lvl} className="flex items-center flex-1">
                    <div className="flex-1 flex flex-col items-center gap-1">
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

              {/* Дерево матрицы */}
              <div className="bg-white/5 rounded-xl px-4 py-5">
                <div className="text-xs text-white/30 text-center mb-4">Матрица {m.level} — текущий уровень</div>
                {loading[m.id] && (
                  <div className="flex justify-center py-4">
                    <Icon name="Loader2" size={22} className="text-white/30 animate-spin" />
                  </div>
                )}
                {details[m.id] && (
                  <MatrixTree
                    detail={details[m.id]}
                    matrix={m}
                    colors={colors}
                    userName={userName}
                    newSlotPositions={newSlots[m.id] ?? new Set()}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
