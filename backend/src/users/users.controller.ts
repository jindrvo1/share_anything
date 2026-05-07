import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Role } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    const { password, emailVerificationToken, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: any, @Body() body: any) {
    // Whitelist only updatable fields to prevent mass assignment
    const { name, bio, location, role } = body;
    // Allow users to switch between USER and HELPER; ADMIN role cannot be self-assigned
    const allowedRole: Role = role === Role.HELPER ? Role.HELPER : Role.USER;
    const user = await this.usersService.update(req.user.userId, { name, bio, location, role: allowedRole });
    const { password: p, emailVerificationToken, ...result } = user;
    return result;
  }
}
