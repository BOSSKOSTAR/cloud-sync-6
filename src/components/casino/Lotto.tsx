import { useState } from "react";
import { useCoins } from "@/context/CoinsContext";

const TOTAL_NUMBERS = 20;
const DRAW_COUNT = 5;
const PICK_COUNT = 5;
const BET_OPTIONS = [10, 25, 50, 100];

const PAYOUTS: Record<number, number> = {
  5: 500,
  4: 50,
  3: 10,
  2: 2,
};

function drawNumbers(): number[] {
  const pool = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);
  const result: number[] = [];
  for (let i = 0; i < DRAW_COUNT; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result.sort((a, b) => a - b);
}

export default function Lotto() {
  const { coins, removeCoins, addCoins } = useCoins();
  const [picked, setPicked] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [bet, setBet] = useState(25);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState<{ text: string; win: boolean } | null>(null);
  const [revealing, setRevealing] = useState<number[]>([]);

  const toggle = (n: number) => {
    if (playing) return;
    if (picked.includes(n)) {
      setPicked(picked.filter((x) => x !== n));
    } else if (picked.length < PICK_COUNT) {
      setPicked([...picked, n]);
    }
  };

  const play = () => {
    if (picked.length !== PICK_COUNT) return;
    if (!removeCoins(bet)) {
      setMessage({ text: "Недостаточно монет!", win: false });
      return;
    }

    setPlaying(true);
    setMessage(null);
    setRevealing([]);
    const numbers = drawNumbers();
    setDrawn(numbers);

    numbers.forEach((num, i) => {
      setTimeout(() => {
        setRevealing((prev) => [...prev, num]);
        if (i === numbers.length - 1) {
          const matches = picked.filter((p) => numbers.includes(p)).length;
          const mult = PAYOUTS[matches] || 0;
          if (mult > 0) {
            const win = bet * mult;
            addCoins(win);
            setMessage({
              text: `🎉 ${matches} совпадений! +${win} монет (x${mult})`,
              win: true,
            });
          } else {
            setMessage({ text: `${matches} совпадений. Не повезло!`, win: false });
          }
          setPlaying(false);
        }
      }, (i + 1) * 500);
    });
  };

  const reset = () => {
    setPicked([]);
    setDrawn([]);
    setRevealing([]);
    setMessage(null);
    setPlaying(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-yellow-400">🎱 Лото</h2>
        <p className="text-gray-400 text-sm mt-1">Выбери {PICK_COUNT} чисел из {TOTAL_NUMBERS} и угадай совпадения!</p>
      </div>

      {/* Number grid */}
      <div className="w-full rounded-xl p-4 border border-white/10" style={{ background: "rgba(0,0,0,0.4)" }}>
        <p className="text-gray-400 text-xs mb-3">Выбрано: {picked.length}/{PICK_COUNT}</p>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).map((n) => {
            const isPicked = picked.includes(n);
            const isDrawn = drawn.includes(n);
            const isRevealed = revealing.includes(n);
            const isMatch = isPicked && isRevealed;

            let bgClass = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10";
            if (isMatch) bgClass = "bg-green-500 border-green-400 text-white";
            else if (isRevealed && !isPicked) bgClass = "bg-red-900/40 border-red-500/30 text-red-300";
            else if (isPicked) bgClass = "bg-yellow-500 border-yellow-400 text-black";

            return (
              <button
                key={n}
                onClick={() => toggle(n)}
                disabled={playing || (picked.length >= PICK_COUNT && !isPicked)}
                className={`h-12 rounded-xl font-bold text-lg border-2 transition-all disabled:cursor-not-allowed ${bgClass}`}
                style={{ transform: isMatch ? "scale(1.1)" : "scale(1)" }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drawn numbers */}
      {drawn.length > 0 && (
        <div className="w-full">
          <p className="text-gray-400 text-xs mb-2 text-center">Выпавшие числа:</p>
          <div className="flex justify-center gap-3">
            {drawn.map((n, i) => (
              <div
                key={n}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${
                  revealing.includes(n)
                    ? picked.includes(n)
                      ? "bg-green-500 border-green-400 text-white scale-110"
                      : "bg-gray-700 border-gray-600 text-white"
                    : "bg-black/50 border-white/10 text-gray-600"
                }`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {revealing.includes(n) ? n : "?"}
              </div>
            ))}
          </div>
        </div>
      )}

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
              onClick={() => setBet(b)}
              disabled={playing}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
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

      {/* Buttons */}
      <div className="flex gap-3">
        {drawn.length > 0 && !playing && (
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            Сбросить
          </button>
        )}
        <button
          onClick={play}
          disabled={playing || picked.length !== PICK_COUNT || coins < bet}
          className="px-10 py-4 rounded-xl text-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: playing ? "rgba(100,80,0,0.5)" : "linear-gradient(135deg, #d97706, #f59e0b)",
            color: "#000",
            boxShadow: playing ? "none" : "0 0 20px rgba(245,158,11,0.4)",
          }}
        >
          {playing ? "Розыгрыш..." : "ИГРАТЬ 🎱"}
        </button>
      </div>

      {/* Paytable */}
      <div className="w-full rounded-xl p-4 border border-white/5" style={{ background: "rgba(0,0,0,0.3)" }}>
        <p className="text-gray-400 text-xs text-center mb-3">Таблица выплат</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {Object.entries(PAYOUTS).map(([matches, mult]) => (
            <div key={matches} className="text-xs">
              <p className="text-white font-bold">{matches}/5</p>
              <p className="text-yellow-400">x{mult}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
