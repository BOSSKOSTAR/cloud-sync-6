import { useSearchParams } from 'react-router-dom'
import Icon from '@/components/ui/icon'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleString('ru', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Receipt() {
  const [params] = useSearchParams()

  const name = params.get('name') || 'Участник'
  const amount = params.get('amount') || '0'
  const date = params.get('date') || new Date().toISOString()
  const tariff = params.get('tariff') || 'Мини'
  const ref = params.get('ref') || Math.random().toString(36).slice(2, 10).toUpperCase()

  const formattedAmount = Number(amount).toLocaleString('ru')

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #050a18 0%, #0a1a10 50%, #050a18 100%)' }}>

      {/* Чек */}
      <div className="w-full max-w-md">
        <div className="rounded-3xl overflow-hidden border border-yellow-500/20 shadow-2xl"
          style={{ background: 'linear-gradient(160deg, #0d2010 0%, #091508 100%)' }}>

          {/* Шапка */}
          <div className="p-6 text-center border-b border-yellow-500/15"
            style={{ background: 'linear-gradient(180deg, rgba(20,50,20,0.8) 0%, transparent 100%)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-yellow-500 flex items-center justify-center text-xs font-bold text-black">П</div>
              <span className="font-bold text-lg text-white">Плям про<span className="text-green-400">100</span></span>
            </div>
            <p className="text-white/40 text-xs">Подтверждение выплаты</p>
          </div>

          {/* Сумма */}
          <div className="px-6 py-8 text-center border-b border-yellow-500/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: 'rgba(34, 197, 94, 0.15)', border: '2px solid rgba(34, 197, 94, 0.3)' }}>
              <Icon name="TrendingUp" size={28} className="text-green-400" />
            </div>
            <div className="text-5xl font-bold text-white mb-1">
              +{formattedAmount} <span className="text-green-400">₽</span>
            </div>
            <p className="text-white/40 text-sm">Успешно выплачено</p>
          </div>

          {/* Детали */}
          <div className="px-6 py-5 space-y-3 border-b border-yellow-500/10">
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-sm">Получатель</span>
              <span className="text-white font-medium text-sm">{name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-sm">Тариф</span>
              <span className="text-yellow-400 font-medium text-sm">{tariff}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-sm">Дата и время</span>
              <span className="text-white/70 text-sm">{formatDate(date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-sm">Номер операции</span>
              <span className="text-white/50 text-xs font-mono">#{ref}</span>
            </div>
          </div>

          {/* Статус */}
          <div className="px-6 py-4 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            <span className="text-green-400 text-sm font-medium">Выплата подтверждена</span>
          </div>

          {/* Перфорация */}
          <div className="px-6 pb-6 text-center">
            <div className="border-t border-dashed border-white/10 pt-4">
              <p className="text-white/20 text-xs">plyampro100.ru · Матричная система заработка</p>
            </div>
          </div>
        </div>

        {/* Подсказка */}
        <p className="text-white/20 text-xs text-center mt-4">
          Сделай скриншот и поделись в социальных сетях
        </p>
      </div>
    </div>
  )
}
