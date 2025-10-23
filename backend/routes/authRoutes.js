// Rotas de autenticação
import express from 'express';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { validateUserRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// POST /api/auth/register - Cadastrar novo usuário
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { nome, sobrenome, email, senha, telefone, data_nascimento, bio } = req.body;
    const supabase = req.app.locals.supabase;

    // Verificar se email já existe
    const { data: existingUser, error: checkError } = await supabase
      .from('usuario')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Gerar hash da senha
    const senha_hash = await hashPassword(senha);

    // Criar usuário
    const { data: newUser, error: createError } = await supabase
      .from('usuario')
      .insert([
        {
          nome,
          sobrenome,
          email,
          senha_hash,
          telefone,
          data_nascimento,
          bio
        }
      ])
      .select('id, nome, sobrenome, email, telefone, data_nascimento, bio, created_at')
      .single();

    if (createError) {
      console.error('Erro ao criar usuário:', createError);
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao criar usuário'
      });
    }

    // Gerar tokens
    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      nome: newUser.nome
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: newUser,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/login - Login do usuário
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, senha } = req.body;
    const supabase = req.app.locals.supabase;

    // Buscar usuário por email
    const { data: user, error: findError } = await supabase
      .from('usuario')
      .select('id, nome, sobrenome, email, senha_hash, ativo, email_verificado')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar se usuário está ativo
    if (!user.ativo) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o suporte.'
      });
    }

    // Verificar senha
    const isPasswordValid = await verifyPassword(senha, user.senha_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Atualizar último login
    await supabase
      .from('usuario')
      .update({ ultimo_login: new Date().toISOString() })
      .eq('id', user.id);

    // Gerar tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      nome: user.nome
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Remover senha_hash da resposta
    const { senha_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/refresh - Renovar token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token necessário'
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    
    // Gerar novo token
    const newToken = generateToken({
      id: decoded.id,
      email: decoded.email,
      nome: decoded.nome
    });

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        token: newToken
      }
    });

  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(401).json({
      success: false,
      message: 'Refresh token inválido ou expirado'
    });
  }
});

// POST /api/auth/logout - Logout (opcional)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

export default router;
