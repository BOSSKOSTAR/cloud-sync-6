export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020d05 0%, #051a0a 50%, #020d05 100%)' }}>
      {/* фоновые кольца */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-yellow-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-yellow-600/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-yellow-600/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-yellow-600/5" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Логотип */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center text-2xl font-black text-green-900 mx-auto mb-8 shadow-lg shadow-yellow-600/20">
          П
        </div>

        <div className="text-yellow-400/60 text-sm font-medium tracking-widest uppercase mb-4">
          Скоро открытие
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          Плям про<span className="text-yellow-400">100</span>
        </h1>

        <p className="text-white/40 text-lg mb-8 leading-relaxed">
          Мы готовим кое-что интересное.<br />Совсем скоро откроем двери.
        </p>

        <div className="inline-flex items-center gap-3 bg-yellow-600/10 border border-yellow-600/30 rounded-2xl px-6 py-4 mb-10">
          <div className="text-yellow-400/60 text-sm">Дата открытия</div>
          <div className="w-px h-4 bg-yellow-600/30" />
          <div className="text-yellow-400 text-xl font-black">25 апреля 2026</div>
        </div>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent mx-auto" />
      </div>
    </div>
  )
}