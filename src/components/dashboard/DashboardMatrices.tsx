import { useState, useEffect } from 'react'
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
}

interface Props {
  matrices: Matrix[]
  onSwitchToOverview: () => void
}

// Структура пирамиды: [уровень матрицы] -> [строки пирамиды со слотами]
// Всего слотов: 2+2+4+4+4 = 16 на 5 уровней матрицы
// Пирамида внутри уровня: строки по 1, 2, 4... вниз
const PYRAMID_ROWS: Record<number, number[]> = {
  1: [1, 1],         // уровень 1: 2 слота — строка по 1+1
  2: [1, 1],         // уровень 2: 2 слота
  3: [2, 2],         // уровень 3: 4 слота
  4: [2, 2],         // уровень 4: 4 слота
  5: [2, 2],         // уровень 5: 4 слота
}

// Глобальный offset слотов для каждого уровня матрицы
const LEVEL_OFFSET = [0, 2, 4, 8, 12]

function PyramidSlot({ slot, colors }: { slot: Slot | null; colors: { dot: string } }) {
  if (!slot) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="w-9 h-9 rounded-full border-2 border-dashed border-white/15 bg-white/3 flex items-center justify-center">
          <Icon name="UserPlus" size={14} className="text-white/20" />
        </div>
        <span className="text-[9px] text-white/20 text-center max-w-[60px] leading-tight">свободно</span>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-9 h-9 rounded-full border-2 border-current flex items-center justify-center ${colors.dot} bg-opacity-20`}
        style={{ background: 'rgba(255,255,255,0.07)' }}>
        <Icon name="User" size={14} className="text-white/80" />
      </div>
      <span className="text-[9px] text-white/60 text-center max-w-[60px] leading-tight truncate">
        {slot.name.split(' ')[0]}
      </span>
    </div>
  )
}

function MatrixPyramid({ detail, matrix, colors }: { detail: MatrixDetail; matrix: Matrix; colors: { dot: string; bar: string; badge: string } }) {
  const levelMultiplier = [1, 2, 4, 8, 16]
  const levelSlots = [2, 2, 4, 4, 4]
  const isLastLevel = matrix.level === 5
  const levelPayout = matrix.entry_price * levelMultiplier[matrix.level - 1]
  const nextTariff = matrix.tariff_slug === 'mini' ? { name: 'Минор', price: 6000 } : matrix.tariff_slug === 'minor' ? { name: 'Мажор', price: 120000 } : null
  const netPayout = isLastLevel && nextTariff ? levelPayout * levelSlots[matrix.level - 1] - nextTariff.price : levelPayout * levelSlots[matrix.level - 1]

  // Слоты текущего уровня
  const offset = LEVEL_OFFSET[matrix.level - 1]
  const rows = PYRAMID_ROWS[matrix.level] ?? [2, 2]
  const slotsForLevel: (Slot | null)[] = []
  let pos = offset + 1
  const totalInLevel = rows.reduce((a, b) => a + b, 0)
  for (let i = 0; i < totalInLevel; i++) {
    const found = detail.slots.find(s => s.position === pos) ?? null
    slotsForLevel.push(found)
    pos++
  }

  // Разбиваем на строки пирамиды
  const pyramidRows: (Slot | null)[][] = []
  let idx = 0
  for (const count of rows) {
    pyramidRows.push(slotsForLevel.slice(idx, idx + count))
    idx += count
  }

  const totalSlotsBefore = levelSlots.slice(0, matrix.level - 1).reduce((a, b) => a + b, 0)
  const filledInLevel = Math.max(0, matrix.slots_filled - totalSlotsBefore)
  const slotsLeft = totalInLevel - filledInLevel

  return (
    <div className="space-y-4">
      {/* Сам пользователь — вершина */}
      <div className="flex flex-col items-center gap-1">
        <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center ${colors.bar} border-transparent shadow-lg`}>
          <Icon name="User" size={16} className="text-white" />
        </div>
        <span className="text-[10px] text-white/70 font-medium">Вы</span>
      </div>

      {/* Стрелка вниз */}
      <div className="flex justify-center">
        <Icon name="ChevronDown" size={16} className="text-white/20" />
      </div>

      {/* Строки пирамиды */}
      <div className="space-y-3">
        {pyramidRows.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-4">
            {row.map((slot, si) => (
              <PyramidSlot key={si} slot={slot} colors={colors} />
            ))}
          </div>
        ))}
      </div>

      {/* Статистика */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <div className="text-xs text-white/30">
          {slotsLeft > 0
            ? `Ещё ${slotsLeft} ${slotsLeft === 1 ? 'слот' : slotsLeft < 5 ? 'слота' : 'слотов'} до ${isLastLevel ? 'выплаты' : `матрицы ${matrix.level + 1}`}`
            : isLastLevel ? 'Финальная выплата!' : 'Переход на следующую матрицу!'
          }
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

  useEffect(() => {
    matrices.forEach(m => {
      if (!details[m.id] && !loading[m.id]) {
        setLoading(prev => ({ ...prev, [m.id]: true }))
        api.getMatrixDetail(m.id).then((res: MatrixDetail) => {
          if (res?.matrix) setDetails(prev => ({ ...prev, [m.id]: res }))
          setLoading(prev => ({ ...prev, [m.id]: false }))
        }).catch(() => setLoading(prev => ({ ...prev, [m.id]: false })))
      }
    })
  }, [matrices]) // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="space-y-4">
      {matrices.map(m => {
        const tariffColors: Record<string, { bar: string; badge: string; dot: string }> = {
          mini:  { bar: 'bg-blue-500',   badge: 'bg-blue-900/50 text-blue-400',    dot: 'text-blue-400' },
          minor: { bar: 'bg-purple-500', badge: 'bg-purple-900/50 text-purple-400', dot: 'text-purple-400' },
          major: { bar: 'bg-yellow-500', badge: 'bg-yellow-900/50 text-yellow-400', dot: 'text-yellow-400' },
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
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${m.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-white/10 text-white/50'}`}>
                {m.status === 'active' ? 'Активна' : 'Завершена'}
              </div>
            </div>

            {/* Уровни */}
            <div className="flex items-center gap-1 mb-6">
              {[1,2,3,4,5].map(lvl => (
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

            {/* Пирамида */}
            {loading[m.id] && (
              <div className="flex justify-center py-6">
                <Icon name="Loader2" size={24} className="text-white/30 animate-spin" />
              </div>
            )}
            {details[m.id] && (
              <div className="bg-white/5 rounded-xl px-4 py-4">
                <div className="text-xs text-white/40 mb-4 text-center">Матрица {m.level} — текущий уровень</div>
                <MatrixPyramid detail={details[m.id]} matrix={m} colors={colors} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}