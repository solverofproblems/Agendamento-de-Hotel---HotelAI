# Hotel Miranda - Frontend

Frontend elegante para o sistema de hospedagem Hotel Miranda, com telas de registro e login.

## 🎨 Design

- **Cores principais**: #cf79e0 (roxo) e #e6e6e6 (cinza claro)
- **Estilo**: Inspirado em Airbnb e Trivago - elegante e moderno
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 🚀 Como executar

### 1. Instalar dependências (se necessário)
```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (ou outra porta que o Vite indicar)

### 3. Certifique-se de que o backend está rodando
O frontend se comunica com o backend em `http://localhost:3000`

Se o backend estiver em outra porta, edite a constante `API_BASE_URL` no arquivo `src/main.js`

## 📱 Funcionalidades

### Tela de Login
- Campos: Email e Senha
- Validação de credenciais
- Mensagens de erro/sucesso
- Link para cadastro

### Tela de Registro
- Campos: Nome, Endereço, Email, Senha, CPF, Telefone
- Máscaras automáticas para CPF e Telefone
- Validação de campos obrigatórios
- Mensagens de erro/sucesso
- Link para login
- Redirecionamento automático para login após registro bem-sucedido

## 🎯 Estrutura

```
frontend/
├── index.html          # HTML principal
├── src/
│   ├── main.js        # Lógica da aplicação
│   └── style.css      # Estilos
└── package.json       # Dependências
```

## 🔧 Configuração

### Alterar URL do Backend

Edite `src/main.js` e altere a constante:
```javascript
const API_BASE_URL = 'http://localhost:3000/api/auth';
```

## ✨ Características

- **Animações suaves**: Transições elegantes entre telas
- **Feedback visual**: Mensagens claras de sucesso/erro
- **Formatação automática**: CPF e telefone são formatados automaticamente
- **Design responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessibilidade**: Foco visível e navegação por teclado

## 🎨 Paleta de Cores

- **Primária**: #cf79e0 (Roxo)
- **Secundária**: #e6e6e6 (Cinza claro)
- **Texto escuro**: #2d2d2d
- **Texto claro**: #666666
- **Sucesso**: #27ae60
- **Erro**: #e74c3c

