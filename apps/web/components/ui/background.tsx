"use client"

export function AntigravityBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Gradient Orbs */}
      <div className="absolute -top-[20%] -left-[10%] size-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute top-[20%] right-[0%] size-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse delay-1000" />
      <div className="absolute bottom-[0%] left-[20%] size-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse delay-2000" />
      
      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid Pattern (Optional, subtle) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)' }}
      />
    </div>
  )
}
