import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';

export const decodeToken = async (token: string): Promise<Record<string, any>> => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não definido!");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return typeof payload === "object" && payload !== null ? payload : {};
  } catch {
    return {};
  }
};

