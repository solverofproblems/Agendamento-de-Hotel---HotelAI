// Utilitários para hash de senhas
import bcrypt from 'bcryptjs';

// Gerar hash da senha
export const hashPassword = async (password) => {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Erro ao gerar hash da senha:', error);
    throw new Error('Erro interno ao processar senha');
  }
};

// Verificar senha
export const verifyPassword = async (password, hashedPassword) => {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    throw new Error('Erro interno ao verificar senha');
  }
};
