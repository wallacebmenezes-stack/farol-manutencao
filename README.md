# ⚙ Farol — Sistema de Controle de Manutenção

Sistema web de gestão de ordens de serviço, técnicos, setores e custos de manutenção.

---

## 🚀 Como subir na Vercel (passo a passo)

### Pré-requisitos
- Conta no GitHub: https://github.com (gratuito)
- Conta na Vercel: https://vercel.com (gratuito)

---

### Passo 1 — Subir o código no GitHub

1. Acesse https://github.com e faça login
2. Clique em **"New repository"** (botão verde)
3. Nome do repositório: `farol-manutencao`
4. Deixe como **Public** e clique em **"Create repository"**
5. Na próxima tela, clique em **"uploading an existing file"**
6. Arraste **todos os arquivos desta pasta** para a área de upload
   - Suba as pastas `src/` e `public/` com seus arquivos dentro
   - Suba também: `package.json`, `vercel.json`, `.gitignore`
7. Clique em **"Commit changes"**

---

### Passo 2 — Publicar na Vercel

1. Acesse https://vercel.com e faça login com sua conta GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `farol-manutencao`
4. A Vercel detecta automaticamente que é React — não precisa mudar nada
5. Clique em **"Deploy"**
6. Aguarde ~2 minutos
7. ✅ Pronto! Seu link estará disponível, ex: `farol-manutencao.vercel.app`

---

### Passo 3 — Compartilhar com o cliente

- Copie o link gerado pela Vercel e envie por WhatsApp, e-mail, etc.
- O sistema funciona em qualquer navegador, celular ou computador
- Qualquer atualização no GitHub é publicada automaticamente na Vercel

---

## 📁 Estrutura do projeto

```
farol-manutencao/
├── public/
│   └── index.html          ← página base
├── src/
│   ├── index.js            ← entrada do React
│   └── App.jsx             ← todo o sistema (componentes + dados)
├── package.json            ← dependências
├── vercel.json             ← configuração de rotas
└── .gitignore
```

---

## ⚠️ Importante sobre os dados

Nesta versão, os dados ficam salvos **apenas na memória do navegador**.
Isso significa que ao fechar e reabrir, os dados voltam ao estado inicial.

**Para persistir dados de verdade**, o próximo passo é integrar com Supabase:
- Banco de dados PostgreSQL gratuito
- Login por e-mail/senha
- API pronta, sem precisar de servidor

---

## 🛠 Tecnologias

- React 18
- CSS-in-JS (estilos inline)
- Google Fonts (JetBrains Mono)
- Sem dependências externas além do React

---

Desenvolvido com Claude (Anthropic) · 2026
