import { useSearchParams } from 'react-router-dom'
import Icon from '@/components/ui/icon'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleString('ru', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const REFERRAL_NAMES = [
  'Александр К.', 'Дмитрий П.', 'Сергей В.', 'Андрей М.', 'Михаил Н.',
  'Екатерина С.', 'Наталья О.', 'Ольга Р.', 'Татьяна Л.', 'Юлия Ф.',
  'Артём Г.', 'Иван Б.', 'Максим Д.', 'Никита Ж.', 'Роман Х.',
]

const TARIFF_LABELS: Record<string, string> = {
  'Матрица': 'Мини',
  'Мини': 'Мини',
  'Минор': 'Минор',
  'Мажор': 'Мажор',
}

export default function Receipt() {
  const [params] = useSearchParams()

  const name = params.get('name') || 'Участник'
  const amount = params.get('amount') || '0'
  const date = params.get('date') || new Date().toISOString()
  const tariff = params.get('tariff') || 'Мини'
  const bank = params.get('bank') || 'Сбербанк'
  const refId = params.get('ref') || '00000001'

  // Генерируем имя реферала детерминированно по id операции
  const refIndex = parseInt(refId.replace(/\D/g, '') || '0', 10) % REFERRAL_NAMES.length
  const referralName = REFERRAL_NAMES[refIndex]
  const tariffLabel = TARIFF_LABELS[tariff] || tariff

  const formattedAmount = Number(amount).toLocaleString('ru')
  const opNum = 'P' + refId.padStart(9, '0')

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)' }}>

      <div className="w-full max-w-sm">

        {/* Чек в стиле банковского уведомления */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: '#1a1a1a' }}>

          {/* Шапка — зелёная полоса */}
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(90deg, #16a34a, #15803d)' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">П</div>
              <span className="font-bold text-white text-sm">Плям про100</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
              <span className="text-white text-xs font-medium">Выполнено</span>
            </div>
          </div>

          {/* Сумма */}
          <div className="px-6 pt-6 pb-4 border-b border-white/8">
            <p className="text-white/40 text-xs mb-1 uppercase tracking-wider">Зачислено на счёт</p>
            <div className="text-4xl font-bold text-white">
              +{formattedAmount} <span className="text-green-400">₽</span>
            </div>
            <p className="text-white/30 text-xs mt-1">{formatDate(date)}</p>
          </div>

          {/* Откуда перевод */}
          <div className="px-6 py-4 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs">Перевод от реферала</p>
                <p className="text-white font-semibold text-sm">{referralName}</p>
                <p className="text-white/30 text-xs">оплатил тариф <span className="text-yellow-400">{tariffLabel}</span></p>
              </div>
            </div>
          </div>

          {/* Получатель */}
          <div className="px-6 py-4 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <Icon name="Wallet" size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs">Получатель</p>
                <p className="text-white font-semibold text-sm">{name}</p>
                {bank && <p className="text-white/30 text-xs">{bank}</p>}
              </div>
            </div>
          </div>

          {/* Детали операции */}
          <div className="px-6 py-4 space-y-2.5">
            <div className="flex justify-between">
              <span className="text-white/30 text-xs">Тип операции</span>
              <span className="text-white/70 text-xs">Реферальное вознаграждение</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30 text-xs">Статус</span>
              <span className="text-green-400 text-xs font-medium">✓ Зачислено</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30 text-xs">Номер операции</span>
              <span className="text-white/40 text-xs font-mono">{opNum}</span>
            </div>
          </div>

          {/* Футер */}
          <div className="px-6 pb-5 pt-1 text-center">
            <div className="border-t border-dashed border-white/8 pt-4">
              <p className="text-white/15 text-xs">plyampro100.ru · Матричная система заработка</p>
            </div>
          </div>
        </div>

        <p className="text-white/20 text-xs text-center mt-4">
          Сделай скриншот и используй в рекламе
        </p>
      </div>
    </div>
  )
}
