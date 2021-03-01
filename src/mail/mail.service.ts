import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly confirmEmailTemplate: string;

  constructor(private readonly configService: ConfigService) {
    this.confirmEmailTemplate = fs.readFileSync(
      path.join(__dirname, './templates', 'confirmEmail.hbs'),
      'utf8',
    );
  }

  async sendConfirmationEmail(email: string, link: string) {
    const template = handlebars.compile(this.confirmEmailTemplate);

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'apikey', // generated ethereal user
        pass: this.configService.get('SENDGRID_API_KEY'), // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: '"CEA👻"<cea@example.com>',
      to: email, // list of receivers
      subject: 'Welcome to CEA! Confirm Your Email',
      text: '', // plain text body
      html: template({ link }),
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, './templates', 'assets', 'logo.png'),
          cid: 'logo', //same cid value as in the html img src
        },
      ],
    });

    console.log('Message sent: %s', info.messageId);
  }
}
