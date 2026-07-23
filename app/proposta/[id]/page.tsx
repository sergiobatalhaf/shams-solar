export default function PropostaPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-shams-black flex items-center justify-center pt-16 px-4">
      <div className="text-center">
        <div className="text-shams-cyan font-semibold mb-2 text-sm uppercase tracking-wider">Proposta #{params.id}</div>
        <h1 className="text-3xl font-black text-white mb-4">Visualização de Proposta</h1>
        <p className="text-white/50">Disponível na Fase 3 — geração de PDF e compartilhamento.</p>
      </div>
    </div>
  )
}
