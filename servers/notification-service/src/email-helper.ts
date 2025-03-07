import path from 'path';

import { IEmailLocals } from '@cngvc/shopi-shared-types';
import { config } from '@notification/config';
import { log, logCatch } from '@notification/utils/logger.util';
import Email from 'email-templates';
import nodemailer, { Transporter } from 'nodemailer';

class EmailHelper {
  public sendEmail = async (template: string, receiver: string, locals: IEmailLocals): Promise<void> => {
    try {
      await this.createTemplatedEmail(template, receiver, locals);
      log.info('Email sent successfully.');
    } catch (error) {
      logCatch(error, 'sendEmail');
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
            relativeTo: path.join(__dirname, '../build')
          }
        }
      });
      await email.send({
        template: path.join(__dirname, '..', 'src/emails', template),
        message: { to: receiver },
        locals
      });
    } catch (error) {
      logCatch(error, 'createTemplatedEmail');
    }
  };
}

export const emailHelper = new EmailHelper();
