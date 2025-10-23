import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { User, Mail, Phone, Calendar, FileText, Save, Edit, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      nome: user?.nome || '',
      sobrenome: user?.sobrenome || '',
      telefone: user?.telefone || '',
      data_nascimento: user?.data_nascimento || '',
      bio: user?.bio || ''
    }
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm()

  useEffect(() => {
    if (user) {
      reset({
        nome: user.nome || '',
        sobrenome: user.sobrenome || '',
        telefone: user.telefone || '',
        data_nascimento: user.data_nascimento || '',
        bio: user.bio || ''
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      const response = await api.put('/users/profile', data)
      
      if (response.data.success) {
        updateUser(response.data.data)
        toast.success('Perfil atualizado com sucesso!')
      } else {
        toast.error(response.data.message || 'Erro ao atualizar perfil')
      }
    } catch (error) {
      toast.error('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true)
    
    try {
      const response = await api.put('/users/change-password', {
        senha_atual: data.senha_atual,
        nova_senha: data.nova_senha
      })
      
      if (response.data.success) {
        toast.success('Senha alterada com sucesso!')
        setShowPasswordForm(false)
        resetPassword()
      } else {
        toast.error(response.data.message || 'Erro ao alterar senha')
      }
    } catch (error) {
      toast.error('Erro interno do servidor')
    } finally {
      setPasswordLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Meu Perfil
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie suas informações pessoais
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Membro desde</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(user?.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do usuário */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Informações Pessoais
              </h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="form-group">
                  <label htmlFor="nome" className="form-label">
                    Nome *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nome"
                      type="text"
                      className={`form-input pl-10 ${errors.nome ? 'error' : ''}`}
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
                  <label htmlFor="sobrenome" className="form-label">
                    Sobrenome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="sobrenome"
                      type="text"
                      className={`form-input pl-10 ${errors.sobrenome ? 'error' : ''}`}
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
              </div>

              {/* Email (readonly) */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="form-input pl-10 bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  O email não pode ser alterado
                </p>
              </div>

              {/* Telefone */}
              <div className="form-group">
                <label htmlFor="telefone" className="form-label">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="telefone"
                    type="tel"
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
                <label htmlFor="data_nascimento" className="form-label">
                  Data de nascimento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
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

              {/* Bio */}
              <div className="form-group">
                <label htmlFor="bio" className="form-label">
                  Biografia
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="bio"
                    rows={4}
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

              {/* Botão salvar */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar e status */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {user?.nome} {user?.sobrenome}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="mt-4">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user?.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.ativo ? 'Conta Ativa' : 'Conta Inativa'}
                </span>
              </div>
            </div>
          </div>

          {/* Alterar senha */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Segurança
            </h3>
            
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn btn-outline w-full"
              >
                <Lock className="h-4 w-4" />
                Alterar senha
              </button>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="senha_atual" className="form-label">
                    Senha atual
                  </label>
                  <input
                    id="senha_atual"
                    type="password"
                    className={`form-input ${passwordErrors.senha_atual ? 'error' : ''}`}
                    {...registerPassword('senha_atual', {
                      required: 'Senha atual é obrigatória'
                    })}
                  />
                  {passwordErrors.senha_atual && (
                    <span className="form-error">{passwordErrors.senha_atual.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="nova_senha" className="form-label">
                    Nova senha
                  </label>
                  <input
                    id="nova_senha"
                    type="password"
                    className={`form-input ${passwordErrors.nova_senha ? 'error' : ''}`}
                    {...registerPassword('nova_senha', {
                      required: 'Nova senha é obrigatória',
                      minLength: {
                        value: 6,
                        message: 'Nova senha deve ter pelo menos 6 caracteres'
                      }
                    })}
                  />
                  {passwordErrors.nova_senha && (
                    <span className="form-error">{passwordErrors.nova_senha.message}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="btn btn-primary flex-1"
                  >
                    {passwordLoading ? (
                    <>
                      <div className="spinner"></div>
                      Alterando...
                    </>
                  ) : (
                    'Alterar'
                  )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false)
                      resetPassword()
                    }}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Informações da conta */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informações da Conta
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email verificado</dt>
                <dd className="text-sm text-gray-900">
                  {user?.email_verificado ? 'Sim' : 'Não'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Último login</dt>
                <dd className="text-sm text-gray-900">
                  {formatDate(user?.ultimo_login)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Membro desde</dt>
                <dd className="text-sm text-gray-900">
                  {formatDate(user?.created_at)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
