"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2FACode = exports.store2FACode = exports.generate2FACode = void 0;
// Map para armazenar códigos 2FA temporariamente (em produção, usar Redis ou DB)
const twoFactorCodes = new Map();
const generate2FACode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString(); // 5 dígitos
};
exports.generate2FACode = generate2FACode;
const store2FACode = (email, code) => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    twoFactorCodes.set(email, { code, expiresAt });
};
exports.store2FACode = store2FACode;
const verify2FACode = (email, code) => {
    const entry = twoFactorCodes.get(email);
    if (!entry)
        return false;
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
exports.verify2FACode = verify2FACode;
