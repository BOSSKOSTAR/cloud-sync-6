import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface Stats {
  users_count: number;
  total_paid: number;
  new_today: number;
}

interface Props {
  stats: Stats | null;
}

export default function AdminStats({ stats }: Props) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Icon name="Users" size={18} className="text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.users_count.toLocaleString('ru')}</div>
              <div className="text-xs text-muted-foreground">Участников всего</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Icon name="UserPlus" size={18} className="text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">+{stats.new_today.toLocaleString('ru')}</div>
              <div className="text-xs text-muted-foreground">Новых сегодня</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Icon name="Banknote" size={18} className="text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total_paid.toLocaleString('ru')} ₽</div>
              <div className="text-xs text-muted-foreground">Выплачено всего</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
