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
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 border border-yellow-600/30" style={{ background: 'rgba(120, 90, 0, 0.2)' }}>
          <Icon name="Star" size={14} className="text-yellow-400 shrink-0" />
          <p className="text-yellow-200/80 text-xs">Реферал получает <span className="font-semibold text-yellow-300">Тариф Мини</span>, ты получаешь <span className="font-semibold text-yellow-300">Тариф Мажор</span> — бесплатно</p>
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