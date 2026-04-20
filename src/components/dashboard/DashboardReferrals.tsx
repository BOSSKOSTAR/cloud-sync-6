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
        <p className="text-white/30 text-xs">Приглашай по этой ссылке и получай выплаты за каждого участника</p>
      </div>

      <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(5, 25, 10, 0.6)', backdropFilter: 'blur(12px)' }}>
        <h3 className="font-semibold mb-4 text-white">Мои рефералы ({referrals.length})</h3>
        {referrals.length === 0 ? (
          <div className="text-white/30 text-center py-6">Рефералов пока нет</div>
        ) : (
          <div className="space-y-2">
            {referrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3 border border-white/10" style={{ background: 'rgba(10, 35, 15, 0.5)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">{r.name[0].toUpperCase()}</div>
                  <div>
                    <div className="font-medium text-white">{r.name}</div>
                    <div className="text-white/40 text-xs">{new Date(r.joined).toLocaleDateString('ru')}</div>
                  </div>
                </div>
                <div className="text-sm text-white/50">{r.matrices} матриц</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
