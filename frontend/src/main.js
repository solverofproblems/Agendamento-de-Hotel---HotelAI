import './style.css';

// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api/auth';

// Estado da aplicação
let currentView = 'login'; // 'login' ou 'register'

// Função para renderizar a aplicação
function renderApp() {
  const app = document.querySelector('#app');
  
  if (currentView === 'login') {
    app.innerHTML = renderLoginPage();
    setupLoginForm();
  } else {
    app.innerHTML = renderRegisterPage();
    setupRegisterForm();
  }
}

// Renderizar página de login
function renderLoginPage() {
  return `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="logo">Hotel Miranda</h1>
          <p class="subtitle">Bem-vindo de volta!</p>
        </div>
        
        <form id="loginForm" class="auth-form">
          <div class="form-group">
            <label for="loginEmail">Email</label>
            <input 
              type="email" 
              id="loginEmail" 
              name="email" 
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="loginSenha">Senha</label>
            <input 
              type="password" 
              id="loginSenha" 
              name="senha" 
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" class="btn-primary">
            Entrar
          </button>
          
          <div class="auth-footer">
            <p>Não tem uma conta? <a href="#" id="switchToRegister">Cadastre-se</a></p>
          </div>
        </form>
        
        <div id="loginMessage" class="message"></div>
      </div>
    </div>
  `;
}

// Renderizar página de registro
function renderRegisterPage() {
  return `
    <div class="auth-container">
      <div class="auth-card register-card">
        <div class="auth-header">
          <h1 class="logo">Hotel Miranda</h1>
          <p class="subtitle">Crie sua conta</p>
        </div>
        
        <form id="registerForm" class="auth-form">
          <div class="form-group">
            <label for="registerNome">Nome Completo</label>
            <input 
              type="text" 
              id="registerNome" 
              name="nome" 
              placeholder="João Silva"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="registerEndereco">Endereço</label>
            <input 
              type="text" 
              id="registerEndereco" 
              name="endereco" 
              placeholder="Rua Exemplo, 123"
            />
          </div>
          
          <div class="form-group">
            <label for="registerEmail">Email</label>
            <input 
              type="email" 
              id="registerEmail" 
              name="email" 
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="registerCpf">CPF</label>
              <input 
                type="text" 
                id="registerCpf" 
                name="cpf" 
                placeholder="000.000.000-00"
                maxlength="14"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="registerTelefone">Telefone</label>
              <input 
                type="tel" 
                id="registerTelefone" 
                name="telefone" 
                placeholder="(00) 00000-0000"
                maxlength="15"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="registerSenha">Senha</label>
            <input 
              type="password" 
              id="registerSenha" 
              name="senha" 
              placeholder="Mínimo 6 caracteres"
              minlength="6"
              required
            />
          </div>
          
          <button type="submit" class="btn-primary">
            Criar Conta
          </button>
          
          <div class="auth-footer">
            <p>Já tem uma conta? <a href="#" id="switchToLogin">Faça login</a></p>
          </div>
        </form>
        
        <div id="registerMessage" class="message"></div>
      </div>
    </div>
  `;
}

// Configurar formulário de login
function setupLoginForm() {
  const form = document.getElementById('loginForm');
  const switchLink = document.getElementById('switchToRegister');
  const messageDiv = document.getElementById('loginMessage');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    
    const formData = new FormData(form);
    const data = {
      email: formData.get('email'),
      senha: formData.get('senha')
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        messageDiv.textContent = `Bem-vindo, ${result.user.nome}! Login realizado com sucesso.`;
        messageDiv.className = 'message message-success';
        form.reset();
        
        // Opcional: redirecionar ou salvar dados do usuário
        console.log('Usuário logado:', result.user);
      } else {
        messageDiv.textContent = result.message || 'Erro ao fazer login';
        messageDiv.className = 'message message-error';
      }
    } catch (error) {
      messageDiv.textContent = 'Erro de conexão. Verifique se o backend está rodando.';
      messageDiv.className = 'message message-error';
      console.error('Erro:', error);
    }
  });
  
  switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    currentView = 'register';
    renderApp();
  });
}

// Configurar formulário de registro
function setupRegisterForm() {
  const form = document.getElementById('registerForm');
  const switchLink = document.getElementById('switchToLogin');
  const messageDiv = document.getElementById('registerMessage');
  
  // Máscaras de input
  const cpfInput = document.getElementById('registerCpf');
  const telefoneInput = document.getElementById('registerTelefone');
  
  cpfInput.addEventListener('input', (e) => {
    e.target.value = formatCPF(e.target.value);
  });
  
  telefoneInput.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    
    const formData = new FormData(form);
    const data = {
      nome: formData.get('nome'),
      endereco: formData.get('endereco') || '',
      email: formData.get('email'),
      senha: formData.get('senha'),
      cpf: formData.get('cpf'),
      telefone: formData.get('telefone')
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        messageDiv.textContent = `Conta criada com sucesso! Bem-vindo, ${result.user.nome}!`;
        messageDiv.className = 'message message-success';
        form.reset();
        
        // Opcional: redirecionar para login após 2 segundos
        setTimeout(() => {
          currentView = 'login';
          renderApp();
        }, 2000);
      } else {
        messageDiv.textContent = result.message || 'Erro ao criar conta';
        messageDiv.className = 'message message-error';
      }
    } catch (error) {
      messageDiv.textContent = 'Erro de conexão. Verifique se o backend está rodando.';
      messageDiv.className = 'message message-error';
      console.error('Erro:', error);
    }
  });
  
  switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    currentView = 'login';
    renderApp();
  });
}

// Funções auxiliares para formatação
function formatCPF(value) {
  value = value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return value;
}

function formatPhone(value) {
  value = value.replace(/\D/g, '');
  if (value.length <= 11) {
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
  }
  return value;
}

// Inicializar aplicação
renderApp();
