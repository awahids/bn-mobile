export function DhikrCompletionCard() {
  return (
    <div className="mt-12 group px-6 pb-6">
      <div className="glass p-10 rounded-[3rem] text-center relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="relative z-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 p-4 shadow-inner group-hover:animate-float">
            <span className="text-4xl">🤲</span>
          </div>
          <h3 className="text-2xl font-black text-foreground mb-3">Masha Allah!</h3>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            Luar biasa. Anda telah menyelesaikan seluruh rangkaian dzikir untuk sesi ini.
            <span className="block mt-2 text-primary font-bold">Semoga istiqomah selalu.</span>
          </p>
        </div>
        <div className="absolute top-[-20%] left-[-10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
}
