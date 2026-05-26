import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTeaserAuth } from "@/context/TeaserAuthContext";
import { getTeasers, recordClick, recordView, Teaser } from "@/lib/teaserApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/ui/icon";
import TeaserCard from "@/components/teaser/TeaserCard";
import TeaserHero from "@/components/teaser/TeaserHero";

const CATEGORIES = [
  { value: "all",    label: "Все" },
  { value: "health", label: "Здоровье" },
  { value: "money",  label: "Деньги" },
  { value: "tech",   label: "Технологии" },
  { value: "beauty", label: "Красота" },
  { value: "shop",   label: "Товары" },
];

const LIMIT = 20;

const STAT_CARDS = [
  { icon: "MousePointerClick", value: "50 000+", label: "кликов в день",    color: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20" },
  { icon: "Users",             value: "1 200+",  label: "рекламодателей",   color: "text-violet-400",  bg: "bg-violet-400/10 border-violet-400/20" },
  { icon: "Globe",             value: "300+",    label: "сайтов-партнёров", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
];

const HOW_STEPS = [
  { num: "01", icon: "UserPlus",    title: "Регистрируйся",  desc: "Создай аккаунт рекламодателя за 1 минуту. Никаких скрытых условий." },
  { num: "02", icon: "ImagePlus",   title: "Создай тизер",   desc: "Загрузи картинку, заголовок и ссылку. Тизер уйдёт на модерацию." },
  { num: "03", icon: "TrendingUp",  title: "Получай клики",  desc: "После одобрения тизер появится в сети на тысячах сайтов-партнёров." },
];

export default function TeaserNetwork() {
  const { user } = useTeaserAuth();
  const [teasers, setTeasers] = useState<Teaser[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTeasers = async (cat: string, off: number, append = false) => {
    try {
      const data = await getTeasers({ category: cat, limit: LIMIT, offset: off });
      const list = data.teasers ?? [];
      setTeasers((prev) => (append ? [...prev, ...list] : list));
      setHasMore(list.length === LIMIT);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    fetchTeasers(category, 0, false);
  }, [category]);

  const handleLoadMore = () => {
    const next = offset + LIMIT;
    setOffset(next);
    setLoadingMore(true);
    fetchTeasers(category, next, true);
  };

  const handleCardClick = async (teaser: Teaser) => {
    try {
      recordView(teaser.id);
      const result = await recordClick(teaser.id);
      const url = result.target_url || teaser.target_url;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      if (teaser.target_url) window.open(teaser.target_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090f]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link to="/teaser-network" className="flex items-center gap-2 shrink-0">
            <span className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-400 to-violet-500
                             flex items-center justify-center">
              <Icon name="Zap" size={15} className="text-black" />
            </span>
            <span className="font-bold text-white text-base">AdTeaser</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#catalog" className="hover:text-white transition-colors">Каталог</a>
            <Link to="/teaser-login" className="hover:text-white transition-colors">Рекламодателям</Link>
            <Link to="/teaser-widget" className="hover:text-white transition-colors">Партнёрам</Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                <Link to="/teaser-dashboard">
                  <Icon name="LayoutDashboard" size={14} />
                  Кабинет
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost" className="text-slate-300 hover:text-white">
                  <Link to="/teaser-login">Войти</Link>
                </Button>
                <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                  <Link to="/teaser-login">Начать</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <TeaserHero />

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0a0d15] border-y border-white/5 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${s.bg}`}>
              <span className={`${s.color}`}>
                <Icon name={s.icon} size={28} />
              </span>
              <div>
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Catalog ─────────────────────────────────────────────────────────── */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 py-12">
        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
                ${category === cat.value
                  ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_16px_rgba(245,158,11,0.4)]"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
                <Skeleton className="aspect-video w-full bg-white/10" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                  <Skeleton className="h-3 w-full bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : teasers.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg">Тизеры не найдены</p>
            <p className="text-sm mt-1">Попробуйте другую категорию</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {teasers.map((t) => (
              <TeaserCard key={t.id} teaser={t} onClick={() => handleCardClick(t)} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-10">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              variant="outline"
              className="border-white/20 text-slate-300 hover:bg-white/10 px-8"
            >
              {loadingMore ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="ChevronDown" size={16} />
                  Загрузить ещё
                </>
              )}
            </Button>
          </div>
        )}
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="bg-[#0a0d15] border-t border-white/5 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Как это работает</h2>
            <p className="text-slate-400">Запустить рекламу можно за 3 простых шага</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-start gap-4
                                              bg-white/5 border border-white/10 rounded-2xl p-6">
                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 z-10">
                    <Icon name="ArrowRight" size={20} className="text-slate-600" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-violet-500/30
                                 border border-amber-500/30 flex items-center justify-center">
                  <Icon name={step.icon} size={20} className="text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{step.num}</span>
                  <h3 className="text-white font-semibold text-lg mt-0.5">{step.title}</h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold
                         shadow-[0_0_30px_rgba(245,158,11,0.3)] px-10"
            >
              <Link to="/teaser-login">
                <Icon name="Rocket" size={18} />
                Начать прямо сейчас
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#07090f] py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center
                        justify-between gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-violet-500
                             flex items-center justify-center">
              <Icon name="Zap" size={12} className="text-black" />
            </span>
            <span className="text-slate-400 font-semibold">AdTeaser</span>
            <span className="ml-2">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/teaser-login" className="hover:text-slate-300 transition-colors">Рекламодателям</Link>
            <Link to="/teaser-widget" className="hover:text-slate-300 transition-colors">Партнёрам</Link>
            <a href="mailto:support@adteaser.ru" className="hover:text-slate-300 transition-colors">Поддержка</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
