import { useState } from "react";
import { useCoins } from "@/context/CoinsContext";

const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const BLACK_NUMBERS = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];

type BetType = "red" | "black" | "even" | "odd" | "low" | "high" | "number";

interface Bet {
  type: BetType;
  value?: number;
  amount: number;
}

const BET_OPTIONS = [10, 25, 50, 100];

function getColor(n: number) {
  if (n === 0) return "green";
  if (RED_NUMBERS.includes(n)) return "red";
  return "black";
}

export default function Roulette() {
  const { coins, removeCoins, addCoins } = useCoins();
  const [result, setResult] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [bets, setBets] = useState<Bet[]>([]);
  const [betAmount, setBetAmount] = useState(25);
  const [selectedBetType, setSelectedBetType] = useState<BetType>("red");
  const [selectedNumber, setSelectedNumber] = useState<number>(7);
  const [message, setMessage] = useState<{ text: string; win: boolean } | null>(null);
  const [ballAngle, setBallAngle] = useState(0);

  const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

  const addBet = () => {
    const bet: Bet = {
      type: selectedBetType,
      value: selectedBetType === "number" ? selectedNumber : undefined,
      amount: betAmount,
    };
    setBets((prev) => [...prev, bet]);
  };

  const clearBets = () => setBets([]);

  const spin = () => {
    if (spinning || bets.length === 0) return;
    const totalCost = bets.reduce((s, b) => s + b.amount, 0);
    if (!removeCoins(totalCost)) {
      setMessage({ text: "Недостаточно монет!", win: false });
      return;
    }

    setSpinning(true);
    setMessage(null);

    let angle = ballAngle;
    let speed = 30;
    const spinCount = 20 + Math.floor(Math.random() * 20);
    let ticks = 0;

    const interval = setInterval(() => {
      angle += speed;
      setBallAngle(angle % 360);
      ticks++;
      if (ticks > spinCount) speed = Math.max(1, speed - 2);
      if (speed <= 1 && ticks > spinCount + 10) {
        clearInterval(interval);
        const num = Math.floor(Math.random() * 37);
        setResult(num);
        setSpinning(false);

        let totalWin = 0;
        bets.forEach((b) => {
          const color = getColor(num);
          let win = false;
          if (b.type === "red" && color === "red") win = true;
          else if (b.type === "black" && color === "black") win = true;
          else if (b.type === "even" && num !== 0 && num % 2 === 0) win = true;
          else if (b.type === "odd" && num % 2 !== 0) win = true;
          else if (b.type === "low" && num >= 1 && num <= 18) win = true;
          else if (b.type === "high" && num >= 19 && num <= 36) win = true;
          else if (b.type === "number" && b.value === num) win = true;

          if (win) {
            const mult = b.type === "number" ? 35 : 2;
            totalWin += b.amount * mult;
          }
        });

        if (totalWin > 0) {
          addCoins(totalWin);
          setMessage({ text: `🎉 Выпало ${num}! Выигрыш: +${totalWin} монет`, win: true });
        } else {
          setMessage({ text: `Выпало ${num}. Не повезло, попробуй снова!`, win: false });
        }
        setBets([]);
      }
    }, 50);
  };

  const betLabels: { type: BetType; label: string; mult: string }[] = [
    { type: "red", label: "🔴 Красное", mult: "x2" },
    { type: "black", label: "⚫ Чёрное", mult: "x2" },
    { type: "even", label: "Чётное", mult: "x2" },
    { type: "odd", label: "Нечётное", mult: "x2" },
    { type: "low", label: "1-18", mult: "x2" },
    { type: "high", label: "19-36", mult: "x2" },
    { type: "number", label: "Число", mult: "x35" },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-yellow-400">🎡 Рулетка</h2>
        <p className="text-gray-400 text-sm mt-1">Поставь монеты и крути колесо!</p>
      </div>

      {/* Wheel */}
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {Array.from({ length: 37 }, (_, i) => {
            const angle = (i / 37) * 360;
            const rad = (angle * Math.PI) / 180;
            const nextRad = (((i + 1) / 37) * 360 * Math.PI) / 180;
            const x1 = 100 + 90 * Math.cos(rad);
            const y1 = 100 + 90 * Math.sin(rad);
            const x2 = 100 + 90 * Math.cos(nextRad);
            const y2 = 100 + 90 * Math.sin(nextRad);
            const color = i === 0 ? "#16a34a" : RED_NUMBERS.includes(i) ? "#dc2626" : "#1f2937";
            return (
              <path
                key={i}
                d={`M100,100 L${x1},${y1} A90,90 0 0,1 ${x2},${y2} Z`}
                fill={color}
                stroke="#000"
                strokeWidth="0.5"
              />
            );
          })}
          <circle cx="100" cy="100" r="20" fill="#1a1a1a" stroke="#d97706" strokeWidth="2" />
          <text x="100" y="106" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">
            {result !== null ? result : "?"}
          </text>
          {/* Ball */}
          <circle
            cx={100 + 70 * Math.cos((ballAngle * Math.PI) / 180)}
            cy={100 + 70 * Math.sin((ballAngle * Math.PI) / 180)}
            r="6"
            fill="white"
            style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
          />
        </svg>
      </div>

      {/* Message */}
      <div className="h-8 text-center">
        {message && (
          <p className={`font-bold text-lg ${message.win ? "text-yellow-400" : "text-gray-400"}`}>
            {message.text}
          </p>
        )}
      </div>

      {/* Bet builder */}
      <div className="w-full rounded-xl p-4 border border-white/10" style={{ background: "rgba(0,0,0,0.4)" }}>
        <p className="text-gray-400 text-sm mb-3">Выбери ставку:</p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {betLabels.map((b) => (
            <button
              key={b.type}
              onClick={() => setSelectedBetType(b.type)}
              className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                selectedBetType === b.type
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {b.label} <span className="opacity-70">{b.mult}</span>
            </button>
          ))}
        </div>

        {selectedBetType === "number" && (
          <div className="mb-3">
            <p className="text-gray-400 text-xs mb-2">Выбери число (0-36):</p>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {Array.from({ length: 37 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedNumber(i)}
                  className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                    selectedNumber === i ? "ring-2 ring-yellow-400" : ""
                  }`}
                  style={{
                    background: i === 0 ? "#16a34a" : RED_NUMBERS.includes(i) ? "#dc2626" : "#374151",
                    color: "white",
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          {BET_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => setBetAmount(b)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                betAmount === b
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <button
          onClick={addBet}
          className="w-full py-2 rounded-lg text-sm font-bold bg-green-600 hover:bg-green-500 text-white transition-colors"
        >
          + Добавить ставку
        </button>
      </div>

      {/* Current bets */}
      {bets.length > 0 && (
        <div className="w-full rounded-xl p-3 border border-yellow-500/20" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400 text-xs">Ставки ({bets.length}):</p>
            <button onClick={clearBets} className="text-xs text-red-400 hover:text-red-300">Очистить</button>
          </div>
          <div className="flex flex-wrap gap-1">
            {bets.map((b, i) => (
              <span key={i} className="text-xs bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full">
                {b.type === "number" ? `№${b.value}` : b.type} — {b.amount}🪙
              </span>
            ))}
          </div>
          <p className="text-yellow-400 text-sm font-bold mt-2">Итого: {totalBet} монет</p>
        </div>
      )}

      <button
        onClick={spin}
        disabled={spinning || bets.length === 0 || coins < totalBet}
        className="w-48 py-4 rounded-xl text-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: spinning ? "rgba(100,80,0,0.5)" : "linear-gradient(135deg, #d97706, #f59e0b)",
          color: "#000",
          boxShadow: spinning ? "none" : "0 0 20px rgba(245,158,11,0.4)",
        }}
      >
        {spinning ? "Крутится..." : "КРУТИТЬ 🎡"}
      </button>
    </div>
  );
}
