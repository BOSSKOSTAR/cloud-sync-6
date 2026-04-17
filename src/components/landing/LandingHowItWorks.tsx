import Icon from '@/components/ui/icon'
import AnimatedNumber from './AnimatedNumber'

interface Tariff {
  key: string
  name: string
  price: number
  color: string
  border: string
  glow: string
  nextTariff: { name: string; price: number } | null
  levels: { level: number; payout: number; slots: number; autoBuy: { name: string; price: number } | null }[]
  total: number
}

interface LandingHowItWorksProps {
  tariffs: Tariff[]
}

export default function LandingHowItWorks({ tariffs }: LandingHowItWorksProps) {
  return (
    <>
      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Как это работает</h2>
          <p className="text-white/40 text-center mb-12">Три простых шага до первого заработка</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: 'UserPlus', title: '1. Регистрируйся', desc: 'Создай аккаунт и пополни баланс. Вход от 300 ₽.', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', iconColor: 'text-blue-400', glow: 'bg-blue-600/20' },
              { icon: 'Share2', title: '2. Приглашай', desc: 'Делись своей реферальной ссылкой с друзьями и знакомыми.', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', iconColor: 'text-purple-400', glow: 'bg-purple-600/20' },
              { icon: 'TrendingUp', title: '3. Зарабатывай', desc: 'Получай выплаты на баланс за каждого участника в матрице.', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', iconColor: 'text-green-400', glow: 'bg-green-600/20' },
            ].map((s, i) => (
              <div key={i} className={`card-hover bg-gradient-to-b ${s.color} border ${s.border} rounded-2xl p-6 text-center`}>
                <div className={`w-14 h-14 rounded-2xl ${s.glow} flex items-center justify-center mx-auto mb-4`}>
                  <Icon name={s.icon} size={26} className={s.iconColor} />
                </div>
                <h3 className="font-semibold mb-2 text-lg">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income showcase */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Реальные цифры</h2>
          <p className="text-white/40 text-center mb-10">Сколько можно заработать на каждом тарифе</p>
          <div className="grid md:grid-cols-3 gap-6">
            {tariffs.map((t, i) => (
              <div key={t.key}
                className={`card-hover bg-gradient-to-b from-white/5 to-transparent border ${t.border} rounded-2xl p-6 shadow-xl ${t.glow}`}
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${t.color} mb-4`}>
                  {t.name}
                </div>
                <div className="text-white/50 text-sm mb-1">Вход</div>
                <div className="text-xl font-bold mb-4">{t.price.toLocaleString('ru')} ₽</div>
                <div className="text-white/50 text-sm mb-1">Заработок</div>
                <div className="text-3xl font-bold text-green-400 mb-4">
                  <AnimatedNumber value={t.total} suffix=" ₽" duration={2500} />
                </div>
                <div className="space-y-1.5">
                  {t.levels.map(l => {
                    const gross = l.payout * l.slots
                    const net = l.autoBuy ? gross - l.autoBuy.price : gross
                    return (
                      <div key={l.level} className="flex justify-between text-sm">
                        <span className="text-white/40">Матрица {l.level}</span>
                        <div className="text-right">
                          {l.autoBuy ? (
                            <>
                              <span className="text-white/40 line-through text-xs mr-1">{gross.toLocaleString('ru')}</span>
                              <span className="text-green-400 font-medium">+{net.toLocaleString('ru')} ₽</span>
                            </>
                          ) : (
                            <span className="text-white/80 font-medium">+{gross.toLocaleString('ru')} ₽</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {t.nextTariff && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-yellow-400/70">
                    <Icon name="ShoppingCart" size={11} />
                    5-я матрица → автопокупка «{t.nextTariff.name}»
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
