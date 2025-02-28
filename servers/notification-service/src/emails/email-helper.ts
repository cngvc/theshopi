import path from 'path';

import { IEmailLocals } from '@cngvc/shopi-shared';
import { config } from '@notification/config';
import { log } from '@notification/utils/logger.util';
import Email from 'email-templates';
import nodemailer, { Transporter } from 'nodemailer';

class EmailHelper {
  public sendEmail = async (template: string, receiver: string, locals: IEmailLocals): Promise<void> => {
    try {
      await this.createTemplatedEmail(template, receiver, locals);
      log.info('Email sent successfully.');
    } catch (error) {
      log.log('error', 'NotificationService MailTransport sendEmail() method error:', error);
    }
  };

  private createTemplatedEmail = async (template: string, receiver: string, locals: IEmailLocals): Promise<void> => {
    try {
      const smtpTransport: Transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: config.SENDER_EMAIL,
          pass: config.SENDER_PASSWORD
        }
      });
      const email: Email = new Email({
        message: {
          from: `The Shopi <${config.SENDER_EMAIL}>`
        },
        send: true,
        preview: false,
        transport: smtpTransport,
        views: {
          options: {
            extension: 'ejs'
          }
        },
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            relativeTo: path.join(__dirname, '../../build')
          }
        }
      });
      await email.send({
        template: path.join(__dirname, '/templates', template),
        message: { to: receiver },
        locals
      });
    } catch (error) {
      log.error(error);
    }
  };
}

export const emailHelper = new EmailHelper();
