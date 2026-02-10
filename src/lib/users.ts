"use server";

import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { User, RegisterData, UserSession, generateUserId } from "@/types/user";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "users.json");
const SALT_ROUNDS = 10;

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 12) {
    return { valid: false, error: "Le mot de passe doit contenir au moins 12 caractères" };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Le mot de passe doit contenir au moins une majuscule" };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Le mot de passe doit contenir au moins une minuscule" };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Le mot de passe doit contenir au moins un chiffre" };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, error: "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)" };
  }

  // Check against common passwords
  const commonPasswords = [
    'password123!', 'password123', 'azerty123!', 'azerty123',
    '123456789!', 'motdepasse123', 'password1234!', 'admin123!'
  ];
  if (commonPasswords.some(p => p.toLowerCase() === password.toLowerCase())) {
    return { valid: false, error: "Ce mot de passe est trop commun. Veuillez en choisir un autre." };
  }

  return { valid: true };
}

/**
 * Read users from JSON file
 */
async function readUsersFile(): Promise<User[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data) as User[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    console.error("Error reading users file:", error);
    return [];
  }
}

/**
 * Write users to JSON file
 */
async function writeUsersFile(users: User[]): Promise<void> {
  const dataDir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(users, null, 2), "utf-8");
}

/**
 * Register a new user
 * @param data - Registration data
 * @returns User session if successful
 * @throws Error if email already exists or validation fails
 */
export async function registerUser(data: RegisterData): Promise<UserSession> {
  const users = await readUsersFile();

  // Check if email already exists
  const existingUser = users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  );

  if (existingUser) {
    throw new Error("Un compte existe déjà avec cette adresse email");
  }

  // Validate password with enhanced requirements
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.error!);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const now = new Date().toISOString();

  const newUser: User = {
    id: generateUserId(),
    email: data.email.toLowerCase().trim(),
    passwordHash,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    createdAt: now,
    updatedAt: now,
  };

  users.push(newUser);
  await writeUsersFile(users);

  return {
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    isAdmin: newUser.isAdmin || false,
  };
}

/**
 * Authenticate a user
 * @param email - User email
 * @param password - User password
 * @returns User session if credentials are valid
 * @throws Error if credentials are invalid
 */
export async function loginUser(
  email: string,
  password: string
): Promise<UserSession> {
  const users = await readUsersFile();

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Email ou mot de passe incorrect");
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin || false,
  };
}

/**
 * Get user by ID
 * @param id - User ID
 * @returns User session if found
 */
export async function getUserById(id: string): Promise<UserSession | null> {
  const users = await readUsersFile();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin || false,
  };
}

/**
 * Get user by email
 * @param email - User email
 * @returns User session if found
 */
export async function getUserByEmail(email: string): Promise<UserSession | null> {
  const users = await readUsersFile();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin || false,
  };
}
