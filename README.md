# Confraternização BP - Gestor Financeiro

Aplicativo web para gerenciar pagamentos de funcionários e despesas da confraternização da Liderança BP.

## Funcionalidades

- **Gerenciamento de Pagamentos**: Adicionar, editar e remover funcionários com seus valores de contribuição
- **Rastreamento de Status**: Marcar pagamentos como Pago, Pendente ou Aguardando Alvará
- **Gerenciamento de Despesas**: Registrar e acompanhar todas as despesas
- **Dashboard Financeiro**: Visualizar totais de arrecadação, pendências, despesas e saldo
- **Compartilhamento**: Gerar resumo financeiro para compartilhar via WhatsApp
- **Busca e Filtros**: Encontrar funcionários por nome e filtrar por status de pagamento

## Stack Tecnológico

- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Backend**: Express 4 + tRPC 11
- **Banco de Dados**: MySQL (via Drizzle ORM)
- **Deploy**: Vercel
- **Autenticação**: Manus OAuth (integrada, sem login necessário para uso interno)

## Setup Local

### Pré-requisitos

- Node.js 18+
- pnpm
- MySQL 8+

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/confraternizacao-bp.git
cd confraternizacao-bp

# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

## Variáveis de Ambiente

As variáveis de ambiente são gerenciadas automaticamente pelo Manus. Para desenvolvimento local, configure:

- `DATABASE_URL`: String de conexão MySQL
- `JWT_SECRET`: Chave secreta para sessões

Outras variáveis são fornecidas automaticamente pelo sistema Manus.

## Estrutura do Projeto

```
confraternizacao-bp/
├── client/                 # Frontend React
│   └── src/
│       ├── pages/         # Páginas da aplicação
│       ├── components/    # Componentes reutilizáveis
│       └── lib/           # Utilitários e configurações
├── server/                # Backend Express + tRPC
│   ├── routers.ts        # Definição de procedures tRPC
│   └── db.ts             # Queries do banco de dados
├── drizzle/              # Schema e migrações do banco
└── shared/               # Código compartilhado
```

## Desenvolvimento

### Adicionar Novo Funcionário

1. Preencher o formulário na aba "Pagos"
2. Clicar em "+ Novo"
3. Preencher nome e valor de contribuição
4. Clicar em "Salvar"

### Registrar Despesa

1. Ir para aba "Gastos"
2. Clicar em "Registrar Nova Despesa"
3. Preencher descrição, valor e data
4. Clicar em "Salvar Despesa"

### Atualizar Status de Pagamento

1. Clicar no botão de status (Pago/Pendente/Aguardando Alvará)
2. O status será atualizado em tempo real

## Deploy no Vercel

### Pré-requisitos

- Conta no Vercel
- Repositório GitHub sincronizado
- Banco de dados MySQL acessível (recomenda-se usar Vercel MySQL ou PlanetScale)

### Passos para Deploy

1. **Conectar GitHub ao Vercel**
   - Ir em https://vercel.com/new
   - Selecionar o repositório `confraternizacao-bp`
   - Vercel detectará automaticamente a configuração

2. **Configurar Variáveis de Ambiente**
   - Na dashboard do Vercel, ir em Settings → Environment Variables
   - Adicionar `DATABASE_URL` com a string de conexão do banco de dados
   - Adicionar `JWT_SECRET` com uma chave aleatória forte

3. **Deploy Automático**
   - Cada push para a branch `main` fará deploy automático
   - Vercel construirá e publicará a aplicação automaticamente

### Sincronização com GitHub

O projeto está configurado para sincronização automática com GitHub:

```bash
# Fazer alterações
git add .
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push origin main

# Vercel fará deploy automaticamente
```

## Testes

```bash
# Executar testes unitários
pnpm test

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

## Troubleshooting

### Erro de Conexão ao Banco de Dados

- Verificar se `DATABASE_URL` está configurada corretamente
- Verificar se o banco de dados está acessível
- Verificar credenciais de acesso

### Erros de Build no Vercel

- Verificar logs do build em Vercel Dashboard
- Garantir que todas as variáveis de ambiente estão configuradas
- Executar `pnpm check` localmente para verificar erros de tipo

### Aplicativo Lento

- Verificar performance do banco de dados
- Considerar adicionar índices nas tabelas
- Verificar uso de memória e CPU no Vercel

## Licença

MIT

## Suporte

Para dúvidas ou problemas, abra uma issue no GitHub ou entre em contato com a equipe de desenvolvimento.
