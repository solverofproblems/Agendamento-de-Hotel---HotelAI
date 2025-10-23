// Exemplo de uso da tabela usuario com Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Exemplo: Criar um novo usuário
async function criarUsuario(dadosUsuario) {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .insert([
        {
          email: dadosUsuario.email,
          senha_hash: dadosUsuario.senha_hash, // Você deve fazer hash da senha antes
          nome: dadosUsuario.nome,
          sobrenome: dadosUsuario.sobrenome,
          telefone: dadosUsuario.telefone,
          data_nascimento: dadosUsuario.data_nascimento,
          bio: dadosUsuario.bio
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao criar usuário:', error);
      return null;
    }

    console.log('Usuário criado com sucesso:', data);
    return data[0];
  } catch (err) {
    console.error('Erro na função criarUsuario:', err);
    return null;
  }
}

// Exemplo: Buscar usuário por email
async function buscarUsuarioPorEmail(email) {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Erro na função buscarUsuarioPorEmail:', err);
    return null;
  }
}

// Exemplo: Atualizar dados do usuário
async function atualizarUsuario(id, dadosAtualizacao) {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .update(dadosAtualizacao)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      return null;
    }

    console.log('Usuário atualizado com sucesso:', data);
    return data[0];
  } catch (err) {
    console.error('Erro na função atualizarUsuario:', err);
    return null;
  }
}

// Exemplo: Listar usuários ativos
async function listarUsuariosAtivos() {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id, nome, sobrenome, email, created_at')
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar usuários:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Erro na função listarUsuariosAtivos:', err);
    return null;
  }
}

// Exemplo: Desativar usuário
async function desativarUsuario(id) {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .update({ ativo: false })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao desativar usuário:', error);
      return null;
    }

    console.log('Usuário desativado com sucesso:', data);
    return data[0];
  } catch (err) {
    console.error('Erro na função desativarUsuario:', err);
    return null;
  }
}

// Exemplo de uso
async function exemploCompleto() {
  console.log('=== Exemplo de uso da tabela usuario ===\n');

  // 1. Criar usuário
  const novoUsuario = await criarUsuario({
    email: 'joao@exemplo.com',
    senha_hash: 'hash_da_senha_aqui', // Use bcrypt ou similar
    nome: 'João',
    sobrenome: 'Silva',
    telefone: '+5511999999999',
    data_nascimento: '1990-01-15',
    bio: 'Desenvolvedor apaixonado por tecnologia'
  });

  if (novoUsuario) {
    console.log('✅ Usuário criado:', novoUsuario.id);
  }

  // 2. Buscar usuário
  const usuario = await buscarUsuarioPorEmail('joao@exemplo.com');
  if (usuario) {
    console.log('✅ Usuário encontrado:', usuario.nome);
  }

  // 3. Atualizar usuário
  if (usuario) {
    const usuarioAtualizado = await atualizarUsuario(usuario.id, {
      bio: 'Desenvolvedor sênior especializado em Node.js'
    });
    if (usuarioAtualizado) {
      console.log('✅ Usuário atualizado');
    }
  }

  // 4. Listar usuários
  const usuarios = await listarUsuariosAtivos();
  if (usuarios) {
    console.log(`✅ Encontrados ${usuarios.length} usuários ativos`);
  }
}

// Exportar funções para uso em outros arquivos
export {
  criarUsuario,
  buscarUsuarioPorEmail,
  atualizarUsuario,
  listarUsuariosAtivos,
  desativarUsuario
};

// Executar exemplo se este arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  exemploCompleto();
}
