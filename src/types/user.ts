/**
 * User type definitions for authentication
 */

export interface User {
  id: string;
  email: string;
  /** Hashed password (never send to client) */
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User data for registration
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * User data for login
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * User session (safe to send to client)
 */
export interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Generate a UUID v4
 */
export function generateUserId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
