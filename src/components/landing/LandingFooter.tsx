import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

export default function LandingFooter() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const siteUrl = window.location.origin
  const pendingRef = localStorage.getItem('pending_ref')
  const toRegister = pendingRef ? `/register?ref=${pendingRef}` : '/register'
  const shareText = 'Заходи в Плям про100 — зарабатывай приглашая друзей! Вход от 300 ₽'

  function handleCopy() {
    navigator.clipboard.writeText(siteUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-b from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#3b82f620_0%,_transparent_70%)]" />
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold mb-4">Готов начать?</h2>
              <p className="text-white/50 mb-8">Регистрация бесплатна. Вход в матрицу от 300 ₽.</p>
              <Button size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
                onClick={() => navigate(toRegister)}>
                Зарегистрироваться бесплатно
              </Button>
              <div className="mt-6 flex justify-center">
                <iframe
                  src="https://yoomoney.ru/quickpay/fundraise/button?billNumber=1H7175FPPE1.260417&"
                  width="330"
                  height="50"
                  frameBorder={0}
                  allowTransparency={true}
                  scrolling="no"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-white/30 text-xs">Поделиться сайтом:</span>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-colors text-xs px-3 py-1.5 rounded-full font-medium"
            >
              <Icon name="Send" size={12} /> Telegram
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + siteUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 transition-colors text-xs px-3 py-1.5 rounded-full font-medium"
            >
              <Icon name="MessageCircle" size={12} /> WhatsApp
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-white/5 border border-white/15 text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors text-xs px-3 py-1.5 rounded-full font-medium"
            >
              <Icon name={copied ? 'Check' : 'Link'} size={12} />
              {copied ? 'Скопировано!' : 'Копировать ссылку'}
            </button>
          </div>
          <a href="/promo" className="flex items-center gap-1.5 text-yellow-400/70 hover:text-yellow-400 transition-colors text-xs font-medium">
            <Icon name="Megaphone" size={13} />
            Рекламные материалы
          </a>
          <div className="text-white/30 text-sm">© 2026 Плям про100 · Матричная система заработка</div>
        </div>
      </footer>
    </>
  )
}