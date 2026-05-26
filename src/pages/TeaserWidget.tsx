import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const WIDGET_CODE = `<!-- AdTeaser Widget -->
<script
  src="https://adteaser.ru/widget.js"
  data-id="YOUR_SITE_ID"
  data-count="4"
  data-theme="auto"
  async
></script>`;

const STEPS = [
  {
    num: "01",
    icon: "UserPlus",
    title: "Зарегистрируйся",
    desc: "Создай аккаунт партнёра — это бесплатно. Укажи данные своего сайта.",
    color: "from-amber-500/30 to-amber-600/20 border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    num: "02",
    icon: "Code2",
    title: "Получи код",
    desc: "В личном кабинете скопируй уникальный код виджета для вашего сайта.",
    color: "from-violet-500/30 to-violet-600/20 border-violet-500/30",
    iconColor: "text-violet-400",
  },
  {
    num: "03",
    icon: "Globe",
    title: "Вставь на сайт",
    desc: "Добавь код перед </body>. Тизеры появятся автоматически и начнут приносить доход.",
    color: "from-emerald-500/30 to-emerald-600/20 border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
];

const TARIFFS = [
  { name: "Базовый",     cpm: "60",  cpc: "1.50",  min: "—",      recommended: false },
  { name: "Стандарт",    cpm: "100", cpc: "2.50",  min: "10 000", recommended: true  },
  { name: "Премиум",     cpm: "180", cpc: "4.00",  min: "50 000", recommended: false },
  { name: "Эксклюзив",  cpm: "300", cpc: "7.00",  min: "200 000", recommended: false },
];

export default function TeaserWidget() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(WIDGET_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/3 w-[500px] h-[400px]
                        rounded-full bg-emerald-700/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px]
                        rounded-full bg-violet-700/10 blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090f]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/teaser-network" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-400 to-violet-500
                             flex items-center justify-center">
              <Icon name="Zap" size={14} className="text-black" />
            </span>
            <span className="font-bold text-white">AdTeaser</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost" className="text-slate-400 hover:text-white">
              <Link to="/teaser-login">Войти</Link>
            </Button>
            <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
              <Link to="/teaser-login">Стать партнёром</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30
                          text-emerald-300 text-xs font-medium px-3 py-1 rounded-full mb-6">
            <Icon name="DollarSign" size={12} />
            Монетизация сайта без рекламных блокировщиков
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Зарабатывай
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              на своём сайте
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Разместите виджет тизеров на сайте и получайте доход за каждый показ и клик.
            Минимальная нагрузка на страницу — один тег <code className="text-emerald-400 bg-emerald-400/10 px-1 rounded">&lt;script&gt;</code>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8
                         shadow-[0_0_30px_rgba(16,185,129,0.35)]"
            >
              <Link to="/teaser-login">
                <Icon name="UserPlus" size={18} />
                Зарегистрироваться как партнёр
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-slate-300 hover:bg-white/10 px-8"
              onClick={() => document.getElementById("widget-code")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Icon name="Code2" size={18} />
              Посмотреть код
            </Button>
          </div>
        </section>

        {/* ── Steps ── */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center text-white mb-10">
            Три шага до первых денег
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`relative bg-gradient-to-br ${step.color} border rounded-2xl p-6`}
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 z-10">
                    <Icon name="ArrowRight" size={20} className="text-slate-600" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center mb-4`}>
                  <Icon name={step.icon} size={20} className={step.iconColor} />
                </div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                  Шаг {step.num}
                </span>
                <h3 className="text-white font-semibold text-lg mt-1 mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Widget code ── */}
        <section id="widget-code" className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white text-center mb-3">Код виджета</h2>
          <p className="text-slate-400 text-center text-sm mb-8">
            Вставьте код перед закрывающим тегом <code className="text-slate-300">&lt;/body&gt;</code>
          </p>

          <div className="relative bg-[#0d1117] border border-white/15 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-slate-500 text-xs">index.html</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className={`text-xs h-7 px-3 transition-colors
                  ${copied
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                {copied ? (
                  <><Icon name="Check" size={13} /> Скопировано</>
                ) : (
                  <><Icon name="Copy" size={13} /> Скопировать</>
                )}
              </Button>
            </div>

            {/* Code */}
            <pre className="p-5 text-sm text-slate-300 overflow-x-auto leading-relaxed">
              <code>{WIDGET_CODE}</code>
            </pre>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "Gauge",   text: "Не замедляет сайт — async загрузка" },
              { icon: "Shield",  text: "Только проверенная реклама" },
              { icon: "Smartphone", text: "Адаптивный — работает на мобильных" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2.5 bg-white/5 border border-white/10
                                           rounded-lg px-3 py-3 text-sm text-slate-400">
                <Icon name={f.icon} size={16} className="text-emerald-400 shrink-0" />
                {f.text}
              </div>
            ))}
          </div>
        </section>

        {/* ── Tariffs table ── */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white text-center mb-3">Выплаты партнёрам</h2>
          <p className="text-slate-400 text-center text-sm mb-8">
            Чем больше трафик — тем выше ставка. Выплаты каждые 2 недели на карту / СБП.
          </p>

          <div className="rounded-xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 px-5 py-3 bg-white/5 border-b border-white/10
                            text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span>Тариф</span>
              <span className="text-center">CPM (за 1000 показов)</span>
              <span className="text-center">CPC (за клик)</span>
              <span className="text-center">Посетителей / мес.</span>
            </div>

            {TARIFFS.map((t, i) => (
              <div
                key={t.name}
                className={`grid grid-cols-4 px-5 py-4 items-center text-sm transition-colors hover:bg-white/5
                  ${t.recommended ? "bg-amber-500/5 border-amber-500/20 border-y" : ""}
                  ${i < TARIFFS.length - 1 && !t.recommended ? "border-b border-white/5" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{t.name}</span>
                  {t.recommended && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold
                                     bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      ТОП
                    </span>
                  )}
                </div>
                <span className="text-center text-emerald-400 font-semibold">{t.cpm} ₽</span>
                <span className="text-center text-amber-400 font-semibold">{t.cpc} ₽</span>
                <span className="text-center text-slate-400">{t.min === "—" ? <span className="text-slate-600">—</span> : `от ${t.min}`}</span>
              </div>
            ))}
          </div>

          <p className="text-slate-600 text-xs text-center mt-3">
            * Ставки актуальны для RU/CIS трафика. Итоговые выплаты зависят от качества аудитории.
          </p>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-gradient-to-br from-emerald-500/10 to-violet-500/10
                          border border-emerald-500/20 rounded-2xl px-8 py-10">
            <Icon name="TrendingUp" size={40} className="text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Готов начать зарабатывать?</h2>
            <p className="text-slate-400 text-sm mb-6">
              Присоединяйтесь к 300+ партнёрам, которые уже монетизируют свои сайты с AdTeaser.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10
                         shadow-[0_0_30px_rgba(16,185,129,0.35)]"
            >
              <Link to="/teaser-login">
                <Icon name="UserPlus" size={18} />
                Зарегистрироваться бесплатно
              </Link>
            </Button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center
                          justify-between gap-4 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-violet-500
                               flex items-center justify-center">
                <Icon name="Zap" size={12} className="text-black" />
              </span>
              <span className="text-slate-400 font-semibold">AdTeaser</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/teaser-network" className="hover:text-slate-300 transition-colors">Каталог</Link>
              <Link to="/teaser-login" className="hover:text-slate-300 transition-colors">Рекламодателям</Link>
              <a href="mailto:support@adteaser.ru" className="hover:text-slate-300 transition-colors">Поддержка</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
