import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      const result = await login(data.email, data.senha)
      
      if (result.success) {
        toast.success('Login realizado com sucesso!')
        navigate('/')
      } else {
        toast.error(result.message || 'Erro ao fazer login')
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
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-lg text-cyan-200 text-glow">
            Faça login em sua conta
          </p>
        </div>

        {/* Formulário */}
        <div className="card fade-in hologram tech-border">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label text-gradient">
                Email
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

            {/* Senha */}
            <div className="form-group">
              <label htmlFor="senha" className="form-label text-gradient">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input pl-10 pr-10 ${errors.senha ? 'error' : ''}`}
                  placeholder="Sua senha"
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

            {/* Botão de login */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full hover-lift glow"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Links */}
            <div className="text-center">
              <p className="text-sm text-cyan-200">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors text-glow"
                >
                  Cadastre-se
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

export default Login
