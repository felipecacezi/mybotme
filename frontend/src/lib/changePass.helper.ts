export const changePassHelper = async (
  newPassword: string,
  confirmPassword: string
) => {
  if (!newPassword || !confirmPassword) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("A nova senha e a confirmação não coincidem.");
  }

  if (newPassword.length < 6) {
    throw new Error("A nova senha deve ter pelo menos 6 caracteres.");
  }
  return true;
};
