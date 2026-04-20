import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface Tariff {
  id: number
  name: string
  slug: string
  price: number
}

interface Matrix {
  tariff_slug: string
  status: string
}

interface Props {
  refUrl: string
  referralsCount: number
  referralCode: string
  copied: boolean
  onCopy: () => void
  tariffs: Tariff[]
  matrices: Matrix[]
  loading: boolean
  balance: number
  buyingId: number | null
  onBuyTariff: (id: number) => void
  onSwitchToOverview: () => void
  inputCls: string
}

export default function DashboardOverview({
  refUrl,
  referralsCount,
  referralCode,
  copied,
  onCopy,
  tariffs,
  matrices,
  loading,
  balance,
  buyingId,
  onBuyTariff,
  inputCls,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-6 border border-yellow-600/40 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(120,80,0,0.45) 0%, rgba(5,25,10,0.7) 100%)', backdropFilter: 'blur(12px)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#ca8a0422_0%,_transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon name="Share2" size={18} className="text-yellow-400" />
              <h3 className="font-bold text-lg text-white">Твоя реферальная ссылка</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1">
              <Icon name="Users" size={13} className="text-yellow-400" />
              <span className="text-yellow-300 text-sm font-semibold">{referralsCount}</span>
              <span className="text-yellow-400/60 text-xs">{referralsCount === 1 ? 'человек' : referralsCount >= 2 && referralsCount <= 4 ? 'человека' : 'человек'} по ссылке</span>
            </div>
          </div>
          <p className="text-white/40 text-sm mb-4">Отправь другу — когда он зарегистрируется, ты станешь его спонсором</p>
          <div className="flex gap-2 mb-3">
            <input readOnly value={refUrl} className={inputCls + ' min-w-0 flex-1 text-sm'} onClick={e => (e.target as HTMLInputElement).select()} />
            <Button onClick={onCopy} className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold shrink-0 gap-1.5">
              <Icon name={copied ? 'Check' : 'Copy'} size={15} />
              {copied ? 'Скопировано' : 'Копировать'}
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(refUrl)}&text=${encodeURIComponent('Заходи в Плям про100 — зарабатывай приглашая друзей! Вход от 300 ₽')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-colors text-xs px-3 py-1.5 rounded-full font-medium"
            >
              <Icon name="Send" size={12} /> Поделиться в Telegram
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('Заходи в Плям про100 — зарабатывай приглашая друзей! Вход от 300 ₽\n' + refUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 transition-colors text-xs px-3 py-1.5 rounded-full font-medium"
            >
              <Icon name="MessageCircle" size={12} /> WhatsApp
            </a>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/40 text-xs px-3 py-1.5 rounded-full">
              Код: <span className="font-mono text-white/60">{referralCode}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
        <h3 className="font-semibold mb-4 text-white">Доступные тарифы</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <Icon name="Loader2" size={24} className="animate-spin text-white/40" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {tariffs.map(t => {
              const isActive = matrices.some(m => m.tariff_slug === t.slug && m.status === 'active')
              const gradients: Record<string, string> = {
                mini: 'from-green-800 to-green-700',
                minor: 'from-yellow-800 to-yellow-700',
                major: 'from-yellow-700 to-amber-600',
              }
              return (
                <div key={t.id} className="rounded-xl p-4 border border-white/10" style={{ background: 'rgba(10, 35, 15, 0.7)', backdropFilter: 'blur(8px)' }}>
                  <div className="font-semibold mb-1 text-white">{t.name}</div>
                  <div className="text-2xl font-bold mb-3 text-white">{t.price.toLocaleString('ru')} ₽</div>
                  {isActive ? (
                    <div className="text-green-400 text-sm flex items-center gap-1">
                      <Icon name="CheckCircle" size={14} /> Активен
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className={`w-full bg-gradient-to-r ${gradients[t.slug] || 'from-yellow-800 to-yellow-700'} text-white hover:opacity-90`}
                      onClick={() => onBuyTariff(t.id)}
                      disabled={buyingId === t.id || balance < t.price}
                    >
                      {buyingId === t.id ? <Icon name="Loader2" size={14} className="animate-spin mr-1" /> : null}
                      {balance < t.price ? 'Пополни баланс' : 'Купить'}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
