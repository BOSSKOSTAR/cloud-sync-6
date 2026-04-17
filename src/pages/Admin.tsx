import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

const ADMIN_URL = "https://functions.poehali.dev/fd69d698-1f88-4fda-b35b-73645337fa4d";

function api(path: string, method = "GET", token: string, body?: object) {
  return fetch(`${ADMIN_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => r.json());
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [banners, setBanners] = useState<Record<string, unknown>[]>([]);
  const [news, setNews] = useState<Record<string, unknown>[]>([]);
  const [reviews, setReviews] = useState<Record<string, unknown>[]>([]);
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [prestart, setPrestart] = useState(() => localStorage.getItem("site_prestart") === "1");

  const [dialog, setDialog] = useState<{ type: string; item?: Record<string, unknown> } | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});

  async function login() {
    setLoading(true);
    const res = await api("/", "GET", token);
    setLoading(false);
    if (res.status === "ok") {
      localStorage.setItem("admin_token", token);
      setAuthed(true);
      loadAll();
    } else {
      toast.error("Неверный пароль");
    }
  }

  async function loadAll() {
    const [b, n, r, u] = await Promise.all([
      api("/banners", "GET", token),
      api("/news", "GET", token),
      api("/reviews", "GET", token),
      api("/users", "GET", token),
    ]);
    if (Array.isArray(b)) setBanners(b);
    if (Array.isArray(n)) setNews(n);
    if (Array.isArray(r)) setReviews(r);
    if (Array.isArray(u)) setUsers(u);
  }

  useEffect(() => {
    if (token) {
      api("/", "GET", token).then((res) => {
        if (res.status === "ok") { setAuthed(true); loadAll(); }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    const { type, item } = dialog!;
    const isEdit = !!item?.id;
    const path = `/${type}${isEdit ? `/${item.id}` : ""}`;
    const method = isEdit ? "PUT" : "POST";
    await api(path, method, token, form);
    toast.success(isEdit ? "Сохранено" : "Создано");
    setDialog(null);
    loadAll();
  }

  async function remove(type: string, id: number) {
    if (!confirm("Удалить?")) return;
    await api(`/${type}/${id}`, "DELETE", token);
    toast.success("Удалено");
    loadAll();
  }

  async function toggleReview(item: Record<string, unknown>) {
    await api(`/reviews/${item.id}`, "PUT", token, { ...item, is_approved: !item.is_approved });
    loadAll();
  }

  function openCreate(type: string) {
    setForm({});
    setDialog({ type });
  }

  function openEdit(type: string, item: Record<string, unknown>) {
    setForm({ ...item });
    setDialog({ type, item });
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">Вход в админ-панель</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
            <Button className="w-full" onClick={login} disabled={loading}>
              {loading ? "Проверка..." : "Войти"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Админ-панель</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5">
            <Icon name="Clock" size={15} className={prestart ? "text-yellow-500" : "text-muted-foreground"} />
            <Label htmlFor="prestart-toggle" className="text-sm cursor-pointer select-none">
              Режим «Скоро открытие»
            </Label>
            <Switch
              id="prestart-toggle"
              checked={prestart}
              onCheckedChange={(v) => {
                setPrestart(v);
                localStorage.setItem("site_prestart", v ? "1" : "0");
                toast.success(v ? "Заглушка включена — сайт закрыт для посетителей" : "Заглушка отключена — сайт открыт");
              }}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => { localStorage.removeItem("admin_token"); setAuthed(false); }}>
            <Icon name="LogOut" size={16} className="mr-2" /> Выйти
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="banners">
          <TabsList className="mb-6">
            <TabsTrigger value="banners">Баннеры ({banners.length})</TabsTrigger>
            <TabsTrigger value="news">Новости ({news.length})</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы ({reviews.length})</TabsTrigger>
            <TabsTrigger value="users">Пользователи ({users.length})</TabsTrigger>
          </TabsList>

          {/* BANNERS */}
          <TabsContent value="banners">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Баннеры</h2>
              <Button size="sm" onClick={() => openCreate("banners")}><Icon name="Plus" size={16} className="mr-2" />Добавить</Button>
            </div>
            <div className="space-y-3">
              {banners.map((b) => (
                <Card key={b.id}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-sm text-muted-foreground">{b.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={b.is_active ? "default" : "secondary"}>{b.is_active ? "Активен" : "Скрыт"}</Badge>
                      <Button size="icon" variant="ghost" onClick={() => openEdit("banners", b)}><Icon name="Pencil" size={16} /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove("banners", b.id)}><Icon name="Trash2" size={16} /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {banners.length === 0 && <p className="text-muted-foreground text-sm">Баннеров пока нет</p>}
            </div>
          </TabsContent>

          {/* NEWS */}
          <TabsContent value="news">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Новости</h2>
              <Button size="sm" onClick={() => openCreate("news")}><Icon name="Plus" size={16} className="mr-2" />Добавить</Button>
            </div>
            <div className="space-y-3">
              {news.map((n) => (
                <Card key={n.id}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground">{new Date(n.created_at).toLocaleDateString("ru-RU")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={n.is_published ? "default" : "secondary"}>{n.is_published ? "Опубликована" : "Черновик"}</Badge>
                      <Button size="icon" variant="ghost" onClick={() => openEdit("news", n)}><Icon name="Pencil" size={16} /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove("news", n.id)}><Icon name="Trash2" size={16} /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {news.length === 0 && <p className="text-muted-foreground text-sm">Новостей пока нет</p>}
            </div>
          </TabsContent>

          {/* REVIEWS */}
          <TabsContent value="reviews">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Отзывы</h2>
              <Button size="sm" onClick={() => openCreate("reviews")}><Icon name="Plus" size={16} className="mr-2" />Добавить</Button>
            </div>
            <div className="space-y-3">
              {reviews.map((r) => (
                <Card key={r.id}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <p className="font-medium">{r.author_name} — {"⭐".repeat(r.rating)}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{r.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={r.is_approved} onCheckedChange={() => toggleReview(r)} />
                      <span className="text-xs text-muted-foreground">{r.is_approved ? "Одобрен" : "На модерации"}</span>
                      <Button size="icon" variant="ghost" onClick={() => openEdit("reviews", r)}><Icon name="Pencil" size={16} /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove("reviews", r.id)}><Icon name="Trash2" size={16} /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {reviews.length === 0 && <p className="text-muted-foreground text-sm">Отзывов пока нет</p>}
            </div>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users">
            <h2 className="text-lg font-semibold mb-4">Пользователи</h2>
            <div className="space-y-3">
              {users.map((u) => (
                <Card key={u.id}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email || "—"}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p>Баланс: <span className="font-medium">{Number(u.balance).toFixed(2)} ₽</span></p>
                      <p className="text-muted-foreground">Операций: {u.tx_count}</p>
                      <p className="text-muted-foreground text-xs">
                        {u.last_activity ? `Активен: ${new Date(u.last_activity).toLocaleDateString("ru-RU")}` : `Регистрация: ${new Date(u.created_at).toLocaleDateString("ru-RU")}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {users.length === 0 && <p className="text-muted-foreground text-sm">Пользователей пока нет</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* DIALOG */}
      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialog?.item ? "Редактировать" : "Создать"}{" "}
              {{ banners: "баннер", news: "новость", reviews: "отзыв" }[dialog?.type || ""] || ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {dialog?.type === "banners" && (
              <>
                <div><Label>Заголовок</Label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Подзаголовок</Label><Input value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
                <div><Label>Ссылка на изображение</Label><Input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
                <div><Label>Текст кнопки</Label><Input value={form.button_text || ""} onChange={(e) => setForm({ ...form, button_text: e.target.value })} /></div>
                <div><Label>Ссылка кнопки</Label><Input value={form.button_link || ""} onChange={(e) => setForm({ ...form, button_link: e.target.value })} /></div>
                <div className="flex items-center gap-2"><Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Активен</Label></div>
              </>
            )}
            {dialog?.type === "news" && (
              <>
                <div><Label>Заголовок</Label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Текст</Label><Textarea rows={5} value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
                <div><Label>Ссылка на изображение</Label><Input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
                <div className="flex items-center gap-2"><Switch checked={!!form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} /><Label>Опубликована</Label></div>
              </>
            )}
            {dialog?.type === "reviews" && (
              <>
                <div><Label>Имя автора</Label><Input value={form.author_name || ""} onChange={(e) => setForm({ ...form, author_name: e.target.value })} /></div>
                <div><Label>Email (необязательно)</Label><Input value={form.author_email || ""} onChange={(e) => setForm({ ...form, author_email: e.target.value })} /></div>
                <div><Label>Текст отзыва</Label><Textarea rows={4} value={form.text || ""} onChange={(e) => setForm({ ...form, text: e.target.value })} /></div>
                <div><Label>Оценка (1-5)</Label><Input type="number" min={1} max={5} value={form.rating || 5} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
                <div className="flex items-center gap-2"><Switch checked={!!form.is_approved} onCheckedChange={(v) => setForm({ ...form, is_approved: v })} /><Label>Одобрен</Label></div>
              </>
            )}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={save}>Сохранить</Button>
              <Button variant="outline" className="flex-1" onClick={() => setDialog(null)}>Отмена</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}