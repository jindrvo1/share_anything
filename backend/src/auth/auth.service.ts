import {
  Injectable, ConflictException, UnauthorizedException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email již existuje');

    const hashed = await bcrypt.hash(dto.password, 10);
    const token = uuidv4();
    const user = await this.usersService.save({
      email: dto.email,
      name: dto.name,
      password: hashed,
      emailVerificationToken: token,
      isEmailVerified: false,
    });

    await this.mailService.sendVerificationEmail(user.email, user.name, token);
    return { message: 'Registrace proběhla úspěšně. Zkontrolujte svůj email.' };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Neplatné přihlašovací údaje');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Neplatné přihlašovací údaje');

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Prosím ověřte svůj email');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) throw new BadRequestException('Neplatný ověřovací token');

    await this.usersService.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
    });
    return { message: 'Email byl úspěšně ověřen' };
  }
}
