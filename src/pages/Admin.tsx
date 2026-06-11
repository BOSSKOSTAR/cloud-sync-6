import { useState, useEffect } from "react";
import { toast } from "sonner";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import AdminTabs from "@/components/admin/AdminTabs";

const ADMIN_URL = "https://functions.poehali.dev/fd69d698-1f88-4fda-b35b-73645337fa4d";
const BALANCE_URL = "https://functions.poehali.dev/4466c646-9adb-42c9-adf7-314bc4a3165d";
const TEASERS_URL = "https://functions.poehali.dev/8636b128-5f4c-4d28-9ecf-cf64e3cac45b";

function api(path: string, method = "GET", token: string, body?: object) {
  const resource = path.replace(/^\//, "");
  const url = resource === "" ? ADMIN_URL : `${ADMIN_URL}?resource=${resource}`;
  return fetch(url, {
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
  const [matrices, setMatrices] = useState<Record<string, unknown>[]>([]);
  const [withdrawals, setWithdrawals] = useState<Record<string, unknown>[]>([]);
  const [teasers, setTeasers] = useState<Record<string, unknown>[]>([]);
  const [stats, setStats] = useState<{ users_count: number; total_paid: number; new_today: number } | null>(null);
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
      loadAll(token);
    } else {
      toast.error("Неверный пароль");
    }
  }

  async function loadTeasers() {
    const res = await fetch(`${TEASERS_URL}/admin/all`, {
      headers: { "X-Admin-Token": token },
    }).then(r => r.json());
    if (Array.isArray(res.teasers)) setTeasers(res.teasers);
  }

  async function approveTeaser(id: number, approve: boolean) {
    await fetch(`${TEASERS_URL}/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Admin-Token": token },
      body: JSON.stringify({ is_approved: approve }),
    });
    toast.success(approve ? "Тизер одобрен" : "Тизер отклонён");
    loadTeasers();
  }

  async function loadStats() {
    const res = await fetch(BALANCE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_stats" }),
    }).then(r => r.json());
    setStats({ users_count: res.users_count ?? 0, total_paid: res.total_paid ?? 0, new_today: res.new_today ?? 0 });
  }

  async function loadAll(t?: string) {
    const tok = t ?? token;
    const [b, n, r, u, m, w] = await Promise.all([
      api("/banners", "GET", tok),
      api("/news", "GET", tok),
      api("/reviews", "GET", tok),
      api("/users", "GET", tok),
      api("/matrices", "GET", tok),
      api("/withdrawals", "GET", tok),
    ]);
    if (Array.isArray(b)) setBanners(b);
    if (Array.isArray(n)) setNews(n);
    if (Array.isArray(r)) setReviews(r);
    if (Array.isArray(u)) setUsers(u);
    if (Array.isArray(m)) setMatrices(m);
    if (Array.isArray(w)) setWithdrawals(w);
    loadTeasers();
    loadStats();
  }

  async function markPaid(id: number) {
    await api(`/withdrawals/${id}`, "PUT", token, { status: "completed" });
    toast.success("Заявка отмечена как выплачено");
    loadAll();
  }

  useEffect(() => {
    if (token) {
      api("/", "GET", token).then((res) => {
        if (res.status === "ok") { setAuthed(true); loadAll(token); }
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

  async function remove(type: string, id: unknown) {
    if (!confirm("Удалить?")) return;
    await api(`/${type}/${id}`, "DELETE", token);
    toast.success("Удалено");
    loadAll();
  }

  async function toggleReview(item: Record<string, unknown>) {
    await api(`/reviews/${item.id}`, "PUT", token, { ...item, is_approved: !item.is_approved });
    loadAll();
  }

  if (!authed) {
    return (
      <AdminLogin
        token={token}
        loading={loading}
        onTokenChange={setToken}
        onLogin={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        prestart={prestart}
        onPrestartChange={setPrestart}
        onLogout={() => { localStorage.removeItem("admin_token"); setAuthed(false); }}
      />
      <div className="p-6">
        <AdminStats stats={stats} />
        <AdminTabs
          banners={banners}
          news={news}
          reviews={reviews}
          users={users}
          matrices={matrices}
          withdrawals={withdrawals}
          teasers={teasers}
          dialog={dialog}
          form={form}
          onSetDialog={setDialog}
          onSetForm={setForm}
          onMarkPaid={markPaid}
          onApproveTeaser={approveTeaser}
          onSave={save}
          onRemove={remove}
          onToggleReview={toggleReview}
          onLoadAll={loadAll}
          onLoadTeasers={loadTeasers}
        />
      </div>
    </div>
  );
}
