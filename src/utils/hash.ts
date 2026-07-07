import bcrypt from 'bcryptjs';
import config from '../config';

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, Number(config.bcrypt_salt_rounds));
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
