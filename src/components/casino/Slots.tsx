import { useState, useRef } from "react";
import { useCoins } from "@/context/CoinsContext";
import { soundSpin, soundTick, soundJackpot, soundWin, soundLose, soundBet } from "@/lib/casinoSounds";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "7️⃣", "🔔"];

const PAYOUTS: Record<string, number> = {
  "💎": 50,
  "7️⃣": 30,
  "⭐": 20,
  "🔔": 15,
  "🍇": 10,
  "🍊": 8,
  "🍋": 5,
  "🍒": 3,
};

const BET_OPTIONS = [10, 25, 50, 100, 250];

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export default function Slots() {
  const { coins, removeCoins, addCoins } = useCoins();
  const [reels, setReels] = useState(["🍒", "🍋", "🍊"]);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(25);
  const [message, setMessage] = useState<{ text: string; win: boolean } | null>(null);
  const [spinReels, setSpinReels] = useState([false, false, false]);
  const intervalRefs = useRef<ReturnType<typeof setInterval>[]>([]);

  const spin = () => {
    if (spinning) return;
    if (!removeCoins(bet)) {
      setMessage({ text: "Недостаточно монет!", win: false });
      soundLose();
      return;
    }
    setMessage(null);
    setSpinning(true);
    setSpinReels([true, true, true]);
    soundSpin();

    const finalSymbols = [randomSymbol(), randomSymbol(), randomSymbol()];
    const displayReels = [...reels];

    intervalRefs.current.forEach(clearInterval);
    intervalRefs.current = [];

    for (let i = 0; i < 3; i++) {
      const interval = setInterval(() => {
        displayReels[i] = randomSymbol();
        setReels([...displayReels]);
        soundTick();
      }, 80);
      intervalRefs.current.push(interval);

      setTimeout(() => {
        clearInterval(intervalRefs.current[i]);
        displayReels[i] = finalSymbols[i];
        setReels([...displayReels]);
        setSpinReels((prev) => {
          const next = [...prev];
          next[i] = false;
          return next;
        });

        if (i === 2) {
          setSpinning(false);
          const [a, b, c] = finalSymbols;
          if (a === b && b === c) {
            const multiplier = PAYOUTS[a] || 5;
            const win = bet * multiplier;
            addCoins(win);
            soundJackpot();
            setMessage({ text: `🎉 Джекпот! +${win} монет (x${multiplier})`, win: true });
          } else if (a === b || b === c || a === c) {
            const matchSymbol = a === b ? a : c;
            const multiplier = Math.floor((PAYOUTS[matchSymbol] || 3) / 2);
            const win = bet * multiplier;
            if (win > 0) {
              addCoins(win);
              soundWin();
              setMessage({ text: `✨ Две совпало! +${win} монет`, win: true });
            } else {
              soundLose();
              setMessage({ text: "Почти! Попробуй ещё раз", win: false });
            }
          } else {
            soundLose();
            setMessage({ text: "Не повезло, крути ещё!", win: false });
          }
        }
      }, 600 + i * 400);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-yellow-400">🎰 Слоты</h2>
        <p className="text-gray-400 text-sm mt-1">Совпади 3 символа — сорви джекпот!</p>
      </div>

      {/* Slot machine */}
      <div className="relative rounded-2xl p-6 border border-yellow-500/30" style={{ background: "rgba(10,25,12,0.8)" }}>
        <div className="flex gap-3 mb-4">
          {reels.map((sym, i) => (
            <div
              key={i}
              className={`w-24 h-24 flex items-center justify-center rounded-xl text-5xl border-2 transition-all ${
                spinReels[i]
                  ? "border-yellow-400 bg-yellow-400/10 animate-pulse"
                  : "border-yellow-600/40 bg-black/40"
              }`}
            >
              {sym}
            </div>
          ))}
        </div>

        {/* Payline indicator */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-yellow-400/30 pointer-events-none" />
      </div>

      {/* Message */}
      <div className="h-8 text-center">
        {message && (
          <p className={`font-bold text-lg ${message.win ? "text-yellow-400" : "text-gray-400"}`}>
            {message.text}
          </p>
        )}
      </div>

      {/* Bet selector */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-400 text-sm">Ставка:</p>
        <div className="flex gap-2">
          {BET_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => { setBet(b); soundBet(); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                bet === b
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || coins < bet}
        className="w-48 py-4 rounded-xl text-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: spinning ? "rgba(100,80,0,0.5)" : "linear-gradient(135deg, #d97706, #f59e0b)",
          color: "#000",
          boxShadow: spinning ? "none" : "0 0 20px rgba(245,158,11,0.4)",
        }}
      >
        {spinning ? "Крутится..." : "КРУТИТЬ 🎰"}
      </button>

      {/* Paytable */}
      <div className="w-full rounded-xl p-4 border border-white/5" style={{ background: "rgba(0,0,0,0.3)" }}>
        <p className="text-gray-400 text-xs text-center mb-3">Таблица выплат (x ставки)</p>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(PAYOUTS).map(([sym, mult]) => (
            <div key={sym} className="flex items-center gap-1 text-xs">
              <span className="text-lg">{sym}</span>
              <span className="text-yellow-400 font-bold">x{mult}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}