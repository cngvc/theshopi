import { SALT_ROUND } from '@auth/constants/hashing';
import { IAuthDocument } from '@cngvc/shopi-shared';
import { compare, hash } from 'bcryptjs';
import { BaseEntity, BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auths')
export class AuthModel extends BaseEntity implements IAuthDocument {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  profilePublicId?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Index()
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
