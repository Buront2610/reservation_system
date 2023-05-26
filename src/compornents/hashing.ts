//パスワードをハッシュ化する関数
//セキュリティ対策
import CryptoJS from 'crypto-js';

const SALT = 'your-unique-salt-here';

export function hashPassword(password: string): string {
  const hashedPassword = CryptoJS.PBKDF2(password, SALT, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString(CryptoJS.enc.Hex);

  return hashedPassword;
}