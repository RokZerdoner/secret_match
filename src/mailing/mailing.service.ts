import {Injectable} from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import {ConfigService} from "@nestjs/config";

@Injectable()
export class MailingService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport(
            {
                host: this.configService.get<string>('MAIL_HOST'),
                port: Number(this.configService.get<string>('MAIL_PORT')),
                secure: this.configService.get<string>('MAILER_SECURE') === 'true',
                auth: {
                    user: this.configService.get<string>('MAIL_USER'),
                    pass: this.configService.get<string>('MAIL_PASS'),
                },
            },
        )
    }

    async sendUsersTheirPair(userInfo: any, opponentInfo: any) {
        const emailBody = `Hello ${userInfo.name},\n\nYour match opponent is: ${opponentInfo.name} (${opponentInfo.email})\n\nGood luck,\nThe Secret match Team`;

        await this.transporter.sendMail({
            to: opponentInfo.email,
            subject: 'Notification about your match opponent',
            text: emailBody,
        });
    }
}
