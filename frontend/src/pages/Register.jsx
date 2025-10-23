import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, FileText } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const password = watch('senha')

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      const result = await registerUser(data)
      
      if (result.success) {
        toast.success('Conta criada com sucesso!')
        navigate('/')
      } else {
        toast.error(result.message || 'Erro ao criar conta')
      }
    } catch (error) {
      toast.error('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center float glow">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white text-glow">
            Criar nova conta
          </h2>
          <p className="mt-2 text-lg text-cyan-200 text-glow">
            Preencha os dados para se cadastrar
          </p>
        </div>

        {/* Formulário */}
        <div className="card fade-in hologram tech-border">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Nome */}
            <div className="form-group">
              <label htmlFor="nome" className="form-label text-gradient">
                Nome *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  id="nome"
                  type="text"
                  autoComplete="given-name"
                  className={`form-input pl-10 ${errors.nome ? 'error' : ''}`}
                  placeholder="Seu nome"
                  {...register('nome', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres'
                    }
                  })}
                />
              </div>
              {errors.nome && (
                <span className="form-error">{errors.nome.message}</span>
              )}
            </div>

            {/* Sobrenome */}
            <div className="form-group">
              <label htmlFor="sobrenome" className="form-label text-gradient">
                Sobrenome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  id="sobrenome"
                  type="text"
                  autoComplete="family-name"
                  className={`form-input pl-10 ${errors.sobrenome ? 'error' : ''}`}
                  placeholder="Seu sobrenome"
                  {...register('sobrenome', {
                    minLength: {
                      value: 2,
                      message: 'Sobrenome deve ter pelo menos 2 caracteres'
                    }
                  })}
                />
              </div>
              {errors.sobrenome && (
                <span className="form-error">{errors.sobrenome.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label text-gradient">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input pl-10 ${errors.email ? 'error' : ''}`}
                  placeholder="seu@email.com"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            {/* Telefone */}
            <div className="form-group">
              <label htmlFor="telefone" className="form-label text-gradient">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  id="telefone"
                  type="tel"
                  autoComplete="tel"
                  className={`form-input pl-10 ${errors.telefone ? 'error' : ''}`}
                  placeholder="+55 11 99999-9999"
                  {...register('telefone', {
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: 'Telefone deve ter um formato válido'
                    }
                  })}
                />
              </div>
              {errors.telefone && (
                <span className="form-error">{errors.telefone.message}</span>
              )}
            </div>

            {/* Data de nascimento */}
            <div className="form-group">
              <label htmlFor="data_nascimento" className="form-label text-gradient">
                Data de nascimento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  id="data_nascimento"
                  type="date"
                  className={`form-input pl-10 ${errors.data_nascimento ? 'error' : ''}`}
                  {...register('data_nascimento', {
                    validate: (value) => {
                      if (value) {
                        const today = new Date()
                        const birthDate = new Date(value)
                        const age = today.getFullYear() - birthDate.getFullYear()
                        if (age < 13) {
                          return 'Você deve ter pelo menos 13 anos'
                        }
                        if (birthDate > today) {
                          return 'Data de nascimento não pode ser no futuro'
                        }
                      }
                      return true
                    }
                  })}
                />
              </div>
              {errors.data_nascimento && (
                <span className="form-error">{errors.data_nascimento.message}</span>
              )}
            </div>

            {/* Senha */}
            <div className="form-group">
              <label htmlFor="senha" className="form-label text-gradient">
                Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input pl-10 pr-10 ${errors.senha ? 'error' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  {...register('senha', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-cyan-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-cyan-400" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <span className="form-error">{errors.senha.message}</span>
              )}
            </div>

            {/* Bio */}
            <div className="form-group">
              <label htmlFor="bio" className="form-label text-gradient">
                Biografia
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-cyan-400" />
                </div>
                <textarea
                  id="bio"
                  rows={3}
                  className={`form-input pl-10 pt-3 ${errors.bio ? 'error' : ''}`}
                  placeholder="Conte um pouco sobre você..."
                  {...register('bio', {
                    maxLength: {
                      value: 500,
                      message: 'Bio deve ter no máximo 500 caracteres'
                    }
                  })}
                />
              </div>
              {errors.bio && (
                <span className="form-error">{errors.bio.message}</span>
              )}
            </div>

            {/* Botão de cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full hover-lift glow"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </button>

            {/* Links */}
            <div className="text-center">
              <p className="text-sm text-cyan-200">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors text-glow"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-cyan-300 text-glow">
            © 2024 Plat Cog. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
