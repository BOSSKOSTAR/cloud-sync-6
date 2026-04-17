import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function LandingFooter() {
  const navigate = useNavigate()
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
                onClick={() => navigate('/register')}>
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
      <footer className="py-8 px-4 border-t border-white/10 text-center text-white/30 text-sm">
        <div className="mb-4">
          <a href="https://freekassa.net" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.freekassa.net/banners/big-dark-1.png" title="Прием платежей на сайте для физических лиц и т.д." alt="Free Kassa" className="mx-auto" />
          </a>
        </div>
        © 2026 Плям про100 · Матричная система заработка
      </footer>
    </>
  )
}