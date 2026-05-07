import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT) || 587,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const url = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify?token=${token}`;
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || 'noreply@pomoc-ted.cz',
        to: email,
        subject: 'Ověřte svůj email – Pomoc Teď',
        html: `
          <h2>Vítejte na Pomoc Teď, ${name}!</h2>
          <p>Pro dokončení registrace klikněte na tlačítko níže:</p>
          <a href="${url}" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Ověřit email</a>
          <p>Nebo zkopírujte tento odkaz: ${url}</p>
        `,
      });
    } catch (err) {
      this.logger.warn(`Failed to send verification email: ${err.message}`);
    }
  }

  async sendResponseNotification(
    email: string, authorName: string, helperName: string, taskTitle: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || 'noreply@pomoc-ted.cz',
        to: email,
        subject: `Někdo reagoval na váš úkol – ${taskTitle}`,
        html: `
          <h2>Ahoj ${authorName}!</h2>
          <p>Uživatel <strong>${helperName}</strong> se přihlásil k pomoci s vaším úkolem: <strong>${taskTitle}</strong>.</p>
          <p>Přihlaste se na <a href="${process.env.APP_URL || 'http://localhost:3000'}">Pomoc Teď</a> pro více informací.</p>
        `,
      });
    } catch (err) {
      this.logger.warn(`Failed to send notification email: ${err.message}`);
    }
  }
}
