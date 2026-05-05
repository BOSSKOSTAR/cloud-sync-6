import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface Referral {
  name: string
  joined: string
  matrices: number
}

interface Props {
  refUrl: string
  referrals: Referral[]
  copied: boolean
  onCopy: () => void
  inputCls: string
}

export default function DashboardReferrals({ refUrl, referrals, copied, onCopy, inputCls }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
        <h3 className="font-semibold mb-2 text-white">Твоя реферальная ссылка</h3>
        <div className="flex gap-2 mb-4">
          <input readOnly value={refUrl} className={inputCls + ' min-w-0 flex-1'} />
          <Button onClick={onCopy} className="bg-yellow-700 hover:bg-yellow-600 text-white shrink-0">
            <Icon name={copied ? 'Check' : 'Copy'} size={16} />
          </Button>
        </div>
        <div className="flex gap-2 mb-3">
          <a
            href={`https://vk.com/share.php?url=${encodeURIComponent(refUrl)}&title=${encodeURIComponent('Присоединяйся и зарабатывай вместе со мной!')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-white border border-white/20 hover:border-blue-400/50 transition-all"
            style={{ background: 'rgba(30, 60, 140, 0.4)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 15.978h-1.588c-.6 0-.784-.477-1.86-1.558-1.008-.924-1.392-.924-1.392-.924s-.192 0-.192.924v1.404c0 .384-.108.558-.924.558-1.5 0-3.192-.924-4.392-2.604-1.8-2.508-2.292-4.404-2.292-4.404s-.096-.384.308-.384h1.596c.384 0 .516.192.66.576 0 0 .852 2.892 2.292 4.272.588.588.924.672.924.288V9.984c-.048-1.008-.576-1.092-.576-1.092s-.288-.048 0-.384c.288-.336 1.344-.24 1.344-.24h2.688c.384 0 .48.192.48.576v4.32c0 .48.192.576.384.576.384 0 .768-.384 1.536-1.152 1.2-1.2 2.016-3.072 2.016-3.072s.192-.384.576-.384h1.596c.48 0 .576.24.48.576 0 0-.924 2.688-3.024 4.8z"/></svg>
            ВКонтакте
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(refUrl)}&text=${encodeURIComponent('Присоединяйся и зарабатывай вместе со мной!')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-white border border-white/20 hover:border-sky-400/50 transition-all"
            style={{ background: 'rgba(0, 100, 160, 0.4)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.317l-2.95-.924c-.64-.204-.657-.64.136-.95l11.57-4.461c.537-.194 1.006.131.836.266z"/></svg>
            Telegram
          </a>
        </div>

      </div>

      <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Мои рефералы</h3>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium text-yellow-300 border border-yellow-600/40" style={{ background: 'rgba(120, 90, 0, 0.3)' }}>
            {referrals.length} чел.
          </span>
        </div>
        {referrals.length === 0 ? (
          <div className="text-center py-10">
            <Icon name="Users" size={36} className="text-white/10 mx-auto mb-3" />
            <div className="text-white/30 text-sm">Рефералов пока нет</div>
            <div className="text-white/20 text-xs mt-1">Поделись ссылкой выше, чтобы начать зарабатывать</div>
          </div>
        ) : (
          <div className="space-y-2">
            {referrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3 border border-white/10" style={{ background: 'rgba(10, 35, 15, 0.5)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-yellow-300 border border-yellow-600/40" style={{ background: 'rgba(120, 90, 0, 0.35)' }}>
                    {r.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-white">{r.name}</div>
                    <div className="text-white/40 text-xs flex items-center gap-1">
                      <Icon name="Calendar" size={10} />
                      {new Date(r.joined).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{r.matrices}</div>
                  <div className="text-white/30 text-xs">матриц</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}