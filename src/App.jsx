import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://teyxiznmkkmhqbufmuvp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleXhpem5ta2ttaHFidWZtdXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDYzMzgsImV4cCI6MjA4OTQ4MjMzOH0.5MS6G6jH7ztr0GL1-zkVZN6uAtuHi-w9XfVxnza949k";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// Mapa de usuários → nome de exibição
const USUARIOS = {
  "cabanamanutencao26@gmail.com": { nome: "Hildo",  cargo: "Chefe de Manutenção" },
  "lenilza.keully@hotmail.com":   { nome: "Lena",   cargo: "Gestora Geral" },
};

// ─── TELA DE LOGIN ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [tela,     setTela]     = useState("login"); // "login" | "recuperar" | "enviado"
  const [email,    setEmail]    = useState("");
  const [senha,    setSenha]    = useState("");
  const [erro,     setErro]     = useState("");
  const [msg,      setMsg]      = useState("");
  const [loading,  setLoading]  = useState(false);
  const [mostrarS, setMostrarS] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro(""); setLoading(true);
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password: senha });
    setLoading(false);
    if (error) { setErro("E-mail ou senha incorretos."); return; }
    onLogin(data.user);
  }

  async function recuperarSenha(e) {
    e.preventDefault();
    setErro(""); setLoading(true);
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) { setErro("Erro ao enviar e-mail. Verifique o endereço."); return; }
    setTela("enviado");
  }

  const inp = { width:"100%", background:"#131920", border:"1px solid #1e2830", borderRadius:6, padding:"9px 12px", color:"#dde6ee", fontSize:12, fontFamily:"inherit", boxSizing:"border-box", outline:"none" };

  return (
    <div style={{ fontFamily:"'JetBrains Mono','Fira Code',monospace", background:"#080c10", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet"/>
      <div style={{ width:340, padding:36, background:"#0e1318", border:"1px solid #1e2830", borderRadius:12, boxShadow:"0 8px 40px rgba(0,0,0,0.6)" }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:32, marginBottom:6 }}>⚙</div>
          <div style={{ fontSize:20, fontWeight:800, color:"#f5a623", letterSpacing:"0.1em" }}>FAROL</div>
          <div style={{ fontSize:10, color:"#5a7080", letterSpacing:"0.2em", marginTop:2 }}>SISTEMA DE MANUTENÇÃO</div>
        </div>

        {/* ── TELA LOGIN ── */}
        {tela === "login" && (
          <form onSubmit={entrar}>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:9, color:"#5a7080", letterSpacing:"0.12em", textTransform:"uppercase", display:"block", marginBottom:5 }}>E-mail</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="seu@email.com" style={inp}
                onFocus={e=>e.target.style.borderColor="#f5a623"} onBlur={e=>e.target.style.borderColor="#1e2830"}/>
            </div>
            <div style={{ marginBottom:8 }}>
              <label style={{ fontSize:9, color:"#5a7080", letterSpacing:"0.12em", textTransform:"uppercase", display:"block", marginBottom:5 }}>Senha</label>
              <div style={{ position:"relative" }}>
                <input type={mostrarS?"text":"password"} value={senha} onChange={e=>setSenha(e.target.value)} required placeholder="••••••••"
                  style={{ ...inp, padding:"9px 38px 9px 12px" }}
                  onFocus={e=>e.target.style.borderColor="#f5a623"} onBlur={e=>e.target.style.borderColor="#1e2830"}/>
                <span onClick={()=>setMostrarS(!mostrarS)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", cursor:"pointer", fontSize:14, color:"#5a7080", userSelect:"none" }}>
                  {mostrarS?"🙈":"👁"}
                </span>
              </div>
            </div>
            <div style={{ textAlign:"right", marginBottom:18 }}>
              <span onClick={()=>{ setTela("recuperar"); setErro(""); }} style={{ fontSize:9, color:"#5a7080", cursor:"pointer", textDecoration:"underline", letterSpacing:"0.05em" }}>
                Esqueci minha senha
              </span>
            </div>
            {erro && <div style={{ marginBottom:14, padding:"8px 12px", background:"#e74c3c18", border:"1px solid #e74c3c44", borderRadius:6, fontSize:10, color:"#e74c3c" }}>⚠ {erro}</div>}
            <button type="submit" disabled={loading} style={{ width:"100%", background:loading?"#5a7080":"#f5a623", color:"#000", border:"none", borderRadius:7, padding:"11px", fontSize:11, fontWeight:800, cursor:loading?"not-allowed":"pointer", letterSpacing:"0.1em", textTransform:"uppercase" }}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}

        {/* ── TELA RECUPERAR SENHA ── */}
        {tela === "recuperar" && (
          <form onSubmit={recuperarSenha}>
            <div style={{ fontSize:11, color:"#8aa0b0", marginBottom:18, lineHeight:1.6 }}>
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:9, color:"#5a7080", letterSpacing:"0.12em", textTransform:"uppercase", display:"block", marginBottom:5 }}>E-mail</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="seu@email.com" style={inp}
                onFocus={e=>e.target.style.borderColor="#f5a623"} onBlur={e=>e.target.style.borderColor="#1e2830"}/>
            </div>
            {erro && <div style={{ marginBottom:14, padding:"8px 12px", background:"#e74c3c18", border:"1px solid #e74c3c44", borderRadius:6, fontSize:10, color:"#e74c3c" }}>⚠ {erro}</div>}
            <button type="submit" disabled={loading} style={{ width:"100%", background:loading?"#5a7080":"#f5a623", color:"#000", border:"none", borderRadius:7, padding:"11px", fontSize:11, fontWeight:800, cursor:loading?"not-allowed":"pointer", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>
              {loading ? "Enviando..." : "Enviar link"}
            </button>
            <button type="button" onClick={()=>{ setTela("login"); setErro(""); }} style={{ width:"100%", background:"transparent", color:"#5a7080", border:"1px solid #1e2830", borderRadius:7, padding:"9px", fontSize:10, cursor:"pointer" }}>
              ← Voltar ao login
            </button>
          </form>
        )}

        {/* ── TELA ENVIADO ── */}
        {tela === "enviado" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>📧</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#2ecc71", marginBottom:8 }}>E-mail enviado!</div>
            <div style={{ fontSize:10, color:"#8aa0b0", lineHeight:1.7, marginBottom:24 }}>
              Verifique a caixa de entrada de<br/>
              <strong style={{ color:"#dde6ee" }}>{email}</strong><br/>
              e clique no link para redefinir sua senha.
            </div>
            <button onClick={()=>{ setTela("login"); setErro(""); setEmail(""); }} style={{ width:"100%", background:"transparent", color:"#5a7080", border:"1px solid #1e2830", borderRadius:7, padding:"9px", fontSize:10, cursor:"pointer" }}>
              ← Voltar ao login
            </button>
          </div>
        )}

        <div style={{ marginTop:20, fontSize:9, color:"#5a7080", textAlign:"center", lineHeight:1.6 }}>
          Acesso restrito a usuários autorizados.<br/>
          Em caso de dúvidas, contate o administrador.
        </div>
      </div>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const hoje      = new Date();
const diasAberta = (d) => Math.floor((hoje - new Date(d + "T00:00:00")) / 86400000);
const fmtBRL    = (v) => (!v || v === 0) ? "—" : `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
const fmtData   = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "—";
const totalOS   = (o) => (Number(o.valor_servico) || 0) + (Number(o.valor_pecas) || 0);
const toArray   = (v) => Array.isArray(v) ? v : (v ? [v] : []);

// Converte linha do banco → formato do sistema
const fromDB = (o) => ({
  id: o.id,
  dataInicio:    o.data_inicio,
  setor:         o.setor,
  solicitante:   o.solicitante,
  servico:       o.servico,
  tipoServico:   o.tipo_servico,
  prioridade:    o.prioridade,
  status:        o.status,
  tecnicos:      toArray(o.tecnicos),
  valorServico:  Number(o.valor_servico) || 0,
  nf:            o.nf || "",
  valorPecas:    Number(o.valor_pecas) || 0,
  dataConclusao: o.data_conclusao,
  obs:           o.obs || "",
  anexos:        o.anexos || [],
  criadoEm:      o.criado_em,
  excluido:      o.excluido || false,
  excluidoEm:    o.excluido_em || null,
  excluidoPor:   o.excluido_por || null,
});

// Converte formato do sistema → linha do banco
const toDB = (o) => ({
  data_inicio:    o.dataInicio,
  setor:          o.setor,
  solicitante:    o.solicitante,
  servico:        o.servico,
  tipo_servico:   o.tipoServico,
  prioridade:     o.prioridade,
  status:         o.status || "Em Andamento",
  tecnicos:       toArray(o.tecnicos),
  valor_servico:  Number(o.valorServico) || 0,
  nf:             o.nf || "",
  valor_pecas:    Number(o.valorPecas) || 0,
  data_conclusao: o.dataConclusao || null,
  obs:            o.obs || "",
  anexos:         o.anexos || [],
});

// ─── CORES ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#080c10", surf: "#0e1318", card: "#131920", border: "#1e2830",
  accent: "#f5a623", accentDim: "#f5a62318",
  text: "#dde6ee", muted: "#5a7080", mutedLight: "#8aa0b0",
  green: "#2ecc71", red: "#e74c3c", yellow: "#f39c12", blue: "#3498db",
  cyan: "#1abc9c", purple: "#9b59b6",
};
const STATUS_COLOR = { "Concluido": C.green, "Em Andamento": C.blue, "Pendente": C.yellow };
const PRIO_COLOR   = { "Urgente": C.red, "Alta": "#e67e22", "Média": C.yellow, "Baixa": C.green };

// ─── MINI COMPONENTS ──────────────────────────────────────────────────────────
function Tag({ label, color }) {
  return <span style={{ background: color+"22", color, border:`1px solid ${color}44`, padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:700, whiteSpace:"nowrap", letterSpacing:"0.05em" }}>{label}</span>;
}

function KPICard({ label, value, color, onClick, active }) {
  return (
    <div onClick={onClick} style={{ background: active?color+"22":C.card, border:`1px solid ${active?color:C.border}`, borderLeft:`4px solid ${color}`, borderRadius:8, padding:"16px 18px", cursor:onClick?"pointer":"default", transition:"all 0.15s", transform:active?"translateY(-1px)":"none", boxShadow:active?`0 4px 20px ${color}30`:"none" }}>
      <div style={{ fontSize:28, fontWeight:900, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, color:active?color:C.muted, marginTop:5, textTransform:"uppercase", letterSpacing:"0.1em", display:"flex", alignItems:"center", gap:4 }}>
        {label}{onClick && <span style={{ fontSize:8, opacity:0.7 }}>▶ ver</span>}
      </div>
    </div>
  );
}

function Spinner({ msg = "Carregando..." }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, padding:40, color:C.muted }}>
      <div style={{ width:28, height:28, border:`3px solid ${C.border}`, borderTop:`3px solid ${C.accent}`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize:11 }}>{msg}</div>
    </div>
  );
}

// ─── ANEXOS ───────────────────────────────────────────────────────────────────
function AnexosUploader({ anexos = [], onUpload, onRemove, onPreview }) {
  const [drag, setDrag] = useState(false);
  const uid = Math.random().toString(36).slice(2);
  const isImage = (t) => t && t.startsWith("image/");
  const iconFor = (nome, tipo) => {
    if (isImage(tipo)) return "🖼";
    if (tipo==="application/pdf") return "📄";
    const ext = nome.split(".").pop().toLowerCase();
    if (["zip","rar","7z"].includes(ext)) return "🗜";
    if (["doc","docx"].includes(ext)) return "📝";
    if (["xls","xlsx"].includes(ext)) return "📊";
    return "📎";
  };
  return (
    <div>
      <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);onUpload(e.dataTransfer.files);}}
        onClick={()=>document.getElementById("ai-"+uid).click()}
        style={{ border:`2px dashed ${drag?C.accent:C.border}`, borderRadius:7, padding:"10px 14px", textAlign:"center", cursor:"pointer", background:drag?C.accent+"0a":"transparent", transition:"all 0.15s", marginBottom:10 }}>
        <div style={{ fontSize:18, marginBottom:3 }}>📎</div>
        <div style={{ fontSize:10, color:C.muted }}>Clique ou arraste arquivos aqui</div>
        <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>Imagens · PDF · ZIP · Word · Excel · Máx 10MB</div>
      </div>
      <input id={"ai-"+uid} type="file" multiple accept="*/*" style={{ display:"none" }} onChange={e=>{onUpload(e.target.files);e.target.value="";}} />
      {anexos.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {anexos.map(a => (
            <div key={a.id} style={{ position:"relative", display:"inline-flex", flexDirection:"column", alignItems:"center" }}>
              {isImage(a.tipo)
                ? <div onClick={()=>onPreview(a)} style={{ cursor:"pointer" }}><img src={a.data} alt={a.nome} style={{ width:72, height:72, objectFit:"cover", borderRadius:6, border:`1px solid ${C.border}`, display:"block" }} /></div>
                : <div onClick={()=>onPreview(a)} style={{ width:72, height:72, borderRadius:6, border:`1px solid ${C.border}`, background:C.surf, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <div style={{ fontSize:26 }}>{iconFor(a.nome,a.tipo)}</div>
                    <div style={{ fontSize:8, color:C.muted, marginTop:3, textAlign:"center", padding:"0 4px" }}>{a.nome.split(".").pop().toUpperCase()}</div>
                  </div>
              }
              <div style={{ fontSize:8, color:C.muted, marginTop:3, maxWidth:72, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.nome}</div>
              <button onClick={()=>onRemove(a.id)} style={{ position:"absolute", top:-5, right:-5, width:16, height:16, borderRadius:"50%", background:C.red, border:"none", color:"#fff", fontSize:9, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SELETOR MÚLTIPLOS TÉCNICOS ───────────────────────────────────────────────
function TecnicosSelector({ value, onChange, opcoes }) {
  const [input, setInput] = useState("");
  const selecionados = toArray(value);
  const add = (nome) => { if (nome && !selecionados.includes(nome)) onChange([...selecionados, nome]); setInput(""); };
  const remove = (nome) => onChange(selecionados.filter(n=>n!==nome));
  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:6 }}>
        {selecionados.map(n => (
          <span key={n} style={{ background:C.accent+"22", border:`1px solid ${C.accent}44`, color:C.accent, padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>
            {n}<span onClick={()=>remove(n)} style={{ cursor:"pointer", color:C.red, fontWeight:900, fontSize:12 }}>×</span>
          </span>
        ))}
      </div>
      <div style={{ position:"relative" }}>
        <input style={{ width:"100%", background:C.surf, border:`1px solid ${C.border}`, borderRadius:5, padding:"6px 10px", color:C.text, fontSize:11, fontFamily:"inherit", boxSizing:"border-box" }}
          placeholder="Adicionar técnico / fornecedor..." value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&input.trim())add(input.trim());}}
          list="tec-opts" />
        <datalist id="tec-opts">{opcoes.filter(o=>!selecionados.includes(o)).map(s=><option key={s} value={s}/>)}</datalist>
        {input.trim() && <button onClick={()=>add(input.trim())} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:C.accent, color:"#000", border:"none", borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:800, cursor:"pointer" }}>+ add</button>}
      </div>
      <div style={{ fontSize:9, color:C.muted, marginTop:3 }}>Enter ou + para adicionar · Pode adicionar vários</div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Autenticação ──
  const [usuario, setUsuario] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Verifica sessão existente ao abrir
    sb.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user || null);
      setAuthLoading(false);
    });
    // Escuta mudanças de sessão
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Trocar senha ──
  const [modalSenha,   setModalSenha]   = useState(false);
  const [senhaAtual,   setSenhaAtual]   = useState("");
  const [senhaNova,    setSenhaNova]    = useState("");
  const [senhaConf,    setSenhaConf]    = useState("");
  const [erroSenha,    setErroSenha]    = useState("");
  const [salvandoSenha,setSalvandoS]   = useState(false);

  async function trocarSenha(e) {
    e.preventDefault();
    setErroSenha("");
    if (senhaNova.length < 6) { setErroSenha("A nova senha deve ter pelo menos 6 caracteres."); return; }
    if (senhaNova !== senhaConf) { setErroSenha("As senhas não coincidem."); return; }
    setSalvandoS(true);
    // Reautentica com senha atual primeiro
    const { error: reAuthErr } = await sb.auth.signInWithPassword({ email: usuario.email, password: senhaAtual });
    if (reAuthErr) { setErroSenha("Senha atual incorreta."); setSalvandoS(false); return; }
    const { error } = await sb.auth.updateUser({ password: senhaNova });
    setSalvandoS(false);
    if (error) { setErroSenha("Erro ao atualizar senha: " + error.message); return; }
    setModalSenha(false);
    setSenhaAtual(""); setSenhaNova(""); setSenhaConf("");
    showToast("Senha alterada com sucesso!");
  }

  async function sair() {
    await sb.auth.signOut();
    setUsuario(null);
  }

  // Enquanto verifica sessão
  if (authLoading) return (
    <div style={{ fontFamily:"'JetBrains Mono',monospace", background:"#080c10", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#5a7080", fontSize:12 }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet"/>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:14, fontWeight:800, color:"#f5a623", marginBottom:12 }}>⚙ FAROL</div>
        <div>Verificando sessão...</div>
      </div>
    </div>
  );

  // Tela de login se não autenticado
  if (!usuario) return <LoginScreen onLogin={setUsuario} />;

  const infoUsuario = USUARIOS[usuario.email] || { nome: usuario.email, cargo: "Usuário" };
  // ── Estado de dados ──
  const [ordens,       setOrdens]       = useState([]);
  const [excluidas,    setExcluidas]    = useState([]);
  const [tecnicos,     setTecnicos]     = useState([]);
  const [solicitantes, setSolicitantes] = useState([]);
  const [setoresList,  setSetoresList]  = useState([]);
  const [tiposServico, setTiposServico] = useState([]);

  // ── UI ──
  const [aba,         setAba]         = useState("dashboard");
  const [subCadastro, setSubCadastro] = useState("tecnicos");
  const [loading,     setLoading]     = useState(true);
  const [salvando,    setSalvando]    = useState(false);
  const [erro,        setErro]        = useState(null);

  // ── Filtros ──
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroSetor,  setFiltroSetor]  = useState("Todos");
  const [filtroPrio,   setFiltroPrio]   = useState("Todos");
  const [busca,        setBusca]        = useState("");
  const [kpiAtivo,     setKpiAtivo]     = useState(null);

  // ── Modais ──
  const [detalhe,      setDetalhe]      = useState(null);
  const [modalOS,      setModalOS]      = useState(false);
  const [editOS,       setEditOS]       = useState(null);
  const [previewAnexo, setPreviewAnexo] = useState(null);

  // ── Edição de cadastros ──
  const [editandoCad, setEditandoCad] = useState(null);
  const [draftCad,    setDraftCad]    = useState({});

  // ── Forms ──
  const OS_VAZIO = { dataInicio: new Date().toISOString().split("T")[0], setor:"", solicitante:"", servico:"", tipoServico:"Corretiva", prioridade:"Média", tecnicos:[], valorServico:"", valorPecas:"", nf:"", obs:"", anexos:[] };
  const [novaOS,   setNovaOS]   = useState(OS_VAZIO);
  const [novoTec,  setNovoTec]  = useState({ nome:"", tipo:"Fornecedor", especialidade:"", telefone:"" });
  const [novoSol,  setNovoSol]  = useState({ nome:"", setor:"", cargo:"" });
  const [novoSetor,setNovoSetor]= useState("");
  const [novoTipo, setNovoTipo] = useState({ nome:"", descricao:"", cor:"#3498db" });

  // ── Toast ──
  const [toast, setToast] = useState(null);
  const showToast = (msg, tipo="ok") => { setToast({ msg, tipo }); setTimeout(()=>setToast(null), 3000); };

  // ── Undo conclusão ──
  const [undoId,      setUndoId]  = useState(null);
  const [undoSeg,     setUndoSeg] = useState(0);
  const undoRef = useRef(null);

  // ─── CARREGAR DADOS DO BANCO ────────────────────────────────────────────────
  const carregarTudo = useCallback(async () => {
    setLoading(true); setErro(null);
    try {
      const [oRes, oExcRes, tRes, sRes, setRes, tipRes] = await Promise.all([
        sb.from("ordens").select("*").eq("excluido", false).order("id", { ascending: false }),
        sb.from("ordens").select("*").eq("excluido", true).order("excluido_em", { ascending: false }),
        sb.from("tecnicos").select("*").order("nome"),
        sb.from("solicitantes").select("*").order("nome"),
        sb.from("setores").select("*").order("nome"),
        sb.from("tipos_servico").select("*").order("nome"),
      ]);
      if (oRes.error)    throw oRes.error;
      if (oExcRes.error) throw oExcRes.error;
      if (tRes.error)    throw tRes.error;
      if (sRes.error)    throw sRes.error;
      if (setRes.error)  throw setRes.error;
      if (tipRes.error)  throw tipRes.error;

      setOrdens(oRes.data.map(fromDB));
      setExcluidas(oExcRes.data.map(fromDB));
      setTecnicos(tRes.data);
      setSolicitantes(sRes.data);
      setSetoresList(setRes.data.map(s=>s.nome));
      setTiposServico(tipRes.data);
    } catch (e) {
      setErro("Erro ao conectar com o banco. Verifique sua conexão.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarTudo(); }, [carregarTudo]);

  // ─── COMPUTED ───────────────────────────────────────────────────────────────
  const alertas        = useMemo(() => ordens.filter(o=>o.status==="Em Andamento").map(o=>({...o,dias:diasAberta(o.dataInicio)})).sort((a,b)=>b.dias-a.dias), [ordens]);
  const alertasCriticos= alertas.filter(a=>a.dias>=7);
  const setoresOpts    = useMemo(() => ["Todos",...Array.from(new Set([...setoresList,...ordens.map(o=>o.setor)])).sort()],[setoresList,ordens]);
  const nomeTecnicos   = useMemo(() => tecnicos.filter(t=>t.ativo).map(t=>t.nome),[tecnicos]);
  const nomeSolicitantes=useMemo(() => solicitantes.filter(s=>s.ativo).map(s=>s.nome),[solicitantes]);
  const nomeTipos      = useMemo(() => tiposServico.map(t=>t.nome),[tiposServico]);
  const totalGasto     = ordens.reduce((s,o)=>s+totalOS(o),0);

  const filtradas = useMemo(() => {
    let b = ordens;
    if (kpiAtivo==="andamento")  b = b.filter(o=>o.status==="Em Andamento");
    else if (kpiAtivo==="concluidas") b = b.filter(o=>o.status==="Concluido");
    else if (kpiAtivo==="alertas")    b = b.filter(o=>o.status==="Em Andamento"&&diasAberta(o.dataInicio)>=7);
    if (filtroStatus!=="Todos") b = b.filter(o=>o.status===filtroStatus);
    if (filtroSetor !=="Todos") b = b.filter(o=>o.setor===filtroSetor);
    if (filtroPrio  !=="Todos") b = b.filter(o=>o.prioridade===filtroPrio);
    if (busca) { const q=busca.toLowerCase(); b=b.filter(o=>[o.servico,o.solicitante,o.setor,...toArray(o.tecnicos)].some(x=>x.toLowerCase().includes(q))); }
    return b;
  }, [ordens,kpiAtivo,filtroStatus,filtroSetor,filtroPrio,busca]);

  const gastoMes = useMemo(()=>{ const m={}; ordens.forEach(o=>{const k=o.dataInicio?.substring(0,7)||""; m[k]=(m[k]||0)+totalOS(o);}); return Object.entries(m).sort(); },[ordens]);
  const maxMes   = Math.max(...gastoMes.map(([,v])=>v),1);
  const histSetor= useMemo(()=>{ const m={}; ordens.forEach(o=>{if(!m[o.setor])m[o.setor]={qtd:0,gasto:0,abertos:0}; m[o.setor].qtd++; m[o.setor].gasto+=totalOS(o); if(o.status==="Em Andamento")m[o.setor].abertos++;}); return Object.entries(m).sort((a,b)=>b[1].gasto-a[1].gasto); },[ordens]);

  // ─── ORDENS DE SERVIÇO ──────────────────────────────────────────────────────
  async function salvarOS() {
    const d = editOS || novaOS;
    if (!d.setor||!d.servico) { showToast("Preencha pelo menos Setor e Serviço","erro"); return; }
    setSalvando(true);
    try {
      if (editOS) {
        const { error } = await sb.from("ordens").update(toDB(editOS)).eq("id", editOS.id);
        if (error) throw error;
        setOrdens(prev=>prev.map(o=>o.id===editOS.id?{...editOS,tecnicos:toArray(editOS.tecnicos),valorServico:Number(editOS.valorServico)||0,valorPecas:Number(editOS.valorPecas)||0}:o));
        showToast(`OS #${String(editOS.id).padStart(3,"0")} atualizada`);
        setEditOS(null);
      } else {
        const { data, error } = await sb.from("ordens").insert([toDB(novaOS)]).select().single();
        if (error) throw error;
        setOrdens(prev=>[fromDB(data),...prev]);
        showToast("Nova OS criada com sucesso!");
        setNovaOS(OS_VAZIO);
      }
      setModalOS(false);
    } catch(e) { showToast("Erro ao salvar OS: "+e.message,"erro"); }
    finally { setSalvando(false); }
  }

  async function concluirOS(id) {
    const hoje_str = new Date().toISOString().split("T")[0];
    const { error } = await sb.from("ordens").update({ status:"Concluido", data_conclusao: hoje_str }).eq("id", id);
    if (error) { showToast("Erro ao concluir OS","erro"); return; }
    setOrdens(prev => prev.map(o => o.id===id ? {...o, status:"Concluido", dataConclusao:hoje_str} : o));
    setDetalhe(prev => prev ? {...prev, status:"Concluido", dataConclusao:hoje_str} : null);

    // Inicia undo com contagem regressiva
    if (undoRef.current) clearInterval(undoRef.current);
    setUndoId(id);
    setUndoSeg(30);
    undoRef.current = setInterval(() => {
      setUndoSeg(s => {
        if (s <= 1) { clearInterval(undoRef.current); undoRef.current=null; setUndoId(null); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  async function desfazerConclusao() {
    if (!undoId) return;
    if (undoRef.current) { clearInterval(undoRef.current); undoRef.current=null; }
    const { error } = await sb.from("ordens").update({ status:"Em Andamento", data_conclusao: null }).eq("id", undoId);
    if (error) { showToast("Erro ao desfazer","erro"); return; }
    setOrdens(prev => prev.map(o => o.id===undoId ? {...o, status:"Em Andamento", dataConclusao:null} : o));
    setUndoId(null); setUndoSeg(0);
    showToast("Conclusão desfeita!");
  }

  async function excluirPermanente(id) {
    const { error } = await sb.from("ordens").delete().eq("id", id);
    if (error) { showToast("Erro ao excluir permanentemente","erro"); return; }
    setExcluidas(prev => prev.filter(o => o.id !== id));
    showToast("OS excluída permanentemente");
  }

  // ── Seleção múltipla para exclusão ──
  const [selecionadas, setSelecionadas] = useState(new Set());
  const [confirmExcluir, setConfirmExcluir] = useState(false);

  function toggleSelecao(id) {
    setSelecionadas(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function excluirSelecionadas(quem = "Gestor") {
    const ids = [...selecionadas];
    if (!ids.length) return;
    const agora = new Date().toISOString();
    const { error } = await sb.from("ordens").update({
      excluido: true, excluido_em: agora, excluido_por: quem
    }).in("id", ids);
    if (error) { showToast("Erro ao excluir","erro"); return; }
    const movidas = ordens.filter(o => ids.includes(o.id)).map(o => ({
      ...o, excluido:true, excluidoEm:agora, excluidoPor:quem
    }));
    setOrdens(prev => prev.filter(o => !ids.includes(o.id)));
    setExcluidas(prev => [...movidas, ...prev]);
    setSelecionadas(new Set());
    setConfirmExcluir(false);
    showToast(`${ids.length} OS excluída(s)`);
  }

  async function reativarOS(id) {
    const { error } = await sb.from("ordens").update({
      excluido: false, excluido_em: null, excluido_por: null
    }).eq("id", id);
    if (error) { showToast("Erro ao reativar","erro"); return; }
    const os = excluidas.find(o => o.id === id);
    setExcluidas(prev => prev.filter(o => o.id !== id));
    setOrdens(prev => [{ ...os, excluido:false, excluidoEm:null, excluidoPor:null }, ...prev]);
    showToast("OS reativada!");
  }

  // ─── ANEXOS ─────────────────────────────────────────────────────────────────
  async function lerArquivos(files, osId) {
    Array.from(files).forEach(file => {
      if (file.size > 10*1024*1024) { showToast(`"${file.name}" muito grande (máx 10MB)`,"erro"); return; }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const anexo = { id: Date.now()+Math.random(), nome:file.name, tipo:file.type, data:e.target.result, tamanho:file.size, dataUpload:new Date().toLocaleDateString("pt-BR") };
        if (osId) {
          const os = ordens.find(o=>o.id===osId);
          const novosAnexos = [...(os?.anexos||[]), anexo];
          const { error } = await sb.from("ordens").update({ anexos: novosAnexos }).eq("id", osId);
          if (error) { showToast("Erro ao salvar anexo","erro"); return; }
          setOrdens(prev=>prev.map(o=>o.id===osId?{...o,anexos:novosAnexos}:o));
          setDetalhe(prev=>prev?{...prev,anexos:novosAnexos}:null);
          showToast("Anexo adicionado!");
        } else {
          if (editOS) setEditOS(prev=>({...prev,anexos:[...(prev.anexos||[]),anexo]}));
          else setNovaOS(prev=>({...prev,anexos:[...(prev.anexos||[]),anexo]}));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  async function removerAnexo(anexoId, osId) {
    if (osId) {
      const os = ordens.find(o=>o.id===osId);
      const novosAnexos = (os?.anexos||[]).filter(a=>a.id!==anexoId);
      const { error } = await sb.from("ordens").update({ anexos: novosAnexos }).eq("id", osId);
      if (error) { showToast("Erro ao remover anexo","erro"); return; }
      setOrdens(prev=>prev.map(o=>o.id===osId?{...o,anexos:novosAnexos}:o));
      setDetalhe(prev=>prev?{...prev,anexos:novosAnexos}:null);
    } else {
      if (editOS) setEditOS(prev=>({...prev,anexos:(prev.anexos||[]).filter(a=>a.id!==anexoId)}));
      else setNovaOS(prev=>({...prev,anexos:(prev.anexos||[]).filter(a=>a.id!==anexoId)}));
    }
  }

  function fmtBytes(b) { return b>1024*1024?`${(b/1024/1024).toFixed(1)}MB`:`${Math.round(b/1024)}KB`; }

  // ─── CADASTROS ──────────────────────────────────────────────────────────────
  function iniciarEdicao(tipo, item) { setEditandoCad({tipo,id:item.id}); setDraftCad({...item}); }
  function cancelarEdicao() { setEditandoCad(null); setDraftCad({}); }

  async function salvarEdicaoCad() {
    const { tipo, id } = editandoCad;
    try {
      if (tipo==="tecnico") {
        const { error } = await sb.from("tecnicos").update({ nome:draftCad.nome, especialidade:draftCad.especialidade, telefone:draftCad.telefone, tipo:draftCad.tipo }).eq("id",id);
        if (error) throw error;
        setTecnicos(prev=>prev.map(t=>t.id===id?{...t,...draftCad}:t));
      }
      if (tipo==="solicitante") {
        const { error } = await sb.from("solicitantes").update({ nome:draftCad.nome, setor:draftCad.setor, cargo:draftCad.cargo }).eq("id",id);
        if (error) throw error;
        setSolicitantes(prev=>prev.map(s=>s.id===id?{...s,...draftCad}:s));
      }
      if (tipo==="tipo") {
        const { error } = await sb.from("tipos_servico").update({ nome:draftCad.nome, descricao:draftCad.descricao, cor:draftCad.cor }).eq("id",id);
        if (error) throw error;
        setTiposServico(prev=>prev.map(t=>t.id===id?{...t,...draftCad}:t));
      }
      showToast("Cadastro atualizado!");
    } catch(e) { showToast("Erro: "+e.message,"erro"); }
    cancelarEdicao();
  }

  async function toggleAtivo(tabela, id, ativo, setter) {
    const { error } = await sb.from(tabela).update({ ativo }).eq("id",id);
    if (error) { showToast("Erro","erro"); return; }
    setter(prev=>prev.map(x=>x.id===id?{...x,ativo}:x));
  }

  async function salvarNovoTec() {
    if (!novoTec.nome) return;
    const { data, error } = await sb.from("tecnicos").insert([novoTec]).select().single();
    if (error) { showToast("Erro: "+error.message,"erro"); return; }
    setTecnicos(prev=>[...prev,data]);
    setNovoTec({nome:"",tipo:"Fornecedor",especialidade:"",telefone:""});
    showToast("Técnico cadastrado!");
  }

  async function salvarNovoSol() {
    if (!novoSol.nome) return;
    const { data, error } = await sb.from("solicitantes").insert([novoSol]).select().single();
    if (error) { showToast("Erro: "+error.message,"erro"); return; }
    setSolicitantes(prev=>[...prev,data]);
    setNovoSol({nome:"",setor:"",cargo:""});
    showToast("Solicitante cadastrado!");
  }

  async function salvarNovoSetor() {
    if (!novoSetor.trim()) return;
    const { error } = await sb.from("setores").insert([{nome:novoSetor.trim()}]);
    if (error) { showToast("Erro: "+error.message,"erro"); return; }
    setSetoresList(prev=>[...prev,novoSetor.trim()]);
    setNovoSetor("");
    showToast("Setor adicionado!");
  }

  async function removerSetor(nome) {
    const { error } = await sb.from("setores").delete().eq("nome",nome);
    if (error) { showToast("Erro","erro"); return; }
    setSetoresList(prev=>prev.filter(s=>s!==nome));
  }

  async function salvarNovoTipo() {
    if (!novoTipo.nome) return;
    const { data, error } = await sb.from("tipos_servico").insert([novoTipo]).select().single();
    if (error) { showToast("Erro: "+error.message,"erro"); return; }
    setTiposServico(prev=>[...prev,data]);
    setNovoTipo({nome:"",descricao:"",cor:"#3498db"});
    showToast("Tipo de serviço cadastrado!");
  }

  async function removerTipo(id) {
    const { error } = await sb.from("tipos_servico").delete().eq("id",id);
    if (error) { showToast("Erro","erro"); return; }
    setTiposServico(prev=>prev.filter(t=>t.id!==id));
  }

  // ─── ESTILOS ──────────────────────────────────────────────────────────────
  const S = {
    app:      { fontFamily:"'JetBrains Mono','Fira Code',monospace", background:C.bg, minHeight:"100vh", color:C.text, display:"flex", fontSize:12 },
    sidebar:  { width:210, background:C.surf, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:"18px 0", flexShrink:0, position:"sticky", top:0, height:"100vh", overflowY:"auto" },
    navItem:  (a)=>({ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", margin:"1px 6px", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:a?700:400, background:a?C.accentDim:"transparent", color:a?C.accent:C.muted, transition:"all 0.1s" }),
    navSub:   (a)=>({ display:"flex", alignItems:"center", gap:6, padding:"6px 10px 6px 28px", margin:"1px 6px", borderRadius:5, cursor:"pointer", fontSize:10, fontWeight:a?700:400, background:a?"#ffffff08":"transparent", color:a?C.text:C.muted }),
    navSec:   { fontSize:9, color:C.muted, letterSpacing:"0.14em", textTransform:"uppercase", padding:"12px 18px 4px", marginTop:6 },
    main:     { flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" },
    topbar:   { background:C.surf, borderBottom:`1px solid ${C.border}`, padding:"11px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:10 },
    content:  { flex:1, padding:20, overflowY:"auto" },
    g4:       { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 },
    g2:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
    card:     { background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:16 },
    sTitle:   { fontSize:9, fontWeight:700, color:C.muted, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:12 },
    table:    { width:"100%", borderCollapse:"collapse" },
    th:       { textAlign:"left", padding:"6px 10px", fontSize:9, color:C.muted, letterSpacing:"0.12em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}` },
    td:       { padding:"8px 10px", borderBottom:`1px solid ${C.border}18`, fontSize:11, verticalAlign:"middle" },
    inp:      { width:"100%", background:C.surf, border:`1px solid ${C.border}`, borderRadius:5, padding:"6px 10px", color:C.text, fontSize:11, fontFamily:"inherit", boxSizing:"border-box" },
    btn:      (bg=C.accent,fg="#000")=>({ background:bg, color:fg, border:"none", borderRadius:6, padding:"7px 14px", fontSize:10, fontWeight:700, cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }),
    btnGhost: { background:"transparent", color:C.muted, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 12px", fontSize:10, cursor:"pointer" },
    btnEdit:  { background:"transparent", color:C.blue, border:`1px solid ${C.blue}44`, borderRadius:5, padding:"3px 8px", fontSize:9, cursor:"pointer" },
    modal:    { position:"fixed", inset:0, background:"#00000095", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 },
    mbox:     { background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:24, width:540, maxWidth:"95vw", maxHeight:"92vh", overflowY:"auto" },
    label:    { fontSize:9, color:C.muted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:3, display:"block" },
    fr:       { marginBottom:12 },
    r2:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
    r3:       { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 },
    chipRow:  { display:"flex", flexWrap:"wrap", gap:6, marginTop:4 },
    chip:     (color)=>({ background:color+"18", border:`1px solid ${color}44`, color, padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }),
  };

  const renderTecnicos = (o) => {
    const arr = toArray(o.tecnicos);
    if (!arr.length) return <span style={{ color:C.muted }}>—</span>;
    return <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}><span style={{ color:C.mutedLight, fontSize:11 }}>{arr[0]}</span>{arr.length>1&&<Tag label={`+${arr.length-1}`} color={C.cyan}/>}</div>;
  };

  const tituloPagina = () => {
    if (aba==="cadastros") return `Cadastros › ${{tecnicos:"Técnicos",solicitantes:"Solicitantes",setoresCad:"Setores",tiposServico:"Tipos de Serviço"}[subCadastro]}`;
    if (aba==="ordens"&&kpiAtivo) return {total:"Todas as OS",andamento:"OS Em Andamento",concluidas:"OS Concluídas",alertas:"OS com Alerta"}[kpiAtivo];
    return {dashboard:"Dashboard",alertas:"Alertas",ordens:"Ordens de Serviço",setores:"Por Setor",custos:"Custos",excluidas:"OS Excluídas"}[aba]||"";
  };

  // ─── TELA DE CARREGAMENTO ──────────────────────────────────────────────────
  if (loading) return (
    <div style={{ ...S.app, alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet"/>
      <div style={{ fontSize:18, fontWeight:800, color:C.accent }}>⚙ FAROL</div>
      <Spinner msg="Conectando ao banco de dados..." />
    </div>
  );

  if (erro) return (
    <div style={{ ...S.app, alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet"/>
      <div style={{ fontSize:14, fontWeight:800, color:C.red }}>⚠ Erro de conexão</div>
      <div style={{ fontSize:11, color:C.muted, maxWidth:400, textAlign:"center" }}>{erro}</div>
      <button style={S.btn()} onClick={carregarTudo}>Tentar novamente</button>
    </div>
  );

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet"/>

      {/* ══ SIDEBAR ══ */}
      <div style={S.sidebar}>
        <div style={{ padding:"0 14px 16px", borderBottom:`1px solid ${C.border}`, marginBottom:8 }}>
          <div style={{ fontSize:14, fontWeight:800, color:C.accent }}>⚙ FAROL</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:1, letterSpacing:"0.1em" }}>MANUTENÇÃO</div>
          <div style={{ fontSize:8, color:C.green, marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:C.green }}/>banco conectado
          </div>
        </div>

        <div style={S.navSec}>Menu</div>
        {[
          {id:"dashboard",icon:"◈",label:"Dashboard"},
          {id:"alertas",  icon:"⚠",label:"Alertas", badge:alertasCriticos.length||null},
          {id:"ordens",   icon:"≡",label:"Ordens de Serviço"},
          {id:"setores",  icon:"◫",label:"Por Setor"},
          {id:"custos",   icon:"◎",label:"Custos"},
          {id:"excluidas",icon:"🗑",label:"OS Excluídas", badge:excluidas.length||null},
        ].map(a=>(
          <div key={a.id} style={S.navItem(aba===a.id&&kpiAtivo===null||aba===a.id&&a.id!=="ordens")}
            onClick={()=>{setAba(a.id);if(a.id!=="ordens")setKpiAtivo(null);}}>
            <span>{a.icon}</span>{a.label}
            {a.badge&&<span style={{ marginLeft:"auto", background:C.red+"33", color:C.red, borderRadius:10, padding:"1px 6px", fontSize:9, fontWeight:800 }}>{a.badge}</span>}
          </div>
        ))}

        <div style={S.navSec}>Cadastros</div>
        <div style={S.navItem(aba==="cadastros")} onClick={()=>setAba("cadastros")}><span>⊞</span>Cadastros</div>
        {aba==="cadastros"&&[
          {id:"tecnicos",    icon:"◉",label:"Técnicos"},
          {id:"solicitantes",icon:"◌",label:"Solicitantes"},
          {id:"setoresCad",  icon:"◧",label:"Setores"},
          {id:"tiposServico",icon:"◑",label:"Tipos de Serviço"},
        ].map(s=>(
          <div key={s.id} style={S.navSub(subCadastro===s.id)} onClick={()=>setSubCadastro(s.id)}>{s.icon} {s.label}</div>
        ))}

        {alertasCriticos.length>0&&(
          <div onClick={()=>setAba("alertas")} style={{ margin:"auto 8px 8px", background:C.red+"15", border:`1px solid ${C.red}33`, borderRadius:6, padding:"8px 10px", cursor:"pointer" }}>
            <div style={{ fontSize:9, color:C.red, fontWeight:700 }}>⚠ ATENÇÃO</div>
            <div style={{ fontSize:10, color:C.text, marginTop:2 }}>{alertasCriticos.length} OS atrasadas</div>
          </div>
        )}
        <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, marginTop:alertasCriticos.length?0:"auto" }}>
          <div style={{ fontSize:9, color:C.muted }}>TOTAL OS</div>
          <div style={{ fontSize:22, fontWeight:900, color:C.accent }}>{ordens.length}</div>
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{tituloPagina()}</div>
            {kpiAtivo&&aba==="ordens"&&<button style={{...S.btnGhost,padding:"3px 8px",fontSize:9}} onClick={()=>setKpiAtivo(null)}>✕ limpar filtro</button>}
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:10, color:C.muted }}>{new Date().toLocaleDateString("pt-BR")}</span>
            <button style={{...S.btnGhost,padding:"4px 10px",fontSize:9}} onClick={carregarTudo} title="Recarregar dados">⟳</button>
            {aba==="ordens"&&<button style={S.btn()} onClick={()=>{setEditOS(null);setModalOS(true);}}>+ Nova OS</button>}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:8, paddingLeft:8, borderLeft:`1px solid ${C.border}` }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.text }}>{infoUsuario.nome}</div>
                <div style={{ fontSize:9, color:C.muted }}>{infoUsuario.cargo}</div>
              </div>
              <button onClick={()=>setModalSenha(true)} title="Alterar senha"
                style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 8px", color:C.muted, fontSize:12, cursor:"pointer" }}>
                🔑
              </button>
              <button onClick={sair} title="Sair"
                style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px", color:C.muted, fontSize:10, cursor:"pointer" }}>
                Sair
              </button>
            </div>
          </div>
        </div>

        <div style={S.content}>

          {/* ══ DASHBOARD ══ */}
          {aba==="dashboard"&&(<>
            <div style={S.g4}>
              <KPICard label="Total de OS"  value={ordens.length}                                    color={C.blue}   onClick={()=>{if(kpiAtivo==="total"){setKpiAtivo(null);}else{setKpiAtivo("total");}setAba("ordens");}} active={kpiAtivo==="total"} />
              <KPICard label="Em Andamento" value={ordens.filter(o=>o.status==="Em Andamento").length} color={C.yellow} onClick={()=>{if(kpiAtivo==="andamento"){setKpiAtivo(null);}else{setKpiAtivo("andamento");}setAba("ordens");}} active={kpiAtivo==="andamento"} />
              <KPICard label="Concluídas"   value={ordens.filter(o=>o.status==="Concluido").length}  color={C.green}  onClick={()=>{if(kpiAtivo==="concluidas"){setKpiAtivo(null);}else{setKpiAtivo("concluidas");}setAba("ordens");}} active={kpiAtivo==="concluidas"} />
              <KPICard label="OS c/ Alerta" value={alertasCriticos.length} color={alertasCriticos.length>0?C.red:C.muted} onClick={()=>{if(kpiAtivo==="alertas"){setKpiAtivo(null);}else{setKpiAtivo("alertas");}setAba("ordens");}} active={kpiAtivo==="alertas"} />
            </div>
            <div style={S.g2}>
              <div style={S.card}>
                <div style={S.sTitle}>Gastos por mês</div>
                {gastoMes.map(([mes,val])=>{
                  const [ano,m]=mes.split("-");
                  const label=new Date(Number(ano),Number(m)-1).toLocaleString("pt-BR",{month:"short",year:"2-digit"});
                  return (
                    <div key={mes} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:3 }}>
                        <span style={{ color:C.mutedLight, textTransform:"capitalize" }}>{label}</span>
                        <span style={{ color:C.accent, fontWeight:700 }}>{fmtBRL(val)}</span>
                      </div>
                      <div style={{ height:5, background:C.border, borderRadius:3 }}>
                        <div style={{ height:"100%", width:`${(val/maxMes)*100}%`, background:`linear-gradient(90deg,${C.accent},${C.yellow})`, borderRadius:3 }}/>
                      </div>
                    </div>
                  );
                })}
                <div style={{ borderTop:`1px solid ${C.border}`, marginTop:10, paddingTop:10, display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:10, color:C.muted }}>Total geral</span>
                  <span style={{ fontSize:15, fontWeight:900, color:C.accent }}>{fmtBRL(totalGasto)}</span>
                </div>
              </div>
              <div style={S.card}>
                <div style={S.sTitle}>OS em andamento — dias em aberto</div>
                {alertas.length===0&&<div style={{ fontSize:11, color:C.green, padding:"20px 0", textAlign:"center" }}>✓ Nenhuma OS em aberto!</div>}
                {alertas.map(o=>(
                  <div key={o.id} onClick={()=>setDetalhe(o)} style={{ padding:"7px 0", borderBottom:`1px solid ${C.border}18`, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.servico}</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>{o.setor} · {toArray(o.tecnicos).join(", ")}</div>
                    </div>
                    <div style={{ flexShrink:0 }}>
                      {o.dias>=30?<Tag label={`${o.dias}d CRÍTICO`} color={C.red}/>:o.dias>=14?<Tag label={`${o.dias}d ATRASADO`} color="#e67e22"/>:o.dias>=7?<Tag label={`${o.dias}d ALERTA`} color={C.yellow}/>:<Tag label={`${o.dias}d`} color={C.green}/>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>)}

          {/* ══ ALERTAS ══ */}
          {aba==="alertas"&&(<>
            {alertasCriticos.length>0&&<div style={{ marginBottom:14, padding:"10px 14px", background:C.red+"12", border:`1px solid ${C.red}30`, borderRadius:7, fontSize:11, color:C.red }}>⚠ {alertasCriticos.length} OS parada(s) há 7+ dias</div>}
            {alertas.map(o=>{
              const cor=o.dias>=30?C.red:o.dias>=14?"#e67e22":o.dias>=7?C.yellow:C.green;
              return (
                <div key={o.id} style={{ background:C.card, border:`1px solid ${cor}33`, borderLeft:`4px solid ${cor}`, borderRadius:8, padding:"13px 16px", marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:5 }}>
                        <span style={{ fontSize:10, color:C.accent, fontWeight:800 }}>OS #{String(o.id).padStart(3,"0")}</span>
                        <Tag label={o.prioridade} color={PRIO_COLOR[o.prioridade]}/>
                        <Tag label={`${o.dias} dias em aberto`} color={cor}/>
                      </div>
                      <div style={{ fontSize:12, marginBottom:4 }}>{o.servico}</div>
                      <div style={{ fontSize:10, color:C.muted }}>{o.setor} · <span style={{ color:C.mutedLight }}>{toArray(o.tecnicos).join(" + ")}</span> · {fmtData(o.dataInicio)}</div>
                    </div>
                    <button style={S.btn(C.green,"#000")} onClick={()=>concluirOS(o.id)}>✓ Concluir</button>
                  </div>
                </div>
              );
            })}
            {alertas.length===0&&<div style={{...S.card,textAlign:"center",padding:40,color:C.green}}>✓ Nenhuma OS em aberto!</div>}
          </>)}

          {aba==="ordens"&&(<>
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
              <input style={{...S.inp,width:190}} placeholder="🔍 Buscar..." value={busca} onChange={e=>setBusca(e.target.value)}/>
              <select style={{...S.inp,width:140}} value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)}>
                <option>Todos</option><option>Concluido</option><option>Em Andamento</option>
              </select>
              <select style={{...S.inp,width:160}} value={filtroSetor} onChange={e=>setFiltroSetor(e.target.value)}>
                {setoresOpts.map(s=><option key={s}>{s}</option>)}
              </select>
              <select style={{...S.inp,width:120}} value={filtroPrio} onChange={e=>setFiltroPrio(e.target.value)}>
                <option>Todos</option><option>Urgente</option><option>Alta</option><option>Média</option><option>Baixa</option>
              </select>
              <span style={{ fontSize:10, color:C.muted }}>{filtradas.length} resultado(s)</span>
              {(busca||filtroStatus!=="Todos"||filtroSetor!=="Todos"||filtroPrio!=="Todos")&&(
                <button style={S.btnGhost} onClick={()=>{setBusca("");setFiltroStatus("Todos");setFiltroSetor("Todos");setFiltroPrio("Todos");}}>✕</button>
              )}
              {selecionadas.size > 0 && (
                <button style={{...S.btn(C.red,"#fff"),marginLeft:"auto"}} onClick={()=>setConfirmExcluir(true)}>
                  🗑 Excluir {selecionadas.size} OS
                </button>
              )}
            </div>
            <div style={S.card}>
              <table style={S.table}>
                <thead><tr>
                  <th style={S.th}>
                    <input type="checkbox" checked={selecionadas.size===filtradas.length&&filtradas.length>0}
                      onChange={e=>setSelecionadas(e.target.checked?new Set(filtradas.map(o=>o.id)):new Set())}
                      style={{ cursor:"pointer" }}/>
                  </th>
                  {["#","Data","Setor","Solicitante","Serviço","Tipo","Técnico(s)","Prio","Status","Dias","Total",""].map((h,i)=><th key={i} style={S.th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filtradas.map(o=>{
                    const dias=o.status==="Em Andamento"?diasAberta(o.dataInicio):null;
                    const tipoInfo=tiposServico.find(t=>t.nome===o.tipoServico);
                    const sel=selecionadas.has(o.id);
                    return (
                      <tr key={o.id} style={{ cursor:"pointer", background:sel?C.red+"08":"transparent" }}
                        onMouseEnter={e=>{if(!sel)e.currentTarget.style.background="#ffffff05";}}
                        onMouseLeave={e=>{e.currentTarget.style.background=sel?C.red+"08":"transparent";}}>
                        <td style={S.td} onClick={e=>e.stopPropagation()}>
                          <input type="checkbox" checked={sel} onChange={()=>toggleSelecao(o.id)} style={{ cursor:"pointer" }}/>
                        </td>
                        <td style={{...S.td,color:C.accent,fontWeight:800}} onClick={()=>setDetalhe(o)}>{String(o.id).padStart(3,"0")}</td>
                        <td style={{...S.td,color:C.muted,whiteSpace:"nowrap"}} onClick={()=>setDetalhe(o)}>{fmtData(o.dataInicio)}</td>
                        <td style={S.td} onClick={()=>setDetalhe(o)}>{o.setor}</td>
                        <td style={{...S.td,color:C.muted}} onClick={()=>setDetalhe(o)}>{o.solicitante}</td>
                        <td style={S.td} title={o.servico} onClick={()=>setDetalhe(o)}>{o.servico?.length>36?o.servico.substring(0,36)+"…":o.servico}</td>
                        <td style={S.td} onClick={()=>setDetalhe(o)}>{tipoInfo?<Tag label={o.tipoServico} color={tipoInfo.cor}/>:<span style={{color:C.muted}}>{o.tipoServico}</span>}</td>
                        <td style={S.td} onClick={()=>setDetalhe(o)}>{renderTecnicos(o)}</td>
                        <td style={S.td} onClick={()=>setDetalhe(o)}><Tag label={o.prioridade} color={PRIO_COLOR[o.prioridade]}/></td>
                        <td style={S.td} onClick={()=>setDetalhe(o)}><Tag label={o.status} color={STATUS_COLOR[o.status]||C.muted}/></td>
                        <td style={S.td} onClick={()=>setDetalhe(o)}>{dias!==null?(dias>=30?<Tag label={`${dias}d`} color={C.red}/>:dias>=14?<Tag label={`${dias}d`} color="#e67e22"/>:dias>=7?<Tag label={`${dias}d`} color={C.yellow}/>:<span style={{color:C.muted,fontSize:10}}>{dias}d</span>):<span style={{color:C.muted,fontSize:10}}>—</span>}</td>
                        <td style={{...S.td,color:C.accent,fontWeight:700,whiteSpace:"nowrap"}} onClick={()=>setDetalhe(o)}>{fmtBRL(totalOS(o))}</td>
                        <td style={S.td} onClick={e=>e.stopPropagation()}>
                          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                            {o.status==="Em Andamento"&&<button style={{...S.btn(C.green,"#000"),padding:"3px 8px",fontSize:9}} onClick={()=>concluirOS(o.id)}>✓</button>}
                            {(o.anexos||[]).length>0&&<span style={{fontSize:9,color:C.muted}} title={`${o.anexos.length} anexo(s)`}>📎{o.anexos.length}</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtradas.length===0&&<div style={{ textAlign:"center", padding:30, color:C.muted, fontSize:11 }}>Nenhuma OS encontrada</div>}
            </div>
          </>)}

          {/* ══ SETORES ══ */}
          {aba==="setores"&&(
            <div style={S.card}>
              <table style={S.table}>
                <thead><tr>{["Setor","Qtd OS","Em aberto","Gasto total","Mão de obra","Peças","% total"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {histSetor.map(([setor,d])=>{
                    const pct=((d.gasto/totalGasto)*100||0).toFixed(1);
                    const mo=ordens.filter(o=>o.setor===setor).reduce((s,o)=>s+(Number(o.valorServico)||0),0);
                    const pc=ordens.filter(o=>o.setor===setor).reduce((s,o)=>s+(Number(o.valorPecas)||0),0);
                    return (
                      <tr key={setor} onClick={()=>{setFiltroSetor(setor);setAba("ordens");}} style={{ cursor:"pointer" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#ffffff05"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{...S.td,fontWeight:700}}>{setor}</td>
                        <td style={{...S.td,color:C.blue,fontWeight:700}}>{d.qtd}</td>
                        <td style={{...S.td,color:d.abertos>0?C.yellow:C.muted}}>{d.abertos>0?d.abertos:"—"}</td>
                        <td style={{...S.td,color:C.accent,fontWeight:700}}>{fmtBRL(d.gasto)}</td>
                        <td style={{...S.td,color:C.muted}}>{fmtBRL(mo)}</td>
                        <td style={{...S.td,color:C.muted}}>{fmtBRL(pc)}</td>
                        <td style={S.td}><div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ height:4, width:50, background:C.border, borderRadius:2 }}><div style={{ height:"100%", width:`${pct}%`, background:C.accent, borderRadius:2 }}/></div><span style={{ fontSize:10, color:C.mutedLight }}>{pct}%</span></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop:8, fontSize:10, color:C.muted }}>💡 Clique em um setor para ver as OS filtradas</div>
            </div>
          )}

          {/* ══ CUSTOS ══ */}
          {aba==="custos"&&(<>
            <div style={S.g4}>
              {[
                {label:"Total geral",     value:fmtBRL(totalGasto),color:C.accent},
                {label:"Mão de obra",     value:fmtBRL(ordens.reduce((s,o)=>s+(Number(o.valorServico)||0),0)),color:C.blue},
                {label:"Peças / material",value:fmtBRL(ordens.reduce((s,o)=>s+(Number(o.valorPecas)||0),0)),color:C.cyan},
                {label:"OS com custo",    value:ordens.filter(o=>totalOS(o)>0).length,color:C.green},
              ].map(k=><KPICard key={k.label} {...k}/>)}
            </div>
            <div style={S.card}>
              <div style={S.sTitle}>Detalhamento — OS com custo (ordenado por valor)</div>
              <table style={S.table}>
                <thead><tr>{["#","Setor","Serviço","Técnico(s)","NF","Serviço R$","Peças R$","Total"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {ordens.filter(o=>totalOS(o)>0).sort((a,b)=>totalOS(b)-totalOS(a)).map(o=>(
                    <tr key={o.id} onClick={()=>setDetalhe(o)} style={{ cursor:"pointer" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#ffffff05"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{...S.td,color:C.accent,fontWeight:800}}>{String(o.id).padStart(3,"0")}</td>
                      <td style={S.td}>{o.setor}</td>
                      <td style={S.td}>{o.servico?.length>38?o.servico.substring(0,38)+"…":o.servico}</td>
                      <td style={{...S.td,color:C.muted}}>{toArray(o.tecnicos).join(" + ")}</td>
                      <td style={{...S.td,color:C.muted}}>{o.nf||"—"}</td>
                      <td style={S.td}>{fmtBRL(o.valorServico)}</td>
                      <td style={S.td}>{fmtBRL(o.valorPecas)}</td>
                      <td style={{...S.td,color:C.accent,fontWeight:800}}>{fmtBRL(totalOS(o))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>)}

          {/* ══ OS EXCLUÍDAS ══ */}
          {aba==="excluidas"&&(
            <div style={S.card}>
              {excluidas.length===0
                ?<div style={{ textAlign:"center", padding:40, color:C.muted, fontSize:11 }}>Nenhuma OS excluída</div>
                :<>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:12 }}>
                    {excluidas.length} OS excluída(s) — clique em reativar para restaurar ao sistema
                  </div>
                  <table style={S.table}>
                    <thead><tr>
                      {["#","Data OS","Setor","Serviço","Excluída em","Excluída por","Status original",""].map(h=><th key={h} style={S.th}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {excluidas.map(o=>(
                        <tr key={o.id} style={{ opacity:0.75 }}
                          onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                          onMouseLeave={e=>e.currentTarget.style.opacity="0.75"}>
                          <td style={{...S.td,color:C.muted,fontWeight:700}}>{String(o.id).padStart(3,"0")}</td>
                          <td style={{...S.td,color:C.muted}}>{fmtData(o.dataInicio)}</td>
                          <td style={S.td}>{o.setor}</td>
                          <td style={S.td}>{o.servico?.length>40?o.servico.substring(0,40)+"…":o.servico}</td>
                          <td style={{...S.td,color:C.red}}>
                            {o.excluidoEm ? new Date(o.excluidoEm).toLocaleString("pt-BR") : "—"}
                          </td>
                          <td style={{...S.td,color:C.muted}}>{o.excluidoPor||"—"}</td>
                          <td style={S.td}><Tag label={o.status} color={STATUS_COLOR[o.status]||C.muted}/></td>
                          <td style={S.td}>
                            <div style={{ display:"flex", gap:5 }}>
                              <button style={S.btn(C.green,"#000")} onClick={()=>reativarOS(o.id)}>↩ Reativar</button>
                              <button style={S.btn(C.blue,"#fff")} onClick={()=>{setEditOS({...o,tecnicos:toArray(o.tecnicos)});setModalOS(true);}}>✏ Editar</button>
                              <button style={S.btn(C.red,"#fff")} onClick={()=>{ if(window.confirm(`Excluir permanentemente a OS #${String(o.id).padStart(3,"0")}? Esta ação não pode ser desfeita.`)) excluirPermanente(o.id); }}>🗑 Excluir</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              }
            </div>
          )}
          {aba==="cadastros"&&(<>

            {/* Técnicos */}
            {subCadastro==="tecnicos"&&(
              <div>
                {["Interno","Fornecedor"].map(tipo=>(
                  <div key={tipo} style={{...S.card,marginBottom:14}}>
                    <div style={S.sTitle}>{tipo==="Interno"?"👷 Equipe interna":"🔧 Fornecedores / terceiros"}</div>
                    <table style={S.table}>
                      <thead><tr>{["Nome","Especialidade","Telefone","OS realizadas","Status",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {tecnicos.filter(t=>t.tipo===tipo).map(t=>{
                          const isEditing=editandoCad?.tipo==="tecnico"&&editandoCad?.id===t.id;
                          const qtd=ordens.filter(o=>toArray(o.tecnicos).some(n=>n.toLowerCase().includes(t.nome.toLowerCase().split(" ")[0]))).length;
                          return (
                            <tr key={t.id}>
                              {isEditing?(<>
                                <td style={S.td}><input style={S.inp} value={draftCad.nome} onChange={e=>setDraftCad({...draftCad,nome:e.target.value})}/></td>
                                <td style={S.td}><input style={S.inp} value={draftCad.especialidade} onChange={e=>setDraftCad({...draftCad,especialidade:e.target.value})}/></td>
                                <td style={S.td}><input style={S.inp} value={draftCad.telefone} onChange={e=>setDraftCad({...draftCad,telefone:e.target.value})}/></td>
                                <td style={{...S.td,color:C.blue}}>{qtd}</td>
                                <td style={S.td}><Tag label={t.ativo?"Ativo":"Inativo"} color={t.ativo?C.green:C.muted}/></td>
                                <td style={S.td}><div style={{ display:"flex",gap:5 }}><button style={S.btn(C.green,"#000")} onClick={salvarEdicaoCad}>✓</button><button style={S.btnGhost} onClick={cancelarEdicao}>✕</button></div></td>
                              </>):(<>
                                <td style={{...S.td,fontWeight:700}}>{t.nome}</td>
                                <td style={{...S.td,color:C.muted}}>{t.especialidade}</td>
                                <td style={{...S.td,color:C.cyan}}>{t.telefone}</td>
                                <td style={{...S.td,color:C.blue,fontWeight:700}}>{qtd}</td>
                                <td style={S.td}><Tag label={t.ativo?"Ativo":"Inativo"} color={t.ativo?C.green:C.muted}/></td>
                                <td style={S.td}><div style={{ display:"flex",gap:5 }}>
                                  <button style={S.btnEdit} onClick={()=>iniciarEdicao("tecnico",t)}>✏ editar</button>
                                  <button style={{...S.btnGhost,padding:"2px 8px",fontSize:9}} onClick={()=>toggleAtivo("tecnicos",t.id,!t.ativo,setTecnicos)}>{t.ativo?"Desativar":"Ativar"}</button>
                                </div></td>
                              </>)}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
                <div style={{...S.card,borderColor:C.accent+"44"}}>
                  <div style={{...S.sTitle,color:C.accent}}>+ Novo Técnico / Fornecedor</div>
                  <div style={S.r3}>
                    <div style={S.fr}><label style={S.label}>Nome</label><input style={S.inp} value={novoTec.nome} onChange={e=>setNovoTec({...novoTec,nome:e.target.value})}/></div>
                    <div style={S.fr}><label style={S.label}>Tipo</label><select style={S.inp} value={novoTec.tipo} onChange={e=>setNovoTec({...novoTec,tipo:e.target.value})}><option>Interno</option><option>Fornecedor</option></select></div>
                    <div style={S.fr}><label style={S.label}>Especialidade</label><input style={S.inp} value={novoTec.especialidade} onChange={e=>setNovoTec({...novoTec,especialidade:e.target.value})}/></div>
                  </div>
                  <div style={S.r2}>
                    <div style={S.fr}><label style={S.label}>Telefone</label><input style={S.inp} value={novoTec.telefone} onChange={e=>setNovoTec({...novoTec,telefone:e.target.value})} placeholder="(98) 99999-9999"/></div>
                    <div style={{ display:"flex",alignItems:"flex-end",paddingBottom:12 }}><button style={S.btn()} onClick={salvarNovoTec}>Salvar</button></div>
                  </div>
                  <div style={{ fontSize:9, color:C.muted }}>⚠ Editar um técnico não altera o histórico de OS anteriores.</div>
                </div>
              </div>
            )}

            {/* Solicitantes */}
            {subCadastro==="solicitantes"&&(
              <div>
                <div style={{...S.card,marginBottom:14}}>
                  <div style={S.sTitle}>Funcionários / solicitantes cadastrados</div>
                  <table style={S.table}>
                    <thead><tr>{["Nome","Setor","Cargo","OS abertas","Status",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {solicitantes.map(s=>{
                        const isEditing=editandoCad?.tipo==="solicitante"&&editandoCad?.id===s.id;
                        const qtd=ordens.filter(o=>o.solicitante?.toLowerCase()===s.nome?.toLowerCase()).length;
                        return (
                          <tr key={s.id}>
                            {isEditing?(<>
                              <td style={S.td}><input style={S.inp} value={draftCad.nome} onChange={e=>setDraftCad({...draftCad,nome:e.target.value})}/></td>
                              <td style={S.td}><input style={S.inp} list="set-edit" value={draftCad.setor} onChange={e=>setDraftCad({...draftCad,setor:e.target.value})}/><datalist id="set-edit">{setoresList.map(x=><option key={x} value={x}/>)}</datalist></td>
                              <td style={S.td}><input style={S.inp} value={draftCad.cargo} onChange={e=>setDraftCad({...draftCad,cargo:e.target.value})}/></td>
                              <td style={{...S.td,color:C.blue}}>{qtd}</td>
                              <td style={S.td}><Tag label={s.ativo?"Ativo":"Inativo"} color={s.ativo?C.green:C.muted}/></td>
                              <td style={S.td}><div style={{ display:"flex",gap:5 }}><button style={S.btn(C.green,"#000")} onClick={salvarEdicaoCad}>✓</button><button style={S.btnGhost} onClick={cancelarEdicao}>✕</button></div></td>
                            </>):(<>
                              <td style={{...S.td,fontWeight:700}}>{s.nome}</td>
                              <td style={{...S.td,color:C.muted}}>{s.setor}</td>
                              <td style={{...S.td,color:C.muted}}>{s.cargo}</td>
                              <td style={{...S.td,color:C.blue,fontWeight:700}}>{qtd}</td>
                              <td style={S.td}><Tag label={s.ativo?"Ativo":"Inativo"} color={s.ativo?C.green:C.muted}/></td>
                              <td style={S.td}><div style={{ display:"flex",gap:5 }}>
                                <button style={S.btnEdit} onClick={()=>iniciarEdicao("solicitante",s)}>✏ editar</button>
                                <button style={{...S.btnGhost,padding:"2px 8px",fontSize:9}} onClick={()=>toggleAtivo("solicitantes",s.id,!s.ativo,setSolicitantes)}>{s.ativo?"Desativar":"Ativar"}</button>
                              </div></td>
                            </>)}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{...S.card,borderColor:C.accent+"44"}}>
                  <div style={{...S.sTitle,color:C.accent}}>+ Novo Solicitante</div>
                  <div style={S.r3}>
                    <div style={S.fr}><label style={S.label}>Nome</label><input style={S.inp} value={novoSol.nome} onChange={e=>setNovoSol({...novoSol,nome:e.target.value})}/></div>
                    <div style={S.fr}><label style={S.label}>Setor</label><input style={S.inp} list="set-list" value={novoSol.setor} onChange={e=>setNovoSol({...novoSol,setor:e.target.value})}/><datalist id="set-list">{setoresList.map(s=><option key={s} value={s}/>)}</datalist></div>
                    <div style={S.fr}><label style={S.label}>Cargo</label><input style={S.inp} value={novoSol.cargo} onChange={e=>setNovoSol({...novoSol,cargo:e.target.value})}/></div>
                  </div>
                  <button style={S.btn()} onClick={salvarNovoSol}>Salvar</button>
                </div>
              </div>
            )}

            {/* Setores */}
            {subCadastro==="setoresCad"&&(
              <div>
                <div style={{...S.card,marginBottom:14}}>
                  <div style={S.sTitle}>Setores cadastrados ({setoresList.length})</div>
                  <div style={S.chipRow}>
                    {setoresList.map(s=>(
                      <div key={s} style={S.chip(C.blue)}>{s}
                        <span onClick={()=>removerSetor(s)} style={{ color:C.red,fontWeight:900,cursor:"pointer",marginLeft:2 }}>×</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:9, color:C.muted, marginTop:10 }}>⚠ Remover um setor não afeta OS já registradas.</div>
                </div>
                <div style={{...S.card,borderColor:C.accent+"44"}}>
                  <div style={{...S.sTitle,color:C.accent}}>+ Novo Setor</div>
                  <div style={{ display:"flex",gap:10,alignItems:"flex-end" }}>
                    <div style={{ flex:1,...S.fr }}>
                      <label style={S.label}>Nome do Setor</label>
                      <input style={S.inp} value={novoSetor} onChange={e=>setNovoSetor(e.target.value)} placeholder="Ex: Estoque de Bebidas"
                        onKeyDown={e=>{if(e.key==="Enter")salvarNovoSetor();}}/>
                    </div>
                    <div style={{ paddingBottom:12 }}><button style={S.btn()} onClick={salvarNovoSetor}>Adicionar</button></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tipos de Serviço */}
            {subCadastro==="tiposServico"&&(
              <div>
                <div style={{...S.card,marginBottom:14}}>
                  <div style={S.sTitle}>Tipos de serviço cadastrados</div>
                  <table style={S.table}>
                    <thead><tr>{["Tipo","Descrição","Cor","OS com esse tipo",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {tiposServico.map(t=>{
                        const isEditing=editandoCad?.tipo==="tipo"&&editandoCad?.id===t.id;
                        const qtd=ordens.filter(o=>o.tipoServico===t.nome).length;
                        return (
                          <tr key={t.id}>
                            {isEditing?(<>
                              <td style={S.td}><input style={S.inp} value={draftCad.nome} onChange={e=>setDraftCad({...draftCad,nome:e.target.value})}/></td>
                              <td style={S.td}><input style={S.inp} value={draftCad.descricao} onChange={e=>setDraftCad({...draftCad,descricao:e.target.value})}/></td>
                              <td style={S.td}><input type="color" value={draftCad.cor} onChange={e=>setDraftCad({...draftCad,cor:e.target.value})} style={{ width:36,height:28,border:"none",background:"none",cursor:"pointer" }}/></td>
                              <td style={{...S.td,color:C.blue}}>{qtd}</td>
                              <td style={S.td}><div style={{ display:"flex",gap:5 }}><button style={S.btn(C.green,"#000")} onClick={salvarEdicaoCad}>✓</button><button style={S.btnGhost} onClick={cancelarEdicao}>✕</button></div></td>
                            </>):(<>
                              <td style={S.td}><Tag label={t.nome} color={t.cor}/></td>
                              <td style={{...S.td,color:C.muted}}>{t.descricao}</td>
                              <td style={S.td}><div style={{ width:18,height:18,borderRadius:4,background:t.cor,border:`1px solid ${C.border}` }}/></td>
                              <td style={{...S.td,color:C.blue,fontWeight:700}}>{qtd}</td>
                              <td style={S.td}><div style={{ display:"flex",gap:5 }}>
                                <button style={S.btnEdit} onClick={()=>iniciarEdicao("tipo",t)}>✏ editar</button>
                                {qtd===0&&<button style={{...S.btnGhost,padding:"2px 8px",fontSize:9,color:C.red,borderColor:C.red+"44"}} onClick={()=>removerTipo(t.id)}>Remover</button>}
                              </div></td>
                            </>)}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{...S.card,borderColor:C.accent+"44"}}>
                  <div style={{...S.sTitle,color:C.accent}}>+ Novo Tipo de Serviço</div>
                  <div style={S.r3}>
                    <div style={S.fr}><label style={S.label}>Nome</label><input style={S.inp} value={novoTipo.nome} onChange={e=>setNovoTipo({...novoTipo,nome:e.target.value})} placeholder="Ex: Preditiva"/></div>
                    <div style={S.fr}><label style={S.label}>Descrição</label><input style={S.inp} value={novoTipo.descricao} onChange={e=>setNovoTipo({...novoTipo,descricao:e.target.value})}/></div>
                    <div style={S.fr}><label style={S.label}>Cor</label><div style={{ display:"flex",gap:8,alignItems:"center" }}><input type="color" value={novoTipo.cor} onChange={e=>setNovoTipo({...novoTipo,cor:e.target.value})} style={{ width:36,height:32,border:`1px solid ${C.border}`,borderRadius:4,background:C.surf,cursor:"pointer",padding:2}}/><Tag label={novoTipo.nome||"Prévia"} color={novoTipo.cor}/></div></div>
                  </div>
                  <button style={S.btn()} onClick={salvarNovoTipo}>Salvar</button>
                </div>
              </div>
            )}
          </>)}
        </div>
      </div>

      {/* ══ MODAL NOVA / EDITAR OS ══ */}
      {modalOS&&(
        <div style={S.modal} onClick={()=>{setModalOS(false);setEditOS(null);}}>
          <div style={S.mbox} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:12, fontWeight:800, color:C.accent, marginBottom:16 }}>
              {editOS?`EDITAR OS #${String(editOS.id).padStart(3,"0")}`:"NOVA ORDEM DE SERVIÇO"}
            </div>
            {(()=>{
              const d=editOS||novaOS;
              const set=(k,v)=>editOS?setEditOS({...editOS,[k]:v}):setNovaOS({...novaOS,[k]:v});
              return (<>
                <div style={S.r2}>
                  <div style={S.fr}><label style={S.label}>Setor</label>
                    <input style={S.inp} list="s-list" value={d.setor} onChange={e=>set("setor",e.target.value)}/>
                    <datalist id="s-list">{setoresList.map(s=><option key={s} value={s}/>)}</datalist>
                  </div>
                  <div style={S.fr}><label style={S.label}>Solicitante</label>
                    <input style={S.inp} list="sol-list" value={d.solicitante} onChange={e=>set("solicitante",e.target.value)}/>
                    <datalist id="sol-list">{nomeSolicitantes.map(n=><option key={n} value={n}/>)}</datalist>
                  </div>
                </div>
                <div style={S.fr}><label style={S.label}>Descrição do Serviço</label>
                  <input style={S.inp} value={d.servico} onChange={e=>set("servico",e.target.value)} placeholder="Descreva o serviço..."/>
                </div>
                <div style={S.r3}>
                  <div style={S.fr}><label style={S.label}>Tipo</label>
                    <select style={S.inp} value={d.tipoServico} onChange={e=>set("tipoServico",e.target.value)}>
                      {nomeTipos.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={S.fr}><label style={S.label}>Prioridade</label>
                    <select style={S.inp} value={d.prioridade} onChange={e=>set("prioridade",e.target.value)}>
                      <option>Baixa</option><option>Média</option><option>Alta</option><option>Urgente</option>
                    </select>
                  </div>
                  <div style={S.fr}><label style={S.label}>Data Início</label>
                    <input type="date" style={S.inp} value={d.dataInicio} onChange={e=>set("dataInicio",e.target.value)}/>
                  </div>
                </div>
                <div style={S.fr}>
                  <label style={S.label}>Técnico(s) / Fornecedor(es)</label>
                  <TecnicosSelector value={toArray(d.tecnicos)} onChange={arr=>set("tecnicos",arr)} opcoes={nomeTecnicos}/>
                </div>
                <div style={S.r2}>
                  <div style={S.fr}><label style={S.label}>NF / Nº OS</label><input style={S.inp} value={d.nf} onChange={e=>set("nf",e.target.value)}/></div>
                  <div style={S.fr}><label style={S.label}>Status</label>
                    {editOS
                      ?<select style={S.inp} value={editOS.status} onChange={e=>set("status",e.target.value)}><option>Em Andamento</option><option>Concluido</option><option>Pendente</option></select>
                      :<div style={{...S.inp,color:C.muted}}>Em Andamento</div>}
                  </div>
                </div>
                <div style={S.r2}>
                  <div style={S.fr}><label style={S.label}>Valor Serviço (R$)</label><input type="number" style={S.inp} value={d.valorServico} onChange={e=>set("valorServico",e.target.value)} placeholder="0"/></div>
                  <div style={S.fr}><label style={S.label}>Valor Peças (R$)</label><input type="number" style={S.inp} value={d.valorPecas} onChange={e=>set("valorPecas",e.target.value)} placeholder="0"/></div>
                </div>
                <div style={S.fr}><label style={S.label}>Observações</label><input style={S.inp} value={d.obs} onChange={e=>set("obs",e.target.value)}/></div>
                <div style={S.fr}>
                  <label style={S.label}>Anexos ({(d.anexos||[]).length} arquivo(s))</label>
                  <AnexosUploader anexos={d.anexos||[]} onUpload={files=>lerArquivos(files,null)} onRemove={id=>removerAnexo(id,null)} onPreview={a=>setPreviewAnexo(a)}/>
                </div>
                <div style={{ display:"flex",gap:8,justifyContent:"flex-end",marginTop:6 }}>
                  <button style={S.btnGhost} onClick={()=>{setModalOS(false);setEditOS(null);}}>Cancelar</button>
                  <button style={S.btn()} onClick={salvarOS} disabled={salvando}>{salvando?"Salvando...":"Salvar"}</button>
                </div>
              </>);
            })()}
          </div>
        </div>
      )}

      {/* ══ MODAL DETALHE OS ══ */}
      {detalhe&&(
        <div style={S.modal} onClick={()=>setDetalhe(null)}>
          <div style={{...S.mbox,width:480}} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <span style={{ fontSize:13,fontWeight:800,color:C.accent }}>OS #{String(detalhe.id).padStart(3,"0")}</span>
              <div style={{ display:"flex",gap:6 }}>
                <Tag label={detalhe.prioridade} color={PRIO_COLOR[detalhe.prioridade]}/>
                <Tag label={detalhe.status} color={STATUS_COLOR[detalhe.status]||C.muted}/>
              </div>
            </div>
            {[
              ["Setor",detalhe.setor],["Solicitante",detalhe.solicitante],["Serviço",detalhe.servico],
              ["Tipo",detalhe.tipoServico],["Técnico(s)",toArray(detalhe.tecnicos).join(" + ")],
              ["Data Início",fmtData(detalhe.dataInicio)],["Data Conclusão",fmtData(detalhe.dataConclusao)],
              ["NF/OS",detalhe.nf||"—"],["Valor Serviço",fmtBRL(detalhe.valorServico)],
              ["Valor Peças",fmtBRL(detalhe.valorPecas)],["Total",fmtBRL(totalOS(detalhe))],
              ["Observações",detalhe.obs||"—"],
            ].map(([k,v])=>(
              <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}1a`,fontSize:11 }}>
                <span style={{ color:C.muted,flexShrink:0,marginRight:12 }}>{k}</span>
                <span style={{ color:C.text,textAlign:"right" }}>{v}</span>
              </div>
            ))}
            {detalhe.status==="Em Andamento"&&(
              <div style={{ marginTop:10,padding:"7px 12px",background:C.yellow+"12",border:`1px solid ${C.yellow}28`,borderRadius:6,fontSize:10,color:C.yellow }}>
                ⏱ Aberta há <strong>{diasAberta(detalhe.dataInicio)} dias</strong>
              </div>
            )}
            <div style={{ marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}1a` }}>
              <div style={{ fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8 }}>
                Anexos ({(detalhe.anexos||[]).length})
              </div>
              <AnexosUploader anexos={detalhe.anexos||[]} onUpload={files=>lerArquivos(files,detalhe.id)} onRemove={id=>removerAnexo(id,detalhe.id)} onPreview={a=>setPreviewAnexo(a)}/>
            </div>
            <div style={{ display:"flex",gap:8,justifyContent:"flex-end",marginTop:14 }}>
              {detalhe.status==="Em Andamento"&&<button style={S.btn(C.green,"#000")} onClick={()=>concluirOS(detalhe.id)}>✓ Concluir</button>}
              <button style={S.btn(C.blue,"#fff")} onClick={()=>{setEditOS({...detalhe,tecnicos:toArray(detalhe.tecnicos)});setDetalhe(null);setModalOS(true);}}>✏ Editar</button>
              <button style={S.btnGhost} onClick={()=>setDetalhe(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL PREVIEW ANEXO ══ */}
      {previewAnexo&&(
        <div style={{...S.modal,zIndex:200}} onClick={()=>setPreviewAnexo(null)}>
          <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,maxWidth:"90vw",maxHeight:"90vh",display:"flex",flexDirection:"column",gap:12 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11,fontWeight:700,color:C.text }}>{previewAnexo.nome}</div>
                <div style={{ fontSize:9,color:C.muted,marginTop:2 }}>{previewAnexo.dataUpload} · {fmtBytes(previewAnexo.tamanho)}</div>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <a href={previewAnexo.data} download={previewAnexo.nome} style={{...S.btn(C.blue,"#fff"),textDecoration:"none",display:"flex",alignItems:"center"}}>⬇ Baixar</a>
                <button style={S.btnGhost} onClick={()=>setPreviewAnexo(null)}>✕ Fechar</button>
              </div>
            </div>
            {previewAnexo.tipo?.startsWith("image/")
              ?<img src={previewAnexo.data} alt={previewAnexo.nome} style={{ maxWidth:"80vw",maxHeight:"75vh",objectFit:"contain",borderRadius:6,border:`1px solid ${C.border}` }}/>
              :previewAnexo.tipo==="application/pdf"
              ?<iframe src={previewAnexo.data} title={previewAnexo.nome} style={{ width:"75vw",height:"75vh",border:`1px solid ${C.border}`,borderRadius:6,background:"#fff" }}/>
              :<div style={{ padding:"40px 60px",textAlign:"center" }}>
                <div style={{ fontSize:52,marginBottom:16 }}>📎</div>
                <div style={{ fontSize:12,color:C.mutedLight,marginBottom:20 }}>{previewAnexo.nome}</div>
                <a href={previewAnexo.data} download={previewAnexo.nome} style={{...S.btn(C.accent,"#000"),textDecoration:"none",display:"inline-flex",alignItems:"center",gap:6}}>⬇ Baixar</a>
              </div>
            }
          </div>
        </div>
      )}

      {/* ══ MODAL CONFIRMAR EXCLUSÃO ══ */}
      {confirmExcluir&&(
        <div style={S.modal} onClick={()=>setConfirmExcluir(false)}>
          <div style={{...S.mbox,width:420}} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:13, fontWeight:800, color:C.red, marginBottom:12 }}>🗑 Confirmar exclusão</div>
            <div style={{ fontSize:11, color:C.text, marginBottom:8 }}>
              Você está prestes a excluir <strong style={{color:C.red}}>{selecionadas.size} OS</strong>.
            </div>
            <div style={{ fontSize:10, color:C.muted, marginBottom:20, padding:"8px 12px", background:C.yellow+"10", border:`1px solid ${C.yellow}30`, borderRadius:6 }}>
              ⚠ As OS não serão apagadas permanentemente — ficarão na aba "OS Excluídas" e podem ser reativadas a qualquer momento.
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button style={S.btnGhost} onClick={()=>setConfirmExcluir(false)}>Cancelar</button>
              <button style={S.btn(C.red,"#fff")} onClick={()=>excluirSelecionadas("Gestor")}>Confirmar exclusão</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ BOTÕES FLUTUANTES ══ */}
      <div style={{ position:"fixed",bottom:28,left:222,zIndex:90,display:"flex",flexDirection:"column",gap:12,alignItems:"flex-start" }}>
        <button onClick={()=>{setEditOS(null);setModalOS(true);}} title="Nova Ordem de Serviço"
          style={{ width:60,height:60,borderRadius:"50%",background:"rgba(245,166,35,0.88)",border:"1.5px solid rgba(245,166,35,0.5)",color:"#000",fontSize:28,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",boxShadow:"0 4px 24px rgba(245,166,35,0.45)",transition:"all 0.18s",lineHeight:1 }}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.1)";e.currentTarget.style.boxShadow="0 6px 32px rgba(245,166,35,0.65)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 24px rgba(245,166,35,0.45)";}}>+</button>
      </div>

      {/* ══ TOAST NORMAL ══ */}
      {toast&&(
        <div style={{ position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"rgba(20,28,38,0.97)",border:`1px solid ${C.border}`,borderLeft:`3px solid ${toast.tipo==="erro"?C.red:C.green}`,borderRadius:8,padding:"10px 18px",fontSize:11,color:C.text,backdropFilter:"blur(10px)",zIndex:300,boxShadow:"0 4px 20px rgba(0,0,0,0.5)",whiteSpace:"nowrap" }}>
          {toast.tipo==="erro"?"⚠":"✓"} {toast.msg}
        </div>
      )}

      {/* ══ TOAST UNDO CONCLUSÃO ══ */}
      {undoId&&(
        <div style={{ position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"rgba(20,28,38,0.97)",border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.green}`,borderRadius:8,padding:"10px 16px",fontSize:11,color:C.text,backdropFilter:"blur(10px)",zIndex:300,boxShadow:"0 4px 20px rgba(0,0,0,0.5)",display:"flex",alignItems:"center",gap:14,whiteSpace:"nowrap" }}>
          <span>✓ OS concluída</span>
          <button onClick={desfazerConclusao} style={{ background:C.yellow+"22",border:`1px solid ${C.yellow}55`,color:C.yellow,borderRadius:5,padding:"3px 10px",fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:"0.06em" }}>
            ↩ DESFAZER
          </button>
          <span style={{ fontSize:10,color:C.muted,minWidth:20,textAlign:"center" }}>{undoSeg}s</span>
        </div>
      )}

      {/* ══ MODAL TROCAR SENHA ══ */}
      {modalSenha&&(
        <div style={S.modal} onClick={()=>{setModalSenha(false);setErroSenha("");}}>
          <div style={{...S.mbox,width:380}} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:12, fontWeight:800, color:C.accent, marginBottom:4 }}>🔑 Alterar senha</div>
            <div style={{ fontSize:10, color:C.muted, marginBottom:18 }}>{usuario?.email}</div>
            <form onSubmit={trocarSenha}>
              {[
                { label:"Senha atual",        val:senhaAtual, set:setSenhaAtual },
                { label:"Nova senha",          val:senhaNova,  set:setSenhaNova  },
                { label:"Confirmar nova senha",val:senhaConf,  set:setSenhaConf  },
              ].map(({label,val,set})=>(
                <div key={label} style={S.fr}>
                  <label style={S.label}>{label}</label>
                  <input type="password" style={S.inp} value={val} onChange={e=>set(e.target.value)} required placeholder="••••••••"/>
                </div>
              ))}
              {erroSenha&&<div style={{ marginBottom:12, padding:"8px 12px", background:C.red+"18", border:`1px solid ${C.red}44`, borderRadius:6, fontSize:10, color:C.red }}>⚠ {erroSenha}</div>}
              <div style={{ fontSize:9, color:C.muted, marginBottom:14 }}>Mínimo de 6 caracteres.</div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button type="button" style={S.btnGhost} onClick={()=>{setModalSenha(false);setErroSenha("");}}>Cancelar</button>
                <button type="submit" style={S.btn()} disabled={salvandoSenha}>{salvandoSenha?"Salvando...":"Salvar nova senha"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
