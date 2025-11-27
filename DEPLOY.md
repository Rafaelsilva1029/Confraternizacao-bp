# Guia de Deploy - Confraternização BP

Este documento fornece instruções passo a passo para fazer deploy da aplicação no Vercel com sincronização automática ao GitHub.

## Pré-requisitos

- Conta no GitHub
- Conta no Vercel (pode usar login com GitHub)
- Banco de dados MySQL acessível (recomendações abaixo)
- Repositório GitHub criado

## Opções de Banco de Dados

### Opção 1: Vercel MySQL (Recomendado)

O Vercel oferece integração nativa com MySQL. Esta é a opção mais simples.

1. Na dashboard do Vercel, clique em "Add Integration"
2. Procure por "MySQL" ou "Vercel MySQL"
3. Siga as instruções para criar um banco de dados
4. A string de conexão será adicionada automaticamente como variável de ambiente

### Opção 2: PlanetScale

PlanetScale oferece um plano gratuito generoso.

1. Crie uma conta em https://planetscale.com
2. Crie um novo banco de dados
3. Copie a string de conexão
4. Configure como variável de ambiente no Vercel

### Opção 3: AWS RDS

Para produção com mais dados:

1. Crie uma instância RDS MySQL no AWS
2. Configure grupos de segurança para permitir acesso do Vercel
3. Copie a string de conexão

## Passo 1: Preparar o Repositório GitHub

```bash
# Clonar o repositório (se ainda não tiver)
git clone https://github.com/seu-usuario/confraternizacao-bp.git
cd confraternizacao-bp

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: Confraternização BP application"

# Fazer push para GitHub
git push origin main
```

## Passo 2: Conectar Vercel ao GitHub

1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Conecte sua conta GitHub (se não estiver conectada)
4. Selecione o repositório `confraternizacao-bp`
5. Clique em "Import"

## Passo 3: Configurar Variáveis de Ambiente

Na página de configuração do projeto no Vercel:

1. Vá para "Environment Variables"
2. Adicione as seguintes variáveis:

### DATABASE_URL
- **Descrição**: String de conexão MySQL
- **Valor**: `mysql://user:password@host:port/database`
- **Exemplo**: `mysql://admin:senha123@db.example.com:3306/confraternizacao`

### JWT_SECRET
- **Descrição**: Chave secreta para assinatura de sessões
- **Valor**: Gere uma string aleatória forte (mínimo 32 caracteres)
- **Comando para gerar**: `openssl rand -base64 32`

### Variáveis Opcionais
Se estiver usando recursos adicionais do Manus:

- `VITE_ANALYTICS_ENDPOINT`: URL do serviço de analytics
- `VITE_ANALYTICS_WEBSITE_ID`: ID do website para analytics

## Passo 4: Fazer Deploy

Após configurar as variáveis de ambiente:

1. Clique em "Deploy"
2. O Vercel construirá e publicará a aplicação automaticamente
3. Você receberá uma URL como: `https://confraternizacao-bp.vercel.app`

## Passo 5: Testar a Aplicação

1. Acesse a URL fornecida pelo Vercel
2. Teste as funcionalidades:
   - Adicionar funcionário
   - Registrar despesa
   - Visualizar dashboard
   - Filtrar e buscar

## Deploy Automático

Após a configuração inicial, todo push para a branch `main` fará deploy automático:

```bash
# Fazer alterações locais
git add .
git commit -m "Descrição das mudanças"
git push origin main

# Vercel fará deploy automaticamente em ~2-3 minutos
```

## Monitoramento e Logs

### Logs de Build
1. Na dashboard do Vercel, clique no deployment
2. Vá para "Build Logs"
3. Procure por erros ou avisos

### Logs de Runtime
1. Vá para "Runtime Logs"
2. Monitore erros em tempo real

### Métricas de Performance
1. Vá para "Analytics"
2. Visualize tempo de resposta, requisições, etc.

## Troubleshooting

### Erro: "DATABASE_URL is not set"
- Verifique se a variável está configurada em Environment Variables
- Confirme o nome exato: `DATABASE_URL` (case-sensitive)
- Redeploy após adicionar a variável

### Erro: "Connection refused"
- Verifique se o banco de dados está acessível
- Confirme a string de conexão
- Se usar PlanetScale, certifique-se de usar o modo "MySQL"

### Erro: "Build failed"
- Verifique os Build Logs
- Execute `pnpm check` localmente para verificar erros de tipo
- Confirme que todas as dependências estão instaladas

### Aplicação Lenta
- Verifique se o banco de dados está respondendo rápido
- Considere adicionar índices nas tabelas
- Monitore uso de memória e CPU

## Rollback

Se um deploy quebrou a aplicação:

1. Na dashboard do Vercel, vá para "Deployments"
2. Encontre o deployment anterior que funcionava
3. Clique nos três pontos e selecione "Promote to Production"

## Domínio Customizado

Para usar um domínio próprio:

1. Na dashboard do Vercel, vá para "Settings" → "Domains"
2. Clique em "Add Domain"
3. Digite seu domínio
4. Siga as instruções para configurar DNS
5. Aguarde propagação (pode levar até 48 horas)

## Segurança

### Boas Práticas

1. **Variáveis de Ambiente**
   - Nunca commite `.env` no GitHub
   - Use variáveis de ambiente para dados sensíveis

2. **Banco de Dados**
   - Use senhas fortes
   - Restrinja acesso por IP se possível
   - Faça backups regulares

3. **Monitoramento**
   - Configure alertas de erro
   - Monitore uso de recursos
   - Revise logs regularmente

## Suporte

Para problemas com Vercel:
- Documentação: https://vercel.com/docs
- Status: https://www.vercel-status.com
- Suporte: https://vercel.com/support

Para problemas com a aplicação:
- Verifique os logs
- Execute testes localmente
- Abra uma issue no GitHub
