# API CRUD de Usuários

API completa para cadastro e gerenciamento de usuários com autenticação JWT e integração com Supabase.

## 🚀 Funcionalidades

- ✅ Cadastro de usuários
- ✅ Login com JWT
- ✅ Perfil do usuário
- ✅ Atualização de dados
- ✅ Alteração de senha
- ✅ Desativação de conta
- ✅ Listagem de usuários
- ✅ Validação de dados
- ✅ Hash de senhas com bcrypt
- ✅ Middleware de autenticação

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Banco de dados configurado com a tabela `usuario`

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env com suas configurações
```

3. **Configurar Supabase:**
- Execute o SQL do arquivo `schema_usuario.sql` no SQL Editor do Supabase
- Configure as variáveis no arquivo `.env`

## 🔧 Configuração do .env

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico

# API
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=sua_chave_secreta_jwt
JWT_REFRESH_SECRET=sua_chave_refresh_jwt
```

## 🚀 Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Endpoints da API

### 🔐 Autenticação

#### POST `/api/auth/register`
Cadastrar novo usuário

**Body:**
```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "email": "joao@exemplo.com",
  "senha": "123456",
  "telefone": "+5511999999999",
  "data_nascimento": "1990-01-15",
  "bio": "Desenvolvedor"
}
```

#### POST `/api/auth/login`
Login do usuário

**Body:**
```json
{
  "email": "joao@exemplo.com",
  "senha": "123456"
}
```

#### POST `/api/auth/refresh`
Renovar token

**Body:**
```json
{
  "refreshToken": "seu_refresh_token"
}
```

### 👤 Usuários

#### GET `/api/users/profile`
Obter perfil do usuário logado
**Headers:** `Authorization: Bearer <token>`

#### PUT `/api/users/profile`
Atualizar perfil do usuário logado
**Headers:** `Authorization: Bearer <token>`

#### PUT `/api/users/change-password`
Alterar senha
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "senha_atual": "123456",
  "nova_senha": "nova123456"
}
```

#### DELETE `/api/users/profile`
Desativar conta
**Headers:** `Authorization: Bearer <token>`

#### GET `/api/users`
Listar usuários (com paginação)
**Headers:** `Authorization: Bearer <token>`
**Query params:** `?page=1&limit=10&search=joao`

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT com expiração
- Validação de dados com Joi
- Middleware de autenticação
- Row Level Security no Supabase

## 📝 Exemplos de Uso

### Cadastrar usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João",
    "email": "joao@exemplo.com",
    "senha": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "senha": "123456"
  }'
```

### Obter perfil
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🏗️ Estrutura do Projeto

```
backend/
├── middleware/
│   ├── auth.js          # Middleware de autenticação
│   └── validation.js     # Validação de dados
├── routes/
│   ├── authRoutes.js    # Rotas de autenticação
│   └── userRoutes.js    # Rotas CRUD de usuários
├── utils/
│   ├── password.js      # Utilitários de senha
│   └── jwt.js           # Utilitários JWT
├── server.js            # Servidor principal
├── package.json         # Dependências
└── schema_usuario.sql   # Schema do banco
```

## 🐛 Troubleshooting

### Erro de conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se a tabela `usuario` foi criada

### Erro de autenticação
- Verifique se o JWT_SECRET está configurado
- Confirme se o token está sendo enviado corretamente

### Erro de validação
- Verifique se os dados estão no formato correto
- Confirme se todos os campos obrigatórios estão preenchidos
