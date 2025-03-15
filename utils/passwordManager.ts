import bcryptjs from "bcryptjs";
import { serverEnv } from "../env/server";

const azRegex = new RegExp(/[a-z]/);
const AZRegex = new RegExp(/[A-Z]/);
const numRegex = new RegExp(/[0-9]/);

export function passwordController(password: string): {
  isStrong: boolean;
  message: string;
} {
  if (password.length < 8) {
    return {
      isStrong: false,
      message: "Password must be at least 8 characters long"
    };
  }
  if (!azRegex.test(password)) {
    return {
      isStrong: false,
      message: "Password must contain at least one lowercase letter"
    };
  }
  if (!AZRegex.test(password)) {
    return {
      isStrong: false,
      message: "Password must contain at least one uppercase letter"
    };
  }
  if (!numRegex.test(password)) {
    return {
      isStrong: false,
      message: "Password must contain at least one number"
    };
  }
  return {
    isStrong: true,
    message: "Password is strong"
  };
}

export function hashPassword(password: string): string {
  const SALT = 12;
  const pepper = serverEnv.PEPPER;
  const hash = bcryptjs.hashSync(password + pepper, SALT);
  return hash;
}

export function validatePassword(inputPassword: string, usersHashedPassword: string): boolean {
  const pepper = serverEnv.PEPPER;
  return bcryptjs.compareSync(inputPassword + pepper, usersHashedPassword);
}
