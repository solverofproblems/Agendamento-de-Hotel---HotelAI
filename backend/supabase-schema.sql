-- Script SQL para criar a tabela de usuários no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
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

-- Criar índice para melhorar performance nas buscas por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);

-- Criar índice para melhorar performance nas buscas por CPF
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON public.usuarios(cpf);

-- Habilitar Row Level Security (RLS) - opcional
-- ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

