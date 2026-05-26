import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTeaserAuth } from "@/context/TeaserAuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

export default function TeaserLogin() {
  const { login, register, isLoading } = useTeaserAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [regData, setRegData]     = useState({ name: "", email: "", password: "" });
  const [error, setError]         = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(loginData.email, loginData.password);
      navigate("/teaser-dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(regData.name, regData.email, regData.password);
      navigate("/teaser-dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    }
  };

  return (
    <div className="min-h-screen bg-[#07090f] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px]
                        rounded-full bg-violet-700/15 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/teaser-network" className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-violet-500
                             flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Icon name="Zap" size={20} className="text-black" />
            </span>
            <span className="text-2xl font-extrabold text-white">AdTeaser</span>
          </Link>
          <p className="text-slate-400 text-sm">Тизерная рекламная сеть</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-7 shadow-2xl">
          <Tabs defaultValue="login" onValueChange={() => setError("")}>
            <TabsList className="w-full bg-white/5 border border-white/10 mb-6 h-10">
              <TabsTrigger
                value="login"
                className="flex-1 data-[state=active]:bg-amber-500 data-[state=active]:text-black
                           data-[state=active]:font-semibold text-slate-400"
              >
                Войти
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 data-[state=active]:bg-amber-500 data-[state=active]:text-black
                           data-[state=active]:font-semibold text-slate-400"
              >
                Регистрация
              </TabsTrigger>
            </TabsList>

            {/* ── Login ── */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm">Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-600
                               focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm">Пароль</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-600
                               focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10
                                  border border-red-400/20 rounded-lg px-3 py-2">
                    <Icon name="AlertCircle" size={14} />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold h-11
                             shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]
                             disabled:opacity-60"
                >
                  {isLoading ? (
                    <><Icon name="Loader2" size={16} className="animate-spin" /> Вход...</>
                  ) : (
                    <><Icon name="LogIn" size={16} /> Войти</>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* ── Register ── */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm">Имя</Label>
                  <Input
                    type="text"
                    placeholder="Иван Петров"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-600
                               focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm">Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-600
                               focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm">Пароль</Label>
                  <Input
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    required
                    minLength={6}
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-600
                               focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10
                                  border border-red-400/20 rounded-lg px-3 py-2">
                    <Icon name="AlertCircle" size={14} />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold h-11
                             shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]
                             disabled:opacity-60"
                >
                  {isLoading ? (
                    <><Icon name="Loader2" size={16} className="animate-spin" /> Регистрация...</>
                  ) : (
                    <><Icon name="UserPlus" size={16} /> Зарегистрироваться</>
                  )}
                </Button>

                <p className="text-slate-600 text-xs text-center">
                  Регистрируясь, вы соглашаетесь с условиями использования сервиса
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-slate-600 text-sm mt-6">
          <Link to="/teaser-network" className="hover:text-slate-400 transition-colors flex items-center justify-center gap-1">
            <Icon name="ArrowLeft" size={13} />
            Вернуться на главную
          </Link>
        </p>
      </div>
    </div>
  );
}
