import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IKeyTokenDocument {
  id?: string;
  authId: string;
  publicKey: string;
  privateKey: string;
  refreshToken: string;
  deviceInfo: string;
}

@Entity('key-tokens')
export class KeyTokenModel extends BaseEntity implements IKeyTokenDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  authId!: string;

  @Column({ type: 'text' })
  publicKey!: string;

  @Column({ type: 'text' })
  privateKey!: string;

  @Column({ type: 'text' })
  refreshToken!: string;

  @Column()
  deviceInfo!: string;
}
