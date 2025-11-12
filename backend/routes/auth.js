import express from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Rota de registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, endereco, email, senha, cpf, telefone } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !email || !senha || !cpf || !telefone) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: nome, email, senha, cpf, telefone. Endereço é opcional.'
      });
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Validação básica de senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter no mínimo 6 caracteres'
      });
    }

    // Verificar se o email já existe
    const { data: existingUser, error: checkError } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', email)
      .eq('active', true)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Hash da senha antes de salvar
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Formatar CPF (remover pontos e traços)
    const cpfFormatado = cpf.replace(/[.-]/g, '');

    // Salvar usuário na tabela usuarios
    const { data: userData, error: dbError } = await supabase
      .from('usuarios')
      .insert([
        {
          nome: nome,
          endereco: endereco,
          email: email,
          senha: senhaHash,
          cpf: cpfFormatado,
          telefone: telefone,
          active: true
        }
      ])
      .select('id, nome, endereco, email, cpf, telefone, created_at, active')
      .single();

    if (dbError) {
      console.error('Erro ao salvar dados do usuário:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Erro ao salvar dados do usuário: ' + dbError.message
      });
    }

    // Remover a senha dos dados retornados (por segurança)
    const { senha: _, ...userWithoutPassword } = userData;

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário na tabela usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, nome, endereco, email, senha, cpf, telefone, created_at, active')
      .eq('email', email)
      .eq('active', true)
      .single();

    if (userError || !userData) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Verificar se o usuário está ativo
    if (!userData.active) {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, userData.senha);

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Remover a senha dos dados retornados (por segurança)
    const { senha: _, ...userWithoutPassword } = userData;

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    });
  }
});

export default router;

