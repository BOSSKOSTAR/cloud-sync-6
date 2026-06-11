import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

interface Props {
  banners: Record<string, unknown>[];
  news: Record<string, unknown>[];
  reviews: Record<string, unknown>[];
  users: Record<string, unknown>[];
  matrices: Record<string, unknown>[];
  withdrawals: Record<string, unknown>[];
  teasers: Record<string, unknown>[];
  dialog: { type: string; item?: Record<string, unknown> } | null;
  form: Record<string, unknown>;
  onSetDialog: (d: { type: string; item?: Record<string, unknown> } | null) => void;
  onSetForm: (f: Record<string, unknown>) => void;
  onMarkPaid: (id: number) => void;
  onApproveTeaser: (id: number, approve: boolean) => void;
  onSave: () => void;
  onRemove: (type: string, id: unknown) => void;
  onToggleReview: (item: Record<string, unknown>) => void;
  onLoadAll: () => void;
  onLoadTeasers: () => void;
}

export default function AdminTabs({
  banners, news, reviews, users, matrices, withdrawals, teasers,
  dialog, form,
  onSetDialog, onSetForm,
  onMarkPaid, onApproveTeaser, onSave, onRemove, onToggleReview,
  onLoadAll, onLoadTeasers,
}: Props) {

  function openCreate(type: string) {
    onSetForm({});
    onSetDialog({ type });
  }

  function openEdit(type: string, item: Record<string, unknown>) {
    onSetForm({ ...item });
    onSetDialog({ type, item });
  }

  return (
    <>
      <Tabs defaultValue="withdrawals">
        <TabsList className="mb-6">
          <TabsTrigger value="withdrawals">
            Выводы {withdrawals.filter(w => w.status === "pending").length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {withdrawals.filter(w => w.status === "pending").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="banners">Баннеры ({banners.length})</TabsTrigger>
          <TabsTrigger value="news">Новости ({news.length})</TabsTrigger>
          <TabsTrigger value="reviews">Отзывы ({reviews.length})</TabsTrigger>
          <TabsTrigger value="users">Пользователи ({users.length})</TabsTrigger>
          <TabsTrigger value="matrices">Матрицы ({matrices.length})</TabsTrigger>
          <TabsTrigger value="teasers">
            Тизеры {teasers.filter(t => !t.is_approved).length > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {teasers.filter(t => !t.is_approved).length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* WITHDRAWALS */}
        <TabsContent value="withdrawals">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Заявки на вывод средств</h2>
            <Button size="sm" variant="outline" onClick={onLoadAll}><Icon name="RefreshCw" size={16} className="mr-2" />Обновить</Button>
          </div>
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <Card key={w.id as number} className={w.status === "pending" ? "border-orange-400/50" : ""}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{w.user_name} <span className="text-muted-foreground text-sm">#{w.user_id}</span></p>
                    <p className="text-sm text-muted-foreground">{w.user_email}</p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold text-green-600">{Number(w.amount).toFixed(2)} ₽</span>
                      <span className="text-muted-foreground"> · СБП: {w.sbp_phone} ({w.sbp_bank})</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(w.created_at as string).toLocaleString("ru-RU")}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={w.status === "pending" ? "destructive" : "secondary"}>
                      {w.status === "pending" ? "Ожидает выплаты" : "Выплачено"}
                    </Badge>
                    {w.status === "pending" && (
                      <Button size="sm" onClick={() => onMarkPaid(w.id as number)} className="bg-green-600 hover:bg-green-700 text-white">
                        <Icon name="Check" size={14} className="mr-1" />Выплачено
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {withdrawals.length === 0 && <p className="text-muted-foreground text-sm">Заявок пока нет</p>}
          </div>
        </TabsContent>

        {/* BANNERS */}
        <TabsContent value="banners">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Баннеры</h2>
            <Button size="sm" onClick={() => openCreate("banners")}><Icon name="Plus" size={16} className="mr-2" />Добавить</Button>
          </div>
          <div className="space-y-3">
            {banners.map((b) => (
              <Card key={b.id as number}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{b.title}</p>
                    <p className="text-sm text-muted-foreground">{b.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={b.is_active ? "default" : "secondary"}>{b.is_active ? "Активен" : "Скрыт"}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => openEdit("banners", b)}><Icon name="Pencil" size={16} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => onRemove("banners", b.id)}><Icon name="Trash2" size={16} /></Button>
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
              <Card key={n.id as number}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{new Date(n.created_at as string).toLocaleDateString("ru-RU")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={n.is_published ? "default" : "secondary"}>{n.is_published ? "Опубликована" : "Черновик"}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => openEdit("news", n)}><Icon name="Pencil" size={16} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => onRemove("news", n.id)}><Icon name="Trash2" size={16} /></Button>
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
              <Card key={r.id as number}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <p className="font-medium">{r.author_name} — {"⭐".repeat(r.rating as number)}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{r.text}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={r.is_approved as boolean} onCheckedChange={() => onToggleReview(r)} />
                    <span className="text-xs text-muted-foreground">{r.is_approved ? "Одобрен" : "На модерации"}</span>
                    <Button size="icon" variant="ghost" onClick={() => openEdit("reviews", r)}><Icon name="Pencil" size={16} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => onRemove("reviews", r.id)}><Icon name="Trash2" size={16} /></Button>
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
              <Card key={u.id as number}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email || "—"}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Баланс: <span className="font-medium">{Number(u.balance).toFixed(2)} ₽</span></p>
                    <p className="text-muted-foreground">Операций: {u.tx_count}</p>
                    <p className="text-muted-foreground text-xs">
                      {u.last_activity ? `Активен: ${new Date(u.last_activity as string).toLocaleDateString("ru-RU")}` : `Регистрация: ${new Date(u.created_at as string).toLocaleDateString("ru-RU")}`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {users.length === 0 && <p className="text-muted-foreground text-sm">Пользователей пока нет</p>}
          </div>
        </TabsContent>

        {/* TEASERS */}
        <TabsContent value="teasers">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Модерация тизеров</h2>
            <Button size="sm" variant="outline" onClick={onLoadTeasers}><Icon name="RefreshCw" size={16} className="mr-2" />Обновить</Button>
          </div>
          <div className="flex gap-2 mb-4">
            {["all", "pending", "approved"].map((f) => (
              <Button key={f} size="sm" variant="outline" onClick={() => {}} className="text-xs">
                {{ all: `Все (${teasers.length})`, pending: `На модерации (${teasers.filter(t => !t.is_approved).length})`, approved: `Одобрены (${teasers.filter(t => t.is_approved).length})` }[f]}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
            {teasers.map((t) => (
              <Card key={t.id as number} className={!t.is_approved ? "border-amber-400/50" : "border-green-500/30"}>
                <CardContent className="py-3 flex items-start gap-4">
                  {t.image_url && (
                    <img src={t.image_url as string} alt="" className="w-20 h-14 object-cover rounded flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{t.title as string}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{t.description as string}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Категория: <span className="text-foreground">{t.category as string}</span>
                      {" · "}Просмотры: {t.views as number} · Клики: {t.clicks as number}
                      {" · "}{new Date(t.created_at as string).toLocaleDateString("ru-RU")}
                    </p>
                    <a href={t.target_url as string} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate block mt-0.5">
                      {t.target_url as string}
                    </a>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge variant={t.is_approved ? "default" : "secondary"} className={t.is_approved ? "bg-green-600" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}>
                      {t.is_approved ? "Одобрен" : "На модерации"}
                    </Badge>
                    {!t.is_approved && (
                      <Button size="sm" onClick={() => onApproveTeaser(t.id as number, true)} className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs">
                        <Icon name="Check" size={13} className="mr-1" />Одобрить
                      </Button>
                    )}
                    {t.is_approved && (
                      <Button size="sm" variant="outline" onClick={() => onApproveTeaser(t.id as number, false)} className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-7 text-xs">
                        <Icon name="X" size={13} className="mr-1" />Отклонить
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {teasers.length === 0 && <p className="text-muted-foreground text-sm">Тизеров пока нет</p>}
          </div>
        </TabsContent>

        {/* MATRICES */}
        <TabsContent value="matrices">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Матрицы пользователей</h2>
            <Button size="sm" variant="outline" onClick={onLoadAll}><Icon name="RefreshCw" size={16} className="mr-2" />Обновить</Button>
          </div>
          <div className="space-y-3">
            {matrices.map((m) => (
              <Card key={m.id as number}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{m.user_name || "—"} <span className="text-muted-foreground text-sm">#{m.user_id}</span></p>
                    <p className="text-sm text-muted-foreground">{m.user_email || "—"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Тариф: {m.tariff_name} · Уровень {m.level_number} · Создана {new Date(m.created_at as string).toLocaleDateString("ru-RU")}</p>
                  </div>
                  <div className="text-right text-sm flex flex-col items-end gap-1">
                    <Badge variant={m.status === "active" ? "default" : "secondary"}>{m.status === "active" ? "Активна" : m.status === "completed" ? "Завершена" : String(m.status)}</Badge>
                    <p className="text-muted-foreground">Слотов: {m.slots_filled} / {m.total_slots}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {matrices.length === 0 && <p className="text-muted-foreground text-sm">Матриц пока нет</p>}
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOG */}
      <Dialog open={!!dialog} onOpenChange={(o) => !o && onSetDialog(null)}>
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
                <div><Label>Заголовок</Label><Input value={form.title as string || ""} onChange={(e) => onSetForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Подзаголовок</Label><Input value={form.subtitle as string || ""} onChange={(e) => onSetForm({ ...form, subtitle: e.target.value })} /></div>
                <div><Label>Ссылка на изображение</Label><Input value={form.image_url as string || ""} onChange={(e) => onSetForm({ ...form, image_url: e.target.value })} /></div>
                <div><Label>Текст кнопки</Label><Input value={form.button_text as string || ""} onChange={(e) => onSetForm({ ...form, button_text: e.target.value })} /></div>
                <div><Label>Ссылка кнопки</Label><Input value={form.button_link as string || ""} onChange={(e) => onSetForm({ ...form, button_link: e.target.value })} /></div>
                <div className="flex items-center gap-2"><Switch checked={!!form.is_active} onCheckedChange={(v) => onSetForm({ ...form, is_active: v })} /><Label>Активен</Label></div>
              </>
            )}
            {dialog?.type === "news" && (
              <>
                <div><Label>Заголовок</Label><Input value={form.title as string || ""} onChange={(e) => onSetForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Текст</Label><Textarea rows={5} value={form.content as string || ""} onChange={(e) => onSetForm({ ...form, content: e.target.value })} /></div>
                <div><Label>Ссылка на изображение</Label><Input value={form.image_url as string || ""} onChange={(e) => onSetForm({ ...form, image_url: e.target.value })} /></div>
                <div className="flex items-center gap-2"><Switch checked={!!form.is_published} onCheckedChange={(v) => onSetForm({ ...form, is_published: v })} /><Label>Опубликована</Label></div>
              </>
            )}
            {dialog?.type === "reviews" && (
              <>
                <div><Label>Имя автора</Label><Input value={form.author_name as string || ""} onChange={(e) => onSetForm({ ...form, author_name: e.target.value })} /></div>
                <div><Label>Email (необязательно)</Label><Input value={form.author_email as string || ""} onChange={(e) => onSetForm({ ...form, author_email: e.target.value })} /></div>
                <div><Label>Текст отзыва</Label><Textarea rows={4} value={form.text as string || ""} onChange={(e) => onSetForm({ ...form, text: e.target.value })} /></div>
                <div><Label>Оценка (1-5)</Label><Input type="number" min={1} max={5} value={form.rating as number || 5} onChange={(e) => onSetForm({ ...form, rating: Number(e.target.value) })} /></div>
                <div className="flex items-center gap-2"><Switch checked={!!form.is_approved} onCheckedChange={(v) => onSetForm({ ...form, is_approved: v })} /><Label>Одобрен</Label></div>
              </>
            )}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={onSave}>Сохранить</Button>
              <Button variant="outline" className="flex-1" onClick={() => onSetDialog(null)}>Отмена</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
