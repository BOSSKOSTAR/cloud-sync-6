import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTeaserAuth } from "@/context/TeaserAuthContext";
import { getMyTeasers, createTeaser, Teaser } from "@/lib/teaserApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Icon from "@/components/ui/icon";

const YOOMONEY_API = "https://functions.poehali.dev/08fdd89a-d3bd-4126-a69a-3db806451fd8";
const TEASERS_API = "https://functions.poehali.dev/8636b128-5f4c-4d28-9ecf-cf64e3cac45b";

interface Package {
  id: number;
  name: string;
  views_count: number;
  price: number;
  description: string;
}

interface Purchase {
  id: number;
  teaser_id: number | null;
  teaser_title: string;
  package_name: string;
  views_count: number;
  amount: number;
  status: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "general", label: "Общее" },
  { value: "health",  label: "Здоровье" },
  { value: "money",   label: "Деньги" },
  { value: "tech",    label: "Технологии" },
  { value: "beauty",  label: "Красота" },
  { value: "shop",    label: "Товары" },
];

const CAT_LABELS: Record<string, string> = {
  general: "Общее", health: "Здоровье", money: "Деньги",
  tech: "Технологии", beauty: "Красота", shop: "Товары",
};

const EMPTY_FORM = {
  title: "", description: "", image_url: "", target_url: "", category: "general",
};

export default function TeaserDashboard() {
  const { user, token, logout } = useTeaserAuth();
  const navigate = useNavigate();

  const [teasers, setTeasers]       = useState<Teaser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");

  const [packages, setPackages]     = useState<Package[]>([]);
  const [purchases, setPurchases]   = useState<Purchase[]>([]);
  const [buyDialog, setBuyDialog]   = useState<{ pkg: Package; teaserId: number | null } | null>(null);
  const [paying, setPaying]         = useState(false);
  const [selectedTeaser, setSelectedTeaser] = useState<number | "">("");

  useEffect(() => {
    if (!user || !token) {
      navigate("/teaser-login");
      return;
    }
    loadTeasers();
    loadPackages();
    loadPurchases();
  }, [user, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTeasers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMyTeasers(token);
      setTeasers(data.teasers ?? []);
    } finally {
      setLoading(false);
    }
  };

  const loadPackages = async () => {
    const res = await fetch(`${TEASERS_API}/packages`);
    const data = await res.json();
    if (data.packages) setPackages(data.packages);
  };

  const loadPurchases = async () => {
    if (!token) return;
    const res = await fetch(`${TEASERS_API}/purchases`, {
      headers: { "X-User-Id": token },
    });
    const data = await res.json();
    if (data.purchases) setPurchases(data.purchases);
  };

  const handleYooMoneyPay = async () => {
    if (!buyDialog || !user) return;
    setPaying(true);
    try {
      const res = await fetch(YOOMONEY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_id: buyDialog.pkg.id,
          user_id: user.id,
          teaser_id: selectedTeaser || 0,
        }),
      });
      const data = await res.json();
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } finally {
      setPaying(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim() || !form.target_url.trim()) {
      setFormError("Заголовок и ссылка обязательны");
      return;
    }
    if (!token) return;
    setSaving(true);
    try {
      await createTeaser(token, form);
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      loadTeasers();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Ошибка создания тизера");
    } finally {
      setSaving(false);
    }
  };

  const totalViews  = teasers.reduce((s, t) => s + (t.views  || 0), 0);
  const totalClicks = teasers.reduce((s, t) => s + (t.clicks || 0), 0);
  const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px]
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
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/40
                              flex items-center justify-center">
                <Icon name="User" size={14} className="text-violet-400" />
              </div>
              {user.name}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={logout}
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              <Icon name="LogOut" size={14} />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Личный кабинет</h1>
            <p className="text-slate-400 text-sm mt-0.5">Управляйте рекламными объявлениями</p>
          </div>
          <Button
            onClick={() => { setForm(EMPTY_FORM); setFormError(""); setDialogOpen(true); }}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold
                       shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <Icon name="Plus" size={16} />
            Создать тизер
          </Button>
        </div>

        <Tabs defaultValue="teasers" className="w-full">
        <TabsList className="mb-6 bg-white/5 border border-white/10">
          <TabsTrigger value="teasers" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            <Icon name="LayoutGrid" size={14} className="mr-1.5" />Мои тизеры
          </TabsTrigger>
          <TabsTrigger value="tariffs" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            <Icon name="Zap" size={14} className="mr-1.5" />Купить показы
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            <Icon name="Receipt" size={14} className="mr-1.5" />История оплат
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teasers">
        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Тизеров",    value: teasers.length,                       icon: "LayoutGrid",       color: "text-slate-300" },
            { label: "Просмотров", value: totalViews.toLocaleString("ru-RU"),    icon: "Eye",              color: "text-blue-400" },
            { label: "Кликов",     value: totalClicks.toLocaleString("ru-RU"),   icon: "MousePointerClick", color: "text-amber-400" },
            { label: "Средний CTR", value: `${avgCtr}%`,                         icon: "TrendingUp",       color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Icon name={s.icon} size={13} />
                {s.label}
              </div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : teasers.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <Icon name="ImagePlus" size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400 text-lg font-medium">Нет тизеров</p>
            <p className="text-slate-600 text-sm mt-1 mb-6">Создайте первое объявление</p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
            >
              <Icon name="Plus" size={15} />
              Создать тизер
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3
                            bg-white/5 border-b border-white/10 text-xs text-slate-500 font-medium
                            uppercase tracking-wider">
              <span>Тизер</span>
              <span className="hidden md:block">Категория</span>
              <span>Статус</span>
              <span className="hidden sm:block">Просмотры</span>
              <span className="hidden sm:block">Клики</span>
              <span>CTR</span>
            </div>

            {/* Table rows */}
            {teasers.map((t, i) => {
              const ctr = t.views > 0
                ? ((t.clicks / t.views) * 100).toFixed(1)
                : "0.0";
              return (
                <div
                  key={t.id}
                  className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center
                               px-4 py-4 text-sm transition-colors hover:bg-white/5
                               ${i < teasers.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  {/* Title + preview */}
                  <div className="flex items-center gap-3 min-w-0">
                    {t.image_url ? (
                      <img
                        src={t.image_url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-800"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Icon name="Image" size={16} className="text-slate-600" />
                      </div>
                    )}
                    <span className="text-white font-medium truncate">{t.title}</span>
                  </div>

                  {/* Category */}
                  <span className="hidden md:block text-slate-400 shrink-0">
                    {CAT_LABELS[t.category] ?? t.category}
                  </span>

                  {/* Status */}
                  <span className="shrink-0">
                    {t.is_approved ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                       bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Активен
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                       bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Модерация
                      </span>
                    )}
                  </span>

                  {/* Views */}
                  <span className="hidden sm:block text-slate-400 shrink-0">
                    {(t.views || 0).toLocaleString("ru-RU")}
                  </span>

                  {/* Clicks */}
                  <span className="hidden sm:block text-slate-300 font-medium shrink-0">
                    {(t.clicks || 0).toLocaleString("ru-RU")}
                  </span>

                  {/* CTR */}
                  <span className="text-amber-400 font-semibold shrink-0">{ctr}%</span>
                  {/* Views left */}
                  {t.views_limit != null && t.views_limit > 0 && (
                    <span className="hidden lg:block text-xs text-slate-500 shrink-0">
                      {Math.max(0, t.views_limit - (t.views_used ?? 0)).toLocaleString("ru-RU")} ост.
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </TabsContent>

        {/* ── ТАРИФЫ ── */}
        <TabsContent value="tariffs">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Купить показы</h2>
            <p className="text-slate-400 text-sm mt-1">Выберите пакет и тизер, которому хотите добавить показы</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg, i) => {
              const isPopular = i === 2;
              const cpm = (pkg.price / pkg.views_count * 1000).toFixed(0);
              return (
                <div key={pkg.id} className={`relative rounded-2xl border p-6 flex flex-col gap-4 transition-all
                  ${isPopular
                    ? "border-amber-500/60 bg-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                    : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        Популярный
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-lg">{pkg.name}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{pkg.description}</p>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-white">{pkg.price.toLocaleString("ru-RU")} ₽</span>
                    <div className="text-slate-500 text-xs mt-1">{pkg.views_count.toLocaleString("ru-RU")} показов · {cpm} ₽ / 1000</div>
                  </div>
                  <Button
                    onClick={() => setBuyDialog({ pkg, teaserId: null })}
                    className={`w-full font-bold ${isPopular
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                      : "bg-white/10 hover:bg-white/20 text-white"}`}
                  >
                    Купить
                  </Button>
                </div>
              );
            })}
            {packages.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-500">
                <Icon name="Loader2" size={24} className="mx-auto animate-spin mb-2" />
                Загрузка тарифов...
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── ИСТОРИЯ ОПЛАТ ── */}
        <TabsContent value="history">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">История оплат</h2>
          </div>
          {purchases.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
              <Icon name="ReceiptText" size={40} className="mx-auto mb-3 text-slate-700" />
              <p className="text-slate-400">Покупок пока нет</p>
              <p className="text-slate-600 text-sm mt-1">Купите первый пакет показов</p>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 bg-white/5
                              border-b border-white/10 text-xs text-slate-500 font-medium uppercase tracking-wider">
                <span>Тизер</span>
                <span>Пакет</span>
                <span className="hidden sm:block">Показы</span>
                <span>Сумма</span>
              </div>
              {purchases.map((p, i) => (
                <div key={p.id} className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center
                  px-4 py-3 text-sm ${i < purchases.length - 1 ? "border-b border-white/5" : ""}`}>
                  <span className="text-white truncate">{p.teaser_title}</span>
                  <span className="text-slate-400 shrink-0">{p.package_name}</span>
                  <span className="hidden sm:block text-slate-400 shrink-0">{p.views_count.toLocaleString("ru-RU")}</span>
                  <span className="text-amber-400 font-semibold shrink-0">{p.amount.toLocaleString("ru-RU")} ₽</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        </Tabs>
      </main>

      {/* ── Buy dialog ── */}
      <Dialog open={!!buyDialog} onOpenChange={(o) => !o && setBuyDialog(null)}>
        <DialogContent className="bg-[#0d1117] border-white/15 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              Купить пакет «{buyDialog?.pkg.name}»
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">Показов</p>
                <p className="text-white font-bold text-xl">{buyDialog?.pkg.views_count.toLocaleString("ru-RU")}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Сумма</p>
                <p className="text-amber-400 font-bold text-xl">{buyDialog?.pkg.price.toLocaleString("ru-RU")} ₽</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Привязать к тизеру (необязательно)</Label>
              <Select value={String(selectedTeaser)} onValueChange={(v) => setSelectedTeaser(v === "" ? "" : Number(v))}>
                <SelectTrigger className="bg-white/5 border-white/15 text-white focus:ring-amber-500/50">
                  <SelectValue placeholder="Выберите тизер..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1117] border-white/15">
                  <SelectItem value="" className="text-slate-400 focus:bg-white/10 focus:text-white">— Без привязки —</SelectItem>
                  {teasers.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)} className="text-slate-300 focus:bg-white/10 focus:text-white">
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3
                            flex items-center gap-3 text-sm text-blue-300">
              <Icon name="Info" size={15} className="shrink-0" />
              После оплаты показы зачислятся автоматически в течение нескольких минут
            </div>

            <Button
              onClick={handleYooMoneyPay}
              disabled={paying}
              className="w-full py-6 rounded-xl bg-[#8B3FFD] hover:bg-[#7B2FED] text-white
                         font-bold text-base transition-colors shadow-[0_0_20px_rgba(139,63,253,0.3)]"
            >
              {paying ? (
                <><Icon name="Loader2" size={16} className="animate-spin mr-2" />Открываю ЮМани...</>
              ) : (
                <><Icon name="Wallet" size={16} className="mr-2" />Оплатить {buyDialog?.pkg.price.toLocaleString("ru-RU")} ₽ через ЮМани</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Create dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0d1117] border-white/15 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">Создать тизер</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Заголовок <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="Привлекательный заголовок до 150 символов"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                maxLength={150}
                required
                className="bg-white/5 border-white/15 text-white placeholder:text-slate-600
                           focus-visible:ring-amber-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Описание</Label>
              <Input
                placeholder="Краткое описание (необязательно)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-white/5 border-white/15 text-white placeholder:text-slate-600
                           focus-visible:ring-amber-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">URL изображения</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                type="url"
                className="bg-white/5 border-white/15 text-white placeholder:text-slate-600
                           focus-visible:ring-amber-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Целевая ссылка <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="https://your-site.com/landing"
                value={form.target_url}
                onChange={(e) => setForm({ ...form, target_url: e.target.value })}
                type="url"
                required
                className="bg-white/5 border-white/15 text-white placeholder:text-slate-600
                           focus-visible:ring-amber-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Категория</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger className="bg-white/5 border-white/15 text-white focus:ring-amber-500/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1117] border-white/15">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="text-slate-300 focus:bg-white/10 focus:text-white">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10
                              border border-red-400/20 rounded-lg px-3 py-2">
                <Icon name="AlertCircle" size={14} />
                {formError}
              </div>
            )}

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5
                            text-amber-300 text-xs flex items-start gap-2">
              <Icon name="Info" size={13} className="mt-0.5 shrink-0" />
              После создания тизер уйдёт на модерацию. Обычно это занимает до 24 часов.
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold
                           shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                {saving ? (
                  <><Icon name="Loader2" size={15} className="animate-spin" /> Сохранение...</>
                ) : (
                  <><Icon name="Send" size={15} /> Отправить на модерацию</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}