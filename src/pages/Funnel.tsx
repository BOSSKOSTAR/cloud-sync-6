import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export default function Funnel() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0a1a0a 0%, #0d2010 50%, #0a1a0a 100%)" }}>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-yellow-600/40 text-yellow-300" style={{ background: "rgba(120,90,0,0.25)" }}>
          <Icon name="Sparkles" size={13} />
          Матричная система заработка
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight">
          Плям <span style={{ background: "linear-gradient(90deg,#f5c842,#e6a800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Про100</span>
        </h1>

        <p className="text-lg sm:text-2xl text-white/70 mb-3 max-w-xl">
          Зарабатывай приглашая друзей.<br />Три тарифа — три уровня дохода.
        </p>

        <p className="text-yellow-400 font-semibold text-base mb-10">
          Вход от 300 ₽ · Заработок до 5 880 000 ₽
        </p>

        <a href="/register" className="w-full max-w-xs">
          <Button className="w-full text-lg py-6 font-bold rounded-2xl" style={{ background: "linear-gradient(90deg,#b8860b,#d4a017)", color: "#fff" }}>
            Начать зарабатывать
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Button>
        </a>
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section className="px-4 py-12 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Как это работает</h2>
        <div className="space-y-4">
          {[
            { icon: "UserPlus", title: "Регистрируйся", desc: "Выбери тариф от 300 ₽ и войди в систему" },
            { icon: "Share2", title: "Приглашай друзей", desc: "Делись реферальной ссылкой в соцсетях и мессенджерах" },
            { icon: "TrendingUp", title: "Получай доход", desc: "Зарабатывай с каждого участника в твоей матрице" },
            { icon: "Banknote", title: "Выводи деньги", desc: "Выводи заработанное на карту через СБП в любое время" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 rounded-2xl p-4 border border-white/10" style={{ background: "rgba(10,35,15,0.6)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(120,90,0,0.35)", border: "1px solid rgba(180,140,0,0.4)" }}>
                <Icon name={item.icon} size={18} className="text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-white/50 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ТАРИФЫ */}
      <section className="px-4 py-12 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Тарифы</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Мини", price: "300 ₽", earn: "до 37 800 ₽" },
            { name: "Миди", price: "600 ₽", earn: "до 226 800 ₽", featured: true },
            { name: "Мажор", price: "1 200 ₽", earn: "до 5 880 000 ₽" },
          ].map((t, i) => (
            <div key={i} className={`rounded-2xl p-4 text-center border flex flex-col gap-2 ${t.featured ? "border-yellow-500/60" : "border-white/10"}`} style={{ background: t.featured ? "rgba(120,90,0,0.3)" : "rgba(10,35,15,0.6)" }}>
              {t.featured && <span className="text-xs text-yellow-300 font-semibold">Популярный</span>}
              <p className="font-bold text-white">{t.name}</p>
              <p className="text-yellow-400 font-black text-lg">{t.price}</p>
              <p className="text-white/50 text-xs">{t.earn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section className="px-4 py-12 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Связаться с нами</h2>
        <div className="space-y-3">
          <a
            href="https://vk.me/join/le0TfTDPUfyS3pcgbVYzo4FWXVrHXqyHWvY="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl p-4 border border-white/10 hover:border-blue-400/40 transition-all"
            style={{ background: "rgba(30,60,140,0.25)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(30,60,140,0.5)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 15.978h-1.588c-.6 0-.784-.477-1.86-1.558-1.008-.924-1.392-.924-1.392-.924s-.192 0-.192.924v1.404c0 .384-.108.558-.924.558-1.5 0-3.192-.924-4.392-2.604-1.8-2.508-2.292-4.404-2.292-4.404s-.096-.384.308-.384h1.596c.384 0 .516.192.66.576 0 0 .852 2.892 2.292 4.272.588.588.924.672.924.288V9.984c-.048-1.008-.576-1.092-.576-1.092s-.288-.048 0-.384c.288-.336 1.344-.24 1.344-.24h2.688c.384 0 .48.192.48.576v4.32c0 .48.192.576.384.576.384 0 .768-.384 1.536-1.152 1.2-1.2 2.016-3.072 2.016-3.072s.192-.384.576-.384h1.596c.48 0 .576.24.48.576 0 0-.924 2.688-3.024 4.8z"/></svg>
            </div>
            <div>
              <p className="font-semibold text-white">Чат ВКонтакте</p>
              <p className="text-white/40 text-sm">Задай вопрос — ответим быстро</p>
            </div>
            <Icon name="ChevronRight" size={18} className="text-white/30 ml-auto" />
          </a>

          <a
            href="/"
            className="flex items-center gap-4 rounded-2xl p-4 border border-white/10 hover:border-yellow-400/40 transition-all"
            style={{ background: "rgba(10,35,15,0.6)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(120,90,0,0.35)", border: "1px solid rgba(180,140,0,0.4)" }}>
              <Icon name="Globe" size={18} className="text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Сайт плям-про100.online</p>
              <p className="text-white/40 text-sm">Регистрация и личный кабинет</p>
            </div>
            <Icon name="ChevronRight" size={18} className="text-white/30 ml-auto" />
          </a>
        </div>
      </section>

      {/* CTA ВНИЗУ */}
      <section className="px-4 py-12 text-center">
        <a href="/register" className="inline-block w-full max-w-xs">
          <Button className="w-full text-lg py-6 font-bold rounded-2xl" style={{ background: "linear-gradient(90deg,#b8860b,#d4a017)", color: "#fff" }}>
            Зарегистрироваться сейчас
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Button>
        </a>
        <p className="text-white/30 text-xs mt-4">Вход от 300 ₽ · Вывод через СБП</p>
      </section>

    </div>
  );
}
