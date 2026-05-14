import { useState, useEffect } from "react";
import { useCoins } from "@/context/CoinsContext";
import { soundBonus } from "@/lib/casinoSounds";

const BONUS_AMOUNTS = [200, 300, 500, 750, 1000, 1500, 2000];
const STORAGE_KEY = "casino_daily_bonus";

interface BonusData {
  lastClaimed: string;
  streak: number;
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function DailyBonus() {
  const { addCoins } = useCoins();
  const [show, setShow] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [streak, setStreak] = useState(1);
  const [bonusAmount, setBonusAmount] = useState(200);

  useEffect(() => {
    const today = getTodayStr();
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: BonusData = raw ? JSON.parse(raw) : { lastClaimed: "", streak: 0 };

    if (data.lastClaimed === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const newStreak = data.lastClaimed === yesterdayStr ? Math.min(data.streak + 1, 7) : 1;
    const amount = BONUS_AMOUNTS[newStreak - 1] || 200;

    setStreak(newStreak);
    setBonusAmount(amount);
    setShow(true);
  }, []);

  const claim = () => {
    const today = getTodayStr();
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: BonusData = raw ? JSON.parse(raw) : { lastClaimed: "", streak: 0 };
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const newStreak = data.lastClaimed === yesterdayStr ? Math.min(data.streak + 1, 7) : 1;

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastClaimed: today, streak: newStreak }));
    soundBonus();
    addCoins(bonusAmount);
    setClaimed(true);
    setTimeout(() => setShow(false), 2000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div
        className="w-full max-w-sm rounded-2xl p-6 border border-yellow-500/40 text-center"
        style={{ background: "linear-gradient(135deg, #0d2010, #1a3020)", boxShadow: "0 0 40px rgba(245,158,11,0.2)" }}
      >
        <div className="text-5xl mb-3">🎁</div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-1">Ежедневный бонус!</h2>
        <p className="text-gray-400 text-sm mb-4">
          {streak > 1 ? `🔥 Серия ${streak} дней подряд!` : "Добро пожаловать!"}
        </p>

        {/* Streak days */}
        <div className="flex justify-center gap-2 mb-5">
          {BONUS_AMOUNTS.map((amt, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs transition-all ${
                i + 1 < streak
                  ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-400"
                  : i + 1 === streak
                  ? "bg-yellow-400 border border-yellow-300 text-black scale-110"
                  : "bg-white/5 border border-white/10 text-gray-600"
              }`}
            >
              <span>{i + 1 === 7 ? "👑" : `День ${i + 1}`}</span>
              <span className="font-bold">{amt}</span>
            </div>
          ))}
        </div>

        <div className="text-4xl font-bold text-yellow-400 mb-1">+{bonusAmount} 🪙</div>
        <p className="text-gray-500 text-xs mb-5">монет на твой счёт</p>

        {claimed ? (
          <div className="py-3 text-green-400 font-bold text-lg">✓ Получено!</div>
        ) : (
          <button
            onClick={claim}
            className="w-full py-3 rounded-xl font-bold text-lg transition-all"
            style={{
              background: "linear-gradient(135deg, #d97706, #f59e0b)",
              color: "#000",
              boxShadow: "0 0 20px rgba(245,158,11,0.4)",
            }}
          >
            Забрать бонус
          </button>
        )}

        {!claimed && (
          <button onClick={() => setShow(false)} className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Позже
          </button>
        )}
      </div>
    </div>
  );
}