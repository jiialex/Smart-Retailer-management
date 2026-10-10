const ACCOUNTS_KEY = 'smartretail.accounts.v1';
const SESSION_KEY = 'smartretail.session.v1';
const HASH_ITERATIONS = 120_000;

export interface AuthSession {
  name: string;
  email: string;
  role: 'Store Manager' | 'Recorder';
}

interface StoredAccount extends AuthSession {
  salt: string;
  passwordHash: string;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuffer, iterations: HASH_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256,
  );
  return encodeBase64(new Uint8Array(derivedBits));
}

function readAccounts(): StoredAccount[] {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    if (!saved) return [];
    const accounts: unknown = JSON.parse(saved);
    return Array.isArray(accounts) ? accounts as StoredAccount[] : [];
  } catch {
    return [];
  }
}

export function getCurrentSession(): AuthSession | null {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    const session: unknown = JSON.parse(saved);
    if (
      typeof session === 'object' &&
      session !== null &&
      'name' in session && typeof session.name === 'string' &&
      'email' in session && typeof session.email === 'string' &&
      'role' in session && (session.role === 'Store Manager' || session.role === 'Recorder')
    ) {
      return { name: session.name, email: session.email, role: session.role };
    }
    return null;
  } catch {
    return null;
  }
}

function saveSession(account: StoredAccount): AuthSession {
  const session: AuthSession = {
    name: account.name,
    email: account.email,
    role: account.role,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function createAccount(
  name: string,
  email: string,
  password: string,
  role: AuthSession['role'] = 'Store Manager',
): Promise<AuthSession> {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const account: StoredAccount = {
    name: name.trim(),
    email: normalizedEmail,
    role,
    salt: encodeBase64(salt),
    passwordHash: await hashPassword(password, salt),
  };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
  return saveSession(account);
}

export async function authenticateAccount(email: string, password: string): Promise<AuthSession | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find((savedAccount) => savedAccount.email === normalizedEmail);
  if (!account) return null;
  const passwordHash = await hashPassword(password, decodeBase64(account.salt));
  if (passwordHash !== account.passwordHash) return null;
  return saveSession(account);
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
