-- Schema da tabela usuario para Supabase
-- Execute este SQL no SQL Editor do Supabase

-- Criar a tabela usuario
CREATE TABLE IF NOT EXISTS public.usuario (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100),
    telefone VARCHAR(20),
    data_nascimento DATE,
    avatar_url TEXT,
    bio TEXT,
    ativo BOOLEAN DEFAULT true,
    email_verificado BOOLEAN DEFAULT false,
    telefone_verificado BOOLEAN DEFAULT false,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuario_email ON public.usuario(email);
CREATE INDEX IF NOT EXISTS idx_usuario_ativo ON public.usuario(ativo);
CREATE INDEX IF NOT EXISTS idx_usuario_created_at ON public.usuario(created_at);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_usuario_updated_at 
    BEFORE UPDATE ON public.usuario 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;

-- Política para usuários poderem ver apenas seus próprios dados
CREATE POLICY "Usuários podem ver apenas seus próprios dados" ON public.usuario
    FOR SELECT USING (auth.uid() = id);

-- Política para usuários poderem atualizar apenas seus próprios dados
CREATE POLICY "Usuários podem atualizar apenas seus próprios dados" ON public.usuario
    FOR UPDATE USING (auth.uid() = id);

-- Política para permitir inserção de novos usuários
CREATE POLICY "Permitir inserção de novos usuários" ON public.usuario
    FOR INSERT WITH CHECK (true);

-- Comentários na tabela e colunas
COMMENT ON TABLE public.usuario IS 'Tabela de usuários do sistema';
COMMENT ON COLUMN public.usuario.id IS 'Identificador único do usuário';
COMMENT ON COLUMN public.usuario.email IS 'Email do usuário (único)';
COMMENT ON COLUMN public.usuario.senha_hash IS 'Hash da senha do usuário';
COMMENT ON COLUMN public.usuario.nome IS 'Nome do usuário';
COMMENT ON COLUMN public.usuario.sobrenome IS 'Sobrenome do usuário';
COMMENT ON COLUMN public.usuario.telefone IS 'Telefone do usuário';
COMMENT ON COLUMN public.usuario.data_nascimento IS 'Data de nascimento do usuário';
COMMENT ON COLUMN public.usuario.avatar_url IS 'URL do avatar do usuário';
COMMENT ON COLUMN public.usuario.bio IS 'Biografia do usuário';
COMMENT ON COLUMN public.usuario.ativo IS 'Status ativo/inativo do usuário';
COMMENT ON COLUMN public.usuario.email_verificado IS 'Status de verificação do email';
COMMENT ON COLUMN public.usuario.telefone_verificado IS 'Status de verificação do telefone';
COMMENT ON COLUMN public.usuario.ultimo_login IS 'Data e hora do último login';
COMMENT ON COLUMN public.usuario.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.usuario.updated_at IS 'Data da última atualização do registro';
