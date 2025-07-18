export function removeCnpjMask(cnpj: string): string {
  return cnpj.replace(/[^\d]/g, '');
}

export function formatCnpj(cnpj: string): string {
  const digits = removeCnpjMask(cnpj);
  if (digits.length !== 14) {
    throw new Error('CNPJ must have 14 digits');
  }
  return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8, 12)}-${digits.substring(12, 14)}`;
}
