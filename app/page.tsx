export default function Home() {
  return (
    <div>
      <section style={{minHeight:"90vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"80px 24px",background:"linear-gradient(180deg,#0D1A0D 0%,#060D06 100%)"}}>
        <div style={{maxWidth:640}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,172,193,.15)",border:"1px solid rgba(0,172,193,.3)",borderRadius:20,padding:"6px 16px",fontSize:12,color:"#00ACC1",marginBottom:24,fontWeight:700,letterSpacing:2}}>
            ⚡ ENERGIA SOLAR FOTOVOLTAICA
          </div>
          <h1 style={{fontSize:"clamp(32px,6vw,52px)",fontWeight:900,lineHeight:1.1,marginBottom:16}}>
            Economize até <span style={{color:"#76FF03"}}>95%</span> na conta de luz
          </h1>
          <p style={{fontSize:18,color:"rgba(255,255,255,.6)",marginBottom:36,lineHeight:1.6}}>
            Projetos personalizados de energia solar para residências e empresas em Curitiba e região.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/simulator"><button className="btn-primary" style={{fontSize:16,padding:"14px 32px"}}>☀️ Simular meu projeto</button></a>
          </div>
        </div>
      </section>

      <section style={{padding:"48px 24px",background:"#0D1A0D"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:24,textAlign:"center"}}>
          {[["500+","Projetos instalados"],["25 anos","Vida útil dos painéis"],["R$ 0","Conta de luz no 1º mês"],["10 anos","Garantia do inversor"]].map(([v,l])=>(
            <div key={l}><div style={{fontSize:36,fontWeight:900,color:"#76FF03"}}>{v}</div><div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>{l}</div></div>
          ))}
        </div>
      </section>

      <section style={{padding:"80px 24px",maxWidth:900,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:11,color:"#00ACC1",fontWeight:700,letterSpacing:3,marginBottom:8}}>QUEM SOMOS</div>
          <h2 style={{fontSize:36,fontWeight:800,marginBottom:16}}>SHAMS Energia Solar</h2>
          <p style={{color:"rgba(255,255,255,.6)",maxWidth:600,margin:"0 auto",lineHeight:1.7}}>
            Empresa especializada em energia solar fotovoltaica, com foco em qualidade, transparência e retorno real. Cada projeto é desenvolvido de forma personalizada para o perfil do cliente.
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {[["🏆","Qualidade Premium","Equipamentos de primeira linha com garantia de até 25 anos"],
            ["📐","Projeto Personalizado","Dimensionamento preciso baseado no seu consumo real"],
            ["⚡","Instalação Rápida","Da visita técnica ao sistema funcionando em até 60 dias"],
            ["📊","Monitoramento","Acompanhe a geração em tempo real pelo app"]].map(([ic,t,d])=>(
            <div key={t} style={{background:"#1A3320",border:"1px solid rgba(46,125,50,.25)",borderRadius:12,padding:24,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12}}>{ic}</div>
              <div style={{fontWeight:700,marginBottom:8}}>{t}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.5}}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:"80px 24px",textAlign:"center",background:"#0D1A0D"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <h2 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Pronto para <span style={{color:"#76FF03"}}>economizar</span>?</h2>
          <p style={{color:"rgba(255,255,255,.6)",marginBottom:32,fontSize:16}}>Simule agora e veja quanto você vai economizar com energia solar.</p>
          <a href="/simulator"><button className="btn-primary" style={{fontSize:18,padding:"16px 40px"}}>☀️ Fazer minha simulação grátis</button></a>
        </div>
      </section>
    </div>
  )
}
