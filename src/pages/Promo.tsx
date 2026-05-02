import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/icon'

const BANNERS = [
  {
    id: 1,
    title: 'Горизонтальный баннер',
    desc: 'Для сайтов, ВКонтакте, Telegram-каналов',
    url: 'https://cdn.poehali.dev/projects/37f6797b-2bcf-4239-aa52-cd5768175cd6/files/d616c9a6-4e6a-412b-8f62-e02e92772a96.jpg',
    filename: 'plyam-banner-horizontal.jpg',
    tag: 'Широкий',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 2,
    title: 'Квадратный пост',
    desc: 'Для постов ВКонтакте, Одноклассники, Telegram',
    url: 'https://cdn.poehali.dev/projects/37f6797b-2bcf-4239-aa52-cd5768175cd6/files/97fe09b4-acc2-472c-afbe-0474219adcb6.jpg',
    filename: 'plyam-banner-square.jpg',
    tag: 'Квадрат',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 3,
    title: 'Вертикальный — сторис',
    desc: 'Для сторис ВКонтакте, Telegram, Instagram',
    url: 'https://cdn.poehali.dev/projects/37f6797b-2bcf-4239-aa52-cd5768175cd6/files/f8071378-3a69-41cc-8c7a-73f2f1c4c3a2.jpg',
    filename: 'plyam-banner-stories.jpg',
    tag: 'Сторис',
    tagColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  },
]

const TEXTS = [
  {
    id: 1,
    title: 'Короткий пост',
    icon: 'Zap',
    text: `💰 Зарабатывай приглашая друзей!\n\nВход от 300 ₽ — заработок до 5 880 000 ₽\n\nТри тарифа, пять уровней матрицы.\nРегистрация бесплатно 👇\n\nплям-про100.online`,
  },
  {
    id: 2,
    title: 'Развёрнутый пост',
    icon: 'FileText',
    text: `🚀 Плям про100 — матричная система заработка\n\nКак это работает:\n1️⃣ Регистрируйся бесплатно\n2️⃣ Выбирай тариф от 300 ₽\n3️⃣ Приглашай друзей по своей ссылке\n4️⃣ Получай выплаты за каждого участника\n\n💎 Тарифы:\n• Мини — 300 ₽, заработок до 8 700 ₽\n• Минор — 6 000 ₽, заработок до 174 000 ₽\n• Мажор — 120 000 ₽, заработок до 5 880 000 ₽\n\nПрисоединяйся 👇\nплям-про100.online`,
  },
  {
    id: 3,
    title: 'Для личных сообщений',
    icon: 'MessageCircle',
    text: `Привет! 👋\n\nХочу рассказать про систему заработка Плям про100.\n\nВход от 300 ₽, приглашаешь друзей — получаешь выплаты. Всё честно и прозрачно.\n\nПосмотри сам: плям-про100.online\n\nЕсли интересно — зарегистрируйся, расскажу подробнее 😊`,
  },
]

export default function Promo() {
  const navigate = useNavigate()
  const [copiedId, setCopiedId] = useState<number | null>(null)

  function handleCopyText(id: number, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-[#050a18] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050a18]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm">На главную</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-xs font-bold">П</div>
            <span className="font-bold">Плям про<span className="text-blue-400">100</span></span>
          </div>
          <button onClick={() => navigate('/register')} className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium">
            Начать
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-28 pb-20">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 text-sm text-yellow-300 mb-4">
            <Icon name="Megaphone" size={14} />
            Рекламные материалы
          </div>
          <h1 className="text-4xl font-bold mb-3">Продвигай и зарабатывай</h1>
          <p className="text-white/50">Скачай баннеры и скопируй готовые тексты для рекламы в соцсетях</p>
        </div>

        {/* Баннеры */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <Icon name="Image" size={20} className="text-blue-400" />
            Баннеры для скачивания
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {BANNERS.map(b => (
              <div key={b.id} className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(5,25,10,0.6)', backdropFilter: 'blur(12px)' }}>
                <div className="relative aspect-video overflow-hidden bg-black/40">
                  <img src={b.url} alt={b.title} className="w-full h-full object-cover" />
                  <div className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full border font-medium ${b.tagColor}`}>
                    {b.tag}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-white mb-1">{b.title}</div>
                  <div className="text-white/40 text-xs mb-4">{b.desc}</div>
                  <a
                    href={b.url}
                    download={b.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-sm font-medium text-white"
                  >
                    <Icon name="Download" size={15} />
                    Скачать
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Готовые тексты */}
        <section>
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <Icon name="ClipboardList" size={20} className="text-green-400" />
            Готовые тексты для постов
          </h2>
          <div className="space-y-4">
            {TEXTS.map(t => (
              <div key={t.id} className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(5,25,10,0.6)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Icon name={t.icon as 'Zap'} size={16} className="text-green-400" />
                    {t.title}
                  </div>
                  <button
                    onClick={() => handleCopyText(t.id, t.text)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                      copiedId === t.id
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white border border-white/10'
                    }`}
                  >
                    <Icon name={copiedId === t.id ? 'Check' : 'Copy'} size={13} />
                    {copiedId === t.id ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>
                <pre className="text-white/60 text-sm whitespace-pre-wrap font-sans leading-relaxed bg-black/20 rounded-xl p-4 border border-white/5">
                  {t.text}
                </pre>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
