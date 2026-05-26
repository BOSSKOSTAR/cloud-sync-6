import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const STATS = [
  { value: "50 000+", label: "кликов в день", icon: "MousePointerClick", color: "text-amber-400" },
  { value: "1 200+",  label: "рекламодателей", icon: "Users",             color: "text-violet-400" },
  { value: "300+",    label: "сайтов-партнёров", icon: "Globe",           color: "text-emerald-400" },
];

export default function TeaserHero() {
  return (
    <section className="relative overflow-hidden bg-[#07090f] py-20 md:py-28">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full
                        bg-violet-700/20 blur-[120px]" />
        <div className="absolute top-10 right-0 w-[400px] h-[400px] rounded-full
                        bg-blue-700/15 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full
                        bg-amber-600/10 blur-[90px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30
                        text-violet-300 text-xs font-medium px-3 py-1 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Рекламная сеть нового поколения
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Тизерная реклама,
          </span>
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            которая работает
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Привлекайте миллионы посетителей.&nbsp;
          <span className="text-slate-300">Платите только за клики.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Button
            asChild
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold
                       shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)]
                       transition-all duration-200 px-8"
          >
            <Link to="/teaser-login">
              <Icon name="Rocket" size={18} />
              Разместить рекламу
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-violet-500/50 text-violet-300 hover:bg-violet-500/10
                       hover:border-violet-400 px-8"
          >
            <Link to="/teaser-widget">
              <Icon name="Code2" size={18} />
              Стать партнёром
            </Link>
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 bg-white/5 border border-white/10
                         rounded-xl px-4 py-4 backdrop-blur-sm"
            >
              <Icon name={s.icon} size={20} className={s.color} />
              <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
              <span className="text-slate-500 text-xs text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
