import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  token: string;
  loading: boolean;
  onTokenChange: (v: string) => void;
  onLogin: () => void;
}

export default function AdminLogin({ token, loading, onTokenChange, onLogin }: Props) {
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
            onChange={(e) => onTokenChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin()}
          />
          <Button className="w-full" onClick={onLogin} disabled={loading}>
            {loading ? "Проверка..." : "Войти"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
