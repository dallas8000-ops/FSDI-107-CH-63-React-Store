import bcrypt from 'bcryptjs';

let adminPasswordHash;

/** Hash ADMIN_PASSWORD once per process; login uses bcrypt.compare. */
export async function initAuth() {
  const plain = process.env.ADMIN_PASSWORD;
  if (!plain || plain.length < 5) {
    throw new Error('ADMIN_PASSWORD must be set to at least 5 characters');
  }
  adminPasswordHash = await bcrypt.hash(plain, 10);
}

export async function verifyAdmin(username, password) {
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  if (username !== expectedUser) return false;
  return bcrypt.compare(password, adminPasswordHash);
}
