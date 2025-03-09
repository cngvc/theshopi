import { SALT_ROUND } from '@auth/constants/hashing';
import { IAuthDocument } from '@cngvc/shopi-shared';
import { compare, hash } from 'bcryptjs';
import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auths')
export class AuthModel extends BaseEntity implements IAuthDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ nullable: true })
  emailVerificationToken?: string;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ nullable: true })
  passwordResetExpires?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, SALT_ROUND);
  }

  async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}
