import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getUser, logout } from '@/lib/api'
import { toast } from 'sonner'
import Icon from '@/components/ui/icon'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardOverview from '@/components/dashboard/DashboardOverview'
import DashboardMatrices from '@/components/dashboard/DashboardMatrices'
import DashboardReferrals from '@/components/dashboard/DashboardReferrals'
import DashboardWallet from '@/components/dashboard/DashboardWallet'

interface User {
  user_id: number
  name: string
  referral_code: string
  balance: number
  total_earned: number
}

interface Tariff {
  id: number
  name: string
  slug: string
  price: number
}

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

interface Transaction {
  id: number
  type: string
  amount: number
  status: string
  description: string
  created_at: string
}

interface Referral {
  name: string
  joined: string
  matrices: number
}

type Tab = 'overview' | 'matrices' | 'referrals' | 'wallet'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getUser() as User | null

  const [tab, setTab] = useState<Tab>('overview')
  const [balance, setBalance] = useState(user?.balance || 0)
  const [totalEarned, setTotalEarned] = useState(user?.total_earned || 0)
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [matrices, setMatrices] = useState<Matrix[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(false)
  const [buyingId, setBuyingId] = useState<number | null>(null)
  const [topupAmount, setTopupAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawPhone, setWithdrawPhone] = useState('')
  const [withdrawBank, setWithdrawBank] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    loadData()
  }, [])

  async function loadData() {
    if (!user) return
    setLoading(true)
    try {
      const [balRes, tariffsRes, matricesRes, refRes] = await Promise.all([
        api.getBalance(user.user_id),
        api.getTariffs(),
        api.getMyMatrices(user.user_id),
        api.getReferrals(user.user_id),
      ])
      if (balRes.balance !== undefined) { setBalance(balRes.balance); setTotalEarned(balRes.total_earned) }
      if (tariffsRes.tariffs) setTariffs(tariffsRes.tariffs)
      if (matricesRes.matrices) setMatrices(matricesRes.matrices)
      if (refRes.referrals) setReferrals(refRes.referrals)
    } finally {
      setLoading(false)
    }
  }

  async function loadTransactions() {
    if (!user) return
    const res = await api.getTransactions(user.user_id)
    if (res.transactions) setTransactions(res.transactions)
  }

  async function loadReferrals() {
    if (!user) return
    const res = await api.getReferrals(user.user_id)
    if (res.referrals) setReferrals(res.referrals)
  }

  useEffect(() => {
    if (tab === 'wallet') loadTransactions()
    if (tab === 'referrals') loadReferrals()
  }, [tab])

  async function buyTariff(tariffId: number) {
    if (!user) return
    setBuyingId(tariffId)
    try {
      const res = await api.buyTariff(user.user_id, tariffId)
      if (res.error) { toast.error(res.error); return }
      toast.success('Тариф активирован!')
      loadData()
    } finally {
      setBuyingId(null)
    }
  }

  async function handleWithdraw() {
    if (!user) return
    const amount = parseFloat(withdrawAmount)
    if (!amount || amount <= 0) { toast.error('Введи сумму'); return }
    if (!withdrawPhone) { toast.error('Введи номер телефона СБП'); return }
    const res = await api.requestWithdrawal(user.user_id, amount, withdrawPhone, withdrawBank)
    if (res.error) { toast.error(res.error); return }
    toast.success('Заявка на вывод отправлена!')
    setWithdrawAmount('')
    setWithdrawPhone('')
    setWithdrawBank('')
    loadData()
    loadTransactions()
  }

  function copyRef() {
    const url = `${window.location.origin}/register?ref=${user?.referral_code}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Ссылка скопирована!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) return null

  const refUrl = `${window.location.origin}/register?ref=${user.referral_code}`

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Обзор', icon: 'LayoutDashboard' },
    { key: 'matrices', label: 'Матрицы', icon: 'Grid3X3' },
    { key: 'referrals', label: 'Рефералы', icon: 'Users' },
    { key: 'wallet', label: 'Кошелёк', icon: 'Wallet' },
  ]

  const inputCls = 'w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40'

  return (
    <div className="min-h-screen text-white">
      <DashboardHeader userName={user.name} />

      <div className="pt-16 max-w-5xl mx-auto px-4 py-6">
        {/* Balance cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 md:col-span-1 rounded-2xl p-4 border border-yellow-600/40" style={{ background: 'rgba(120, 90, 0, 0.35)', backdropFilter: 'blur(12px)' }}>
            <div className="text-white/50 text-sm mb-1">Баланс</div>
            <div className="text-2xl font-bold text-white">{balance.toLocaleString('ru')} ₽</div>
          </div>
          <div className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(5, 30, 10, 0.55)', backdropFilter: 'blur(12px)' }}>
            <div className="text-white/50 text-sm mb-1">Заработано всего</div>
            <div className="text-xl font-bold text-green-400">{totalEarned.toLocaleString('ru')} ₽</div>
          </div>
          <div className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(5, 30, 10, 0.55)', backdropFilter: 'blur(12px)' }}>
            <div className="text-white/50 text-sm mb-1">Матриц активных</div>
            <div className="text-xl font-bold text-white">{matrices.filter(m => m.status === 'active').length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1 mb-6 border border-white/10" style={{ background: 'rgba(5, 20, 10, 0.5)', backdropFilter: 'blur(12px)' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-gradient-to-r from-yellow-700 to-yellow-600 text-white'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Icon name={t.icon} size={14} />
              <span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <DashboardOverview
            refUrl={refUrl}
            referralsCount={referrals.length}
            referralCode={user.referral_code}
            copied={copied}
            onCopy={copyRef}
            tariffs={tariffs}
            matrices={matrices}
            loading={loading}
            balance={balance}
            buyingId={buyingId}
            onBuyTariff={buyTariff}
            onSwitchToOverview={() => setTab('overview')}
            inputCls={inputCls}
          />
        )}

        {tab === 'matrices' && (
          <DashboardMatrices
            matrices={matrices}
            onSwitchToOverview={() => setTab('overview')}
          />
        )}

        {tab === 'referrals' && (
          <DashboardReferrals
            refUrl={refUrl}
            referrals={referrals}
            copied={copied}
            onCopy={copyRef}
            inputCls={inputCls}
          />
        )}

        {tab === 'wallet' && (
          <DashboardWallet
            userId={user.user_id}
            balance={balance}
            transactions={transactions}
            withdrawAmount={withdrawAmount}
            withdrawPhone={withdrawPhone}
            withdrawBank={withdrawBank}
            onWithdrawAmountChange={setWithdrawAmount}
            onWithdrawPhoneChange={setWithdrawPhone}
            onWithdrawBankChange={setWithdrawBank}
            onWithdraw={handleWithdraw}
            inputCls={inputCls}
          />
        )}
      </div>
    </div>
  )
}
