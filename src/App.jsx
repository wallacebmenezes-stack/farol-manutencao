import { useState, useMemo } from "react";

// ─── DADOS INICIAIS ───────────────────────────────────────────────────────────
const OS_INICIAL = [
  { id: 1, dataInicio: "2026-02-06", setor: "Cozinha", solicitante: "Clenildes", servico: "Troca de torneira de parede/inox", tipoServico: "Corretiva", prioridade: "Alta", status: "Concluido", tecnico: "Hildo", valorServico: 0, nf: "x", valorPecas: 155, dataConclusao: "2026-02-06", obs: "Peça de estoque da empresa/marca JED" },
  { id: 2, dataInicio: "2026-02-06", setor: "Padaria", solicitante: "Mila", servico: "Configuração e limpeza de sensor do forno elétrico Venancio Turbo Twister", tipoServico: "Preventiva", prioridade: "Média", status: "Concluido", tecnico: "Venilton", valorServico: 220, nf: "x", valorPecas: 0, dataConclusao: "2026-02-06", obs: "Manutenção corretiva sem troca de peças" },
  { id: 3, dataInicio: "2026-02-06", setor: "Bar", solicitante: "Ismael", servico: "Reparo e manutenção de extrator de suco SKYMSEN mod-EX", tipoServico: "Corretiva", prioridade: "Alta", status: "Concluido", tecnico: "Master Eletrônica", valorServico: 273, nf: "669", valorPecas: 0, dataConclusao: "2026-02-06", obs: "Troca da câmara de líquido, fio e castanha" },
  { id: 4, dataInicio: "2026-02-07", setor: "Salão de Baixo", solicitante: "Araújo", servico: "Limpeza de filtros e telas dos Ar Condicionados (3 máquinas)", tipoServico: "Preventiva", prioridade: "Média", status: "Concluido", tecnico: "Goiano / MC Ice", valorServico: 0, nf: "x", valorPecas: 0, dataConclusao: "2026-02-07", obs: "Empresa contratada MC Ice" },
  { id: 5, dataInicio: "2026-02-07", setor: "Açougue", solicitante: "Alessandro", servico: "Condensadora retirada para manutenção pela NOVEL/Marcus", tipoServico: "Corretiva", prioridade: "Alta", status: "Em Andamento", tecnico: "Marcus / NOVEL", valorServico: 0, nf: "x", valorPecas: 0, dataConclusao: null, obs: "Equipamento em teste para depois instalar" },
  { id: 6, dataInicio: "2026-02-08", setor: "Brinquedoteca", solicitante: "Celso", servico: "Conserto do forro da Brinquedoteca", tipoServico: "Corretiva", prioridade: "Urgente", status: "Em Andamento", tecnico: "Neto", valorServico: 0, nf: "x", valorPecas: 0, dataConclusao: null, obs: "Forro molhado por goteiras no telhado" },
  { id: 7, dataInicio: "2026-02-09", setor: "Bar", solicitante: "Clenildes", servico: "Conserto do copo do liquidificador inox SKYMSEN (peça mancal)", tipoServico: "Corretiva", prioridade: "Média", status: "Concluido", tecnico: "Master Eletrônica", valorServico: 0, nf: "4507", valorPecas: 140, dataConclusao: "2026-02-09", obs: "" },
  { id: 8, dataInicio: "2026-02-09", setor: "Louça", solicitante: "Clenildes", servico: "Troca da torneira da pia da louça", tipoServico: "Corretiva", prioridade: "Média", status: "Concluido", tecnico: "Hildo", valorServico: 0, nf: "196021", valorPecas: 95.12, dataConclusao: "2026-02-10", obs: "" },
  { id: 9, dataInicio: "2026-02-09", setor: "Caixa", solicitante: "Lena", servico: "Conserto de 2 nobreaks danificados por infiltração de água", tipoServico: "Corretiva", prioridade: "Alta", status: "Em Andamento", tecnico: "INTERNOBREAK", valorServico: 0, nf: "x", valorPecas: 0, dataConclusao: null, obs: "Danificados por entrada de água no setor" },
  { id: 10, dataInicio: "2026-02-09", setor: "Almoxarifado", solicitante: "Lena", servico: "Recuperação do telhado (telha de barro)", tipoServico: "Corretiva", prioridade: "Média", status: "Concluido", tecnico: "Sr. Piauí", valorServico: 350, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-09", obs: "" },
  { id: 11, dataInicio: "2026-02-10", setor: "Salão", solicitante: "Lena", servico: "Reparo no telhado do salão com troca de telhas", tipoServico: "Corretiva", prioridade: "Alta", status: "Concluido", tecnico: "Sr. Raimundo", valorServico: 0, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-12", obs: "60 telhas e 6 sacos de pregos" },
  { id: 12, dataInicio: "2026-02-10", setor: "Câmara 03", solicitante: "Sr. Ismael", servico: "Comprar e instalar fechadura da câmara 3", tipoServico: "Corretiva", prioridade: "Alta", status: "Em Andamento", tecnico: "—", valorServico: 0, nf: "O.S1102", valorPecas: 0, dataConclusao: null, obs: "Compra em andamento" },
  { id: 13, dataInicio: "2026-02-10", setor: "Salão VIP", solicitante: "Hildo", servico: "Limpeza dos filtros e desentupimento dos drenos", tipoServico: "Preventiva", prioridade: "Alta", status: "Concluido", tecnico: "Goiano / MC Ice", valorServico: 0, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-11", obs: "" },
  { id: 14, dataInicio: "2026-02-10", setor: "Cozinha", solicitante: "Clenildes", servico: "Troca de 2 lâmpadas (painel LED Taschibra 24W)", tipoServico: "Corretiva", prioridade: "Média", status: "Concluido", tecnico: "Cesar", valorServico: 100, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-11", obs: "" },
  { id: 15, dataInicio: "2026-02-11", setor: "Bar", solicitante: "Fábio", servico: "Troca de duas tomadas no bar", tipoServico: "Corretiva", prioridade: "Média", status: "Concluido", tecnico: "Cesar", valorServico: 50, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-11", obs: "" },
  { id: 16, dataInicio: "2026-02-11", setor: "Copa", solicitante: "Clenildes", servico: "Troca de luminária no refeitório", tipoServico: "Corretiva", prioridade: "Média", status: "Concluido", tecnico: "Cesar", valorServico: 50, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-11", obs: "" },
  { id: 17, dataInicio: "2026-02-11", setor: "Salão Aberto", solicitante: "Hildo", servico: "Troca de lâmpada no salão aberto", tipoServico: "Corretiva", prioridade: "Média", status: "Concluido", tecnico: "Cesar", valorServico: 100, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-11", obs: "" },
  { id: 18, dataInicio: "2026-02-11", setor: "Depósito Cervejas", solicitante: "Celso", servico: "Alvenaria para depósito de cerveja", tipoServico: "Melhoria", prioridade: "Média", status: "Concluido", tecnico: "Sr. Piauí", valorServico: 600, nf: "O.S1102", valorPecas: 210, dataConclusao: "2026-02-13", obs: "" },
  { id: 19, dataInicio: "2026-02-12", setor: "Salão de Baixo", solicitante: "Hildo", servico: "Manutenção preventiva Ar Condicionado Nº 04", tipoServico: "Preventiva", prioridade: "Alta", status: "Concluido", tecnico: "Goiano / MC Ice", valorServico: 0, nf: "179300", valorPecas: 31, dataConclusao: "2026-02-12", obs: "4m de mangueira 3/4 para dreno" },
  { id: 20, dataInicio: "2026-02-16", setor: "Câmaras Frias", solicitante: "Lena", servico: "Troca de 3 cantoneiras das câmaras frias 1, 2 e 3", tipoServico: "Corretiva", prioridade: "Média", status: "Concluido", tecnico: "RJ Refrigeração", valorServico: 200, nf: "O.S1102", valorPecas: 300, dataConclusao: "2026-02-16", obs: "" },
  { id: 21, dataInicio: "2026-02-16", setor: "Estacionamento", solicitante: "Hildo", servico: "Limpeza e organização do estacionamento", tipoServico: "Geral", prioridade: "Média", status: "Concluido", tecnico: "Michael da Silva Cutrim", valorServico: 300, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-18", obs: "" },
  { id: 22, dataInicio: "2026-02-18", setor: "Sala Supervisão", solicitante: "Celso", servico: "Manutenção preventiva Ar Condicionado Nº 22", tipoServico: "Preventiva", prioridade: "Alta", status: "Concluido", tecnico: "Goiano / MC Ar", valorServico: 0, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-18", obs: "Não foi necessário comprar peças" },
  { id: 23, dataInicio: "2026-02-19", setor: "Cozinha", solicitante: "Hildo", servico: "2 pedras de concreto para tampa do esgoto", tipoServico: "Corretiva", prioridade: "Média", status: "Concluido", tecnico: "Sr. Piauí", valorServico: 250, nf: "O.S1102", valorPecas: 0, dataConclusao: "2026-02-19", obs: "Pagamento via pix pendente" },
  { id: 24, dataInicio: "2026-02-19", setor: "Estacionamento", solicitante: "Hildo", servico: "Limpeza e organização do estacionamento (2ª etapa)", tipoServico: "Geral", prioridade: "Média", status: "Em Andamento", tecnico: "Michael da Silva Cutrim", valorServico: 300, nf: "O.S1102", valorPecas: 0, dataConclusao: null, obs: "Pagamento via pix pendente" },
  { id: 25, dataInicio: "2026-02-20", setor: "Almoxarifado", solicitante: "Hildo", servico: "Manutenção no ar condicionado do almoxarifado", tipoServico: "Preventiva", prioridade: "Alta", status: "Concluido", tecnico: "Goiano / MC Ice", valorServico: 0, nf: "13062", valorPecas: 338.5, dataConclusao: "2026-02-20", obs: "Cobre, fita PVC, solda foscolper, refil solda EOS" },
  { id: 26, dataInicio: "2026-02-20", setor: "Almoxarifado", solicitante: "Lena", servico: "Instalação de condensador + evaporadora SPLIT 30.000 Btus", tipoServico: "Instalação", prioridade: "Alta", status: "Concluido", tecnico: "Goiano / MC Ice", valorServico: 0, nf: "97", valorPecas: 3500, dataConclusao: "2026-02-20", obs: "" },
  { id: 27, dataInicio: "2026-02-20", setor: "Açougue", solicitante: "Lena", servico: "Instalação de condensadora 30.000 Btus no açougue", tipoServico: "Instalação", prioridade: "Alta", status: "Concluido", tecnico: "Goiano / MC Ice", valorServico: 0, nf: "97", valorPecas: 2500, dataConclusao: "2026-02-20", obs: "" },
  { id: 28, dataInicio: "2026-02-09", setor: "Depósito Cervejas", solicitante: "Celso", servico: "Fabricação de 4 grades para o depósito de cervejas", tipoServico: "Melhoria", prioridade: "Média", status: "Concluido", tecnico: "Francinaldo Maramaldo", valorServico: 1200, nf: "O.S:1002", valorPecas: 300, dataConclusao: "2026-02-09", obs: "Pago via pix" },
];

const TECNICOS_INICIAIS = [
  { id: 1, nome: "Hildo", tipo: "Interno", especialidade: "Geral", telefone: "(98) 99999-0001", ativo: true },
  { id: 2, nome: "Cesar", tipo: "Interno", especialidade: "Elétrica", telefone: "(98) 99999-0002", ativo: true },
  { id: 3, nome: "Venilton", tipo: "Interno", especialidade: "Elétrica/Eletrônica", telefone: "(98) 99999-0003", ativo: true },
  { id: 4, nome: "Goiano / MC Ice", tipo: "Fornecedor", especialidade: "Ar Condicionado", telefone: "(98) 98888-1001", ativo: true },
  { id: 5, nome: "Master Eletrônica", tipo: "Fornecedor", especialidade: "Eletrônica", telefone: "(98) 98888-1002", ativo: true },
  { id: 6, nome: "RJ Refrigeração", tipo: "Fornecedor", especialidade: "Refrigeração", telefone: "(98) 98888-1003", ativo: true },
  { id: 7, nome: "Sr. Piauí", tipo: "Fornecedor", especialidade: "Alvenaria/Civil", telefone: "(98) 97777-2001", ativo: true },
  { id: 8, nome: "NOVEL / Marcus", tipo: "Fornecedor", especialidade: "Refrigeração", telefone: "(98) 97777-2002", ativo: true },
  { id: 9, nome: "INTERNOBREAK", tipo: "Fornecedor", especialidade: "Nobreak/Elétrica", telefone: "(98) 97777-2003", ativo: true },
  { id: 10, nome: "Michael da Silva Cutrim", tipo: "Fornecedor", especialidade: "Limpeza/Geral", telefone: "(98) 96666-3001", ativo: true },
];

const SOLICITANTES_INICIAIS = [
  { id: 1, nome: "Clenildes", setor: "Cozinha/Bar", cargo: "Responsável de setor", ativo: true },
  { id: 2, nome: "Lena", setor: "Administrativo", cargo: "Supervisora", ativo: true },
  { id: 3, nome: "Celso", setor: "Gerência", cargo: "Gerente", ativo: true },
  { id: 4, nome: "Hildo", setor: "Manutenção", cargo: "Técnico Manutenção", ativo: true },
  { id: 5, nome: "Alessandro", setor: "Açougue", cargo: "Responsável Açougue", ativo: true },
  { id: 6, nome: "Araújo", setor: "Salão", cargo: "Responsável Salão", ativo: true },
  { id: 7, nome: "Mila", setor: "Padaria", cargo: "Responsável Padaria", ativo: true },
  { id: 8, nome: "Ismael", setor: "Bar/Câmaras", cargo: "Responsável Bar", ativo: true },
  { id: 9, nome: "Fábio", setor: "Bar", cargo: "Operador", ativo: true },
];

const SETORES_INICIAIS = [
  "Açougue", "Almoxarifado", "Bar", "Brinquedoteca", "Câmara 03", "Câmaras Frias",
  "Caixa", "Copa", "Cozinha", "Depósito Cervejas", "Estacionamento", "Louça",
  "Padaria", "Salão", "Salão Aberto", "Salão de Baixo", "Salão VIP",
  "Sala Supervisão", "Sala Diretoria", "RH", "Setor Compras", "Delivery",
];

const TIPOS_SERVICO_INICIAIS = [
  { id: 1, nome: "Corretiva", descricao: "Reparo de equipamento/instalação com defeito", cor: "#e74c3c" },
  { id: 2, nome: "Preventiva", descricao: "Manutenção programada para evitar falhas", cor: "#3498db" },
  { id: 3, nome: "Instalação", descricao: "Instalação de novo equipamento ou componente", cor: "#1abc9c" },
  { id: 4, nome: "Melhoria", descricao: "Obras e melhorias nas instalações", cor: "#9b59b6" },
  { id: 5, nome: "Geral", descricao: "Serviços gerais de limpeza e organização", cor: "#95a5a6" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const hoje = new Date("2026-03-12");
const diasAberta = (d) => Math.floor((hoje - new Date(d + "T00:00:00")) / 86400000);
const fmtBRL = (v) => (!v || v === 0) ? "—" : `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
const fmtData = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "—";
const totalOS = (o) => (Number(o.valorServico) || 0) + (Number(o.valorPecas) || 0);

// ─── CORES ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#080c10", surf: "#0e1318", card: "#131920", border: "#1e2830",
  accent: "#f5a623", accentDim: "#f5a62318",
  text: "#dde6ee", muted: "#5a7080", mutedLight: "#8aa0b0",
  green: "#2ecc71", red: "#e74c3c", yellow: "#f39c12", blue: "#3498db", cyan: "#1abc9c", purple: "#9b59b6",
};
const STATUS_COLOR = { "Concluido": C.green, "Em Andamento": C.blue, "Pendente": C.yellow };
const PRIO_COLOR = { "Urgente": C.red, "Alta": "#e67e22", "Média": C.yellow, "Baixa": C.green };

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Tag({ label, color }) {
  return <span style={{ background: color + "22", color, border: `1px solid ${color}44`, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", letterSpacing: "0.05em" }}>{label}</span>;
}

function KPICard({ label, value, color, onClick, active }) {
  return (
    <div onClick={onClick} style={{
      background: active ? color + "22" : C.card,
      border: `1px solid ${active ? color : C.border}`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 8, padding: "16px 18px",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.15s",
      transform: active ? "translateY(-1px)" : "none",
      boxShadow: active ? `0 4px 20px ${color}30` : "none",
    }}>
      <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: active ? color : C.muted, marginTop: 5, textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 4 }}>
        {label}
        {onClick && <span style={{ fontSize: 8, opacity: 0.7 }}>▶ ver</span>}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [aba, setAba] = useState("dashboard");
  const [subCadastro, setSubCadastro] = useState("tecnicos");

  // dados
  const [ordens, setOrdens] = useState(OS_INICIAL);
  const [tecnicos, setTecnicos] = useState(TECNICOS_INICIAIS);
  const [solicitantes, setSolicitantes] = useState(SOLICITANTES_INICIAIS);
  const [setoresList, setSetoresList] = useState(SETORES_INICIAIS);
  const [tiposServico, setTiposServico] = useState(TIPOS_SERVICO_INICIAIS);

  // filtros OS
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroSetor, setFiltroSetor] = useState("Todos");
  const [filtroPrio, setFiltroPrio] = useState("Todos");
  const [busca, setBusca] = useState("");

  // modais
  const [detalhe, setDetalhe] = useState(null);
  const [modalOS, setModalOS] = useState(false);
  const [editOS, setEditOS] = useState(null);

  // forms cadastro
  const [novaOS, setNovaOS] = useState({ dataInicio: "2026-03-12", setor: "", solicitante: "", servico: "", tipoServico: "Corretiva", prioridade: "Média", tecnico: "", valorServico: "", valorPecas: "", nf: "", obs: "" });
  const [novoTec, setNovoTec] = useState({ nome: "", tipo: "Fornecedor", especialidade: "", telefone: "" });
  const [novoSol, setNovoSol] = useState({ nome: "", setor: "", cargo: "" });
  const [novoSetor, setNovoSetor] = useState("");
  const [novoTipo, setNovoTipo] = useState({ nome: "", descricao: "", cor: "#3498db" });

  // KPI click → filtro rápido
  const [kpiAtivo, setKpiAtivo] = useState(null); // "total" | "andamento" | "concluidas" | "alertas"

  // Histórico para Undo
  const [historico, setHistorico] = useState([]); // [{ordens, descricao}]
  const [undoMsg, setUndoMsg] = useState(null);

  function salvarHistorico(descricao, ordensAntes) {
    setHistorico(h => [...h.slice(-19), { ordens: ordensAntes, descricao }]);
  }
  function undo() {
    if (historico.length === 0) return;
    const ultimo = historico[historico.length - 1];
    setOrdens(ultimo.ordens);
    setHistorico(h => h.slice(0, -1));
    setUndoMsg(`Desfeito: ${ultimo.descricao}`);
    setTimeout(() => setUndoMsg(null), 2500);
  }

  // computed
  const alertas = useMemo(() =>
    ordens.filter(o => o.status === "Em Andamento").map(o => ({ ...o, dias: diasAberta(o.dataInicio) })).sort((a, b) => b.dias - a.dias),
    [ordens]);
  const alertasCriticos = alertas.filter(a => a.dias >= 7);

  const setoresOpts = useMemo(() => ["Todos", ...Array.from(new Set([...setoresList, ...ordens.map(o => o.setor)])).sort()], [setoresList, ordens]);
  const nomeTecnicos = useMemo(() => tecnicos.filter(t => t.ativo).map(t => t.nome), [tecnicos]);
  const nomeSolicitantes = useMemo(() => solicitantes.filter(s => s.ativo).map(s => s.nome), [solicitantes]);
  const nomeTipos = useMemo(() => tiposServico.map(t => t.nome), [tiposServico]);

  const totalGasto = ordens.reduce((s, o) => s + totalOS(o), 0);

  // filtro principal (inclui filtro por KPI clicado)
  const filtradas = useMemo(() => {
    let base = ordens;
    if (kpiAtivo === "andamento") base = base.filter(o => o.status === "Em Andamento");
    else if (kpiAtivo === "concluidas") base = base.filter(o => o.status === "Concluido");
    else if (kpiAtivo === "alertas") base = base.filter(o => o.status === "Em Andamento" && diasAberta(o.dataInicio) >= 7);
    if (filtroStatus !== "Todos") base = base.filter(o => o.status === filtroStatus);
    if (filtroSetor !== "Todos") base = base.filter(o => o.setor === filtroSetor);
    if (filtroPrio !== "Todos") base = base.filter(o => o.prioridade === filtroPrio);
    if (busca) { const q = busca.toLowerCase(); base = base.filter(o => [o.servico, o.solicitante, o.tecnico, o.setor].some(x => x.toLowerCase().includes(q))); }
    return base;
  }, [ordens, kpiAtivo, filtroStatus, filtroSetor, filtroPrio, busca]);

  const gastoMes = useMemo(() => {
    const m = {};
    ordens.forEach(o => { const k = o.dataInicio.substring(0, 7); m[k] = (m[k] || 0) + totalOS(o); });
    return Object.entries(m).sort();
  }, [ordens]);
  const maxMes = Math.max(...gastoMes.map(([, v]) => v), 1);

  const histSetor = useMemo(() => {
    const m = {};
    ordens.forEach(o => {
      if (!m[o.setor]) m[o.setor] = { qtd: 0, gasto: 0, abertos: 0 };
      m[o.setor].qtd++; m[o.setor].gasto += totalOS(o);
      if (o.status === "Em Andamento") m[o.setor].abertos++;
    });
    return Object.entries(m).sort((a, b) => b[1].gasto - a[1].gasto);
  }, [ordens]);

  function handleKpiClick(tipo) {
    if (kpiAtivo === tipo) { setKpiAtivo(null); setAba("ordens"); }
    else { setKpiAtivo(tipo); setAba("ordens"); }
  }

  function salvarOS() {
    salvarHistorico(editOS ? `Edição OS #${String(editOS.id).padStart(3,"0")}` : "Nova OS criada", ordens);
    if (editOS) {
      setOrdens(ordens.map(o => o.id === editOS.id ? { ...editOS, valorServico: Number(editOS.valorServico) || 0, valorPecas: Number(editOS.valorPecas) || 0 } : o));
      setEditOS(null);
    } else {
      const id = Math.max(...ordens.map(o => o.id)) + 1;
      setOrdens([{ ...novaOS, id, status: "Em Andamento", valorServico: Number(novaOS.valorServico) || 0, valorPecas: Number(novaOS.valorPecas) || 0, dataConclusao: null }, ...ordens]);
      setNovaOS({ dataInicio: "2026-03-12", setor: "", solicitante: "", servico: "", tipoServico: "Corretiva", prioridade: "Média", tecnico: "", valorServico: "", valorPecas: "", nf: "", obs: "" });
    }
    setModalOS(false);
  }

  function concluirOS(id) {
    const os = ordens.find(o => o.id === id);
    salvarHistorico(`Conclusão OS #${String(id).padStart(3,"0")} — ${os?.setor || ""}`, ordens);
    setOrdens(ordens.map(o => o.id === id ? { ...o, status: "Concluido", dataConclusao: "2026-03-12" } : o));
    setDetalhe(null);
  }

  // ─── ESTILOS ──────────────────────────────────────────────────────────────
  const S = {
    app: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: C.bg, minHeight: "100vh", color: C.text, display: "flex", fontSize: 12 },
    sidebar: { width: 204, background: C.surf, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "18px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" },
    navItem: (a) => ({ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", margin: "1px 6px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: a ? 700 : 400, background: a ? C.accentDim : "transparent", color: a ? C.accent : C.muted, transition: "all 0.1s" }),
    navSub: (a) => ({ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px 6px 28px", margin: "1px 6px", borderRadius: 5, cursor: "pointer", fontSize: 10, fontWeight: a ? 700 : 400, background: a ? "#ffffff08" : "transparent", color: a ? C.text : C.muted, transition: "all 0.1s" }),
    navSection: { fontSize: 9, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 18px 4px", marginTop: 6 },
    main: { flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" },
    topbar: { background: C.surf, borderBottom: `1px solid ${C.border}`, padding: "11px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 },
    content: { flex: 1, padding: 20, overflowY: "auto" },
    g4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 },
    g2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    g3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 },
    card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 },
    sTitle: { fontSize: 9, fontWeight: 700, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "6px 10px", fontSize: 9, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}` },
    td: { padding: "8px 10px", borderBottom: `1px solid ${C.border}18`, fontSize: 11, verticalAlign: "middle" },
    inp: { width: "100%", background: C.surf, border: `1px solid ${C.border}`, borderRadius: 5, padding: "6px 10px", color: C.text, fontSize: 11, fontFamily: "inherit", boxSizing: "border-box" },
    btn: (bg = C.accent, fg = "#000") => ({ background: bg, color: fg, border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }),
    btnGhost: { background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 12px", fontSize: 10, cursor: "pointer" },
    modal: { position: "fixed", inset: 0, background: "#00000095", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
    mbox: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, width: 520, maxWidth: "95vw", maxHeight: "92vh", overflowY: "auto" },
    label: { fontSize: 9, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3, display: "block" },
    fr: { marginBottom: 12 },
    r2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    r3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
    chipRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 },
    chip: (color) => ({ background: color + "18", border: `1px solid ${color}44`, color, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }),
  };

  const ABAS_PRINC = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "alertas", icon: "⚠", label: `Alertas${alertasCriticos.length > 0 ? ` (${alertasCriticos.length})` : ""}` },
    { id: "ordens", icon: "≡", label: "Ordens de Serviço" },
    { id: "setores", icon: "◫", label: "Por Setor" },
    { id: "custos", icon: "◎", label: "Custos" },
  ];

  const SUB_CADASTROS = [
    { id: "tecnicos", icon: "◉", label: "Técnicos" },
    { id: "solicitantes", icon: "◌", label: "Solicitantes" },
    { id: "setoresCad", icon: "◧", label: "Setores" },
    { id: "tiposServico", icon: "◑", label: "Tipos de Serviço" },
  ];

  const tituloPagina = () => {
    if (aba === "cadastros") return `Cadastros › ${SUB_CADASTROS.find(s => s.id === subCadastro)?.label}`;
    if (aba === "ordens" && kpiAtivo) {
      const labels = { total: "Todas as OS", andamento: "OS Em Andamento", concluidas: "OS Concluídas", alertas: "OS com Alerta" };
      return labels[kpiAtivo];
    }
    return ABAS_PRINC.find(a => a.id === aba)?.label?.replace(/ \(\d+\)/, "") || "";
  };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet" />

      {/* ══ SIDEBAR ══ */}
      <div style={S.sidebar}>
        <div style={{ padding: "0 14px 16px", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>⚙ FAROL</div>
          <div style={{ fontSize: 9, color: C.muted, marginTop: 1, letterSpacing: "0.1em" }}>MANUTENÇÃO v3.0</div>
        </div>

        <div style={S.navSection}>Menu</div>
        {ABAS_PRINC.map(a => (
          <div key={a.id} style={S.navItem(aba === a.id && kpiAtivo === null || aba === a.id && a.id !== "ordens")}
            onClick={() => { setAba(a.id); if (a.id !== "ordens") setKpiAtivo(null); }}>
            <span>{a.icon}</span>{a.label}
          </div>
        ))}

        <div style={S.navSection}>Cadastros</div>
        <div style={S.navItem(aba === "cadastros")} onClick={() => setAba("cadastros")}>
          <span>⊞</span>Cadastros
        </div>
        {aba === "cadastros" && SUB_CADASTROS.map(s => (
          <div key={s.id} style={S.navSub(subCadastro === s.id)} onClick={() => setSubCadastro(s.id)}>
            {s.icon} {s.label}
          </div>
        ))}

        {alertasCriticos.length > 0 && (
          <div onClick={() => setAba("alertas")} style={{ margin: "auto 8px 8px", background: C.red + "15", border: `1px solid ${C.red}33`, borderRadius: 6, padding: "8px 10px", cursor: "pointer" }}>
            <div style={{ fontSize: 9, color: C.red, fontWeight: 700, letterSpacing: "0.1em" }}>⚠ ATENÇÃO</div>
            <div style={{ fontSize: 10, color: C.text, marginTop: 2 }}>{alertasCriticos.length} OS atrasadas</div>
          </div>
        )}

        <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, marginTop: alertasCriticos.length ? 0 : "auto" }}>
          <div style={{ fontSize: 9, color: C.muted }}>TOTAL OS</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.accent }}>{ordens.length}</div>
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{tituloPagina()}</div>
            {kpiAtivo && aba === "ordens" && (
              <button style={{ ...S.btnGhost, padding: "3px 8px", fontSize: 9 }} onClick={() => setKpiAtivo(null)}>✕ limpar filtro</button>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.muted }}>12/03/2026</span>
            {aba === "ordens" && <button style={S.btn()} onClick={() => { setEditOS(null); setModalOS(true); }}>+ Nova OS</button>}
          </div>
        </div>

        <div style={S.content}>

          {/* ══ DASHBOARD ══ */}
          {aba === "dashboard" && (<>
            <div style={S.g4}>
              <KPICard label="Total de OS" value={ordens.length} color={C.blue} onClick={() => handleKpiClick("total")} active={kpiAtivo === "total"} />
              <KPICard label="Em Andamento" value={ordens.filter(o => o.status === "Em Andamento").length} color={C.yellow} onClick={() => handleKpiClick("andamento")} active={kpiAtivo === "andamento"} />
              <KPICard label="Concluídas" value={ordens.filter(o => o.status === "Concluido").length} color={C.green} onClick={() => handleKpiClick("concluidas")} active={kpiAtivo === "concluidas"} />
              <KPICard label={`OS c/ Alerta`} value={alertasCriticos.length} color={alertasCriticos.length > 0 ? C.red : C.muted} onClick={() => handleKpiClick("alertas")} active={kpiAtivo === "alertas"} />
            </div>

            <div style={S.g2}>
              <div style={S.card}>
                <div style={S.sTitle}>Gastos por mês</div>
                {gastoMes.map(([mes, val]) => {
                  const [ano, m] = mes.split("-");
                  const label = new Date(Number(ano), Number(m) - 1).toLocaleString("pt-BR", { month: "short", year: "2-digit" });
                  return (
                    <div key={mes} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3 }}>
                        <span style={{ color: C.mutedLight, textTransform: "capitalize" }}>{label}</span>
                        <span style={{ color: C.accent, fontWeight: 700 }}>{fmtBRL(val)}</span>
                      </div>
                      <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${(val / maxMes) * 100}%`, background: `linear-gradient(90deg,${C.accent},${C.yellow})`, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: C.muted }}>Total geral</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: C.accent }}>{fmtBRL(totalGasto)}</span>
                </div>
              </div>

              <div style={S.card}>
                <div style={S.sTitle}>OS em andamento — dias em aberto</div>
                {alertas.map(o => (
                  <div key={o.id} onClick={() => setDetalhe(o)} style={{ padding: "7px 0", borderBottom: `1px solid ${C.border}18`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.servico}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{o.setor} · {o.tecnico}</div>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {o.dias >= 30 ? <Tag label={`${o.dias}d CRÍTICO`} color={C.red} /> :
                        o.dias >= 14 ? <Tag label={`${o.dias}d ATRASADO`} color="#e67e22" /> :
                          o.dias >= 7 ? <Tag label={`${o.dias}d ALERTA`} color={C.yellow} /> :
                            <Tag label={`${o.dias}d`} color={C.green} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>)}

          {/* ══ ALERTAS ══ */}
          {aba === "alertas" && (<>
            {alertasCriticos.length > 0 && (
              <div style={{ marginBottom: 14, padding: "10px 14px", background: C.red + "12", border: `1px solid ${C.red}30`, borderRadius: 7, fontSize: 11, color: C.red }}>
                ⚠ {alertasCriticos.length} OS parada(s) há 7+ dias sem conclusão
              </div>
            )}
            {alertas.map(o => {
              const cor = o.dias >= 30 ? C.red : o.dias >= 14 ? "#e67e22" : o.dias >= 7 ? C.yellow : C.green;
              return (
                <div key={o.id} style={{ background: C.card, border: `1px solid ${cor}33`, borderLeft: `4px solid ${cor}`, borderRadius: 8, padding: "13px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 5 }}>
                        <span style={{ fontSize: 10, color: C.accent, fontWeight: 800 }}>OS #{String(o.id).padStart(3, "0")}</span>
                        <Tag label={o.prioridade} color={PRIO_COLOR[o.prioridade]} />
                        <Tag label={`${o.dias} dias em aberto`} color={cor} />
                      </div>
                      <div style={{ fontSize: 12, marginBottom: 4 }}>{o.servico}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>
                        {o.setor} · <span style={{ color: C.mutedLight }}>{o.tecnico}</span> · Aberta em {fmtData(o.dataInicio)}
                      </div>
                    </div>
                    <button style={S.btn(C.green, "#000")} onClick={() => concluirOS(o.id)}>✓ Concluir</button>
                  </div>
                </div>
              );
            })}
            {alertas.length === 0 && <div style={{ ...S.card, textAlign: "center", padding: 40, color: C.green }}>✓ Nenhuma OS em aberto!</div>}
          </>)}

          {/* ══ ORDENS DE SERVIÇO ══ */}
          {aba === "ordens" && (<>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              <input style={{ ...S.inp, width: 190 }} placeholder="🔍 Buscar..." value={busca} onChange={e => setBusca(e.target.value)} />
              <select style={{ ...S.inp, width: 140 }} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                <option>Todos</option><option>Concluido</option><option>Em Andamento</option>
              </select>
              <select style={{ ...S.inp, width: 160 }} value={filtroSetor} onChange={e => setFiltroSetor(e.target.value)}>
                {setoresOpts.map(s => <option key={s}>{s}</option>)}
              </select>
              <select style={{ ...S.inp, width: 120 }} value={filtroPrio} onChange={e => setFiltroPrio(e.target.value)}>
                <option>Todos</option><option>Urgente</option><option>Alta</option><option>Média</option><option>Baixa</option>
              </select>
              <span style={{ fontSize: 10, color: C.muted }}>{filtradas.length} resultado(s)</span>
              {(busca || filtroStatus !== "Todos" || filtroSetor !== "Todos" || filtroPrio !== "Todos") && (
                <button style={S.btnGhost} onClick={() => { setBusca(""); setFiltroStatus("Todos"); setFiltroSetor("Todos"); setFiltroPrio("Todos"); }}>✕</button>
              )}
            </div>
            <div style={S.card}>
              <table style={S.table}>
                <thead><tr>
                  {["#", "Data", "Setor", "Solicitante", "Serviço", "Tipo", "Técnico", "Prio", "Status", "Dias", "Total", ""].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filtradas.map(o => {
                    const dias = o.status === "Em Andamento" ? diasAberta(o.dataInicio) : null;
                    const tipoInfo = tiposServico.find(t => t.nome === o.tipoServico);
                    return (
                      <tr key={o.id} onClick={() => setDetalhe(o)} style={{ cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#ffffff05"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ ...S.td, color: C.accent, fontWeight: 800 }}>{String(o.id).padStart(3, "0")}</td>
                        <td style={{ ...S.td, color: C.muted, whiteSpace: "nowrap" }}>{fmtData(o.dataInicio)}</td>
                        <td style={S.td}>{o.setor}</td>
                        <td style={{ ...S.td, color: C.muted }}>{o.solicitante}</td>
                        <td style={S.td} title={o.servico}>{o.servico.length > 38 ? o.servico.substring(0, 38) + "…" : o.servico}</td>
                        <td style={S.td}>{tipoInfo ? <Tag label={o.tipoServico} color={tipoInfo.cor} /> : <span style={{ color: C.muted }}>{o.tipoServico}</span>}</td>
                        <td style={{ ...S.td, color: C.muted, whiteSpace: "nowrap" }}>{o.tecnico}</td>
                        <td style={S.td}><Tag label={o.prioridade} color={PRIO_COLOR[o.prioridade]} /></td>
                        <td style={S.td}><Tag label={o.status} color={STATUS_COLOR[o.status] || C.muted} /></td>
                        <td style={S.td}>
                          {dias !== null && (dias >= 30 ? <Tag label={`${dias}d`} color={C.red} /> : dias >= 14 ? <Tag label={`${dias}d`} color="#e67e22" /> : dias >= 7 ? <Tag label={`${dias}d`} color={C.yellow} /> : <span style={{ color: C.muted, fontSize: 10 }}>{dias}d</span>)}
                          {dias === null && <span style={{ color: C.muted, fontSize: 10 }}>—</span>}
                        </td>
                        <td style={{ ...S.td, color: C.accent, fontWeight: 700, whiteSpace: "nowrap" }}>{fmtBRL(totalOS(o))}</td>
                        <td style={S.td}>
                          {o.status === "Em Andamento" && (
                            <button style={{ ...S.btn(C.green, "#000"), padding: "3px 8px", fontSize: 9 }} onClick={e => { e.stopPropagation(); concluirOS(o.id); }}>✓</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>)}

          {/* ══ SETORES ══ */}
          {aba === "setores" && (
            <div style={S.card}>
              <table style={S.table}>
                <thead><tr>
                  {["Setor", "Qtd OS", "Em aberto", "Gasto total", "Mão de obra", "Peças", "% total"].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {histSetor.map(([setor, d]) => {
                    const pct = ((d.gasto / totalGasto) * 100 || 0).toFixed(1);
                    const mo = ordens.filter(o => o.setor === setor).reduce((s, o) => s + (Number(o.valorServico) || 0), 0);
                    const pc = ordens.filter(o => o.setor === setor).reduce((s, o) => s + (Number(o.valorPecas) || 0), 0);
                    return (
                      <tr key={setor} onClick={() => { setFiltroSetor(setor); setAba("ordens"); }} style={{ cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#ffffff05"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ ...S.td, fontWeight: 700 }}>{setor}</td>
                        <td style={{ ...S.td, color: C.blue, fontWeight: 700 }}>{d.qtd}</td>
                        <td style={{ ...S.td, color: d.abertos > 0 ? C.yellow : C.muted }}>{d.abertos > 0 ? d.abertos : "—"}</td>
                        <td style={{ ...S.td, color: C.accent, fontWeight: 700 }}>{fmtBRL(d.gasto)}</td>
                        <td style={{ ...S.td, color: C.muted }}>{fmtBRL(mo)}</td>
                        <td style={{ ...S.td, color: C.muted }}>{fmtBRL(pc)}</td>
                        <td style={S.td}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ height: 4, width: 50, background: C.border, borderRadius: 2 }}>
                              <div style={{ height: "100%", width: `${pct}%`, background: C.accent, borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 10, color: C.mutedLight }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: 8, fontSize: 10, color: C.muted }}>💡 Clique em um setor para ver as OS filtradas</div>
            </div>
          )}

          {/* ══ CUSTOS ══ */}
          {aba === "custos" && (<>
            <div style={S.g4}>
              {[
                { label: "Total geral", value: fmtBRL(totalGasto), color: C.accent },
                { label: "Mão de obra", value: fmtBRL(ordens.reduce((s, o) => s + (Number(o.valorServico) || 0), 0)), color: C.blue },
                { label: "Peças / material", value: fmtBRL(ordens.reduce((s, o) => s + (Number(o.valorPecas) || 0), 0)), color: C.cyan },
                { label: "OS com custo", value: ordens.filter(o => totalOS(o) > 0).length, color: C.green },
              ].map(k => <KPICard key={k.label} {...k} />)}
            </div>
            <div style={S.card}>
              <div style={S.sTitle}>Detalhamento — OS com custo (ordenado por valor)</div>
              <table style={S.table}>
                <thead><tr>
                  {["#", "Setor", "Serviço", "Técnico", "NF", "Serviço", "Peças", "Total"].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {ordens.filter(o => totalOS(o) > 0).sort((a, b) => totalOS(b) - totalOS(a)).map(o => (
                    <tr key={o.id} onClick={() => setDetalhe(o)} style={{ cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#ffffff05"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ ...S.td, color: C.accent, fontWeight: 800 }}>{String(o.id).padStart(3, "0")}</td>
                      <td style={S.td}>{o.setor}</td>
                      <td style={S.td}>{o.servico.length > 40 ? o.servico.substring(0, 40) + "…" : o.servico}</td>
                      <td style={{ ...S.td, color: C.muted }}>{o.tecnico}</td>
                      <td style={{ ...S.td, color: C.muted }}>{o.nf || "—"}</td>
                      <td style={S.td}>{fmtBRL(o.valorServico)}</td>
                      <td style={S.td}>{fmtBRL(o.valorPecas)}</td>
                      <td style={{ ...S.td, color: C.accent, fontWeight: 800 }}>{fmtBRL(totalOS(o))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>)}

          {/* ══ CADASTROS ══ */}
          {aba === "cadastros" && (<>

            {/* ── Técnicos ── */}
            {subCadastro === "tecnicos" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: C.muted }}>{tecnicos.length} técnicos / fornecedores cadastrados</div>
                </div>
                {["Interno", "Fornecedor"].map(tipo => (
                  <div key={tipo} style={{ ...S.card, marginBottom: 14 }}>
                    <div style={S.sTitle}>{tipo === "Interno" ? "👷 Equipe interna" : "🔧 Fornecedores / terceiros"}</div>
                    <table style={S.table}>
                      <thead><tr>{["Nome", "Especialidade", "Telefone", "OS realizadas", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {tecnicos.filter(t => t.tipo === tipo).map(t => {
                          const qtd = ordens.filter(o => o.tecnico.toLowerCase().includes(t.nome.toLowerCase().split(" ")[0])).length;
                          return (
                            <tr key={t.id}>
                              <td style={{ ...S.td, fontWeight: 700 }}>{t.nome}</td>
                              <td style={{ ...S.td, color: C.muted }}>{t.especialidade}</td>
                              <td style={{ ...S.td, color: C.cyan }}>{t.telefone}</td>
                              <td style={{ ...S.td, color: C.blue, fontWeight: 700 }}>{qtd}</td>
                              <td style={S.td}><Tag label={t.ativo ? "Ativo" : "Inativo"} color={t.ativo ? C.green : C.muted} /></td>
                              <td style={S.td}>
                                <button style={{ ...S.btnGhost, padding: "2px 8px", fontSize: 9 }} onClick={() => setTecnicos(tecnicos.map(x => x.id === t.id ? { ...x, ativo: !x.ativo } : x))}>
                                  {t.ativo ? "Desativar" : "Ativar"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
                {/* Form novo técnico inline */}
                <div style={{ ...S.card, borderColor: C.accent + "44" }}>
                  <div style={{ ...S.sTitle, color: C.accent }}>+ Novo Técnico / Fornecedor</div>
                  <div style={S.r3}>
                    <div style={S.fr}><label style={S.label}>Nome</label><input style={S.inp} value={novoTec.nome} onChange={e => setNovoTec({ ...novoTec, nome: e.target.value })} placeholder="Nome completo" /></div>
                    <div style={S.fr}><label style={S.label}>Tipo</label>
                      <select style={S.inp} value={novoTec.tipo} onChange={e => setNovoTec({ ...novoTec, tipo: e.target.value })}>
                        <option>Interno</option><option>Fornecedor</option>
                      </select>
                    </div>
                    <div style={S.fr}><label style={S.label}>Especialidade</label><input style={S.inp} value={novoTec.especialidade} onChange={e => setNovoTec({ ...novoTec, especialidade: e.target.value })} placeholder="Ex: Elétrica" /></div>
                  </div>
                  <div style={S.r2}>
                    <div style={S.fr}><label style={S.label}>Telefone</label><input style={S.inp} value={novoTec.telefone} onChange={e => setNovoTec({ ...novoTec, telefone: e.target.value })} placeholder="(98) 99999-9999" /></div>
                    <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 12 }}>
                      <button style={S.btn()} onClick={() => { if (!novoTec.nome) return; setTecnicos([...tecnicos, { ...novoTec, id: tecnicos.length + 1, ativo: true }]); setNovoTec({ nome: "", tipo: "Fornecedor", especialidade: "", telefone: "" }); }}>Salvar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Solicitantes ── */}
            {subCadastro === "solicitantes" && (
              <div>
                <div style={{ ...S.card, marginBottom: 14 }}>
                  <div style={S.sTitle}>Funcionários / solicitantes cadastrados</div>
                  <table style={S.table}>
                    <thead><tr>{["Nome", "Setor", "Cargo", "OS abertas", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {solicitantes.map(s => {
                        const qtd = ordens.filter(o => o.solicitante.toLowerCase() === s.nome.toLowerCase()).length;
                        return (
                          <tr key={s.id}>
                            <td style={{ ...S.td, fontWeight: 700 }}>{s.nome}</td>
                            <td style={{ ...S.td, color: C.muted }}>{s.setor}</td>
                            <td style={{ ...S.td, color: C.muted }}>{s.cargo}</td>
                            <td style={{ ...S.td, color: C.blue, fontWeight: 700 }}>{qtd}</td>
                            <td style={S.td}><Tag label={s.ativo ? "Ativo" : "Inativo"} color={s.ativo ? C.green : C.muted} /></td>
                            <td style={S.td}>
                              <button style={{ ...S.btnGhost, padding: "2px 8px", fontSize: 9 }} onClick={() => setSolicitantes(solicitantes.map(x => x.id === s.id ? { ...x, ativo: !x.ativo } : x))}>
                                {s.ativo ? "Desativar" : "Ativar"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ ...S.card, borderColor: C.accent + "44" }}>
                  <div style={{ ...S.sTitle, color: C.accent }}>+ Novo Solicitante</div>
                  <div style={S.r3}>
                    <div style={S.fr}><label style={S.label}>Nome</label><input style={S.inp} value={novoSol.nome} onChange={e => setNovoSol({ ...novoSol, nome: e.target.value })} /></div>
                    <div style={S.fr}><label style={S.label}>Setor</label>
                      <input style={S.inp} list="set-list" value={novoSol.setor} onChange={e => setNovoSol({ ...novoSol, setor: e.target.value })} />
                      <datalist id="set-list">{setoresList.map(s => <option key={s} value={s} />)}</datalist>
                    </div>
                    <div style={S.fr}><label style={S.label}>Cargo</label><input style={S.inp} value={novoSol.cargo} onChange={e => setNovoSol({ ...novoSol, cargo: e.target.value })} /></div>
                  </div>
                  <button style={S.btn()} onClick={() => { if (!novoSol.nome) return; setSolicitantes([...solicitantes, { ...novoSol, id: solicitantes.length + 1, ativo: true }]); setNovoSol({ nome: "", setor: "", cargo: "" }); }}>Salvar</button>
                </div>
              </div>
            )}

            {/* ── Setores ── */}
            {subCadastro === "setoresCad" && (
              <div>
                <div style={{ ...S.card, marginBottom: 14 }}>
                  <div style={S.sTitle}>Setores cadastrados ({setoresList.length})</div>
                  <div style={S.chipRow}>
                    {setoresList.map(s => (
                      <div key={s} style={S.chip(C.blue)}>
                        {s}
                        <span onClick={() => setSetoresList(setoresList.filter(x => x !== s))} style={{ color: C.red, fontWeight: 900, cursor: "pointer", marginLeft: 2 }}>×</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ ...S.card, borderColor: C.accent + "44" }}>
                  <div style={{ ...S.sTitle, color: C.accent }}>+ Novo Setor</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                    <div style={{ flex: 1, ...S.fr }}>
                      <label style={S.label}>Nome do Setor</label>
                      <input style={S.inp} value={novoSetor} onChange={e => setNovoSetor(e.target.value)} placeholder="Ex: Estoque de Bebidas" onKeyDown={e => { if (e.key === "Enter" && novoSetor.trim()) { setSetoresList([...setoresList, novoSetor.trim()]); setNovoSetor(""); } }} />
                    </div>
                    <div style={{ paddingBottom: 12 }}>
                      <button style={S.btn()} onClick={() => { if (novoSetor.trim()) { setSetoresList([...setoresList, novoSetor.trim()]); setNovoSetor(""); } }}>Adicionar</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>Pressione Enter ou clique em Adicionar · Clique no × para remover</div>
                </div>
              </div>
            )}

            {/* ── Tipos de Serviço ── */}
            {subCadastro === "tiposServico" && (
              <div>
                <div style={{ ...S.card, marginBottom: 14 }}>
                  <div style={S.sTitle}>Tipos de serviço cadastrados</div>
                  <table style={S.table}>
                    <thead><tr>{["Tipo", "Descrição", "Cor", "OS com esse tipo", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {tiposServico.map(t => {
                        const qtd = ordens.filter(o => o.tipoServico === t.nome).length;
                        return (
                          <tr key={t.id}>
                            <td style={S.td}><Tag label={t.nome} color={t.cor} /></td>
                            <td style={{ ...S.td, color: C.muted }}>{t.descricao}</td>
                            <td style={S.td}>
                              <div style={{ width: 18, height: 18, borderRadius: 4, background: t.cor, border: `1px solid ${C.border}` }} />
                            </td>
                            <td style={{ ...S.td, color: C.blue, fontWeight: 700 }}>{qtd}</td>
                            <td style={S.td}>
                              {qtd === 0 && (
                                <button style={{ ...S.btnGhost, padding: "2px 8px", fontSize: 9, color: C.red, borderColor: C.red + "44" }} onClick={() => setTiposServico(tiposServico.filter(x => x.id !== t.id))}>Remover</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ ...S.card, borderColor: C.accent + "44" }}>
                  <div style={{ ...S.sTitle, color: C.accent }}>+ Novo Tipo de Serviço</div>
                  <div style={S.r3}>
                    <div style={S.fr}><label style={S.label}>Nome</label><input style={S.inp} value={novoTipo.nome} onChange={e => setNovoTipo({ ...novoTipo, nome: e.target.value })} placeholder="Ex: Preditiva" /></div>
                    <div style={S.fr}><label style={S.label}>Descrição</label><input style={S.inp} value={novoTipo.descricao} onChange={e => setNovoTipo({ ...novoTipo, descricao: e.target.value })} /></div>
                    <div style={S.fr}>
                      <label style={S.label}>Cor</label>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="color" value={novoTipo.cor} onChange={e => setNovoTipo({ ...novoTipo, cor: e.target.value })} style={{ width: 36, height: 32, border: `1px solid ${C.border}`, borderRadius: 4, background: C.surf, cursor: "pointer", padding: 2 }} />
                        <Tag label={novoTipo.nome || "Prévia"} color={novoTipo.cor} />
                      </div>
                    </div>
                  </div>
                  <button style={S.btn()} onClick={() => { if (!novoTipo.nome) return; setTiposServico([...tiposServico, { ...novoTipo, id: tiposServico.length + 1 }]); setNovoTipo({ nome: "", descricao: "", cor: "#3498db" }); }}>Salvar</button>
                </div>
              </div>
            )}
          </>)}
        </div>
      </div>

      {/* ══ MODAL NOVA / EDITAR OS ══ */}
      {modalOS && (
        <div style={S.modal} onClick={() => { setModalOS(false); setEditOS(null); }}>
          <div style={S.mbox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.accent, marginBottom: 16 }}>
              {editOS ? `EDITAR OS #${String(editOS.id).padStart(3, "0")}` : "NOVA ORDEM DE SERVIÇO"}
            </div>
            {(() => {
              const d = editOS || novaOS;
              const set = (k, v) => editOS ? setEditOS({ ...editOS, [k]: v }) : setNovaOS({ ...novaOS, [k]: v });
              return (<>
                <div style={S.r2}>
                  <div style={S.fr}><label style={S.label}>Setor</label>
                    <input style={S.inp} list="s-list" value={d.setor} onChange={e => set("setor", e.target.value)} />
                    <datalist id="s-list">{setoresList.map(s => <option key={s} value={s} />)}</datalist>
                  </div>
                  <div style={S.fr}><label style={S.label}>Solicitante</label>
                    <input style={S.inp} list="sol-list" value={d.solicitante} onChange={e => set("solicitante", e.target.value)} />
                    <datalist id="sol-list">{nomeSolicitantes.map(n => <option key={n} value={n} />)}</datalist>
                  </div>
                </div>
                <div style={S.fr}><label style={S.label}>Descrição do Serviço</label>
                  <input style={S.inp} value={d.servico} onChange={e => set("servico", e.target.value)} placeholder="Descreva o serviço..." />
                </div>
                <div style={S.r3}>
                  <div style={S.fr}><label style={S.label}>Tipo de Serviço</label>
                    <select style={S.inp} value={d.tipoServico} onChange={e => set("tipoServico", e.target.value)}>
                      {nomeTipos.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={S.fr}><label style={S.label}>Prioridade</label>
                    <select style={S.inp} value={d.prioridade} onChange={e => set("prioridade", e.target.value)}>
                      <option>Baixa</option><option>Média</option><option>Alta</option><option>Urgente</option>
                    </select>
                  </div>
                  <div style={S.fr}><label style={S.label}>Data Início</label>
                    <input type="date" style={S.inp} value={d.dataInicio} onChange={e => set("dataInicio", e.target.value)} />
                  </div>
                </div>
                <div style={S.r2}>
                  <div style={S.fr}><label style={S.label}>Técnico Responsável</label>
                    <input style={S.inp} list="tec-list" value={d.tecnico} onChange={e => set("tecnico", e.target.value)} />
                    <datalist id="tec-list">{nomeTecnicos.map(n => <option key={n} value={n} />)}</datalist>
                  </div>
                  <div style={S.fr}><label style={S.label}>NF / Nº OS</label>
                    <input style={S.inp} value={d.nf} onChange={e => set("nf", e.target.value)} />
                  </div>
                </div>
                <div style={S.r2}>
                  <div style={S.fr}><label style={S.label}>Valor Serviço (R$)</label>
                    <input type="number" style={S.inp} value={d.valorServico} onChange={e => set("valorServico", e.target.value)} placeholder="0" />
                  </div>
                  <div style={S.fr}><label style={S.label}>Valor Peças (R$)</label>
                    <input type="number" style={S.inp} value={d.valorPecas} onChange={e => set("valorPecas", e.target.value)} placeholder="0" />
                  </div>
                </div>
                {editOS && (
                  <div style={S.fr}><label style={S.label}>Status</label>
                    <select style={S.inp} value={editOS.status} onChange={e => set("status", e.target.value)}>
                      <option>Em Andamento</option><option>Concluido</option><option>Pendente</option>
                    </select>
                  </div>
                )}
                <div style={S.fr}><label style={S.label}>Observações</label>
                  <input style={S.inp} value={d.obs} onChange={e => set("obs", e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                  <button style={S.btnGhost} onClick={() => { setModalOS(false); setEditOS(null); }}>Cancelar</button>
                  <button style={S.btn()} onClick={salvarOS}>Salvar</button>
                </div>
              </>);
            })()}
          </div>
        </div>
      )}

      {/* ══ MODAL DETALHE OS ══ */}
      {detalhe && (
        <div style={S.modal} onClick={() => setDetalhe(null)}>
          <div style={{ ...S.mbox, width: 460 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: C.accent }}>OS #{String(detalhe.id).padStart(3, "0")}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <Tag label={detalhe.prioridade} color={PRIO_COLOR[detalhe.prioridade]} />
                <Tag label={detalhe.status} color={STATUS_COLOR[detalhe.status] || C.muted} />
              </div>
            </div>
            {[["Setor", detalhe.setor], ["Solicitante", detalhe.solicitante], ["Serviço", detalhe.servico], ["Tipo", detalhe.tipoServico], ["Técnico", detalhe.tecnico], ["Data Início", fmtData(detalhe.dataInicio)], ["Data Conclusão", fmtData(detalhe.dataConclusao)], ["NF/OS", detalhe.nf || "—"], ["Valor Serviço", fmtBRL(detalhe.valorServico)], ["Valor Peças", fmtBRL(detalhe.valorPecas)], ["Total", fmtBRL(totalOS(detalhe))], ["Observações", detalhe.obs || "—"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}1a`, fontSize: 11 }}>
                <span style={{ color: C.muted, flexShrink: 0, marginRight: 12 }}>{k}</span>
                <span style={{ color: C.text, textAlign: "right" }}>{v}</span>
              </div>
            ))}
            {detalhe.status === "Em Andamento" && (
              <div style={{ marginTop: 10, padding: "7px 12px", background: C.yellow + "12", border: `1px solid ${C.yellow}28`, borderRadius: 6, fontSize: 10, color: C.yellow }}>
                ⏱ Aberta há <strong>{diasAberta(detalhe.dataInicio)} dias</strong>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
              {detalhe.status === "Em Andamento" && <button style={S.btn(C.green, "#000")} onClick={() => concluirOS(detalhe.id)}>✓ Concluir</button>}
              <button style={S.btn(C.blue, "#fff")} onClick={() => { setEditOS({ ...detalhe }); setDetalhe(null); setModalOS(true); }}>✏ Editar</button>
              <button style={S.btnGhost} onClick={() => setDetalhe(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ BOTÕES FLUTUANTES ══ */}
      <div style={{
        position: "fixed", bottom: 28, left: 220, zIndex: 90,
        display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start",
      }}>
        {/* Undo */}
        <button
          onClick={undo}
          title={historico.length > 0 ? `Desfazer: ${historico[historico.length - 1]?.descricao}` : "Nada para desfazer"}
          style={{
            width: 52, height: 52, borderRadius: "50%",
            background: historico.length > 0 ? "rgba(192, 57, 43, 0.82)" : "rgba(120, 40, 30, 0.35)",
            border: `1.5px solid ${historico.length > 0 ? "rgba(231,76,60,0.6)" : "rgba(120,40,30,0.3)"}`,
            color: historico.length > 0 ? "#fff" : "rgba(255,255,255,0.3)",
            fontSize: 20, cursor: historico.length > 0 ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: historico.length > 0 ? "0 4px 20px rgba(192,57,43,0.4)" : "none",
            transition: "all 0.18s",
            transform: "scale(1)",
          }}
          onMouseEnter={e => { if (historico.length > 0) e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          ↩
        </button>

        {/* Nova OS */}
        <button
          onClick={() => { setEditOS(null); setModalOS(true); }}
          title="Nova Ordem de Serviço"
          style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(245, 166, 35, 0.88)",
            border: "1.5px solid rgba(245,166,35,0.5)",
            color: "#000",
            fontSize: 28, fontWeight: 900, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 24px rgba(245,166,35,0.45)",
            transition: "all 0.18s",
            transform: "scale(1)",
            lineHeight: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(245,166,35,0.65)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(245,166,35,0.45)"; }}
        >
          +
        </button>
      </div>

      {/* ══ TOAST UNDO ══ */}
      {undoMsg && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "rgba(20,28,38,0.95)", border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.red}`, borderRadius: 8,
          padding: "10px 18px", fontSize: 11, color: C.text,
          backdropFilter: "blur(10px)", zIndex: 200,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          animation: "fadeIn 0.2s ease",
          whiteSpace: "nowrap",
        }}>
          ↩ {undoMsg}
        </div>
      )}
    </div>
  );
}
