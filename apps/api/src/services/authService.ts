import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env.js';
import { UserModel } from '../models/UserModel.js';
import { AppError } from '../utils/AppError.js';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  register: async ({ name, email, password }: RegisterInput): Promise<{ userId: string; email: string }> => {
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hashedPassword });

    return { userId: user.id, email: user.email };
  },

  login: async ({ email, password }: LoginInput): Promise<{ token: string; user: { id: string; name: string; email: string } }> => {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email }
    };
  }
};
