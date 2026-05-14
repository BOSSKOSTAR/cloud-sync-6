import { useState, useEffect } from "react";
import { useCoins } from "@/context/CoinsContext";

const API_URL = "https://functions.poehali.dev/34f643fb-7ec8-4f75-9c7a-1c1d2cdd702c";

interface Leader {
  nickname: string;
  coins: number;
  updated_at: string;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const { coins } = useCoins();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState(() => localStorage.getItem("casino_nickname") || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchLeaders = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setLeaders(data.leaders || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const saveScore = async () => {
    if (!nickname.trim()) return;
    setSaving(true);
    localStorage.setItem("casino_nickname", nickname.trim());
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: nickname.trim(), coins }),
    });
    setSaving(false);
    setSaved(true);
    await fetchLeaders();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-yellow-400">🏆 Таблица лидеров</h2>
        <p className="text-gray-400 text-sm mt-1">Топ-20 игроков по количеству монет</p>
      </div>

      {/* Save my score */}
      <div className="w-full rounded-xl p-4 border border-yellow-500/20" style={{ background: "rgba(0,0,0,0.4)" }}>
        <p className="text-gray-400 text-sm mb-3">Твой результат: <span className="text-yellow-400 font-bold">🪙 {coins.toLocaleString()}</span></p>
        <div className="flex gap-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 32))}
            placeholder="Введи никнейм..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
          />
          <button
            onClick={saveScore}
            disabled={saving || !nickname.trim()}
            className="px-4 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
            style={{
              background: saved ? "#16a34a" : "linear-gradient(135deg, #d97706, #f59e0b)",
              color: "#000",
            }}
          >
            {saving ? "..." : saved ? "✓ Сохранено!" : "Сохранить"}
          </button>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="w-full rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(0,0,0,0.4)" }}>
        <div className="grid grid-cols-3 px-4 py-2 text-xs text-gray-500 border-b border-white/5">
          <span>#</span>
          <span>Игрок</span>
          <span className="text-right">Монеты</span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Загружаю...</div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Пока никого нет. Будь первым!</div>
        ) : (
          leaders.map((l, i) => {
            const isMe = l.nickname === nickname.trim();
            return (
              <div
                key={i}
                className={`grid grid-cols-3 px-4 py-3 border-b border-white/5 last:border-0 transition-colors ${
                  isMe ? "bg-yellow-400/5" : "hover:bg-white/2"
                }`}
              >
                <span className="text-lg">{i < 3 ? MEDALS[i] : `${i + 1}`}</span>
                <span className={`font-semibold truncate ${isMe ? "text-yellow-400" : "text-white"}`}>
                  {l.nickname} {isMe && <span className="text-xs text-gray-500">(ты)</span>}
                </span>
                <span className="text-right text-yellow-300 font-bold">🪙 {l.coins.toLocaleString()}</span>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={fetchLeaders}
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        🔄 Обновить
      </button>
    </div>
  );
}
