import { useState } from "react";
import { useCoins } from "@/context/CoinsContext";
import Slots from "@/components/casino/Slots";
import Roulette from "@/components/casino/Roulette";
import Lotto from "@/components/casino/Lotto";
import Leaderboard from "@/components/casino/Leaderboard";
import DailyBonus from "@/components/casino/DailyBonus";

type Tab = "slots" | "roulette" | "lotto" | "leaders";

export default function Casino() {
  const [tab, setTab] = useState<Tab>("slots");
  const { coins, addCoins } = useCoins();

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "slots", label: "Слоты", emoji: "🎰" },
    { id: "roulette", label: "Рулетка", emoji: "🎡" },
    { id: "lotto", label: "Лото", emoji: "🎱" },
    { id: "leaders", label: "Топ", emoji: "🏆" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0a1a0d 0%, #0d1f10 50%, #0a150c 100%)" }}>
      <DailyBonus />
      {/* Header */}
      <header className="border-b border-yellow-600/20 px-4 py-3" style={{ background: "rgba(5,20,8,0.9)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎰</span>
            <h1 className="text-xl font-bold text-yellow-400">LuckyCasino</h1>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5">
            <span className="text-yellow-400 text-lg">🪙</span>
            <span className="text-yellow-300 font-bold text-lg">{coins.toLocaleString()}</span>
            <button
              onClick={() => addCoins(500)}
              className="ml-2 text-xs bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-2 py-0.5 rounded-full transition-colors"
            >
              +500
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-yellow-600/20" style={{ background: "rgba(5,20,8,0.7)" }}>
        <div className="max-w-4xl mx-auto flex">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 font-semibold text-sm transition-all border-b-2 ${
                tab === t.id
                  ? "border-yellow-400 text-yellow-400 bg-yellow-400/5"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              <span>{t.emoji}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Game area */}
      <main className="flex-1 flex items-start justify-center p-4 pt-8">
        <div className="w-full max-w-2xl">
          {tab === "slots" && <Slots />}
          {tab === "roulette" && <Roulette />}
          {tab === "lotto" && <Lotto />}
          {tab === "leaders" && <Leaderboard />}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-600 py-3">
        Только виртуальные монеты · 18+ · Играй ответственно
      </footer>
    </div>
  );
}