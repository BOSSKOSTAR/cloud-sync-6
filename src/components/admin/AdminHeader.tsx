import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface Props {
  prestart: boolean;
  onPrestartChange: (v: boolean) => void;
  onLogout: () => void;
}

export default function AdminHeader({ prestart, onPrestartChange, onLogout }: Props) {
  return (
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
              onPrestartChange(v);
              localStorage.setItem("site_prestart", v ? "1" : "0");
              toast.success(v ? "Заглушка включена — сайт закрыт для посетителей" : "Заглушка отключена — сайт открыт");
            }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <Icon name="LogOut" size={16} className="mr-2" /> Выйти
        </Button>
      </div>
    </div>
  );
}
