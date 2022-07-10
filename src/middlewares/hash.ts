import bcrypt from "bcryptjs";
import { scrypt, randomBytes } from "node:crypto";

// hash password with scrypt
export async function scryptHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

// hash password with bcrypt
export async function bcryptHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (_error, salt) => {
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) reject(error);
        resolve(hash);
      });
    });
  });
}
