import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { useNavigate } from 'react-router-dom'

interface Transaction {
  id: number
  type: string
  amount: number
  status: string
  description: string
  created_at: string
}

const TYPE_LABELS: Record<string, string> = {
  topup: 'Пополнение',
  buy_tariff: 'Покупка тарифа',
  matrix_payout: 'Выплата матрицы',
  withdrawal: 'Вывод средств',
}

interface Props {
  userId: number
  userName: string
  balance: number
  transactions: Transaction[]
  withdrawAmount: string
  withdrawPhone: string
  withdrawBank: string
  onWithdrawAmountChange: (v: string) => void
  onWithdrawPhoneChange: (v: string) => void
  onWithdrawBankChange: (v: string) => void
  onWithdraw: () => void
  inputCls: string
}

export default function DashboardWallet({
  userId,
  userName,
  balance,
  transactions,
  withdrawAmount,
  withdrawPhone,
  withdrawBank,
  onWithdrawAmountChange,
  onWithdrawPhoneChange,
  onWithdrawBankChange,
  onWithdraw,
  inputCls,
}: Props) {
  const navigate = useNavigate()

  function getTariffByAmount(amount: number): string {
    if (amount >= 120000) return 'Мажор'
    if (amount >= 6000) return 'Минор'
    return 'Мини'
  }

  function openReceipt(tx: Transaction) {
    const amt = Math.abs(tx.amount)
    const params = new URLSearchParams({
      name: userName,
      amount: String(amt),
      date: tx.created_at,
      tariff: getTariffByAmount(amt),
      ref: String(tx.id).padStart(8, '0'),
      ...(withdrawBank ? { bank: withdrawBank } : {}),
    })
    window.open(`/receipt?${params.toString()}`, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
            <Icon name="Plus" size={16} className="text-green-400" /> Пополнить баланс
          </h3>
          <div className="flex justify-center">
            <iframe
              src={`https://yoomoney.ru/quickpay/fundraise/button?billNumber=1H7175FPPE1.260417&label=${userId}`}
              width="330"
              height="50"
              frameBorder={0}
              allowTransparency={true}
              scrolling="no"
            />
          </div>
        </div>

        <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
            <Icon name="ArrowUpRight" size={16} className="text-yellow-400" /> Вывести средства (СБП)
          </h3>
          <div className="space-y-2 mb-3">
            <input type="number" placeholder="Сумма" value={withdrawAmount} onChange={e => onWithdrawAmountChange(e.target.value)} className={inputCls} />
            <input type="text" placeholder="+7 999 999-99-99" value={withdrawPhone} onChange={e => onWithdrawPhoneChange(e.target.value)} className={inputCls} />
            <input type="text" placeholder="Банк (Сбер, Тинькофф...)" value={withdrawBank} onChange={e => onWithdrawBankChange(e.target.value)} className={inputCls} />
          </div>
          <Button className="w-full bg-yellow-700 hover:bg-yellow-600 text-white" onClick={onWithdraw}>
            Запросить вывод
          </Button>
          <p className="text-white/30 text-xs mt-2">Доступно: {balance.toLocaleString('ru')} ₽</p>
        </div>
      </div>

      <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
        <h3 className="font-semibold mb-4 text-white">История операций</h3>
        {transactions.length === 0 ? (
          <div className="text-white/30 text-center py-6">Операций пока нет</div>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => {
              const isIncome = ['topup', 'matrix_payout'].includes(tx.type)
              return (
                <div key={tx.id} className="flex items-center justify-between rounded-xl px-4 py-3 border border-white/10" style={{ background: 'rgba(10, 35, 15, 0.5)' }}>
                  <div>
                    <div className="font-medium text-sm text-white">{TYPE_LABELS[tx.type] || tx.type}</div>
                    <div className="text-white/40 text-xs">{new Date(tx.created_at).toLocaleString('ru')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                      {isIncome ? '+' : '-'}{Math.abs(tx.amount).toLocaleString('ru')} ₽
                    </div>
                    {isIncome && (
                      <button
                        onClick={() => openReceipt(tx)}
                        className="text-white/30 hover:text-yellow-400 transition-colors"
                        title="Получить чек"
                      >
                        <Icon name="Receipt" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}