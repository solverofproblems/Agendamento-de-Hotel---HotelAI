# Frontend - Plat Cog

Interface moderna e responsiva para o sistema de usuários, construída com React e Vite.

## 🚀 Funcionalidades

- ✅ **Autenticação completa**
  - Login com validação
  - Cadastro com formulário completo
  - Logout seguro
  - Renovação automática de tokens

- ✅ **Dashboard interativo**
  - Listagem de usuários
  - Busca e paginação
  - Estatísticas em tempo real
  - Interface responsiva

- ✅ **Gerenciamento de perfil**
  - Edição de dados pessoais
  - Alteração de senha
  - Upload de avatar (preparado)
  - Validação em tempo real

- ✅ **Design moderno**
  - Interface limpa e intuitiva
  - Responsivo para mobile
  - Animações suaves
  - Tema consistente

## 🛠️ Tecnologias

- **React 18** - Biblioteca principal
- **Vite** - Build tool rápido
- **React Router DOM** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones modernos

## 📋 Pré-requisitos

- Node.js 18+
- Backend da API rodando na porta 3000

## 🚀 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em desenvolvimento:**
```bash
npm run dev
```

3. **Build para produção:**
```bash
npm run build
```

4. **Preview da build:**
```bash
npm run preview
```

## 🔧 Configuração

O frontend está configurado para se comunicar com o backend através de proxy no Vite:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

## 📱 Páginas e Funcionalidades

### 🔐 **Páginas de Autenticação**

#### `/login`
- Formulário de login com validação
- Campos: email, senha
- Mostrar/ocultar senha
- Redirecionamento automático

#### `/register`
- Formulário completo de cadastro
- Campos: nome, sobrenome, email, telefone, data nascimento, senha, bio
- Validação em tempo real
- Confirmação de senha

### 🏠 **Páginas Principais**

#### `/` (Dashboard)
- Listagem de usuários
- Busca e filtros
- Paginação
- Estatísticas
- Cards informativos

#### `/profile`
- Edição de perfil
- Alteração de senha
- Informações da conta
- Avatar (preparado)

## 🎨 **Design System**

### **Cores**
- **Primária:** #667eea (azul)
- **Secundária:** #764ba2 (roxo)
- **Sucesso:** #48bb78 (verde)
- **Erro:** #f56565 (vermelho)
- **Aviso:** #ed8936 (laranja)

### **Componentes**
- **Botões:** primary, secondary, outline
- **Formulários:** inputs, labels, validação
- **Cards:** sombras, bordas arredondadas
- **Layout:** sidebar, header, responsivo

## 🔒 **Segurança**

- **Tokens JWT** com renovação automática
- **Interceptors** para tratamento de erros
- **Validação** de formulários
- **Sanitização** de dados
- **Proteção** de rotas

## 📱 **Responsividade**

- **Mobile First** design
- **Breakpoints:** sm, md, lg, xl
- **Sidebar** colapsível
- **Grid** adaptativo
- **Touch** friendly

## 🚀 **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm run preview      # Preview da build

# Linting
npm run lint         # Verificar código
```

## 🔧 **Estrutura do Projeto**

```
frontend/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Layout.jsx   # Layout principal
│   │   └── ProtectedRoute.jsx
│   ├── contexts/        # Contextos React
│   │   └── AuthContext.jsx
│   ├── pages/          # Páginas da aplicação
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── Profile.jsx
│   ├── services/       # Serviços e APIs
│   │   └── api.js
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Ponto de entrada
│   └── index.css       # Estilos globais
├── package.json        # Dependências
├── vite.config.js      # Configuração Vite
└── index.html          # HTML base
```

## 🎯 **Funcionalidades Avançadas**

### **Autenticação**
- Login automático com token
- Renovação de token em background
- Logout em todas as abas
- Proteção de rotas

### **Formulários**
- Validação em tempo real
- Mensagens de erro específicas
- Loading states
- Reset automático

### **UX/UI**
- Animações suaves
- Loading spinners
- Toast notifications
- Feedback visual

## 🐛 **Troubleshooting**

### **Erro de conexão com API**
- Verifique se o backend está rodando na porta 3000
- Confirme se o proxy está configurado corretamente

### **Problemas de autenticação**
- Verifique se os tokens estão sendo salvos
- Confirme se as rotas protegidas estão funcionando

### **Erros de build**
- Limpe o cache: `rm -rf node_modules && npm install`
- Verifique se todas as dependências estão instaladas

## 📈 **Performance**

- **Code splitting** automático
- **Lazy loading** de componentes
- **Tree shaking** para bundle otimizado
- **Hot reload** em desenvolvimento
- **Build** otimizado para produção

## 🎨 **Customização**

### **Temas**
- Variáveis CSS para cores
- Classes utilitárias
- Componentes reutilizáveis

### **Estilos**
- CSS modules (opcional)
- Styled components (opcional)
- Tailwind CSS (opcional)

O frontend está completo e pronto para uso! 🎉
