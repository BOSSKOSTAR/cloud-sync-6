import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { logout } from '@/lib/api'
import Icon from '@/components/ui/icon'

interface Props {
  userName: string
}

export default function DashboardHeader({ userName }: Props) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: 'rgba(5, 20, 10, 0.85)' }}>
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center text-xs font-bold text-green-900">П</div>
          <span className="font-bold text-white">Плям про<span className="text-yellow-400">100</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-sm hidden md:block">{userName}</span>
          <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" onClick={() => { logout(); navigate('/') }}>
            <Icon name="LogOut" size={16} />
          </Button>
        </div>
      </div>
    </header>
  )
}
