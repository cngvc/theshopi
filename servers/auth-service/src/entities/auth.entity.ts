import { IAuthDocument, IUserProviderDocument } from '@cngvc/shopi-shared';

import * as argon2 from 'argon2';
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserProviderModel } from './user-provider.entity';

export type UserRole = 'admin' | 'basic';

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

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'enum', enum: ['admin', 'basic'], default: 'basic', select: false })
  role!: UserRole;

  @OneToMany(() => UserProviderModel, (provider) => provider.user, { nullable: true })
  private _providers!: UserProviderModel[];

  get providers(): IUserProviderDocument[] {
    return (this._providers ?? []) as IUserProviderDocument[];
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
