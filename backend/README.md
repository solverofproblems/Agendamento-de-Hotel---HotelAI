# Backend - Sistema de Hotel

Backend desenvolvido com Express.js e Supabase para gerenciamento de autenticação de usuários.

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
PORT=3000
NODE_ENV=development
```

### 3. Configurar tabela no Supabase

No Supabase, você precisa criar a tabela `usuarios` executando o script SQL do arquivo `supabase-schema.sql` ou usando a seguinte estrutura:

```sql
CREATE TABLE public.usuarios (
  id serial PRIMARY KEY,
  nome varchar(255) NOT NULL,
  endereco varchar(512),
  email varchar(255) NOT NULL UNIQUE,
  senha varchar(255) NOT NULL,
  cpf bpchar(11),
  telefone varchar(50),
  created_at timestamp with time zone DEFAULT now(),
  deleted_by varchar(255),
  deleted_at timestamp with time zone,
  active boolean DEFAULT true
);
```

## Executar o servidor

### Modo desenvolvimento (com watch)
```bash
npm run dev
```

### Modo produção
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## Endpoints

### POST /api/auth/register
Registra um novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "endereco": "Rua Exemplo, 123",
  "email": "joao@example.com",
  "senha": "senha123",
  "cpf": "123.456.789-00",
  "telefone": "(11) 99999-9999"
}
```

**Resposta de sucesso (201):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "endereco": "Rua Exemplo, 123",
    "email": "joao@example.com",
    "cpf": "12345678900",
    "telefone": "(11) 99999-9999",
    "created_at": "2024-01-01T00:00:00.000Z",
    "active": true
  }
}
```

**Nota:** O CPF é armazenado sem pontos e traços (apenas números).

### POST /api/auth/login
Realiza login do usuário.

**Body:**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "endereco": "Rua Exemplo, 123",
    "email": "joao@example.com",
    "cpf": "12345678900",
    "telefone": "(11) 99999-9999",
    "created_at": "2024-01-01T00:00:00.000Z",
    "active": true
  }
}
```

**Nota:** A senha é verificada usando hash bcrypt e nunca é retornada na resposta.

### GET /health
Verifica se o servidor está funcionando.

## Estrutura do Projeto

```
backend/
├── config/
│   └── supabase.js      # Configuração do cliente Supabase
├── routes/
│   └── auth.js          # Rotas de autenticação
├── server.js            # Servidor Express principal
├── package.json         # Dependências do projeto
└── README.md           # Este arquivo
```

