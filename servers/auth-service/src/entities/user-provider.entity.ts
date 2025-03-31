import { IAuthDocument, IUserProviderDocument } from '@cngvc/shopi-shared';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuthModel } from './auth.entity';

@Entity('user-providers')
export class UserProviderModel extends BaseEntity implements IUserProviderDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  provider!: string; // "github", "google", "twitter"

  @Column()
  providerId!: string;

  @ManyToOne(() => AuthModel, (user) => user.providers, { onDelete: 'CASCADE' })
  private _user!: AuthModel;

  get user(): IAuthDocument {
    return this._user as IAuthDocument;
  }
}
