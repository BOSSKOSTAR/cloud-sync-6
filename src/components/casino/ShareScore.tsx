import { useState, useRef } from "react";
import { useCoins } from "@/context/CoinsContext";

export default function ShareScore() {
  const { coins } = useCoins();
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const nickname = localStorage.getItem("casino_nickname") || "Игрок";
  const cardRef = useRef<HTMLDivElement>(null);

  const shareText = `🎰 Я набрал ${coins.toLocaleString()} монет в LuckyCasino!\nСможешь побить мой рекорд? 👉 ${window.location.origin}/casino`;

  const copyText = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({ title: "LuckyCasino", text: shareText });
    } else {
      copyText();
    }
  };

  const getRank = () => {
    if (coins >= 10000) return { label: "Легенда", emoji: "👑" };
    if (coins >= 5000) return { label: "Профи", emoji: "💎" };
    if (coins >= 2000) return { label: "Опытный", emoji: "⭐" };
    if (coins >= 500) return { label: "Новичок", emoji: "🎯" };
    return { label: "Стартер", emoji: "🌱" };
  };

  const rank = getRank();

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-yellow-500/30 text-yellow-400 hover:bg-yellow-400/10"
      >
        <span>📤</span>
        <span>Поделиться</span>
      </button>

      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setShow(false)}
        >
          <div className="w-full max-w-sm flex flex-col gap-4">
            {/* Card preview */}
            <div
              ref={cardRef}
              className="rounded-2xl p-6 text-center border border-yellow-500/30"
              style={{
                background: "linear-gradient(135deg, #0d2010 0%, #1a3a20 50%, #0d2010 100%)",
                boxShadow: "0 0 40px rgba(245,158,11,0.15)",
              }}
            >
              <div className="text-4xl mb-2">🎰</div>
              <h3 className="text-yellow-400 font-bold text-xl mb-1">LuckyCasino</h3>
              <p className="text-gray-400 text-sm mb-4">{nickname}</p>

              <div className="bg-black/30 rounded-xl py-4 px-6 mb-4 border border-yellow-500/20">
                <p className="text-gray-400 text-xs mb-1">Мой результат</p>
                <p className="text-yellow-400 font-bold text-4xl">🪙 {coins.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">виртуальных монет</p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">{rank.emoji}</span>
                <span className="text-white font-semibold">{rank.label}</span>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`text-xl ${s <= Math.min(5, Math.ceil(coins / 2000)) ? "text-yellow-400" : "text-gray-700"}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-gray-500 text-xs">{window.location.origin}/casino</p>
            </div>

            {/* Share buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={shareNative}
                className="w-full py-3 rounded-xl font-bold text-base transition-all"
                style={{
                  background: "linear-gradient(135deg, #d97706, #f59e0b)",
                  color: "#000",
                  boxShadow: "0 0 20px rgba(245,158,11,0.3)",
                }}
              >
                📤 Поделиться
              </button>

              <button
                onClick={copyText}
                className="w-full py-3 rounded-xl font-bold text-sm border border-white/10 text-gray-300 hover:bg-white/5 transition-all"
              >
                {copied ? "✓ Скопировано!" : "📋 Скопировать текст"}
              </button>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + "/casino")}&text=${encodeURIComponent(`🎰 Я набрал ${coins.toLocaleString()} монет в LuckyCasino! Сможешь побить?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-sm text-center transition-all"
                style={{ background: "#229ed9", color: "white" }}
              >
                ✈️ Поделиться в Telegram
              </a>

              <button
                onClick={() => setShow(false)}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors py-1"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
