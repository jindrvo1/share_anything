import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

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
    const { password, role, ...safe } = body;
    const user = await this.usersService.update(req.user.userId, safe);
    const { password: p, emailVerificationToken, ...result } = user;
    return result;
  }
}
