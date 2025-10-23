// Rotas CRUD para usuários
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateUserUpdate } from '../middleware/validation.js';
import { hashPassword } from '../utils/password.js';

const router = express.Router();

// GET /api/users/profile - Obter perfil do usuário logado
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const userId = req.user.id;

    const { data: user, error } = await supabase
      .from('usuario')
      .select('id, nome, sobrenome, email, telefone, data_nascimento, avatar_url, bio, ativo, email_verificado, telefone_verificado, ultimo_login, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/users/profile - Atualizar perfil do usuário logado
router.put('/profile', authenticateToken, validateUserUpdate, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const userId = req.user.id;
    const updateData = req.body;

    const { data: updatedUser, error } = await supabase
      .from('usuario')
      .update(updateData)
      .eq('id', userId)
      .select('id, nome, sobrenome, email, telefone, data_nascimento, avatar_url, bio, ativo, email_verificado, telefone_verificado, ultimo_login, created_at, updated_at')
      .single();

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao atualizar usuário'
      });
    }

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: updatedUser
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/users/change-password - Alterar senha
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { senha_atual, nova_senha } = req.body;
    const supabase = req.app.locals.supabase;
    const userId = req.user.id;

    // Validação básica
    if (!senha_atual || !nova_senha) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (nova_senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Nova senha deve ter pelo menos 6 caracteres'
      });
    }

    // Buscar usuário atual
    const { data: user, error: findError } = await supabase
      .from('usuario')
      .select('senha_hash')
      .eq('id', userId)
      .single();

    if (findError || !user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual
    const { verifyPassword } = await import('../utils/password.js');
    const isCurrentPasswordValid = await verifyPassword(senha_atual, user.senha_hash);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Gerar hash da nova senha
    const nova_senha_hash = await hashPassword(nova_senha);

    // Atualizar senha
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ senha_hash: nova_senha_hash })
      .eq('id', userId);

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao atualizar senha'
      });
    }

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/users/profile - Desativar conta do usuário
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const userId = req.user.id;

    const { error } = await supabase
      .from('usuario')
      .update({ ativo: false })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao desativar usuário:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao desativar conta'
      });
    }

    res.json({
      success: true,
      message: 'Conta desativada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao desativar conta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/users - Listar usuários (apenas para administradores - exemplo)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('usuario')
      .select('id, nome, sobrenome, email, ativo, email_verificado, created_at', { count: 'exact' })
      .eq('ativo', true);

    // Filtro de busca
    if (search) {
      query = query.or(`nome.ilike.%${search}%,sobrenome.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Paginação
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao buscar usuários'
      });
    }

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/users/:id - Obter usuário por ID (apenas para administradores - exemplo)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = req.app.locals.supabase;

    const { data: user, error } = await supabase
      .from('usuario')
      .select('id, nome, sobrenome, email, telefone, data_nascimento, avatar_url, bio, ativo, email_verificado, telefone_verificado, ultimo_login, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
