// Middleware de validação
import Joi from 'joi';

// Schema para validação de cadastro de usuário
export const validateUserRegistration = (req, res, next) => {
  const schema = Joi.object({
    nome: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
    sobrenome: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Sobrenome deve ter pelo menos 2 caracteres',
      'string.max': 'Sobrenome deve ter no máximo 100 caracteres'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
    senha: Joi.string().min(6).max(50).required().messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'string.max': 'Senha deve ter no máximo 50 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
    telefone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
      'string.pattern.base': 'Telefone deve ter um formato válido'
    }),
    data_nascimento: Joi.date().max('now').optional().messages({
      'date.max': 'Data de nascimento não pode ser no futuro'
    }),
    bio: Joi.string().max(500).optional().messages({
      'string.max': 'Bio deve ter no máximo 500 caracteres'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

// Schema para validação de login
export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
    senha: Joi.string().required().messages({
      'any.required': 'Senha é obrigatória'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

// Schema para validação de atualização de usuário
export const validateUserUpdate = (req, res, next) => {
  const schema = Joi.object({
    nome: Joi.string().min(2).max(100).optional(),
    sobrenome: Joi.string().min(2).max(100).optional(),
    telefone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
      'string.pattern.base': 'Telefone deve ter um formato válido'
    }),
    data_nascimento: Joi.date().max('now').optional().messages({
      'date.max': 'Data de nascimento não pode ser no futuro'
    }),
    bio: Joi.string().max(500).optional().messages({
      'string.max': 'Bio deve ter no máximo 500 caracteres'
    }),
    avatar_url: Joi.string().uri().optional().messages({
      'string.uri': 'Avatar URL deve ser um link válido'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};
