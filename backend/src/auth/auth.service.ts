import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service'; // Make sure this import is correct
import { User } from '@prisma/client'; // User model from Prisma client
//================================================================
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
//===============================
  // Register a new user
  async register(
    username: string,
    password: string,
  ): Promise<{
    message: string;
    user: { username: string; password: string };
  }> {
    // Hash the password before saving to the DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await this.prisma.user.create({
      data: { username, password: hashedPassword },
    });

    // Return success message and user data
    return {
      message: 'success',
      user: { username: user.username, password: user.password }, // Return only username and password (or any other data)
    };
  }
//===============================
  // Login an existing user
  async login(
    username: string,
    password: string,
  ): Promise<{ message: string; token: string }> {
    // Find the user in the database by username
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    // If user doesn't exist or the password is incorrect, throw an error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    // If authentication is successful, generate and return JWT token
    const token = this.generateJwt(user.id);

    return {
      message: 'success',
      token,
    };
  }
//===============================
  // Generate JWT token for the user
  private generateJwt(userId: number): string {
    // Create the payload with userId
    const payload = { userId };

    // Sign and return the JWT token
    return this.jwtService.sign(payload);
  }
}
