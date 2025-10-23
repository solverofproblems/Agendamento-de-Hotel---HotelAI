// Utilitários para JWT
import jwt from 'jsonwebtoken';

// Gerar token JWT
export const generateToken = (payload) => {
  try {
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expira em 7 dias
    );
    return token;
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    throw new Error('Erro interno ao gerar token');
  }
};

// Gerar refresh token
export const generateRefreshToken = (payload) => {
  try {
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '30d' } // Refresh token expira em 30 dias
    );
    return refreshToken;
  } catch (error) {
    console.error('Erro ao gerar refresh token:', error);
    throw new Error('Erro interno ao gerar refresh token');
  }
};

// Verificar token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    throw new Error('Token inválido ou expirado');
  }
};
