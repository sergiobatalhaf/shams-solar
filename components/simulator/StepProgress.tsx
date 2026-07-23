interface Props {
  step: number
  total: number
  labels: string[]
}

export default function StepProgress({ step, total, labels }: Props) {
  return (
    <div className="w-full mb-8">
      {/* Step labels - desktop */}
      <div className="hidden md:flex justify-between mb-3">
        {labels.map((label, i) => (
          <span key={i} className={`text-xs font-medium transition-colors ${
            i + 1 === step ? 'text-shams-neon' :
            i + 1 < step  ? 'text-shams-light' : 'text-white/30'
          }`} style={{ width: `${100 / total}%`, textAlign: 'center' }}>
            {label}
          </span>
        ))}
      </div>
      {/* Mobile: step x/total */}
      <div className="md:hidden text-center text-xs text-white/50 mb-2">
        Etapa <span className="text-shams-neon font-bold">{step}</span> de {total} — {labels[step - 1]}
      </div>
      {/* Bar */}
      <div className="relative h-1.5 bg-shams-surface rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full shams-gradient rounded-full transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      {/* Dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
            i + 1 === step ? 'bg-shams-neon border-shams-neon scale-125' :
            i + 1 < step  ? 'bg-shams-light border-shams-light' :
                             'bg-transparent border-shams-green/30'
          }`} />
        ))}
      </div>
    </div>
  )
}
