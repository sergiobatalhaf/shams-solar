"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "shams2024"

type P = {
  id:string; numero_proposta:string; status:string; created_at:string
  vendedor_nome:string; kit_total_placas:number; kit_preco_final:number
  clientes?:{nome:string;cidade:string}
}

export default function AdminPage() {
  const [auth,setAuth]       = useState(false)
  const [pw,setPw]           = useState("")
  const [ps,setPs]           = useState<P[]>([])
  const [loading,setLoading] = useState(false)

  useEffect(()=>{ if(typeof window!=="undefined"&&sessionStorage.getItem("shams_admin")==="1") setAuth(true) },[])
  useEffect(()=>{ if(auth) load() },[auth])

  async function login(e:React.FormEvent){
    e.preventDefault()
    if(pw===PASS){sessionStorage.setItem("shams_admin","1");setAuth(true)}
    else alert("Senha incorreta")
  }

  async function load(){
    setLoading(true)
    const{data}=await supabase.from("propostas").select("*,clientes(nome,cidade)").order("created_at",{ascending:false}).limit(50)
    if(data) setPs(data as P[])
    setLoading(false)
  }

  async function updStatus(id:string,status:string){
    await supabase.from("propostas").update({status}).eq("id",id)
    load()
  }

  const fmt = (v:number) => v?.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) || "—"
  const sc:Record<string,string> = {draft:"#FFA726",sent:"#29B6F6",approved:"#76FF03",rejected:"#EF5350"}
  const sl:Record<string,string> = {draft:"Rascunho",sent:"Enviada",approved:"Aprovada",rejected:"Recusada"}

  if(!auth) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"80vh",padding:24}}>
      <form onSubmit={login} style={{background:"#1A3320",border:"1px solid rgba(46,125,50,.3)",borderRadius:16,padding:40,width:"100%",maxWidth:380,textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:12}}>🔐</div>
        <h1 style={{fontSize:22,fontWeight:800,marginBottom:4}}>Área Admin</h1>
        <p style={{color:"rgba(255,255,255,.4)",fontSize:13,marginBottom:24}}>SHAMS Energia Solar</p>
        <input type="password" placeholder="Senha" value={pw} onChange={e=>setPw(e.target.value)} style={{marginBottom:16}}/>
        <button type="submit" className="btn-primary" style={{width:"100%"}}>Entrar</button>
      </form>
    </div>
  )

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h1 style={{fontSize:24,fontWeight:800}}>Painel Admin</h1><p style={{color:"rgba(255,255,255,.4)",fontSize:13}}>SHAMS Energia Solar</p></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={load} style={{background:"rgba(46,125,50,.2)",border:"1px solid rgba(46,125,50,.3)",color:"#4CAF50",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>🔄 Atualizar</button>
          <button onClick={()=>{sessionStorage.removeItem("shams_admin");setAuth(false)}} style={{background:"rgba(239,83,80,.15)",border:"1px solid rgba(239,83,80,.3)",color:"#EF5350",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>Sair</button>
        </div>
      </div>

      {loading ? <p style={{color:"rgba(255,255,255,.4)"}}>Carregando...</p> : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {ps.map(p=>(
            <div key={p.id} style={{background:"#1A3320",border:"1px solid rgba(46,125,50,.2)",borderRadius:12,padding:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>#{p.numero_proposta}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:2}}>{p.clientes?.nome} · {p.clientes?.cidade} · {new Date(p.created_at).toLocaleDateString("pt-BR")}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.35)",marginTop:2}}>Vendedor: {p.vendedor_nome} · {p.kit_total_placas} placas · {fmt(p.kit_preco_final)}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,background:`${sc[p.status]}22`,color:sc[p.status]}}>{sl[p.status]}</span>
                <select value={p.status} onChange={e=>updStatus(p.id,e.target.value)} style={{width:"auto",fontSize:11,padding:"4px 8px"}}>
                  <option value="draft">Rascunho</option>
                  <option value="sent">Enviada</option>
                  <option value="approved">Aprovada</option>
                  <option value="rejected">Recusada</option>
                </select>
              </div>
            </div>
          ))}
          {ps.length===0&&<p style={{color:"rgba(255,255,255,.3)",textAlign:"center",padding:40}}>Nenhuma proposta ainda.</p>}
        </div>
      )}
    </div>
  )
}
