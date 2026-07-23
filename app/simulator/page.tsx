"use client"
import { useState, useMemo } from "react"

const KWH_PRICE = 1.04
const KITS = [
  {plates:4,eco:250,price:10923.59,kwh:240.38},{plates:6,eco:350,price:13570.11,kwh:336.54},
  {plates:8,eco:450,price:17279.80,kwh:432.69},{plates:10,eco:550,price:22129.66,kwh:528.85},
  {plates:12,eco:650,price:25256.08,kwh:625.00},{plates:14,eco:750,price:28545.68,kwh:721.15},
  {plates:16,eco:850,price:32204.00,kwh:817.31},{plates:18,eco:950,price:35175.03,kwh:913.46},
  {plates:20,eco:1050,price:40482.84,kwh:1009.62},{plates:24,eco:1250,price:46670.73,kwh:1201.92},
  {plates:30,eco:1550,price:61075.89,kwh:1490.38},{plates:40,eco:2000,price:79846.02,kwh:1923.08},
]
const STEPS = ["Cliente","Consumo","Adições","Opções","Pagamento","Proposta"]
const fmt = (v: number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})
const pmt = (P: number,r: number,n: number) => r===0?P/n:P*r/(1-Math.pow(1+r,-n))

function selectKit(target: number, line: string, metalOn: boolean, metalM2: number) {
  const kits = line==="standard" ? KITS.map(k=>({...k,price:k.price*0.8})) : KITS
  const covering = kits.filter(k=>k.kwh>=target)
  let primary = covering.length>0 ? covering[0] : kits[kits.length-1]
  let secondary: typeof kits[0]|null = null
  if(covering.length===0){const rem=target-primary.kwh;const sc=kits.filter(k=>k.kwh>=rem);secondary=sc.length>0?sc[0]:kits[kits.length-1]}
  const basePrice = primary.price+(secondary?.price||0)
  const metalCost = metalOn?metalM2*1000:0
  const totalKwh = primary.kwh+(secondary?.kwh||0)
  const totalPlates = primary.plates+(secondary?.plates||0)
  const monthlyEco = primary.eco+(secondary?.eco||0)
  return {primary,secondary,totalPlates,totalKwh,basePrice,finalPrice:basePrice+metalCost,coverage:Math.min(100,Math.round(totalKwh/target*100)),monthlyEco,metalCost}
}

function calcROI(monthlyEco: number, investment: number) {
  let cum = -investment, payback = 0
  const table = []
  for(let y=0;y<=25;y++){
    const adj = monthlyEco*12*Math.pow(1.058,y)*(1-0.2*y/25)
    if(y>0)cum+=adj
    if(y>0&&cum>=0&&payback===0)payback=y
    table.push({year:y,cashflow:adj,balance:cum})
  }
  return {payback:payback||25,ret25:table[25].balance,table}
}

function genPropNum(){const d=new Date();return d.getFullYear().toString().slice(-2)+String(d.getMonth()+1).padStart(2,"0")+(Math.floor(Math.random()*9000)+1000)}

const S = {
  wrap:{background:"#1A3320",border:"1px solid rgba(46,125,50,.25)",borderRadius:10,padding:16,marginBottom:14} as React.CSSProperties,
  tag:{fontSize:10,color:"#00ACC1",fontWeight:700,letterSpacing:2,marginBottom:4} as React.CSSProperties,
  h2:{fontSize:22,fontWeight:800,marginBottom:4} as React.CSSProperties,
  sub:{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:20} as React.CSSProperties,
  grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12} as React.CSSProperties,
  nav:{display:"flex",justifyContent:"space-between",marginTop:24} as React.CSSProperties,
  toggle:(on:boolean):React.CSSProperties=>({width:40,height:24,borderRadius:12,background:on?"#4CAF50":"#132613",position:"relative",flexShrink:0,cursor:"pointer"}),
  dot:(on:boolean):React.CSSProperties=>({position:"absolute",width:18,height:18,background:"#fff",borderRadius:"50%",top:3,left:on?19:3,transition:"left .2s"}),
}

export default function SimulatorPage() {
  const [step,setStep] = useState(1)
  const [propNum] = useState(genPropNum)
  const [vendor,setVendor] = useState("")
  const [name,setName] = useState("")
  const [company,setCompany] = useState("")
  const [phone,setPhone] = useState("")
  const [email,setEmail] = useState("")
  const [city,setCity] = useState("")
  const [neighborhood,setNeighborhood] = useState("")
  const [roofType,setRoofType] = useState("")
  const [roofFace,setRoofFace] = useState("")
  const [kwh,setKwh] = useState(0)
  const [hasAC,setHasAC]=useState(false);const [acUnits,setAcUnits]=useState(1);const [acKwh,setAcKwh]=useState(300)
  const [hasEV,setHasEV]=useState(false);const [evKwh,setEvKwh]=useState(200)
  const [hasPool,setHasPool]=useState(false);const [poolKwh,setPoolKwh]=useState(400)
  const [hasFloor,setHasFloor]=useState(false);const [floorKwh,setFloorKwh]=useState(300)
  const [hasOthers,setHasOthers]=useState(false);const [othersKwh,setOthersKwh]=useState(0);const [othersDesc,setOthersDesc]=useState("")
  const [dist,setDist] = useState("<30m")
  const [metalOn,setMetalOn] = useState(false);const [metalM2,setMetalM2] = useState(20)
  const [line,setLine] = useState("premium")
  const [entry,setEntry] = useState(0)
  const [method,setMethod] = useState("avista")
  const [inst,setInst] = useState(1)
  const [payConfirmed,setPayConfirmed] = useState(false)

  const totalKwh = useMemo(()=>{
    let t=kwh
    if(hasAC)t+=acUnits*acKwh;if(hasEV)t+=evKwh;if(hasPool)t+=poolKwh;if(hasFloor)t+=floorKwh;if(hasOthers)t+=othersKwh
    return Math.round(t)
  },[kwh,hasAC,acUnits,acKwh,hasEV,evKwh,hasPool,poolKwh,hasFloor,floorKwh,hasOthers,othersKwh])

  const kit = useMemo(()=>totalKwh>0?selectKit(totalKwh,line,metalOn,metalM2):null,[totalKwh,line,metalOn,metalM2])

  const financed = Math.max(0,(kit?.finalPrice||0)-entry)
  let parc=0,total=0,payLabel=""
  if(kit){
    if(method==="avista"){parc=kit.finalPrice*.85;total=parc;payLabel=`À vista — ${fmt(parc)} (15% desc.)`}
    else if(method==="boleto"){parc=financed/5;total=entry+financed;payLabel=`Boleto 5x de ${fmt(parc)}`}
    else if(method==="cartao"){parc=pmt(financed,.01,inst);total=entry+parc*inst;payLabel=`Cartão ${inst}x de ${fmt(parc)}`}
    else{parc=pmt(financed,.017,inst);total=entry+parc*inst;payLabel=`Financ. ${inst}x de ${fmt(parc)}`}
  }

  const roi = useMemo(()=>kit?calcROI(kit.monthlyEco,kit.finalPrice):null,[kit])

  function step1Next(){if(!vendor||!name||!city||!neighborhood||!roofType||!roofFace){alert("Preencha todos os campos obrigatórios (*)");return}setStep(2)}
  function step2Next(){if(!kwh||kwh<=0){alert("Informe o consumo mensal.");return}setStep(3)}

  const Progress = () => (
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        {STEPS.map((l,i)=><span key={l} style={{fontSize:10,fontWeight:700,color:i+1===step?"#76FF03":i+1<step?"#4CAF50":"rgba(255,255,255,.25)",width:"16.66%",textAlign:"center"}}>{l}</span>)}
      </div>
      <div style={{height:4,background:"#132613",borderRadius:2}}>
        <div style={{height:"100%",background:"linear-gradient(90deg,#00ACC1,#4CAF50)",borderRadius:2,width:`${(step/6)*100}%`,transition:"width .4s"}}/>
      </div>
    </div>
  )

  const Wrap = ({children}:{children:React.ReactNode}) => (
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 16px"}}>
      <Progress/>
      <div style={{background:"#0D1A0D",border:"1px solid rgba(46,125,50,.15)",borderRadius:16,padding:24}}>
        {children}
      </div>
    </div>
  )

  // STEP 1
  if(step===1) return <Wrap>
    <div style={S.tag}>ETAPA 1</div>
    <h2 style={S.h2}>Dados do Cliente</h2>
    <p style={S.sub}>Preencha as informações da visita.</p>
    <div style={S.wrap}>
      <div style={S.tag}>VENDEDOR</div>
      <label>Seu nome *</label><input value={vendor} onChange={e=>setVendor(e.target.value)} placeholder="Nome do vendedor" style={{marginTop:4}}/>
    </div>
    <div style={S.wrap}>
      <div style={S.tag}>CLIENTE</div>
      <div style={S.grid2}>
        <div><label>Nome completo *</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" style={{marginTop:4}}/></div>
        <div><label>Empresa</label><input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Razão social" style={{marginTop:4}}/></div>
        <div><label>Telefone</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(00) 00000-0000" style={{marginTop:4}}/></div>
        <div><label>E-mail</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="email@exemplo.com" style={{marginTop:4}}/></div>
        <div><label>Cidade *</label><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Ex: Curitiba" style={{marginTop:4}}/></div>
        <div><label>Bairro *</label><input value={neighborhood} onChange={e=>setNeighborhood(e.target.value)} placeholder="Ex: Centro" style={{marginTop:4}}/></div>
      </div>
    </div>
    <div style={S.wrap}>
      <div style={S.tag}>TELHADO</div>
      <div style={S.grid2}>
        <div><label>Tipo *</label><select value={roofType} onChange={e=>setRoofType(e.target.value)} style={{marginTop:4}}><option value="">Selecione...</option><option>Telha Cerâmica</option><option>Telha Metálica</option><option>Laje</option><option>Fibrocimento</option><option>Outro</option></select></div>
        <div><label>Face *</label><select value={roofFace} onChange={e=>setRoofFace(e.target.value)} style={{marginTop:4}}><option value="">Selecione...</option>{["Norte","Sul","Leste","Oeste","Nordeste","Noroeste","Sudeste","Sudoeste"].map(f=><option key={f}>{f}</option>)}</select></div>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={step1Next} className="btn-primary">Continuar →</button></div>
  </Wrap>

  // STEP 2
  if(step===2) return <Wrap>
    <div style={S.tag}>ETAPA 2</div>
    <h2 style={S.h2}>Consumo Atual</h2>
    <p style={S.sub}>Informe o consumo mensal em kWh (está na conta de luz).</p>
    <div style={S.wrap}>
      <label>kWh por mês</label>
      <input type="number" value={kwh||""} onChange={e=>setKwh(Number(e.target.value))} placeholder="0" min="0" step="10" style={{marginTop:4,fontSize:20,fontWeight:700}}/>
      <input type="range" min="0" max="5000" step="50" value={kwh} onChange={e=>setKwh(Number(e.target.value))} style={{width:"100%",marginTop:10,accentColor:"#4CAF50"}}/>
    </div>
    {kwh>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
      {[["Gasto mensal",fmt(kwh*KWH_PRICE),"#76FF03"],["Gasto anual",fmt(kwh*KWH_PRICE*12),"#4CAF50"],["Em 25 anos",fmt(kwh*KWH_PRICE*12*25),"#fff"]].map(([l,v,c])=>(
        <div key={l as string} style={{background:"#1A3320",borderRadius:10,padding:14,textAlign:"center"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:4}}>{l}</div>
          <div style={{fontSize:15,fontWeight:900,color:c as string}}>{v}</div>
        </div>
      ))}
    </div>}
    <div style={{...S.wrap,marginBottom:20}}>
      <div style={S.tag}>REFERÊNCIAS RÁPIDAS</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {[[150,"~150kWh"],[350,"~350kWh"],[600,"~600kWh"],[1000,"~1000kWh"],[3000,"~3000kWh"]].map(([v,l])=>(
          <button key={v} onClick={()=>setKwh(v as number)} style={{padding:"6px 12px",borderRadius:6,border:"1px solid rgba(46,125,50,.3)",background:"transparent",color:"rgba(255,255,255,.5)",fontSize:11,fontWeight:600,cursor:"pointer"}}>{l}</button>
        ))}
      </div>
    </div>
    <div style={S.nav}><button onClick={()=>setStep(1)} className="btn-outline">← Voltar</button><button onClick={step2Next} className="btn-primary">Continuar →</button></div>
  </Wrap>

  // STEP 3
  if(step===3) return <Wrap>
    <div style={S.tag}>ETAPA 3</div>
    <h2 style={S.h2}>Adições Futuras</h2>
    <p style={S.sub}>Selecione equipamentos que o cliente pretende adicionar.</p>
    {[
      {key:"AC",ic:"❄️",l:"Ar-condicionado",s:"~300 kWh/mês por unidade",on:hasAC,setOn:setHasAC,bg:"rgba(33,150,243,.2)"},
      {key:"EV",ic:"🚗",l:"Carro Elétrico",s:"~200 kWh/mês",on:hasEV,setOn:setHasEV,bg:"rgba(103,58,183,.2)"},
      {key:"Pool",ic:"🏊",l:"Piscina Aquecida",s:"~400 kWh/mês",on:hasPool,setOn:setHasPool,bg:"rgba(0,150,136,.2)"},
      {key:"Floor",ic:"🔥",l:"Piso Aquecido",s:"~300 kWh/mês",on:hasFloor,setOn:setHasFloor,bg:"rgba(255,152,0,.2)"},
      {key:"Others",ic:"➕",l:"Outros Consumidores",s:"Informe o consumo",on:hasOthers,setOn:setHasOthers,bg:"rgba(76,175,80,.2)"},
    ].map(it=>(
      <div key={it.key} style={{background:"#1A3320",borderRadius:10,marginBottom:10,overflow:"hidden"}}>
        <div onClick={()=>it.setOn(!it.on)} style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
          <div style={{width:38,height:38,borderRadius:10,background:it.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{it.ic}</div>
          <div style={{flex:1}}><div style={{fontWeight:600}}>{it.l}</div><div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{it.s}</div></div>
          <div style={S.toggle(it.on)}><div style={S.dot(it.on)}/></div>
        </div>
        {it.on&&<div style={{padding:"14px 16px",borderTop:"1px solid rgba(46,125,50,.15)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {it.key==="AC"&&<><div><label>Quantidade</label><input type="number" min="1" value={acUnits} onChange={e=>setAcUnits(Number(e.target.value))}/></div><div><label>kWh/unidade</label><input type="number" value={acKwh} onChange={e=>setAcKwh(Number(e.target.value))}/></div></>}
          {it.key==="EV"&&<div><label>kWh/mês</label><input type="number" value={evKwh} onChange={e=>setEvKwh(Number(e.target.value))}/></div>}
          {it.key==="Pool"&&<div><label>kWh/mês</label><input type="number" value={poolKwh} onChange={e=>setPoolKwh(Number(e.target.value))}/></div>}
          {it.key==="Floor"&&<div><label>kWh/mês</label><input type="number" value={floorKwh} onChange={e=>setFloorKwh(Number(e.target.value))}/></div>}
          {it.key==="Others"&&<><div style={{gridColumn:"span 2"}}><label>Descrição</label><input value={othersDesc} onChange={e=>setOthersDesc(e.target.value)} placeholder="Ex: Bomba de irrigação..."/></div><div><label>kWh/mês</label><input type="number" value={othersKwh} onChange={e=>setOthersKwh(Number(e.target.value))}/></div></>}
        </div>}
      </div>
    ))}
    <div style={{background:"linear-gradient(135deg,#00ACC1,#4CAF50)",borderRadius:12,padding:"16px 20px",margin:"16px 0"}}>
      <div style={{fontSize:11,opacity:.8,fontWeight:600,marginBottom:4}}>⚡ CONSUMO TOTAL</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:28,fontWeight:900}}>{totalKwh.toLocaleString("pt-BR")} kWh/mês</div>
        <div style={{textAlign:"right"}}><div style={{fontSize:11,opacity:.7}}>Custo estimado</div><div style={{fontSize:16,fontWeight:800}}>{fmt(totalKwh*KWH_PRICE)}/mês</div></div>
      </div>
    </div>
    <div style={S.nav}><button onClick={()=>setStep(2)} className="btn-outline">← Voltar</button><button onClick={()=>setStep(4)} className="btn-primary">Continuar →</button></div>
  </Wrap>

  // STEP 4
  if(step===4) return <Wrap>
    <div style={S.tag}>ETAPA 4</div>
    <h2 style={S.h2}>Opções de Instalação</h2>
    <p style={S.sub}>Configure as condições e escolha a linha do produto.</p>
    <div style={S.wrap}>
      <div style={S.tag}>DISTÂNCIA: INVERSOR → QUADRO</div>
      {([["<30m","Menos de 30 metros"],["<50m","30 a 50 metros"],["<100m","50 a 100 metros"]] as [string,string][]).map(([v,l])=>(
        <div key={v} onClick={()=>setDist(v)} style={{padding:"12px 14px",borderRadius:8,border:`1px solid ${dist===v?"#4CAF50":"rgba(46,125,50,.2)"}`,background:dist===v?"rgba(76,175,80,.1)":"transparent",cursor:"pointer",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${dist===v?"#4CAF50":"rgba(255,255,255,.3)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{dist===v&&<div style={{width:8,height:8,borderRadius:"50%",background:"#4CAF50"}}/>}</div>
          <span style={{fontSize:13,fontWeight:500}}>{l}</span>
        </div>
      ))}
    </div>
    <div style={S.wrap}>
      <div style={S.tag}>ESTRUTURA METÁLICA</div>
      <div onClick={()=>setMetalOn(!metalOn)} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginBottom:metalOn?12:0}}>
        <div style={S.toggle(metalOn)}><div style={S.dot(metalOn)}/></div>
        <span style={{fontSize:13,fontWeight:500}}>Incluir estrutura metálica (cobertura/pergolado)</span>
      </div>
      {metalOn&&<div><label>Área coberta (m²)</label><input type="number" min="1" value={metalM2} onChange={e=>setMetalM2(Number(e.target.value))} style={{marginTop:4}}/><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginTop:8}}><span style={{color:"rgba(255,255,255,.5)"}}>Custo adicional:</span><span style={{color:"#76FF03",fontWeight:800}}>+ R$ {(metalM2*1000).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span></div></div>}
    </div>
    <div style={S.wrap}>
      <div style={S.tag}>LINHA DO PRODUTO</div>
      <div style={S.grid2}>
        <div onClick={()=>setLine("premium")} style={{border:`2px solid ${line==="premium"?"#76FF03":"rgba(46,125,50,.2)"}`,borderRadius:10,padding:16,cursor:"pointer",background:line==="premium"?"rgba(118,255,3,.05)":"transparent"}}>
          <div style={{fontSize:10,padding:"3px 8px",borderRadius:20,fontWeight:700,display:"inline-block",marginBottom:8,background:"rgba(118,255,3,.15)",color:"#76FF03"}}>🏆 Recomendado</div>
          <div style={{fontWeight:800,marginBottom:3}}>LINHA PREMIUM</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>Melhor custo-benefício. Equipamentos de primeira linha.</div>
        </div>
        <div onClick={()=>setLine("standard")} style={{border:`2px solid ${line==="standard"?"#00ACC1":"rgba(46,125,50,.2)"}`,borderRadius:10,padding:16,cursor:"pointer",background:line==="standard"?"rgba(0,172,193,.05)":"transparent"}}>
          <div style={{fontSize:10,padding:"3px 8px",borderRadius:20,fontWeight:700,display:"inline-block",marginBottom:8,background:"rgba(0,172,193,.15)",color:"#00ACC1"}}>💰 Mais acessível</div>
          <div style={{fontWeight:800,marginBottom:3}}>LINHA STANDARD</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>20% abaixo da Premium.</div>
        </div>
      </div>
    </div>
    <div style={S.nav}><button onClick={()=>setStep(3)} className="btn-outline">← Voltar</button><button onClick={()=>setStep(5)} className="btn-primary">Continuar →</button></div>
  </Wrap>

  // STEP 5
  if(step===5) return <Wrap>
    <div style={S.tag}>ETAPA 5</div>
    <h2 style={S.h2}>Kit & Pagamento</h2>
    <p style={S.sub}>Kit dimensionado automaticamente. Selecione as condições.</p>
    {kit&&<div style={{background:"linear-gradient(135deg,#00ACC1,#4CAF50)",borderRadius:12,padding:"18px 20px",marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div><div style={{fontSize:11,opacity:.8,fontWeight:600,marginBottom:4}}>KIT RECOMENDADO</div><div style={{fontSize:30,fontWeight:900}}>{kit.totalPlates} Placas</div><div style={{fontSize:13,opacity:.8,marginTop:2}}>{kit.secondary?`${kit.primary.plates} + ${kit.secondary.plates} placas`:"Kit único"}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:10,opacity:.6}}>LINHA</div><div style={{fontSize:16,fontWeight:900}}>{line.toUpperCase()}</div><div style={{fontSize:10,opacity:.6,marginTop:6}}>COBERTURA</div><div style={{fontSize:18,fontWeight:900}}>{kit.coverage}%</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,.2)"}}>
        {[[kit.totalKwh.toFixed(0),"kWh/mês"],[fmt(kit.monthlyEco),"Econ./mês"],[fmt(kit.monthlyEco*12),"Econ./ano"],[fmt(kit.finalPrice),"Preço"]].map(([v,l])=>(
          <div key={l as string}><div style={{fontSize:14,fontWeight:800}}>{v}</div><div style={{fontSize:9,opacity:.6}}>{l}</div></div>
        ))}
      </div>
    </div>}
    <div style={S.wrap}>
      <label>Valor de entrada (opcional)</label>
      <input type="number" value={entry||""} onChange={e=>{setEntry(Number(e.target.value));setPayConfirmed(false)}} placeholder="R$ 0,00" min="0" step="500" style={{marginTop:4}}/>
      {entry>0&&<div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:6}}>Saldo financiado: {fmt(financed)}</div>}
    </div>
    <div style={S.wrap}>
      <div style={S.tag}>CONDIÇÃO DE PAGAMENTO</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14}}>
        {[{id:"avista",ic:"☀️",l:"À Vista"},{id:"boleto",ic:"📄",l:"Boleto 5x"},{id:"cartao",ic:"💳",l:"Cartão"},{id:"financiamento",ic:"🏦",l:"Financ."}].map(m=>(
          <div key={m.id} onClick={()=>{setMethod(m.id);setInst(m.id==="cartao"?2:m.id==="financiamento"?12:1);setPayConfirmed(false)}} style={{padding:"10px 8px",borderRadius:8,border:`1px solid ${method===m.id?"#4CAF50":"rgba(46,125,50,.2)"}`,cursor:"pointer",textAlign:"center",background:method===m.id?"rgba(76,175,80,.15)":"transparent",color:method===m.id?"#fff":"rgba(255,255,255,.4)",fontSize:11,fontWeight:600}}>
            <div style={{fontSize:16,marginBottom:4}}>{m.ic}</div>{m.l}
          </div>
        ))}
      </div>
      {(method==="cartao"||method==="financiamento")&&<div style={{marginBottom:12}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:6}}>Parcelas:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {(method==="cartao"?[2,3,4,5,6,7,8,9,10,12,15,18,21]:[12,18,24,36,48,60,72]).map(n=>(
            <button key={n} onClick={()=>{setInst(n);setPayConfirmed(false)}} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${inst===n?"#4CAF50":"rgba(46,125,50,.2)"}`,background:inst===n?"rgba(76,175,80,.1)":"transparent",color:inst===n?"#fff":"rgba(255,255,255,.4)",fontSize:12,fontWeight:600,cursor:"pointer"}}>{n}x</button>
          ))}
        </div>
      </div>}
      <div style={{background:"#132613",border:"1px solid rgba(76,175,80,.3)",borderRadius:10,padding:16}}>
        <div style={{fontSize:26,fontWeight:900}}>{payLabel}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:12,paddingTop:12,borderTop:"1px solid rgba(46,125,50,.2)"}}>
          {kit&&[[fmt(kit.monthlyEco),"Econ./mês"],[fmt(kit.monthlyEco*12),"Econ./ano"],[fmt(total),"Total pago"]].map(([v,l])=>(
            <div key={l as string} style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:"#76FF03"}}>{v}</div><div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>{l}</div></div>
          ))}
        </div>
        <button onClick={()=>setPayConfirmed(true)} style={{marginTop:12,width:"100%",padding:10,borderRadius:8,background:payConfirmed?"#76FF03":"rgba(76,175,80,.2)",border:`1px solid ${payConfirmed?"#76FF03":"#4CAF50"}`,color:payConfirmed?"#060D06":"#4CAF50",fontWeight:700,fontSize:13,cursor:"pointer"}}>
          {payConfirmed?"✓ Condição selecionada":"Selecionar esta condição"}
        </button>
      </div>
    </div>
    <div style={S.nav}><button onClick={()=>setStep(4)} className="btn-outline">← Voltar</button><button onClick={()=>{if(!payConfirmed){alert("Selecione uma condição de pagamento.");return}setStep(6)}} className="btn-primary" style={{opacity:payConfirmed?1:.4}}>Ver Proposta →</button></div>
  </Wrap>

  // STEP 6
  if(step===6&&kit&&roi) return <Wrap>
    <div style={S.tag}>PROPOSTA CONCLUÍDA ✓</div>
    <h2 style={S.h2}>Resumo da Proposta</h2>
    <p style={{fontSize:12,color:"rgba(255,255,255,.3)",marginBottom:20}}>Proposta nº {propNum} · {new Date().toLocaleDateString("pt-BR")} · Vendedor: {vendor}</p>
    <div style={{background:"linear-gradient(135deg,#00ACC1,#4CAF50)",borderRadius:14,padding:22,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <div style={{width:46,height:46,background:"rgba(255,255,255,.2)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>☀️</div>
        <div><div style={{fontSize:22,fontWeight:900}}>{name}</div><div style={{fontSize:12,opacity:.7}}>{city} — {neighborhood}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,paddingTop:14,borderTop:"1px solid rgba(255,255,255,.25)"}}>
        {[[totalKwh,"kWh consumo"],[kit.totalPlates,"placas"],[kit.totalKwh.toFixed(0),"kWh gerado"],[kit.coverage+"%","cobertura"]].map(([v,l])=>(
          <div key={l as string}><div style={{fontSize:14,fontWeight:800}}>{v}</div><div style={{fontSize:9,opacity:.6}}>{l}</div></div>
        ))}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
      <div style={S.wrap}>
        <div style={S.tag}>SISTEMA</div>
        {[["Linha",line.toUpperCase()],["Placas",kit.totalPlates+" un"],["Telhado",roofType],["Face",roofFace],["Dist. inv.",dist]].map(([l,v])=>(
          <div key={l as string} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(46,125,50,.1)",fontSize:12}}><span style={{color:"rgba(255,255,255,.45)"}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
        ))}
      </div>
      <div style={S.wrap}>
        <div style={S.tag}>FINANCEIRO</div>
        {[["Kit",fmt(kit.basePrice)],["Total",fmt(kit.finalPrice),"#76FF03"],["Pagamento",payLabel.split(" — ")[0]],["Parcela",fmt(parc),"#76FF03"],["Total pago",fmt(total)]].map(([l,v,c])=>(
          <div key={l as string} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(46,125,50,.1)",fontSize:12}}><span style={{color:"rgba(255,255,255,.45)"}}>{l}</span><span style={{fontWeight:600,color:c as string||"#fff"}}>{v}</span></div>
        ))}
      </div>
      <div style={S.wrap}>
        <div style={S.tag}>RETORNO (ROI)</div>
        {[["Econ./mês",fmt(kit.monthlyEco),"#76FF03"],["Econ./ano",fmt(kit.monthlyEco*12)],["Ret. 25 anos",fmt(roi.ret25),"#76FF03"]].map(([l,v,c])=>(
          <div key={l as string} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(46,125,50,.1)",fontSize:12}}><span style={{color:"rgba(255,255,255,.45)"}}>{l}</span><span style={{fontWeight:600,color:c as string||"#fff"}}>{v}</span></div>
        ))}
        <div style={{textAlign:"center",paddingTop:10}}><div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>PAYBACK</div><div style={{fontSize:28,fontWeight:900,color:"#76FF03"}}>{roi.payback}</div><div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>anos para retorno</div></div>
      </div>
      <div style={S.wrap}>
        <div style={S.tag}>GARANTIAS</div>
        {[["Inversores","10 anos"],["Painel (defeito)","12 anos"],["Painel (vida útil)","25 anos"],["Instalação","12 meses"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(46,125,50,.1)",fontSize:12}}><span style={{color:"rgba(255,255,255,.45)"}}>{l}</span><span style={{fontWeight:700,color:"#76FF03"}}>{v}</span></div>
        ))}
      </div>
    </div>
    <div style={S.wrap}>
      <div style={S.tag}>📈 FLUXO DE CAIXA — 25 ANOS</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr>{["Período","Economia Anual","Saldo Acumulado"].map(h=><th key={h} style={{background:"#132613",padding:"6px 10px",textAlign:"left",color:"rgba(255,255,255,.5)",fontSize:10}}>{h}</th>)}</tr></thead>
        <tbody>{roi.table.filter(r=>[0,3,5,10,15,20,25].includes(r.year)).map(r=>(
          <tr key={r.year}><td style={{padding:"6px 10px",borderBottom:"1px solid rgba(46,125,50,.1)"}}>{r.year===0?"0º ano":`${r.year}º ano`}</td><td style={{padding:"6px 10px",borderBottom:"1px solid rgba(46,125,50,.1)"}}>{fmt(r.cashflow)}</td><td style={{padding:"6px 10px",borderBottom:"1px solid rgba(46,125,50,.1)",fontWeight:700,color:r.balance>=0?"#76FF03":"#EF5350"}}>{fmt(r.balance)}</td></tr>
        ))}</tbody>
      </table>
      <div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginTop:8}}>* Inflação 5,8% a.a. · Degradação 20% em 25 anos</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={()=>window.print()} style={{background:"#4CAF50",color:"#060D06",padding:15,borderRadius:10,fontSize:15,fontWeight:800,border:"none",cursor:"pointer"}}>🖨️ Imprimir / Salvar PDF</button>
      <button onClick={()=>setStep(5)} style={{background:"transparent",border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.5)",padding:10,borderRadius:8,fontSize:13,cursor:"pointer"}}>← Ajustar Pagamento</button>
    </div>
    <div style={{textAlign:"center",color:"rgba(255,255,255,.2)",fontSize:10,marginTop:16}}>SHAMS Energia Solar · comercial@shamsolar.net · (41) 99665-9223</div>
  </Wrap>

  return null
}
