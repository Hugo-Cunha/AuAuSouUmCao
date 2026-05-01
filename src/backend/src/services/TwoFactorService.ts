// Map para armazenar códigos 2FA temporariamente (em produção, usar Redis ou DB)
const twoFactorCodes = new Map<string, { code: string; expiresAt: Date }>();

export const generate2FACode = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 5 dígitos
};

export const store2FACode = (email: string, code: string) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
  twoFactorCodes.set(email, { code, expiresAt });
};

export const verify2FACode = (email: string, code: string): boolean => {
  const entry = twoFactorCodes.get(email);
  if (!entry) return false;
  if (new Date() > entry.expiresAt) {
    twoFactorCodes.delete(email);
    return false;
  }
  if (entry.code === code) {
    twoFactorCodes.delete(email);
    return true;
  }
  return false;
};